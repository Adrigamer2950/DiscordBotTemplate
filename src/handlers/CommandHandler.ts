import { AsciiTable3 } from "ascii-table3";
import { readdirSync } from "fs";
import { Command } from "../structures/Command";
import { type APIApplicationCommandOption, Collection, type RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import { importFile } from "../util/ImportFile";
import { client } from "..";

export namespace CommandHandler {
    export let commands: Collection<string, Command> = new Collection()

    function addCommand(command: Command): void {
        commands.set(command.data.name, command);
    }

    export async function loadCommands() {
        let table = new AsciiTable3("Commands").setHeading(
            "Name",
            "Category"
        );

        const folders = readdirSync(`${import.meta.dir.replaceAll("/handlers", "")}/commands`);
        for (const folderName of folders) {
            const files = readdirSync(`${import.meta.dir.replaceAll("/handlers", "")}/commands/${folderName}`);
            files.forEach(async (fName) => {
                if (fName.endsWith(".ts") || fName.endsWith(".js")) {
                    const command: Command = await importFile(
                        `${import.meta.dir.replaceAll("/handlers", "")}/commands/${folderName}/${fName}`
                    );

                    addCommand(command);

                    //const f = require(`${import.meta.dir.replaceAll("/handlers", "")}/commands/${folderName}/${fName}`);
                    //if (f.registerSubCommands != undefined) f.registerSubCommands(this);
                }
            });
        }

        setTimeout(() => {
            for (let command of commands.values()) {
                table.addRowMatrix([
                    [command.data.name + " ", command.category.id],
                ]);
            }

            console.log(table.toString())
        }, 300)
    }

    export async function registerCommands() {
        let slash: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

        commands.forEach((cmd: Command, name) => {
            //if (!(cmd instanceof SubCommand))
            slash.push({
                name: cmd.data.name,
                description: cmd.data.description,
                options: cmd.data.options as APIApplicationCommandOption[],
            });
        });

        console.log(
            `Started refreshing ${slash.length} application (/) commands.`
        );

        client.rest.put(Routes.applicationCommands(client.user?.id + ""), {
            body: slash,
        });

        console.log(
            `Successfully reloaded ${slash.length} application (/) commands.`
        );
    }
}