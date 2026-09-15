<script>
  let {
    onInputNumber = () => {},
    onErase = () => {},
    onUndo = () => {},
    onHint = () => {},
    onToggleNotes = () => {},
    isNotesMode = false,
    canUndo = false,
    digitCounts = {}
  } = $props();

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
</script>

<div class="pad-container">
  <!-- Controls row (Undo, Erase, Notes, Hint) -->
  <div class="tools-row">
    <button
      class="tool-btn {canUndo ? '' : 'disabled'}"
      onclick={onUndo}
      disabled={!canUndo}
      title="Urungkan Langkah (Ctrl+Z)"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M3 7v6h6"></path>
        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
      </svg>
      <span>Undo</span>
    </button>

    <button
      class="tool-btn"
      onclick={onErase}
      title="Hapus Angka / Catatan (Backspace)"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M20 20H7L3 14l9-9 8 8v7z"></path>
        <line x1="18" y1="9" x2="12" y2="15"></line>
      </svg>
      <span>Hapus</span>
    </button>

    <button
      class="tool-btn {isNotesMode ? 'active-note' : ''}"
      onclick={onToggleNotes}
      title="Beralih Mode Catatan Pensil (N)"
    >
      <div class="note-icon-wrapper">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
        <span class="note-status-dot"></span>
      </div>
      <span>Catatan: {isNotesMode ? 'ON' : 'OFF'}</span>
    </button>

    <button
      class="tool-btn"
      onclick={onHint}
      title="Buka Petunjuk Sel Terpilih (H)"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      <span>Hint</span>
    </button>
  </div>

  <!-- Numbers 1-9 Grid -->
  <div class="numbers-grid">
    {#each numbers as num}
      {@const remaining = 9 - (digitCounts[num] || 0)}
      {@const isCompleted = remaining <= 0}

      <button
        class="num-btn glass-card {isCompleted ? 'completed' : ''}"
        onclick={() => onInputNumber(num)}
        aria-label={`Masukkan angka ${num}`}
      >
        <span class="num-digit">{num}</span>
        <span class="num-remaining">{isCompleted ? '✓' : remaining}</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .pad-container {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
  }

  .tools-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.6rem;
  }

  .tool-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    padding: 0.75rem 0.5rem;
    background: rgba(30, 41, 59, 0.7);
    border: 1px solid var(--border-glass);
    border-radius: 0.85rem;
    color: var(--text-secondary);
    font-size: 0.78rem;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .tool-btn:hover:not(.disabled) {
    background: rgba(51, 65, 85, 0.9);
    color: #f8fafc;
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  .tool-btn.disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .tool-btn.active-note {
    background: rgba(99, 102, 241, 0.25);
    border-color: #6366f1;
    color: #a5b4fc;
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.35);
  }

  .note-icon-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .note-status-dot {
    position: absolute;
    top: -2px;
    right: -4px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: transparent;
  }

  .active-note .note-status-dot {
    background-color: #38bdf8;
    box-shadow: 0 0 6px #38bdf8;
  }

  .numbers-grid {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap: 0.45rem;
  }

  .num-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 0.2rem;
    border-radius: 0.75rem;
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid var(--border-glass);
    transition: all 0.18s ease;
    cursor: pointer;
  }

  .num-btn:hover:not(.completed) {
    background: rgba(99, 102, 241, 0.35);
    border-color: #6366f1;
    transform: translateY(-3px);
  }

  .num-digit {
    font-family: var(--font-heading);
    font-size: 1.4rem;
    font-weight: 800;
    color: #f8fafc;
    line-height: 1;
  }

  .num-remaining {
    font-size: 0.65rem;
    font-weight: 600;
    color: var(--text-muted);
    margin-top: 0.2rem;
  }

  .num-btn.completed {
    opacity: 0.25;
    pointer-events: none;
  }

  @media (max-width: 480px) {
    .num-digit {
      font-size: 1.2rem;
    }
    .num-btn {
      padding: 0.6rem 0.1rem;
    }
  }
</style>
