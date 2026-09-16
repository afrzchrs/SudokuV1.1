import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';

function parseTimeToSeconds(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 3) {
    const [h, m, s] = parts;
    return (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
  } else if (parts.length === 2) {
    const [m, s] = parts;
    return (m || 0) * 60 + (s || 0);
  }
  return Number(timeStr) || 0;
}

export async function GET({ url }) {
  try {
    const difficulty = url.searchParams.get('difficulty') || 'All';
    const sql = getDb();
    
    let results;
    if (difficulty && difficulty !== 'All') {
      const normalized = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
      results = await sql`
        SELECT id, name, time, time_seconds, difficulty, created_at
        FROM leaderboard
        WHERE LOWER(difficulty) = LOWER(${normalized})
        ORDER BY time_seconds ASC
        LIMIT 50
      `;
    } else {
      results = await sql`
        SELECT id, name, time, time_seconds, difficulty, created_at
        FROM leaderboard
        ORDER BY time_seconds ASC
        LIMIT 50
      `;
    }

    const formatted = results.map(row => ({
      id: row.id,
      name: row.name,
      time: row.time,
      timeSeconds: row.time_seconds,
      difficulty: row.difficulty,
      dificulty: row.difficulty,
      timestamp: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString()
    }));

    return json({
      success: true,
      difficulty,
      count: formatted.length,
      data: formatted
    });
  } catch (err) {
    console.error('Error fetching leaderboard from Supabase:', err);
    return json({
      success: false,
      message: 'Failed to fetch leaderboard from database',
      data: []
    }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { name, time, difficulty, dificulty } = body;
    const chosenDifficulty = difficulty || dificulty;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return json({ success: false, message: 'Nama pemain wajib diisi.' }, { status: 400 });
    }
    if (!time || typeof time !== 'string') {
      return json({ success: false, message: 'Waktu penyelesaian wajib diisi.' }, { status: 400 });
    }
    if (!chosenDifficulty) {
      return json({ success: false, message: 'Tingkat kesulitan (difficulty) wajib dipilih.' }, { status: 400 });
    }

    const trimmedName = name.trim().slice(0, 50);
    const normalizedDifficulty = chosenDifficulty.charAt(0).toUpperCase() + chosenDifficulty.slice(1).toLowerCase();
    const timeSec = parseTimeToSeconds(time);

    const sql = getDb();
    const [inserted] = await sql`
      INSERT INTO leaderboard (name, time, time_seconds, difficulty)
      VALUES (${trimmedName}, ${time}, ${timeSec}, ${normalizedDifficulty})
      RETURNING id, name, time, time_seconds, difficulty, created_at
    `;

    return json({
      success: true,
      message: 'Skor berhasil dicatat ke leaderboard!',
      data: {
        id: inserted.id,
        name: inserted.name,
        time: inserted.time,
        timeSeconds: inserted.time_seconds,
        difficulty: inserted.difficulty,
        dificulty: inserted.difficulty,
        timestamp: inserted.created_at
      }
    }, { status: 201 });
  } catch (err) {
    console.error('Error saving score to Supabase:', err);
    return json({
      success: false,
      message: 'Gagal menyimpan skor ke database.'
    }, { status: 500 });
  }
}
