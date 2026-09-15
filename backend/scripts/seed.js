import { dbService } from '../src/db/client.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_JSON_PATH = path.resolve(__dirname, '../data/skor.json');

async function seed() {
  if (!dbService.isPostgres()) {
    console.log('Not connected to Postgres. Skipping seed.');
    process.exit(0);
  }

  const existing = await dbService.getLeaderboard('All');
  if (existing.length > 0) {
    console.log(`Database already has ${existing.length} records. Skipping seed.`);
    process.exit(0);
  }

  if (!fs.existsSync(LOCAL_JSON_PATH)) {
    console.log('No local skor.json found to seed.');
    process.exit(0);
  }

  const scores = JSON.parse(fs.readFileSync(LOCAL_JSON_PATH, 'utf-8'));
  console.log(`Seeding ${scores.length} scores to Supabase...`);

  for (const s of scores) {
    await dbService.addScore({
      name: s.name,
      time: s.time,
      difficulty: s.difficulty || s.dificulty || 'Easy'
    });
  }

  console.log('Seed completed successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
