import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as schema from './schema.js';
import { leaderboard } from './schema.js';
import { desc, asc, eq } from 'drizzle-orm';
import { timeToSeconds } from '../engine/sudokuEngine.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_JSON_PATH = path.resolve(__dirname, '../../data/skor.json');

let db = null;
let isConnectedToPostgres = false;

// Check if valid PostgreSQL DATABASE_URL is configured
const connectionString = process.env.DATABASE_URL;
const isPlaceholder = !connectionString || 
  connectionString.includes('[') || 
  connectionString.includes('YOUR_PASSWORD') || 
  connectionString.includes('PROJECT_REF') || 
  connectionString.includes('PROJECT-REF');

if (!isPlaceholder) {
  try {
    const client = postgres(connectionString, {
      prepare: false,
      connect_timeout: 5,
      max: 10
    });
    db = drizzle(client, { schema });
    isConnectedToPostgres = true;
    console.log('Connected to Supabase / PostgreSQL with Drizzle ORM');
  } catch (err) {
    console.warn('Could not connect to PostgreSQL database. Using local JSON fallback.', err.message);
    isConnectedToPostgres = false;
  }
} else {
  console.log('ℹNo live DATABASE_URL provided or placeholder detected. Operating in local JSON storage mode.');
}

// Helper to read local JSON backup
function readLocalScores() {
  try {
    if (fs.existsSync(LOCAL_JSON_PATH)) {
      const raw = fs.readFileSync(LOCAL_JSON_PATH, 'utf-8');
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    }
  } catch (err) {
    console.error('Error reading local JSON fallback:', err);
  }
  return [];
}

// Helper to write local JSON backup
function writeLocalScores(scores) {
  try {
    const dir = path.dirname(LOCAL_JSON_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_JSON_PATH, JSON.stringify(scores, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local JSON fallback:', err);
  }
}

export const dbService = {
  isPostgres: () => isConnectedToPostgres,

  async getLeaderboard(difficulty = null) {
    if (isConnectedToPostgres && db) {
      try {
        let query = db.select().from(leaderboard);
        if (difficulty && difficulty !== 'All') {
          query = query.where(eq(leaderboard.difficulty, difficulty));
        }
        const results = await query.orderBy(asc(leaderboard.timeSeconds)).limit(50);
        return results.map(row => ({
          id: row.id,
          name: row.name,
          time: row.time,
          timeSeconds: row.timeSeconds,
          dificulty: row.difficulty,
          difficulty: row.difficulty,
          timestamp: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString()
        }));
      } catch (err) {
        console.warn('Postgres query failed, falling back to local JSON:', err.message);
      }
    }

    // Local fallback
    const scores = readLocalScores();
    let filtered = scores;
    if (difficulty && difficulty !== 'All') {
      filtered = scores.filter(s => (s.dificulty || s.difficulty || '').toLowerCase() === difficulty.toLowerCase());
    }

    filtered.sort((a, b) => {
      const aSec = a.timeSeconds ?? timeToSeconds(a.time);
      const bSec = b.timeSeconds ?? timeToSeconds(b.time);
      return aSec - bSec;
    });

    return filtered.slice(0, 50).map((item, idx) => ({
      id: item.id || idx + 1,
      name: item.name,
      time: item.time,
      timeSeconds: item.timeSeconds ?? timeToSeconds(item.time),
      dificulty: item.dificulty || item.difficulty,
      difficulty: item.dificulty || item.difficulty,
      timestamp: item.timestamp || new Date().toISOString()
    }));
  },

  async addScore({ name, time, difficulty }) {
    const timeSec = timeToSeconds(time);
    const normalizedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();

    if (isConnectedToPostgres && db) {
      try {
        const [inserted] = await db.insert(leaderboard).values({
          name,
          time,
          timeSeconds: timeSec,
          difficulty: normalizedDifficulty
        }).returning();

        return {
          id: inserted.id,
          name: inserted.name,
          time: inserted.time,
          timeSeconds: inserted.timeSeconds,
          difficulty: inserted.difficulty,
          dificulty: inserted.difficulty,
          timestamp: inserted.createdAt
        };
      } catch (err) {
        console.warn('Postgres insert failed, falling back to local JSON:', err.message);
      }
    }

    // Local fallback
    const scores = readLocalScores();
    const newEntry = {
      name,
      time,
      timeSeconds: timeSec,
      dificulty: normalizedDifficulty,
      difficulty: normalizedDifficulty,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    scores.push(newEntry);
    writeLocalScores(scores);
    return newEntry;
  }
};

export { db, schema };
