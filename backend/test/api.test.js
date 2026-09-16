process.env.NODE_ENV = 'test';
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/server.js';
import { closeDatabaseConnection } from '../src/db/client.js';

describe('Sudoku Rush Microservice API Integration Tests', () => {
  let server;
  let baseUrl;

  before((_, done) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      done();
    });
  });

  after(async () => {
    if (server) {
      if (server.closeAllConnections) server.closeAllConnections();
      await new Promise(resolve => server.close(resolve));
    }
    await closeDatabaseConnection();
  });

  describe('GET /api/health', () => {
    it('returns status ok with service details', async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.status, 'ok');
      assert.ok(data.service.includes('Sudoku Rush'));
      assert.ok(data.database);
    });
  });

  describe('GET /api/puzzle', () => {
    it('returns a new easy puzzle by default', async () => {
      const res = await fetch(`${baseUrl}/api/puzzle`);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.equal(data.data.difficulty, 'Easy');
      assert.equal(data.data.puzzle.length, 9);
      assert.equal(data.data.solution.length, 9);
    });

    it('returns a mediocre puzzle when requested', async () => {
      const res = await fetch(`${baseUrl}/api/puzzle?difficulty=mediocre`);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.equal(data.data.difficulty, 'Mediocre');
    });

    it('returns a genius puzzle when requested', async () => {
      const res = await fetch(`${baseUrl}/api/puzzle?difficulty=genius`);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.equal(data.data.difficulty, 'Genius');
    });
  });

  describe('POST /api/puzzle/verify', () => {
    it('validates a complete and correct 9x9 solution', async () => {
      // First get a puzzle with known solution
      const pzRes = await fetch(`${baseUrl}/api/puzzle?difficulty=easy`);
      const pzData = await pzRes.json();
      const validGrid = pzData.data.solution;

      const res = await fetch(`${baseUrl}/api/puzzle/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grid: validGrid })
      });
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.equal(data.valid, true);
    });

    it('rejects an incomplete puzzle containing zeroes', async () => {
      const incompleteGrid = Array.from({ length: 9 }, () => Array(9).fill(1));
      incompleteGrid[0][0] = 0;

      const res = await fetch(`${baseUrl}/api/puzzle/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grid: incompleteGrid })
      });
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.valid, false);
      assert.ok(data.message.includes('kosong'));
    });

    it('rejects an invalid payload format', async () => {
      const res = await fetch(`${baseUrl}/api/puzzle/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grid: 'invalid' })
      });
      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.success, false);
    });
  });

  describe('GET & POST /api/leaderboard', () => {
    it('retrieves leaderboard rankings', async () => {
      const res = await fetch(`${baseUrl}/api/leaderboard`);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.ok(Array.isArray(data.data));
    });

    it('filters leaderboard by difficulty', async () => {
      const res = await fetch(`${baseUrl}/api/leaderboard?difficulty=Easy`);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.ok(Array.isArray(data.data));
      data.data.forEach(item => {
        assert.equal(item.difficulty.toLowerCase(), 'easy');
      });
    });

    it('rejects submission with missing player name', async () => {
      const res = await fetch(`${baseUrl}/api/leaderboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '', time: '00:05:00', difficulty: 'Easy' })
      });
      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.success, false);
    });

    it('successfully submits and registers a new score', async () => {
      const testName = 'TestBot_' + Date.now().toString().slice(-4);
      const res = await fetch(`${baseUrl}/api/leaderboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: testName,
          time: '00:04:15',
          difficulty: 'Easy'
        })
      });
      assert.equal(res.status, 201);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.equal(data.data.name, testName);

      // Verify the score appears in leaderboard
      const lbRes = await fetch(`${baseUrl}/api/leaderboard?difficulty=Easy`);
      const lbData = await lbRes.json();
      const match = lbData.data.find(entry => entry.name === testName);
      assert.ok(match, 'Newly added score must be present in leaderboard');
    });
  });

  describe('404 Fallback Route', () => {
    it('returns 404 for unknown endpoints', async () => {
      const res = await fetch(`${baseUrl}/api/non-existent`);
      assert.equal(res.status, 404);
      const data = await res.json();
      assert.equal(data.success, false);
    });
  });
});
