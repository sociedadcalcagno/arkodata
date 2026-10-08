import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

export const hasDatabase = Boolean(process.env.DATABASE_URL);

if (!hasDatabase) {
  console.warn('DATABASE_URL no configurada: usando almacenamiento en memoria');
}

export const pool = hasDatabase
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      max: Number(process.env.PG_POOL_MAX) || 1,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000,
    })
  : null;

export const db = pool
  ? drizzle(pool, { schema })
  : null;
