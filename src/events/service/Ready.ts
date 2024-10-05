import type { Awaitable, PresenceStatusData } from "discord.js";
import { EventDispatchMeta, type BotServiceEventArgs, type NyxBot } from "@nyx-discord/core";
import { AbstractEventSubscriber } from "../../structures/event/EventSubscriber";
import { EventType } from "../../structures/event/EventType.ts";
import { getConfig, type Config } from '../../util/Config.ts';

export default class ReadyEventSubscriber extends AbstractEventSubscriber<BotServiceEventArgs> {

    protected readonly event = "start";
    protected readonly eventType = EventType.Service;

    public handleEvent(meta: EventDispatchMeta): Awaitable<void> {
        const bot: NyxBot = meta.getBot() as NyxBot;

        const config: Config = getConfig();

        bot.getClient().user?.setPresence({
            activities: [
                {
                    name: config.presence.desc,
                    type: config.presence.type
                }
            ],
            status: config.presence.status as any as PresenceStatusData
        })

        bot.getLogger().info(`&aReady as &d${meta.getBot()?.getClient().user?.username}`);
    }
}