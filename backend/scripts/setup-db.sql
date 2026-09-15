-- SQL Script to create Leaderboard Table in Supabase
-- Paste this in Supabase Dashboard -> SQL Editor and click "Run"

CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  time VARCHAR(20) NOT NULL,
  time_seconds INTEGER NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Index for fast ranking query
CREATE INDEX IF NOT EXISTS idx_leaderboard_difficulty_time 
ON leaderboard(difficulty, time_seconds ASC);

-- Initial seed data
INSERT INTO leaderboard (name, time, time_seconds, difficulty, created_at)
VALUES 
  ('Riza', '00:17:33', 1053, 'Mediocre', '2025-07-16 03:39:37+00'),
  ('Riza', '00:20:25', 1225, 'Easy', '2025-07-15 10:41:40+00'),
  ('Riza', '00:51:45', 3105, 'Genius', '2025-07-16 07:28:34+00')
ON CONFLICT DO NOTHING;
