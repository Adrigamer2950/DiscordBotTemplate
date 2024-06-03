import type { ClientEvents } from "discord.js";

export class Event {
    constructor(public type: keyof ClientEvents, public run: (...args: any) => any) {}
}