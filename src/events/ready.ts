import { Client, type PresenceStatusData } from 'discord.js';
import { Event } from '../structures/Event';
import { client } from '..';
import { CommandHandler } from '../handlers/CommandHandler';
import * as config from '../util/Config';

export default new Event("ready", async (c: Client) => {
    client.user = {
        id: c.user?.id
    };

    CommandHandler.registerCommands();

    c.user?.setPresence({
        activities: [
            {
                name: config.getConfig().presence.desc,
                type: config.getConfig().presence.type
            }
        ],
        status: config.getConfig().presence.status as any as PresenceStatusData
    })

    console.log("Client started as " + c.user?.username)
})