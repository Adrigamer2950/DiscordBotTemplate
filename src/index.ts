import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ override: true, path: path.join(process.cwd(), process.env.NODE_ENV == 'dev' ? '.env.dev' : '.env') })

import { BotClient } from "./structures/Client"
import { PrismaClient } from '@prisma/client';

export const client = new BotClient(process.env['TOKEN'] as any as string);

export const prisma = new PrismaClient();

client.start();
