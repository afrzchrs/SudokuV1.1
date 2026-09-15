# Implementation Plan: Sudoku Rush Revamp (SvelteKit + Microservice + Supabase/Drizzle)

Revamp the existing legacy PHP + vanilla HTML/JS Sudoku project into a modern, high-performance web application powered by **SvelteKit** and a dedicated **JavaScript Microservice Backend** with **Supabase & Drizzle ORM**.

## User Review Required

> [!IMPORTANT]
> - **Architecture Separation**: A dedicated lightweight Node.js microservice (`backend/` or `services/sudoku-api`) will handle puzzle generation, solution uniqueness validation, and leaderboard persistence using Drizzle ORM + Supabase. SvelteKit will provide the frontend SSR/SPA experience.
> - **Database**: Supabase PostgreSQL with Drizzle ORM. We will provide `.env.example`, ready-to-run migration scripts/schema, and a graceful fallback to local storage/mock data so the app runs immediately even before Supabase credentials are provided.
> - **Game Difficulties**: Retains current naming ("Easy", "Mediocre", "Genius") and card themes, upgraded to modern glassmorphic cards and interactive game mechanics.

---

## Proposed Architecture

```
Sudoku/
├── backend/                       # Dedicated JavaScript Microservice
│   ├── package.json
│   ├── .env.example
│   ├── drizzle.config.js          # Drizzle ORM configuration
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.js          # Leaderboard table definition
│   │   │   └── client.js          # Drizzle + Supabase connection with local fallback
│   │   ├── engine/
│   │   │   └── sudokuEngine.js    # Refactored DRY solver & puzzle generator (reused from easy/mediocre/genius.js)
│   │   ├── routes/
│   │   │   ├── puzzle.js          # Puzzle generation & validation endpoints
│   │   │   └── leaderboard.js     # Leaderboard CRUD & ranking endpoints
│   │   └── server.js              # Microservice entry point (Port 4000)
│   └── scripts/
│       └── migrate.js             # Drizzle push / table setup helper
│
├── frontend/                      # SvelteKit Application
│   ├── package.json
│   ├── svelte.config.js
│   ├── vite.config.js
│   └── src/
│       ├── app.html
│       ├── lib/
│       │   ├── api.js             # Client for Microservice
│       │   ├── components/
│       │   │   ├── Navbar.svelte
│       │   │   ├── Footer.svelte
│       │   │   ├── DifficultyCards.svelte
│       │   │   ├── LeaderboardSection.svelte
│       │   │   ├── FeaturesSection.svelte
│       │   │   ├── HowToPlaySection.svelte
│       │   │   ├── SudokuBoard.svelte
│       │   │   ├── NumberPad.svelte
│       │   │   ├── GameControls.svelte
│       │   │   └── VictoryModal.svelte
│       │   └── stores/
│       │       └── gameStore.js   # Sudoku state (timer, board, history, pencil notes)
│       └── routes/
│           ├── +layout.svelte     # Global styles, fonts, layout
│           ├── +page.svelte       # Landing page (Hero, Cards, Leaderboard, Rules, etc.)
│           └── play/[difficulty]/
│               └── +page.svelte   # Modern minimalist Sudoku game page
│
├── assets/                        # Existing images preserved and repurposed
└── README.md                      # Setup and running instructions
```

---

## Proposed Changes

### 1. Refactored DRY Backend Microservice (`backend/`)
Refactor the repetitive logic from `easy.js`, `mediocre.js`, and `genius.js` into a clean, unified `sudokuEngine.js`:
- Backtracking generator & solver.
- Unique solution verifier (`hasUniqueSolution`).
- Dynamic difficulty clue counts: `easy: 40`, `mediocre/medium: 32`, `genius/hard: 26`.
- Board completeness & validity checker.
- Microservice exposes REST endpoints:
  - `GET /api/health`: Health status.
  - `GET /api/puzzle?difficulty=:difficulty`: Generates a verified unique puzzle with puzzle ID and initial clue masks.
  - `POST /api/puzzle/verify`: Validates user-submitted solution.
  - `GET /api/leaderboard?difficulty=:difficulty`: Fetches top ranked players sorted by solve time.
  - `POST /api/leaderboard`: Submits new high score (validates name, time, difficulty).

