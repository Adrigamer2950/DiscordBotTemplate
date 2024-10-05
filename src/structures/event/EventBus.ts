import type { Comparator } from "@discordjs/collection";
import { type Awaitable, type ReadonlyCollection, Collection } from 'discord.js';
import { EventDispatchMeta, IllegalDuplicateError, type AnyEventBus, type AnyEventSubscriber, type AnyEventSubscriberFrom, type EventBus, type EventDispatchArgs, type EventDispatcher, type EventSubscriber, type EventSubscriberCollection, type Identifier, type NyxBot, type ReadonlyMetaCollection } from "@nyx-discord/core";

export class CustomEventBus<
    EventArgs extends Record<keyof EventArgs & string, unknown[]>,
> implements EventBus<EventArgs> {

    private subscribers: EventSubscriberCollection<EventArgs> = new Collection() as EventSubscriberCollection<EventArgs>;

    static create<EventArgs extends Record<keyof EventArgs & string, unknown[]>>(bot: NyxBot, id: Identifier): CustomEventBus<EventArgs> {
        return new CustomEventBus(bot, id);
    }

    private constructor(private bot: NyxBot, private readonly id: Identifier) { }

    async subscribe<const Sub extends EventSubscriber<EventArgs, keyof EventArgs & string>, const EventName extends ReturnType<Sub["getEvent"]> & keyof EventArgs>(...subscribers: EventSubscriber<EventArgs, EventName>[]): Promise<this> {
        for (const subscriber of subscribers) {
            const eventName = subscriber.getEvent();
            const id = subscriber.getId();

            const existingSubscribers = this.subscribers.get(eventName);
            const presentSubscriber = existingSubscribers?.get(id);
            if (presentSubscriber) {
                throw new IllegalDuplicateError(
                    presentSubscriber,
                    subscriber,
                    'Subscriber with the same ID already exists',
                );
            }

            const newSubscribers = existingSubscribers
                ? existingSubscribers.set(id, subscriber)
                : new Collection<Identifier, AnyEventSubscriberFrom<EventArgs>>([
                    [id, subscriber],
                ]);

            const newSortedSubscribers = newSubscribers.sort((firstValue, secondValue) =>
                firstValue.getPriority() - secondValue.getPriority());

            this.subscribers.set(eventName, newSortedSubscribers);
        }

        return this;
    }

    unsubscribe(subscriber: AnyEventSubscriberFrom<EventArgs>): Awaitable<this> {
        throw new Error("Method not implemented.");
    }

    unsubscribeLocked(subscriber: AnyEventSubscriberFrom<EventArgs>): Awaitable<this> {
        throw new Error("Method not implemented.");
    }

    async emit<const EventName extends keyof EventArgs & string>(eventName: EventName, _args: EventArgs[EventName], meta?: EventDispatchMeta): Promise<this> {
        for (const _sub of this.subscribers) {
            for (const sub of _sub[1]) {
                const subscriber = sub[1] as AnyEventSubscriber;

                if (subscriber.getEvent() != eventName) continue;

                const args: Parameters<AnyEventSubscriber['handleEvent']> = this.generateArgsForEvent(eventName, _args, meta);

                const [eventMeta, ...anyArgs] = args;

                await subscriber.handleEvent(eventMeta, ...anyArgs);
            }
        }

        return this;
    }

    protected generateArgsForEvent<Args extends unknown[]>(
        eventName: string,
        eventArgs: Args,
        meta?: EventDispatchMeta,
    ): EventDispatchArgs<Args> {
        const metadata =
            meta
            ?? EventDispatchMeta.fromEventName(this.bot, this as AnyEventBus, eventName);
        return [metadata, ...eventArgs];
    }

    clearSubscribers(eventName?: string, clearLocked?: boolean): Awaitable<this> {
        throw new Error("Method not implemented.");
    }

    isSubscribed(subscriber: AnyEventSubscriberFrom<EventArgs>): boolean {
        throw new Error("Method not implemented.");
    }

    sortSubscribers(comparator: Comparator<Identifier, AnyEventSubscriberFrom<EventArgs>>): this {
        throw new Error("Method not implemented.");
    }

    setDispatcher(dispatcher: EventDispatcher): this {
        throw new Error("Method not implemented.");
    }

    getDispatcher(): EventDispatcher {
        throw new Error("Method not implemented.");
    }

    getSubscribers(): ReadonlyCollection<Identifier, AnyEventSubscriberFrom<EventArgs>> {
        throw new Error("Method not implemented.");
    }

    getSubscribedEvents(): ReadonlyCollection<string, Collection<Identifier, AnyEventSubscriberFrom<EventArgs>>> {
        throw new Error("Method not implemented.");
    }

    values(): IterableIterator<AnyEventSubscriberFrom<EventArgs>> {
        throw new Error("Method not implemented.");
    }

    keys(): IterableIterator<Identifier> {
        throw new Error("Method not implemented.");
    }

    entries(): IterableIterator<[Identifier, AnyEventSubscriberFrom<EventArgs>]> {
        throw new Error("Method not implemented.");
    }

    isLocked(): boolean {
        throw new Error("Method not implemented.");
    }

    lock(): this {
        throw new Error("Method not implemented.");
    }

    unlock(): this {
        throw new Error("Method not implemented.");
    }

    getId(): Identifier {
        return this.id;
    }

    getMeta(): ReadonlyMetaCollection | null {
        throw new Error("Method not implemented.");
    }

    [Symbol.iterator](): IterableIterator<[Identifier, AnyEventSubscriberFrom<EventArgs>]> {
        throw new Error("Method not implemented.");
    }

    next(...args: [] | [undefined]): IteratorResult<[Identifier, AnyEventSubscriberFrom<EventArgs>], any> {
        throw new Error("Method not implemented.");
    }

    return?(value?: any): IteratorResult<[Identifier, AnyEventSubscriberFrom<EventArgs>], any> {
        throw new Error("Method not implemented.");
    }

    throw?(e?: any): IteratorResult<[Identifier, AnyEventSubscriberFrom<EventArgs>], any> {
        throw new Error("Method not implemented.");
    }

    getBot(): NyxBot | null {
        return this.bot;
    }

    onRegister(): Awaitable<void> {
        throw new Error("Method not implemented.");
    }

    onUnregister(): Awaitable<void> {
        throw new Error("Method not implemented.");
    }

}