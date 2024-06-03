import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import { Category } from "../../structures/Category";

export default new Command(
    new SlashCommandBuilder().setName("ping").setDescription("testing command"),
    Category.BETA,
    async (i, client) => {
        await i.reply({ content: "pong" })
    }
)