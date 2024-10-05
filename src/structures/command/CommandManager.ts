import { CommandExecutionMeta, type AnyExecutableCommand, type BotService, type CommandCustomIdCodec, type CommandEventArgs, type CommandExecutableInteraction, type CommandExecutor, type CommandManager, type CommandResolver, type CommandSubscriptionsContainer, type EventBus, type EventManager, type EventSubscriber, type ExecutableCommand, type Identifier, type NyxBot, type NyxLogger, type PluginManager, type ReadonlyCommandDeployer, type ReadonlyCommandRepository, type ScheduleManager, type SessionManager, type TopLevelCommand } from "@nyx-discord/core";
import { type Awaitable, type AutocompleteInteraction, type Client, Collection, type ChatInputCommandInteraction, type RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import { readdirSync } from "fs";
import { importFile } from "../../util/ImportFile";

export class CustomCommandManager implements CommandManager {

    private commands: Collection<Identifier, TopLevelCommand> = new Collection();

    execute(source: CommandExecutableInteraction, meta?: CommandExecutionMeta): Awaitable<boolean> {
        let cmd: TopLevelCommand | undefined = this.commands.get((source as ChatInputCommandInteraction).commandName as Identifier)

        if (cmd == undefined) {
            return false;
        }

        meta =
            meta
            ?? CommandExecutionMeta.fromCommandCall(cmd as AnyExecutableCommand, source, this.bot);

        if (this.isExecutableCommand(cmd)) {
            cmd.execute(source as ChatInputCommandInteraction, meta);
        }

        return true;
    }

    private isExecutableCommand(cmd: any): cmd is ExecutableCommand<Identifier, ChatInputCommandInteraction> {
        return cmd && typeof cmd.execute === "function";
    }

    autocomplete(interaction: AutocompleteInteraction, meta?: CommandExecutionMeta): Awaitable<boolean> {
        throw new Error("Method not implemented.");
    }

    addCommands(...commands: TopLevelCommand[]): Awaitable<this> {
        for (const cmd of commands) {
            this.commands.set(cmd.getName(), cmd);
        }

        return this;
    }

    removeCommands(...commands: TopLevelCommand[]): Awaitable<this> {
        throw new Error("Method not implemented.");
    }

    editCommands(...commands: TopLevelCommand[]): Awaitable<this> {
        throw new Error("Method not implemented.");
    }

    subscribe(...subscribers: EventSubscriber<CommandEventArgs, keyof CommandEventArgs>[]): Awaitable<this> {
        throw new Error("Method not implemented.");
    }

    deploy(): Awaitable<void> {
        throw new Error("Method not implemented.");
    }

    getSubscriptions(): CommandSubscriptionsContainer {
        throw new Error("Method not implemented.");
    }

    getCustomIdCodec(): CommandCustomIdCodec {
        throw new Error("Method not implemented.");
    }

    getResolver(): CommandResolver {
        throw new Error("Method not implemented.");
    }

    getExecutor(): CommandExecutor {
        throw new Error("Method not implemented.");
    }

    getRepository(): ReadonlyCommandRepository {
        throw new Error("Method not implemented.");
    }

    getEventBus(): EventBus<CommandEventArgs> {
        throw new Error("Method not implemented.");
    }

    getDeployer(): ReadonlyCommandDeployer {
        throw new Error("Method not implemented.");
    }

    bot: NyxBot<NyxLogger, CommandManager, EventManager, ScheduleManager, SessionManager, PluginManager, BotService, Client<boolean>>;

    constructor(bot: NyxBot) {
        this.bot = bot;
    }
    
    setCommands(...commands: TopLevelCommand[]): Awaitable<this> {
        throw new Error("Method not implemented.");
    }

    async onSetup(): Promise<void> {
        this.bot.getLogger().info("&eLoading commands...");

        for (const folder of readdirSync(__dirname + "/../../commands")) {
            for (const file of readdirSync(__dirname + `/../../commands/${folder}`)) {
                const clazz = await importFile(__dirname + `/../../commands/${folder}/${file}`);

                if (this.isCommand(clazz)) {
                    await this.addCommands(clazz as TopLevelCommand)
                }
            }
        }
    }

    private isCommand(obj: any): obj is TopLevelCommand {
        return obj && typeof obj.getName === "function";
    }

    onStart(): Awaitable<void> {
        let slash: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

        this.commands.forEach((cmd) => slash.push(cmd.getData() as RESTPostAPIChatInputApplicationCommandsJSONBody));

        this.bot.getClient().rest.put(Routes.applicationCommands(this.bot.getClient().user?.id as string), {
            body: slash
        })
    }

    onStop(): Awaitable<void> {
        throw new Error("Method not implemented.");
    }

}