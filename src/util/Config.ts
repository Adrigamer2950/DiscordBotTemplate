import * as config from '../../config.json';

export function getConfig() {
    if(process.env.NODE_ENV == 'dev')
        return config.dev;
    else
        return config.prod;
}