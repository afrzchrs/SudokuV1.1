import postgres from 'postgres';
import { env } from '$env/dynamic/private';

const defaultConnectionString = 'postgresql://postgres.vqmzjvbhsrehxdgwlpov:sudokuggidminigames@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';

let sql = null;

export function getDb() {
  if (!sql) {
    const connectionString = env.DATABASE_URL || defaultConnectionString;
    sql = postgres(connectionString, {
      prepare: false,
      connect_timeout: 10,
      max: 5
    });
  }
  return sql;
}
