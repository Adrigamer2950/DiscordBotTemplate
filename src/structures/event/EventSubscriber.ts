import { EventDispatchMeta, EventSubscriberLifetimeEnum, PriorityEnum, type EventBus, type EventSubscriber, type EventSubscriberFilter, type EventSubscriberLifetime, type Identifier, type MetaCollection, type Priority, type ReadonlyMetaCollection } from "@nyx-discord/core";
import { type Awaitable, Collection } from "discord.js";
import type {EventType} from "./EventType.ts";

export abstract class AbstractEventSubscriber<
    EventArgs extends Record<keyof EventArgs & string, unknown[]>
> implements EventSubscriber<EventArgs, keyof EventArgs & string> {

    protected locked: boolean = false;
    protected readonly lifetime: EventSubscriberLifetime = EventSubscriberLifetimeEnum.On;
    protected readonly priority: Priority = PriorityEnum.Normal;
    protected readonly id: Identifier = Symbol(this.constructor.name);
    protected readonly filter: EventSubscriberFilter<
        EventArgs,
        keyof EventArgs & string
    > | null = null;
    protected readonly meta: MetaCollection = new Collection();

    protected abstract readonly event: keyof EventArgs & string;
    protected abstract readonly eventType: EventType;

    public abstract handleEvent(
        meta: EventDispatchMeta,
        ...args: EventArgs[keyof EventArgs]
    ): Awaitable<void>;

    onSubscribe(bus: EventBus<EventArgs>): Awaitable<void> {
        throw new Error("Method not implemented.");
    }

    onUnsubscribe(bus: EventBus<EventArgs>): Awaitable<void> {
        throw new Error("Method not implemented.");
    }

    onBusUnregister(bus: EventBus<EventArgs>): Awaitable<void> {
        throw new Error("Method not implemented.");
    }

    ignoresHandledEvents(): boolean {
        throw new Error("Method not implemented.");
    }

    isLocked(): boolean {
        return this.locked;
    }

    getEvent(): keyof EventArgs & string {
        return this.event;
    }

    getEventType(): EventType {
        return this.eventType;
    }

    getLifetime(): EventSubscriberLifetime {
        return this.lifetime;
    }

    getPriority(): Priority {
        return this.priority;
    }

    getId(): Identifier {
        return this.id;
    }

    lock(): this {
        this.locked = true;
        return this;
    }

    unlock(): this {
        this.locked = false;
        return this;
    }

    getFilter(): EventSubscriberFilter<EventArgs, keyof EventArgs & string> | null {
        return this.filter;
    }

    getMeta(): ReadonlyMetaCollection | null {
        return this.meta;
    }
}