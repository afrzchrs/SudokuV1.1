/**
 * API client to communicate with the Sudoku Rush Microservice backend.
 * Uses relative `/api` path which proxies to http://localhost:4000 in Vite dev
 * or directly to the configured microservice URL.
 */

const API_BASE = '/api';

export async function fetchPuzzle(difficulty = 'easy') {
  try {
    const res = await fetch(`${API_BASE}/puzzle?difficulty=${encodeURIComponent(difficulty)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn('Microservice fetchPuzzle failed, using client-side fallback generation:', err);
    return null;
  }
}

export async function verifyPuzzle(grid) {
  try {
    const res = await fetch(`${API_BASE}/puzzle/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grid })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Microservice verifyPuzzle failed:', err);
    return { success: false, message: 'Could not connect to backend verification.' };
  }
}

export async function fetchLeaderboard(difficulty = 'All') {
  try {
    const res = await fetch(`${API_BASE}/leaderboard?difficulty=${encodeURIComponent(difficulty)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.warn('Microservice fetchLeaderboard failed:', err);
    return [];
  }
}

export async function submitScore({ name, time, difficulty }) {
  const res = await fetch(`${API_BASE}/leaderboard`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, time, difficulty })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to submit score');
  }
  return await res.json();
}
