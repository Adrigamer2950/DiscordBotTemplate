import * as config from '../config/config.json';
import { ActivityType, PresenceStatusData } from 'discord-api-types';

export function getConfig() {
    return process.env.NODE_ENV == 'dev' ? config.dev : config.prod;
}

export interface Config {
    presence: {
        status: PresenceStatusData;
        type: ActivityType,
        desc: string;
    }
}