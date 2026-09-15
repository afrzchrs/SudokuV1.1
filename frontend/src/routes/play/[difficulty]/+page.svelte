<script>
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import SudokuBoard from '$lib/components/SudokuBoard.svelte';
  import NumberPad from '$lib/components/NumberPad.svelte';
  import VictoryModal from '$lib/components/VictoryModal.svelte';
  import { fetchPuzzle, verifyPuzzle } from '$lib/api.js';
  import { generatePuzzle, isCompleteAndValid, formatTime } from '$lib/sudokuEngine.js';

  // Get difficulty from URL param
  const paramDiff = page.params.difficulty || 'easy';
  const difficultyName = paramDiff.charAt(0).toUpperCase() + paramDiff.slice(1).toLowerCase();

  // State
  let isLoading = $state(true);
  let grid = $state(Array.from({ length: 9 }, () => Array(9).fill(0)));
  let prefilled = $state(Array.from({ length: 9 }, () => Array(9).fill(false)));
  let solution = $state(Array.from({ length: 9 }, () => Array(9).fill(0)));
  let notes = $state({}); // key: `${r}-${c}`, value: number[]
  let history = $state([]); // array of snapshots
  let selectedCell = $state({ r: 0, c: 0 });
  let isNotesMode = $state(false);

  // Timer
  let seconds = $state(0);
  let timerId = null;
  let isPaused = $state(false);

  // Victory
  let isVictoryModalOpen = $state(false);
  let finalTimeStr = $state('00:00:00');

  // Count instances of each digit on board
  let digitCounts = $derived.by(() => {
    const counts = {};
    for (let n = 1; n <= 9; n++) counts[n] = 0;
    if (grid) {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          const val = grid[r][c];
          if (val >= 1 && val <= 9) {
            counts[val] = (counts[val] || 0) + 1;
          }
        }
      }
    }
    return counts;
  });

  function startTimer() {
    if (timerId) clearInterval(timerId);
    seconds = 0;
    isPaused = false;
    timerId = setInterval(() => {
      if (!isPaused) {
        seconds++;
      }
    }, 1000);
  }

  function togglePause() {
    isPaused = !isPaused;
  }

  async function initGame() {
    isLoading = true;
    try {
      // 1. Try microservice backend first
      let puzzleData = await fetchPuzzle(paramDiff);
      
      // 2. Fallback to client engine if backend unreachable
      if (!puzzleData || !puzzleData.puzzle) {
        console.log('Using client fallback generator for difficulty:', paramDiff);
        puzzleData = generatePuzzle(paramDiff);
      }

      // Initialize board
      const rawPuzzle = puzzleData.puzzle;
      const rawSolution = puzzleData.solution;

      grid = rawPuzzle.map(row => [...row]);
      prefilled = rawPuzzle.map(row => row.map(val => val !== 0));
      solution = rawSolution ? rawSolution.map(row => [...row]) : [];
      notes = {};
      history = [];

      // Find first empty cell to select
      let foundEmpty = false;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (!prefilled[r][c]) {
            selectedCell = { r, c };
            foundEmpty = true;
            break;
          }
        }
        if (foundEmpty) break;
      }

      startTimer();
    } catch (err) {
      console.error('Failed to init game:', err);
    } finally {
      isLoading = false;
    }
  }

  function saveSnapshot() {
    history = [
      ...history.slice(-30), // keep max 30 snapshots
      {
        grid: grid.map(r => [...r]),
        notes: JSON.parse(JSON.stringify(notes))
      }
    ];
  }

  function handleSelectCell(r, c) {
    selectedCell = { r, c };
  }

  function handleInputNumber(num) {
    if (!selectedCell || isPaused) return;
    const { r, c } = selectedCell;
    if (prefilled[r][c]) return; // cannot overwrite clues

    saveSnapshot();

    if (isNotesMode) {
      // Toggle note
      const cellKey = `${r}-${c}`;
      const currentNotes = notes[cellKey] ? [...notes[cellKey]] : [];
      const noteIndex = currentNotes.indexOf(num);
      if (noteIndex >= 0) {
        currentNotes.splice(noteIndex, 1);
      } else {
        currentNotes.push(num);
        currentNotes.sort((a, b) => a - b);
      }
      notes = { ...notes, [cellKey]: currentNotes };
    } else {
      // Normal digit fill
      const newGrid = grid.map(row => [...row]);
      newGrid[r][c] = num;
      grid = newGrid;

      // Clear notes on this cell
      const newNotes = { ...notes };
      delete newNotes[`${r}-${c}`];
      notes = newNotes;

      // Check if board is full and triggers victory
      checkBoardCompletion();
    }
  }

  function handleErase() {
    if (!selectedCell || isPaused) return;
    const { r, c } = selectedCell;
    if (prefilled[r][c]) return;

    saveSnapshot();

    // Clear digit
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = 0;
    grid = newGrid;

    // Clear notes
    const newNotes = { ...notes };
    delete newNotes[`${r}-${c}`];
    notes = newNotes;
  }

  function handleUndo() {
    if (history.length === 0 || isPaused) return;
    const lastState = history[history.length - 1];
    history = history.slice(0, -1);
    grid = lastState.grid.map(r => [...r]);
    notes = JSON.parse(JSON.stringify(lastState.notes));
  }

  function handleHint() {
    if (!selectedCell || isPaused || !solution || solution.length !== 9) return;
    const { r, c } = selectedCell;
    if (prefilled[r][c]) return;

    const correctVal = solution[r][c];
    if (correctVal) {
      saveSnapshot();
      const newGrid = grid.map(row => [...row]);
      newGrid[r][c] = correctVal;
      grid = newGrid;

      const newNotes = { ...notes };
      delete newNotes[`${r}-${c}`];
      notes = newNotes;

      checkBoardCompletion();
    }
  }

  function toggleNotesMode() {
    isNotesMode = !isNotesMode;
  }

  async function checkBoardCompletion() {
    // Check if any cell is still 0
    const hasZeros = grid.flat().some(v => v === 0);
    if (hasZeros) return;

    // Check complete & valid
    const valid = isCompleteAndValid(grid);
    if (valid) {
      clearInterval(timerId);
      finalTimeStr = formatTime(seconds);
      isVictoryModalOpen = true;
    }
  }

  // Explicit check button
  async function handleManualCheck() {
    const hasZeros = grid.flat().some(v => v === 0);
    if (hasZeros) {
      alert('Masih ada kotak yang kosong! Lengkapi semua kotak untuk menyelesaikan teka-teki.');
      return;
    }

    // Try backend verification first
    const verifyResult = await verifyPuzzle(grid);
    if (verifyResult.valid || isCompleteAndValid(grid)) {
      clearInterval(timerId);
      finalTimeStr = formatTime(seconds);
      isVictoryModalOpen = true;
    } else {
      alert('Ada angka yang salah atau bentrok dengan baris/kolom/blok. Periksa kembali!');
    }
  }

  // Keyboard navigation
  function handleKeydown(e) {
    if (isVictoryModalOpen) return;

    // Number keys 1-9
    if (e.key >= '1' && e.key <= '9') {
      e.preventDefault();
      handleInputNumber(parseInt(e.key));
      return;
    }

    // Erase keys
    if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
      e.preventDefault();
      handleErase();
      return;
    }

    // Toggle Notes Mode: 'n' or 'N'
    if (e.key.toLowerCase() === 'n') {
      e.preventDefault();
      toggleNotesMode();
      return;
    }

    // Undo: Ctrl+Z or 'z'
    if (e.key.toLowerCase() === 'z' || (e.ctrlKey && e.key.toLowerCase() === 'z')) {
      e.preventDefault();
      handleUndo();
      return;
    }

    // Hint: 'h' or 'H'
    if (e.key.toLowerCase() === 'h') {
      e.preventDefault();
      handleHint();
      return;
    }

    // Arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      if (!selectedCell) return;
      let { r, c } = selectedCell;
      if (e.key === 'ArrowUp') r = (r + 8) % 9;
      if (e.key === 'ArrowDown') r = (r + 1) % 9;
      if (e.key === 'ArrowLeft') c = (c + 8) % 9;
      if (e.key === 'ArrowRight') c = (c + 1) % 9;
      selectedCell = { r, c };
    }
  }

  onMount(() => {
    initGame();
    window.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    if (timerId) clearInterval(timerId);
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeydown);
    }
  });

  function getBadgeClass(diff) {
    const d = (diff || '').toLowerCase();
    if (d === 'easy') return 'badge-easy';
    if (d === 'mediocre' || d === 'medium') return 'badge-mediocre';
    return 'badge-genius';
  }
