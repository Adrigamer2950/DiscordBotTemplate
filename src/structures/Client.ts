import { Client, GatewayIntentBits, REST, type Snowflake } from "discord.js";
import { EventHandler } from "../handlers/EventHandler";
import { CommandHandler } from "../handlers/CommandHandler";

export class BotClient {

    public djs: Client;
    public rest: REST;
    public user: ClientUser | null | undefined;

    constructor(private token: string) {
        this.djs = new Client(
            {
                intents:
                    [GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages]
            }
        )
        this.rest = new REST().setToken(this.token);

        EventHandler.loadEvents();
        CommandHandler.loadCommands();
    }

    public start() {
        this.djs.login(this.token);
    }
}

export interface ClientUser {
    id: Snowflake | undefined;
}