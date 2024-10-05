import { type BotServiceEventArgs, type EventDispatchMeta } from "@nyx-discord/core";
import { AbstractEventSubscriber } from "../../structures/event/EventSubscriber";
import {EventType} from "../../structures/event/EventType.ts";

export default class StopEventSubscriber extends AbstractEventSubscriber<BotServiceEventArgs> {

    protected readonly event = "stop";
    protected readonly eventType = EventType.Service;

    public async handleEvent(meta: EventDispatchMeta, reason?: string | undefined): Promise<void> {
        meta.getBot()?.getLogger().info("&cStopping with reason: " + (reason ?? "No reason"))

        await meta.getBot()?.getClient().destroy();

        process.exit(0)
    }
}