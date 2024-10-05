import { Bot } from "./structures/bot/Bot";
import type { NyxBot } from "@nyx-discord/core";
import readline from 'readline-sync';
import dotenv from 'dotenv';
import path from "path";

dotenv.config({ override: true, path: path.join(process.cwd(), process.env.NODE_ENV == 'dev' ? '.env.dev' : '.env') })

export const bot: NyxBot = await new Bot({
    token: process.env['token'] as string,
    intents: []
});

await bot.start();

const stopCmd = [
    "stop", "exit", "st", "end"
];

while (true) {
    const input = readline.question("> ");

    if (stopCmd.includes(input)) {
        bot.getService().stop();

        break;
    }
}