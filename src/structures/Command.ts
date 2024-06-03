import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { BotClient } from "./Client";
import { ChatInputCommandInteraction, type SlashCommandOptionsOnlyBuilder } from "discord.js";
import { InteractionOptions } from "../util/InteractionOptions";
import type { Category } from "./Category";

export class Command {
    constructor(public data: SlashCommandBuilder | SlashCommandSubcommandBuilder | SlashCommandOptionsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">, public category: Category, public onExecute: (interaction: ChatInputCommandInteraction, client: BotClient, options: InteractionOptions) => any) {}
}

export class SubCommand extends Command {
    static data: SlashCommandSubcommandBuilder;
    constructor(public data: SlashCommandBuilder | SlashCommandSubcommandBuilder | SlashCommandOptionsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">, public category: Category, public onExecute: (interaction: ChatInputCommandInteraction, client: BotClient, options: InteractionOptions) => any) {
        super(data, category, onExecute)
    }
}

export class SubCommandGroup {
    constructor(public data: SlashCommandSubcommandGroupBuilder) {}
}