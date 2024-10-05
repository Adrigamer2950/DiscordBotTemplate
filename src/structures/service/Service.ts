import type { BotService, BotServiceEventArgs, BotStatus, CommandManager, EventBus, EventManager, EventSubscriber, NyxBot, NyxLogger, PluginManager, ScheduleManager, SessionManager } from "@nyx-discord/core";
import type { Awaitable, Client } from "discord.js";

export class CustomBotService implements BotService {

    private running: boolean = false;

    async setup(): Promise<this> {
        await this.bot.getCommandManager().onSetup();
        await this.bot.getEventManager().onSetup();

        this.bot.getClient().once('ready', () => {
            this.running = true;

            this.getEventBus().emit("start", []);
        });

        this.getEventBus().emit("setup", []);

        return this;
    }

    async start(): Promise<this> {
        await this.bot.getClient().login(this.bot.getToken());

        this.bot.getCommandManager().onStart();
        this.bot.getEventManager().onStart();

        return this;
    }

    stop(reason?: string): Awaitable<this> {
        this.getEventBus().emit('stop', [reason]);

        return this;
    }

    getStartPromise(): Promise<NyxBot> {
        throw new Error("Method not implemented.");
    }

    isRunning(): boolean {
        return this.running;
    }

    subscribe(...subscribers: EventSubscriber<BotServiceEventArgs, keyof BotServiceEventArgs>[]): Awaitable<this> {
        for (const sub of subscribers) {
            this.getEventBus().subscribe(sub);
        }

        return this;
    }

    getEventBus(): EventBus<BotServiceEventArgs> {
        return this.eventBus;
    }

    getStatus(): BotStatus {
        throw new Error("Method not implemented.");
    }

    constructor(
        public bot: NyxBot<NyxLogger, CommandManager, EventManager, ScheduleManager, SessionManager, PluginManager, BotService, Client<boolean>>,
        public eventBus: EventBus<BotServiceEventArgs>
    ) { }

}