### 2. Drizzle ORM + Supabase Setup
- Define `leaderboard` schema:
  - `id`: serial/UUID primary key.
  - `name`: varchar (player name, up to 50 chars).
  - `time`: varchar (formatted "MM:SS" or "HH:MM:SS").
  - `time_seconds`: integer (for reliable sorting index).
  - `difficulty`: varchar ('Easy', 'Mediocre', 'Genius').
  - `created_at`: timestamp default now.
- Provide `.env.example` with:
  - `PORT=4000`
  - `DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
  - `SUPABASE_URL=https://[PROJECT-REF].supabase.co`
  - `SUPABASE_ANON_KEY=...`
- Provide local memory/file fallback mechanism so the app continues working flawlessly during development if Supabase credentials haven't been pasted yet.

### 3. SvelteKit Modern Frontend (`frontend/`)
- Setup SvelteKit project with modern CSS variables, Inter/Outfit typography, glassmorphic dark theme with vibrant neon/emerald accents.
- **Navbar & Footer**: Responsive, brand logo, navigation anchors, github/credits link.
- **Hero & Difficulty Cards**:
  - Retain the existing cards ("Easy.", "Mediocre.", "Genius.") with existing image assets (`images.jpeg`, `download.jpeg`, `consciousness-709143-400x300.jpg`).
  - Add interactive card hover animations, difficulty badges, clue counts, estimated times, and direct "Play Now" action.
- **Real-Time Leaderboard Section**:
  - Located directly under hero/difficulty cards as requested.
  - Difficulty filter pill tabs: "All", "Easy", "Mediocre", "Genius".
  - Top 3 Podium showcase with medals 🥇 🥈 🥉.
  - Formatted table with ranking, player name, completion time, difficulty badge, and timestamp.
  - Real-time auto-refresh capability.
- **Additional Landing Page Sections**:
  - "How to Play & Strategies" (Rules of 3x3 blocks, pencil markings, naked singles).
  - "Key Features" (Cloud Leaderboard, Clean Minimalist UI, Smart Notes & Undo, Anti-cheat server verification).
- **Game Page (`/play/[difficulty]`)**:
  - Clean, distraction-free minimalist board layout.
  - Cell states: prefilled, user-input, selected, same-number highlighted, row-col-block highlighted, conflicting number highlighted.
  - **Notes / Pencil Marks Mode**: Mini 3x3 candidate numbers inside cells.
  - **Undo & Erase**: History stack for instant undo.
  - **Virtual Keypad & Keyboard Support**: Number pad 1-9, backspace, notes toggle, arrow navigation.
  - **Victory Dialog**: Modal triggered on completion with celebratory animation, time summary, player name input field, and one-click submission to Supabase leaderboard.

---

## Verification Plan

### Automated & Integration Tests
1. Verify microservice starts and responds to `/api/health`, `/api/puzzle`, and `/api/leaderboard`.
2. Verify Drizzle ORM schema compatibility with Supabase PostgreSQL connection string.
3. Test puzzle generation for all 3 difficulties (Easy, Mediocre, Genius) ensuring unique solution solvability.
4. Verify SvelteKit builds cleanly (`npm run build` or `npm run check`).

### Manual Verification in Browser
1. Start microservice on port 4000 and SvelteKit dev server on port 5173.
2. Navigate to Landing Page (`http://localhost:5173`):
   - Check Hero, Difficulty Cards, Leaderboard table and filter tabs.
   - Click each Difficulty Card and verify navigation to `/play/easy`, `/play/mediocre`, `/play/genius`.
3. Test Sudoku Game UX:
   - Cell selection, keyboard number entry, pencil note mode, undo, erase.
   - Solve or test victory flow, enter name, verify submission to leaderboard.
   - Verify leaderboard updates and reflects the newly submitted score.
