import { type CacheType, type ClientEvents, type Interaction, ChatInputCommandInteraction } from "discord.js";
import { AbstractEventSubscriber } from "../../structures/event/EventSubscriber";
import type { EventDispatchMeta } from "@nyx-discord/core";
import { EventType } from "../../structures/event/EventType.ts";

export default class CommandExecution extends AbstractEventSubscriber<ClientEvents> {

    protected readonly event = "interactionCreate";
    protected readonly eventType = EventType.Client;

    public async handleEvent(meta: EventDispatchMeta, interaction: Interaction<CacheType>): Promise<void> {
        if (!(interaction instanceof ChatInputCommandInteraction)) return;

        if (!meta.getBot()?.getCommandManager().execute(interaction))
            await interaction.reply({
                ephemeral: true,
                content: "❌ | Command not found"
            });
    }

}