/**
 * Client-Side Sudoku Engine
 * Matches the backend microservice engine for instant resilience and fallback.
 */

export function shuffle(arr) {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function isValid(grid, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num || grid[i][col] === num) return false;
  }
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++) {
    for (let c = bc; c < bc + 3; c++) {
      if (grid[r][c] === num) return false;
    }
  }
  return true;
}

export function hasUniqueSolution(puzzle) {
  let count = 0;
  function backtrack(grid) {
    if (count > 1) return;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) {
          for (let n = 1; n <= 9; n++) {
            if (isValid(grid, r, c, n)) {
              grid[r][c] = n;
              backtrack(grid);
              grid[r][c] = 0;
            }
          }
          return;
        }
      }
    }
    count++;
  }
  const clone = puzzle.map(row => [...row]);
  backtrack(clone);
  return count === 1;
}

export function generateFullGrid() {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  function fillCell(idx) {
    if (idx === 81) return true;
    const r = Math.floor(idx / 9), c = idx % 9;
    if (grid[r][c] !== 0) return fillCell(idx + 1);

    const shuffledNums = shuffle(nums);
    for (const n of shuffledNums) {
      if (isValid(grid, r, c, n)) {
        grid[r][c] = n;
        if (fillCell(idx + 1)) return true;
        grid[r][c] = 0;
      }
    }
    return false;
  }

  fillCell(0);
  return grid;
}

export const DIFFICULTY_CONFIG = {
  easy: { name: 'Easy', clueCount: 40, label: 'Easy.' },
  mediocre: { name: 'Mediocre', clueCount: 32, label: 'Mediocre.' },
  medium: { name: 'Mediocre', clueCount: 32, label: 'Mediocre.' },
  genius: { name: 'Genius', clueCount: 26, label: 'Genius.' },
  hard: { name: 'Genius', clueCount: 26, label: 'Genius.' }
};

export function generatePuzzle(level = 'easy') {
  const normalizedLevel = String(level).toLowerCase();
  const config = DIFFICULTY_CONFIG[normalizedLevel] || DIFFICULTY_CONFIG.easy;
  const targetClues = config.clueCount;

  const fullGrid = generateFullGrid();
  const puzzle = fullGrid.map(r => [...r]);
  const positions = shuffle([...Array(81).keys()]);

  for (const pos of positions) {
    const r = Math.floor(pos / 9);
    const c = pos % 9;
    const temp = puzzle[r][c];
    puzzle[r][c] = 0;

    if (!hasUniqueSolution(puzzle)) {
      puzzle[r][c] = temp;
    }

    const currentClueCount = puzzle.flat().filter(v => v !== 0).length;
    if (currentClueCount <= targetClues) break;
  }

  return {
    difficulty: config.name,
    puzzle,
    solution: fullGrid,
    clueCount: puzzle.flat().filter(v => v !== 0).length
  };
}

export function isCompleteAndValid(grid) {
  const uniqueNine = arr => {
    if (!arr || arr.length !== 9) return false;
    const set = new Set(arr);
    return set.size === 9 && [...set].every(n => Number.isInteger(n) && n >= 1 && n <= 9);
  };

  // 1) Rows
  for (let r = 0; r < 9; r++) {
    if (!uniqueNine(grid[r])) return false;
  }

  // 2) Columns
  for (let c = 0; c < 9; c++) {
    const col = grid.map(row => row[c]);
    if (!uniqueNine(col)) return false;
  }

  // 3) 3x3 Blocks
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const block = [];
      for (let r = br * 3; r < br * 3 + 3; r++) {
        for (let c = bc * 3; c < bc * 3 + 3; c++) {
          block.push(grid[r][c]);
        }
      }
      if (!uniqueNine(block)) return false;
    }
  }

  return true;
}

export function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  const pad = n => String(n).padStart(2, '0');
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}
