import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import path,{ dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: path.resolve(__dirname, '../.env') });

export const PORT = process.env.PORT;
export const DATABASE_HOST = process.env.DATABASE_HOST;
export const DATABASE_NAME = process.env.DATABASE_NAME;
export const DATABASE_USER = process.env.DATABASE_USER;
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
export const DATABASE_PORT = process.env.DATABASE_PORT;
export const REDIS_URL = process.env.REDIS_URL;
export const JUDGE0CE_API_KEY = process.env.JUDGE0CE_API_KEY;
export const JUDGE0CE_API_HOST = process.env.JUDGE0CE_API_HOST;