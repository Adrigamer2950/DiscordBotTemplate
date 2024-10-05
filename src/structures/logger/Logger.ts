import type { NyxLogger } from "@nyx-discord/core";

export class Logger implements NyxLogger {

    constructor(private name: string) {}

    log: (level: LoggerLevel, ...args: any[]) => unknown = (level: LoggerLevel, ...args: any[]) => {
        for (const arg of args) {
            if (typeof arg[0] !== "string") {
                console.log(`[${level}] [${this.name}] `, arg)
            } else {
                console.info(`[${level}] [${this.name}] ${colorizeOutput(arg)}`);
            }
        }
    };

    trace: (...args: any[]) => unknown = (...args: any[]) => {
        this.log(LoggerLevel.TRACE, args);
    };

    debug: (...args: any[]) => unknown = (...args: any[]) => {
        this.log(LoggerLevel.DEBUG, args);
    };

    info: (...args: any[]) => unknown = (...args: any[]) => {
        this.log(LoggerLevel.INFO, args);
    };

    warn: (...args: any[]) => unknown = (...args: any[]) => {
        this.log(LoggerLevel.WARN, args);
    };

    error: (...args: any[]) => unknown = (...args: any[]) => {
        this.log(LoggerLevel.ERROR, args);
    };
}

export enum LoggerLevel {
    TRACE = "TRACE",
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR"
}

const colors: [string, number][] = [
    ["&0", 30], // Black
    ["&c", 31], // Red
    ["&a", 32], // Green
    ["&e", 33], // Yellow
    ["&9", 34], // Blue
    ["&d", 35], // Magenta
    ["&b", 36], // Cyan
    ["&f", 37], // White
    ["&r", 0]   // Reset
];

export function colorizeOutput(text: string) {
    text = text + "&r";
    for (var col of colors) {
        text = text.replaceAll(col[0], `\x1b[${col[1]}m`);
    }

    return text;
}