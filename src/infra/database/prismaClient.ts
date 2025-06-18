import { PrismaClient as PostgresClient } from './generated/client-postgres';
import { PrismaClient as MongoClient } from './generated/client-mongo';

export const postgres = new PostgresClient();
export const mongo = new MongoClient();
