import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  isValid,
  hasUniqueSolution,
  generateFullGrid,
  generatePuzzle,
  isCompleteAndValid,
  timeToSeconds,
  formatSeconds,
  DIFFICULTY_CONFIG
} from '../src/engine/sudokuEngine.js';

describe('Sudoku Engine Unit Tests', () => {
  describe('isValid placement', () => {
    it('allows valid number placement in an empty cell', () => {
      const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
      assert.equal(isValid(grid, 0, 0, 5), true);
    });

    it('rejects duplicate number in the same row', () => {
      const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
      grid[0][4] = 5;
      assert.equal(isValid(grid, 0, 0, 5), false);
    });

    it('rejects duplicate number in the same column', () => {
      const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
      grid[5][0] = 7;
      assert.equal(isValid(grid, 0, 0, 7), false);
    });

    it('rejects duplicate number in the same 3x3 block', () => {
      const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
      grid[1][1] = 9;
      assert.equal(isValid(grid, 2, 2, 9), false);
    });
  });

  describe('generateFullGrid & isCompleteAndValid', () => {
    it('generates a valid completed 9x9 Sudoku board', () => {
      const grid = generateFullGrid();
      assert.equal(grid.length, 9);
      grid.forEach(row => {
        assert.equal(row.length, 9);
        row.forEach(val => {
          assert.ok(val >= 1 && val <= 9, `Value ${val} should be between 1 and 9`);
        });
      });
      assert.equal(isCompleteAndValid(grid), true);
    });

    it('isCompleteAndValid correctly rejects invalid boards', () => {
      const grid = generateFullGrid();
      // Introduce duplicate in row 0
      grid[0][1] = grid[0][0];
      assert.equal(isCompleteAndValid(grid), false);
    });

    it('isCompleteAndValid rejects boards containing zeroes or empty cells', () => {
      const grid = generateFullGrid();
      grid[4][4] = 0;
      assert.equal(isCompleteAndValid(grid), false);
    });
  });

  describe('generatePuzzle', () => {
    it('generates an Easy puzzle with solvable solution and unique solution', () => {
      const puzzleObj = generatePuzzle('easy');
      assert.equal(puzzleObj.difficulty, 'Easy');
      assert.ok(puzzleObj.clueCount <= DIFFICULTY_CONFIG.easy.clueCount + 5, 'Clue count within reasonable range');
      assert.equal(hasUniqueSolution(puzzleObj.puzzle), true);
      assert.equal(isCompleteAndValid(puzzleObj.solution), true);
    });

    it('generates a Mediocre puzzle', () => {
      const puzzleObj = generatePuzzle('mediocre');
      assert.equal(puzzleObj.difficulty, 'Mediocre');
      assert.equal(hasUniqueSolution(puzzleObj.puzzle), true);
      assert.equal(isCompleteAndValid(puzzleObj.solution), true);
    });

    it('generates a Genius puzzle', () => {
      const puzzleObj = generatePuzzle('genius');
      assert.equal(puzzleObj.difficulty, 'Genius');
      assert.equal(hasUniqueSolution(puzzleObj.puzzle), true);
      assert.equal(isCompleteAndValid(puzzleObj.solution), true);
    });
  });

  describe('hasUniqueSolution', () => {
    it('detects multiple solutions on completely empty grid', () => {
      const emptyGrid = Array.from({ length: 9 }, () => Array(9).fill(0));
      assert.equal(hasUniqueSolution(emptyGrid), false);
    });
  });

  describe('Time conversion utilities', () => {
    it('converts HH:MM:SS format to seconds', () => {
      assert.equal(timeToSeconds('01:02:03'), 3723);
    });

    it('converts MM:SS format to seconds', () => {
      assert.equal(timeToSeconds('05:30'), 330);
    });

    it('formats seconds into HH:MM:SS string', () => {
      assert.equal(formatSeconds(3723), '01:02:03');
      assert.equal(formatSeconds(330), '00:05:30');
      assert.equal(formatSeconds(0), '00:00:00');
    });
  });
});
