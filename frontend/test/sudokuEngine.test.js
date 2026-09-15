import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  isValid,
  hasUniqueSolution,
  generateFullGrid,
  generatePuzzle,
  isCompleteAndValid,
  formatTime,
  DIFFICULTY_CONFIG
} from '../src/lib/sudokuEngine.js';

describe('Frontend Sudoku Engine Parity Tests', () => {
  it('validates cell placement correctly', () => {
    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    assert.equal(isValid(grid, 0, 0, 1), true);
    grid[0][1] = 1;
    assert.equal(isValid(grid, 0, 0, 1), false);
  });

  it('generates full grid and validates completeness', () => {
    const fullGrid = generateFullGrid();
    assert.equal(isCompleteAndValid(fullGrid), true);
  });

  it('generates playable puzzles for Easy, Mediocre, and Genius', () => {
    ['easy', 'mediocre', 'genius'].forEach(difficulty => {
      const pz = generatePuzzle(difficulty);
      assert.ok(pz.puzzle);
      assert.ok(pz.solution);
      assert.equal(hasUniqueSolution(pz.puzzle), true);
      assert.equal(isCompleteAndValid(pz.solution), true);
    });
  });

  it('formats time in HH:MM:SS format', () => {
    assert.equal(formatTime(0), '00:00:00');
    assert.equal(formatTime(65), '00:01:05');
    assert.equal(formatTime(3600), '01:00:00');
  });
});
