import { BotStatusEnum, type BotService, type BotStatus, type CommandManager, type EventManager, type Identifier, type NyxBot, type NyxLogger, type PluginManager, type ScheduleManager, type SessionManager } from "@nyx-discord/core";
import { Client, type BitFieldResolvable, type GatewayIntentsString } from "discord.js";
import { CustomBotService } from "../service/Service";
import { CustomEventBus } from "../event/EventBus";
import { CustomEventManager } from "../event/EventManager";
import { CustomCommandManager } from "../command/CommandManager";
import {Logger} from "../logger/Logger.ts";

export class Bot implements NyxBot {

    private readonly client: Client;
    private readonly eventManager: EventManager;
    private readonly commandManager: CommandManager;
    private readonly service: BotService;
    private status: BotStatus = BotStatusEnum.Unprepared;
    private readonly token: string;
    private readonly logger: NyxLogger;

    constructor(
        options: {
            logger?: NyxLogger,
            token: string,
            intents: BitFieldResolvable<GatewayIntentsString, number>
        }
    ) {
        this.token = options.token;

        this.client = new Client({
            intents: options.intents
        });

        this.logger = options.logger ?? new Logger("Bot");

        this.commandManager = new CustomCommandManager(this);
        this.eventManager = new CustomEventManager(this);

        this.service = new CustomBotService(this, CustomEventBus.create(this, Symbol("service")));
    }

    getLogger(): NyxLogger {
        return this.logger;
    }

    getClient(): Client<boolean> {
        return this.client;
    }

    getCommandManager(): CommandManager {
        return this.commandManager;
    }

    getEventManager(): EventManager {
        return this.eventManager;
    }

    getScheduleManager(): ScheduleManager {
        throw new Error("Method not implemented.");
    }

    getSessionManager(): SessionManager {
        throw new Error("Method not implemented.");
    }

    getPluginManager(): PluginManager {
        throw new Error("Method not implemented.");
    }

    getService(): BotService {
        return this.service;
    }

    async start(): Promise<this> {
        this.getLogger().info("&eLoading...");

        if (this.status == BotStatusEnum.Unprepared)
            await this.service.setup();

        await this.service.start();

        this.status = BotStatusEnum.Running;

        return this;
    }

    getToken(): string {
        return this.token;
    }

    decorate<Key extends string | symbol, Value>(key: Key, value: Value): asserts this is this & Record<Key, Value> {
        throw new Error("Method not implemented.");
    }

    getId(): Identifier {
        throw new Error("Method not implemented.");
    }
}