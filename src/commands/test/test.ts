import type { CommandExecutionMeta, ParentCommand, ContextMenuCommand } from "@nyx-discord/core";
import { type RESTPostAPIChatInputApplicationCommandsJSONBody, type ChatInputCommandInteraction, type CacheType, SlashCommandBuilder } from "discord.js";
import { AbstractCommand } from "../../structures/command/Command";

export default class Command extends AbstractCommand {

    data: RESTPostAPIChatInputApplicationCommandsJSONBody = new SlashCommandBuilder()
        .setName("test")
        .setDescription("Testing lol")
    .toJSON();

    async execute(interaction: ChatInputCommandInteraction<CacheType>, metadata: CommandExecutionMeta): Promise<void> {
        await interaction.reply({
            content: "Test",
            ephemeral: true
        })
    }
}