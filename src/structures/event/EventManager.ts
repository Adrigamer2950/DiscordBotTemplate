import {
    type Awaitable,
    Client,
    type ClientEvents,
    Collection,
    type Interaction,
    type ReadonlyCollection
} from 'discord.js';
import type {
    AnyEventBus,
    BotService,
    BotServiceEventArgs,
    ClassImplements,
    CommandManager,
    EventBus,
    EventManager,
    EventManagerEventsArgs,
    EventSubscriber,
    Identifier,
    NyxBot,
    NyxLogger,
    PluginManager,
    ScheduleManager,
    SessionManager
} from "@nyx-discord/core";
import {readdirSync} from 'fs';
import {importFile} from '../../util/ImportFile';
import {CustomEventBus} from './EventBus';
import type {AbstractEventSubscriber} from "./EventSubscriber.ts";
import {EventType} from "./EventType.ts";

export class CustomEventManager implements EventManager {

    private buses: Collection<Identifier, AnyEventBus>;
    private readonly clientBus: EventBus<ClientEvents>;

    constructor(bot: NyxBot) {
        this.bot = bot;
        this.buses = new Collection();

        this.clientBus = CustomEventBus.create(bot, Symbol('client'));

        this.buses.set(this.clientBus.getId(), this.clientBus as AnyEventBus);
    }

    addEventBuses(...buses: AnyEventBus[]): Awaitable<this> {
        for (const bus of buses)
            this.buses.set(bus.getId(), bus);

        return this;
    }

    removeEventBus(busOrId: AnyEventBus | Identifier): Awaitable<this> {
        this.buses.delete(this.isAnyEventBus(busOrId) ? (busOrId as AnyEventBus).getId() : (busOrId as Identifier));

        return this;
    }

    private isAnyEventBus(obj: any): obj is AnyEventBus {
        return obj && typeof obj.getId === "function";
    }

    getBus<const Bus extends AnyEventBus>(busOrId: Identifier | Bus): Bus | null {
        return this.buses.get(this.isAnyEventBus(busOrId) ? (busOrId as AnyEventBus).getId() : (busOrId as Identifier)) as Bus | null;
    }

    isBusRegistered(eventBusOrId: Identifier | AnyEventBus): boolean {
        return this.getBus(eventBusOrId) != null;
    }

    getBusByClass<const BusClass extends ClassImplements<AnyEventBus>>(BusClass: BusClass): InstanceType<BusClass> | null {
        throw new Error("Method not implemented.");
    }

    subscribeClient(...subscribers: EventSubscriber<ClientEvents, keyof ClientEvents>[]): Awaitable<this> {
        for (const sub of subscribers) {
            this.getClientBus().subscribe(sub);
        }

        return this;
    }

    subscribeManager(...subscribers: EventSubscriber<EventManagerEventsArgs, keyof EventManagerEventsArgs>[]): Awaitable<this> {
        throw new Error("Method not implemented.");
    }

    getClientBus(): EventBus<ClientEvents> {
        return this.clientBus;
    }

    getManagerBus(): EventBus<EventManagerEventsArgs> {
        throw new Error("Method not implemented.");
    }

    getBuses(): ReadonlyCollection<Identifier, AnyEventBus> {
        throw new Error("Method not implemented.");
    }

    bot: NyxBot<NyxLogger, CommandManager, EventManager, ScheduleManager, SessionManager, PluginManager, BotService, Client<boolean>>;

    async onSetup(): Promise<void> {
        this.bot.getLogger().info("&eLoading events...");

        for (const folder of readdirSync(__dirname + "/../../events")) {
            for (const file of readdirSync(__dirname + `/../../events/${folder}`)) {
                const clazz = await importFile(__dirname + `/../../events/${folder}/${file}`) as AbstractEventSubscriber<any>;

                switch (clazz.getEventType()) {
                    case EventType.Service: {
                        await this.bot.getService().subscribe(clazz as EventSubscriber<BotServiceEventArgs, keyof BotServiceEventArgs>);
                        break;
                    }
                    case EventType.Client: {
                        await this.subscribeClient(clazz as EventSubscriber<ClientEvents, keyof ClientEvents>);
                        break;
                    }
                }
            }
        }
    }

    onStart(): void {
        this.bot.getClient().on('interactionCreate', (i: Interaction) => {
            this.getClientBus().emit('interactionCreate', [i])
        });
    }

    onStop(): Awaitable<void> {
        throw new Error("Method not implemented.");
    }

}