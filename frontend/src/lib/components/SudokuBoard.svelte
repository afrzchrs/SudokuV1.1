<script>
  let {
    grid = [],
    prefilled = [],
    notes = {},
    selectedCell = null,
    onSelectCell = () => {}
  } = $props();

  // Find duplicate conflicts in real-time
  let conflicts = $derived.by(() => {
    const errorSet = new Set();
    if (!grid || grid.length !== 9) return errorSet;

    // Check rows
    for (let r = 0; r < 9; r++) {
      const seen = new Map();
      for (let c = 0; c < 9; c++) {
        const val = grid[r][c];
        if (val !== 0) {
          if (seen.has(val)) {
            errorSet.add(`${r}-${c}`);
            errorSet.add(`${r}-${seen.get(val)}`);
          } else {
            seen.set(val, c);
          }
        }
      }
    }

    // Check cols
    for (let c = 0; c < 9; c++) {
      const seen = new Map();
      for (let r = 0; r < 9; r++) {
        const val = grid[r][c];
        if (val !== 0) {
          if (seen.has(val)) {
            errorSet.add(`${r}-${c}`);
            errorSet.add(`${seen.get(val)}-${c}`);
          } else {
            seen.set(val, r);
          }
        }
      }
    }

    // Check 3x3 blocks
    for (let br = 0; br < 3; br++) {
      for (let bc = 0; bc < 3; bc++) {
        const seen = new Map();
        for (let r = br * 3; r < br * 3 + 3; r++) {
          for (let c = bc * 3; c < bc * 3 + 3; c++) {
            const val = grid[r][c];
            if (val !== 0) {
              if (seen.has(val)) {
                errorSet.add(`${r}-${c}`);
                const [sr, sc] = seen.get(val);
                errorSet.add(`${sr}-${sc}`);
              } else {
                seen.set(val, [r, c]);
              }
            }
          }
        }
      }
    }

    return errorSet;
  });

  function getSelectedVal() {
    if (!selectedCell || !grid || !grid[selectedCell.r]) return 0;
    return grid[selectedCell.r][selectedCell.c] || 0;
  }
</script>

<div class="sudoku-board-container">
  <div class="board-grid">
    {#each Array(9) as _, r}
      {#each Array(9) as _, c}
        {@const val = grid[r] ? grid[r][c] : 0}
        {@const isPrefilled = prefilled[r] && prefilled[r][c]}
        {@const isSelected = selectedCell && selectedCell.r === r && selectedCell.c === c}
        {@const selectedVal = getSelectedVal()}
        {@const isSameVal = selectedVal !== 0 && val === selectedVal}
        {@const isInPeer = selectedCell && (
          selectedCell.r === r || 
          selectedCell.c === c || 
          (Math.floor(selectedCell.r / 3) === Math.floor(r / 3) && Math.floor(selectedCell.c / 3) === Math.floor(c / 3))
        )}
        {@const isError = conflicts.has(`${r}-${c}`)}
        {@const cellNotes = notes[`${r}-${c}`] || []}

        <button
          type="button"
          class="sudoku-cell 
            {isSelected ? 'selected' : ''} 
            {isSameVal && !isSelected ? 'same-val' : ''} 
            {isInPeer && !isSelected && !isSameVal ? 'peer' : ''} 
            {isError ? 'error' : ''} 
            {isPrefilled ? 'prefilled' : 'user-fill'}"
          class:border-right-bold={(c + 1) % 3 === 0 && c !== 8}
          class:border-bottom-bold={(r + 1) % 3 === 0 && r !== 8}
          onclick={() => onSelectCell(r, c)}
          aria-label={`Baris ${r + 1}, Kolom ${c + 1}, Nilai ${val || 'kosong'}`}
        >
          {#if val !== 0}
            <span class="cell-number">{val}</span>
          {:else if cellNotes.length > 0}
            <div class="notes-grid">
              {#each Array(9) as _, i}
                {@const noteNum = i + 1}
                <span class="note-digit">
                  {cellNotes.includes(noteNum) ? noteNum : ''}
                </span>
              {/each}
            </div>
          {/if}
        </button>
      {/each}
    {/each}
  </div>
</div>

<style>
  .sudoku-board-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .board-grid {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(9, 1fr);
    width: min(92vw, 480px);
    height: min(92vw, 480px);
    background: #0f172a;
    border: 3px solid rgba(99, 102, 241, 0.5);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 15px 40px -10px rgba(0, 0, 0, 0.7);
  }

  .sudoku-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.07);
    color: #f8fafc;
    font-size: clamp(1.2rem, 3.8vw, 1.85rem);
    font-family: var(--font-heading);
    font-weight: 700;
    position: relative;
    user-select: none;
    transition: background-color 0.15s ease, transform 0.1s ease;
    padding: 0;
  }

  /* 3x3 block borders */
  .border-right-bold {
    border-right: 3px solid rgba(99, 102, 241, 0.5);
  }

  .border-bottom-bold {
    border-bottom: 3px solid rgba(99, 102, 241, 0.5);
  }

  /* Cell states */
  .sudoku-cell.prefilled {
    color: #e2e8f0;
    font-weight: 800;
  }

  .sudoku-cell.user-fill {
    color: #38bdf8;
    font-weight: 700;
  }

  .sudoku-cell.peer {
    background: rgba(99, 102, 241, 0.14);
  }

  .sudoku-cell.same-val {
    background: rgba(6, 182, 212, 0.28);
    color: #ffffff;
    text-shadow: 0 0 10px rgba(6, 182, 212, 0.8);
  }

  .sudoku-cell.selected {
    background: #4338ca !important;
    color: #ffffff !important;
    box-shadow: inset 0 0 0 2.5px #38bdf8;
    z-index: 2;
  }

  .sudoku-cell.error {
    background: rgba(244, 63, 94, 0.35) !important;
    color: #fca5a5 !important;
  }

  .cell-number {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Notes mode 3x3 mini grid */
  .notes-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    width: 100%;
    height: 100%;
    padding: 2px;
  }

  .note-digit {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: clamp(0.55rem, 1.6vw, 0.72rem);
    font-family: var(--font-body);
    font-weight: 600;
    color: #94a3b8;
  }
</style>
