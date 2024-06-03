import { ChatInputCommandInteraction, type Interaction } from "discord.js";
import { Event } from "../structures/Event";
import { CommandHandler } from "../handlers/CommandHandler";
import { client } from "..";
import { InteractionOptions } from "../util/InteractionOptions";

export default new Event("interactionCreate", async (i: Interaction) => {
    if (i.isChatInputCommand()) {
        const command = CommandHandler.commands.get((i as ChatInputCommandInteraction).commandName)

        if (command == undefined) {
            return;
        }
        
        await command.onExecute(i, client, new InteractionOptions(i))
    }
})