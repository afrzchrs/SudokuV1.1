import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import puzzleRoutes from './routes/puzzle.js';
import leaderboardRoutes from './routes/leaderboard.js';
import { dbService } from './db/client.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sudoku Rush Microservice API',
    database: dbService.isPostgres() ? 'Supabase PostgreSQL (Drizzle ORM)' : 'Local JSON Storage',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/puzzle', puzzleRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start listening only when executed directly
const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('server.js') ||
  process.argv[1].endsWith('src/server.js') ||
  process.argv[1].endsWith('src\\server.js')
);

if (isDirectRun && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Sudoku Rush Microservice running on http://localhost:${PORT}`);
    console.log(`📊 Leaderboard DB: ${dbService.isPostgres() ? 'Supabase (PostgreSQL)' : 'Local JSON Storage'}`);
  });
}

export { app };
export default app;