</script>

<svelte:head>
  <title>Sudoku Rush - Playing {difficultyName}</title>
</svelte:head>

<div class="game-page-container">
  <!-- Top Bar -->
  <div class="game-top-bar glass-card">
    <div class="top-left">
      <a href="/" class="back-link" title="Kembali ke Beranda">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7"></path>
        </svg>
        <span class="desktop-only">Beranda</span>
      </a>
      <span class="badge {getBadgeClass(paramDiff)}">{difficultyName}</span>
    </div>

    <!-- Timer with Pause -->
    <div class="timer-box font-mono">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <span class="timer-display">{formatTime(seconds)}</span>
      <button class="pause-btn" onclick={togglePause} title={isPaused ? "Lanjutkan" : "Jeda"}>
        {#if isPaused}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        {:else}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"/>
            <rect x="14" y="4" width="4" height="16"/>
          </svg>
        {/if}
      </button>
    </div>

    <div class="top-right">
      <button class="btn-primary finish-btn" onclick={handleManualCheck}>
        <span>Selesai</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </button>

      <button class="icon-action-btn" onclick={initGame} title="Puzzle Baru">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
        </svg>
      </button>
    </div>
  </div>

  {#if isLoading}
    <div class="game-loading glass-card">
      <div class="spinner"></div>
      <h3>Menyiapkan Puzzle Unik...</h3>
      <p>Microservice sedang memvalidasi struktur sel dan solusi.</p>
    </div>
  {:else}
    <div class="game-workspace">
      {#if isPaused}
        <div class="paused-overlay glass-card">
          <h2>Game Dijeda</h2>
          <p>Waktu dihentikan sementara. Tekan tombol lanjutkan saat siap.</p>
          <button class="btn-primary" onclick={togglePause}>
            Lanjutkan Permainan
          </button>
        </div>
      {:else}
        <!-- Sudoku Board -->
        <SudokuBoard
          {grid}
          {prefilled}
          {notes}
          {selectedCell}
          onSelectCell={handleSelectCell}
        />

        <!-- Keypad and Action Bar -->
        <NumberPad
          onInputNumber={handleInputNumber}
          onErase={handleErase}
          onUndo={handleUndo}
          onHint={handleHint}
          onToggleNotes={toggleNotesMode}
          {isNotesMode}
          canUndo={history.length > 0}
          {digitCounts}
        />
      {/if}
    </div>
  {/if}

  <!-- Victory Dialog -->
  <VictoryModal
    isOpen={isVictoryModalOpen}
    solveTime={finalTimeStr}
    difficulty={difficultyName}
    onPlayAgain={() => {
      isVictoryModalOpen = false;
      initGame();
    }}
  />
</div>

<style>
  .game-page-container {
    width: 100%;
    max-width: 720px;
    margin: 0 auto;
    padding: 1.5rem 1rem 3rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .game-top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.85rem 1.25rem;
    border-radius: 1rem;
    gap: 0.5rem;
  }

  .top-left {
    display: flex;
    align-items: center;
    gap: 0.85rem;
  }

  .back-link {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--text-secondary);
    font-weight: 600;
    font-size: 0.9rem;
    transition: color 0.2s ease;
  }

  .back-link:hover {
    color: #f8fafc;
  }

  .timer-box {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid var(--border-glass);
    padding: 0.45rem 1rem;
    border-radius: 9999px;
    color: #38bdf8;
    font-weight: 700;
    font-size: 1.15rem;
  }

  .pause-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    transition: color 0.2s;
  }

  .pause-btn:hover {
    color: #f8fafc;
  }

  .top-right {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .finish-btn {
    padding: 0.5rem 1.15rem;
    font-size: 0.88rem;
    border-radius: 0.65rem;
  }

  .icon-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 0.65rem;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid var(--border-glass);
    color: var(--text-secondary);
    transition: all 0.2s ease;
  }

  .icon-action-btn:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
  }

  .game-workspace {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.75rem;
    width: 100%;
  }

  .game-loading, .paused-overlay {
    padding: 5rem 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid rgba(99, 102, 241, 0.2);
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 600px) {
    .desktop-only {
      display: none;
    }
    .timer-display {
      font-size: 1rem;
    }
  }
</style>
