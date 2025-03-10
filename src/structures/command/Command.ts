import { CommandExecutionMeta, type CommandFilter, type ComponentCommandInteraction, type ContextMenuCommand, type ParentCommand, type ReadonlyMetaCollection, type StandaloneCommand, type SubCommand, type SubCommandGroup } from "@nyx-discord/core";
import type { Snowflake, AutocompleteInteraction, Awaitable, ChatInputCommandInteraction, CacheType, RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";

export abstract class AbstractCommand implements StandaloneCommand {

    abstract data: RESTPostAPIChatInputApplicationCommandsJSONBody;

    getGuilds(): ReadonlyArray<Snowflake> | null {
        throw new Error("Method not implemented.");
    }

    autocomplete(interaction: AutocompleteInteraction, metadata: CommandExecutionMeta): Awaitable<void> {
        throw new Error("Method not implemented.");
    }

    abstract execute(interaction: ChatInputCommandInteraction<CacheType>, metadata: CommandExecutionMeta): Awaitable<void>;

    handleInteraction(interaction: ComponentCommandInteraction, metadata: CommandExecutionMeta): Awaitable<void> {
        throw new Error("Method not implemented.");
    }

    getData(): RESTPostAPIChatInputApplicationCommandsJSONBody {
        return this.data;
    }

    getName(): string {
        return this.getData().name;
    }

    isParent(): this is ParentCommand {
        throw new Error("Method not implemented.");
    }

    isContextMenu(): this is ContextMenuCommand {
        throw new Error("Method not implemented.");
    }

    isStandalone(): this is StandaloneCommand {
        return true;
    }

    isSubCommand(): this is SubCommand {
        throw new Error("Method not implemented.");
    }

    isSubCommandGroup(): this is SubCommandGroup {
        throw new Error("Method not implemented.");
    }

    getNameTree(): ReadonlyArray<string> {
        throw new Error("Method not implemented.");
    }

    getMeta(): ReadonlyMetaCollection | null {
        throw new Error("Method not implemented.");
    }

    getFilter(): CommandFilter | null {
        throw new Error("Method not implemented.");
    }

    getId(): string {
        throw new Error("Method not implemented.");
    }

}