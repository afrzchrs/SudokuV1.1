import express from 'express';
import { dbService } from '../db/client.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const difficulty = req.query.difficulty || 'All';
    const rankings = await dbService.getLeaderboard(difficulty);

    res.json({
      success: true,
      difficulty,
      isPostgres: dbService.isPostgres(),
      count: rankings.length,
      data: rankings
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard data'
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, time, difficulty, dificulty } = req.body;
    const chosenDifficulty = difficulty || dificulty;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Nama pemain wajib diisi.'
      });
    }

    if (!time || typeof time !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Waktu penyelesaian wajib diisi.'
      });
    }

    if (!chosenDifficulty) {
      return res.status(400).json({
        success: false,
        message: 'Tingkat kesulitan (difficulty) wajib dipilih.'
      });
    }

    const trimmedName = name.trim().slice(0, 50);
    const result = await dbService.addScore({
      name: trimmedName,
      time,
      difficulty: chosenDifficulty
    });

    res.status(201).json({
      success: true,
      message: 'Skor berhasil dicatat ke leaderboard!',
      data: result
    });
  } catch (error) {
    console.error('Error saving score to leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menyimpan skor ke database.'
    });
  }
});

export default router;
