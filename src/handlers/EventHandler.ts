import { AsciiTable3 } from "ascii-table3";
import { readdirSync } from "fs";
import { importFile } from "../util/ImportFile.ts";
import { Event } from "../structures/Event.ts";
import { client } from "../index.ts";

export namespace EventHandler {
    export function loadEvents() {
        var table = new AsciiTable3("Loaded Events").setHeading(
            "Name",
            "File Name"
        );

        const files = readdirSync(`${import.meta.dir.replaceAll("/handlers", "")}/events`);
        files.forEach(async (fName, index) => {
            if (fName.endsWith(".ts") || fName.endsWith(".js")) {
                const event: Event = await importFile(
                    `${import.meta.dir.replaceAll("/handlers", "")}/events/${fName}`
                );
                addEvent(event);
                table.addRowMatrix([[event.type.toString(), fName]]);
                if (index == files.length - 1) console.log(table.toString());
            }
        });
    }

    export function addEvent(event: Event): void {
        client.djs.on(event.type, event.run)
    }
}