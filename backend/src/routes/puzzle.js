import express from 'express';
import { generatePuzzle, isCompleteAndValid, DIFFICULTY_CONFIG } from '../engine/sudokuEngine.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const difficulty = (req.query.difficulty || 'easy').toLowerCase();
    const result = generatePuzzle(difficulty);

    res.json({
      success: true,
      data: {
        difficulty: result.difficulty,
        puzzle: result.puzzle,
        solution: result.solution,
        clueCount: result.clueCount
      }
    });
  } catch (error) {
    console.error('Error generating puzzle:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate puzzle'
    });
  }
});

router.post('/verify', (req, res) => {
  try {
    const { grid } = req.body;
    if (!grid || !Array.isArray(grid) || grid.length !== 9) {
      return res.status(400).json({
        success: false,
        message: 'Invalid grid format. Must be a 9x9 matrix.'
      });
    }

    // Check for empty cells (0)
    const hasZeros = grid.flat().some(cell => cell === 0 || cell === null || cell === undefined);
    if (hasZeros) {
      return res.json({
        success: false,
        valid: false,
        message: 'Masih ada sel yang kosong!'
      });
    }

    const valid = isCompleteAndValid(grid);
    return res.json({
      success: true,
      valid,
      message: valid ? 'Sudoku berhasil diselesaikan!' : 'Ada angka yang duplikat atau salah penempatan.'
    });
  } catch (error) {
    console.error('Error verifying puzzle:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during verification'
    });
  }
});

export default router;
