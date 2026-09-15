<script>
  import { submitScore } from '$lib/api.js';

  let { 
    isOpen = false, 
    solveTime = '00:00:00', 
    difficulty = 'Easy',
    onPlayAgain = () => {}
  } = $props();

  let playerName = $state('');
  let isSubmitting = $state(false);
  let isSubmitted = $state(false);
  let errorMessage = $state('');

  async function handleSubmit(e) {
    e?.preventDefault();
    if (!playerName.trim()) {
      errorMessage = 'Nama tidak boleh kosong!';
      return;
    }
    errorMessage = '';
    isSubmitting = true;

    try {
      await submitScore({
        name: playerName.trim(),
        time: solveTime,
        difficulty
      });
      isSubmitted = true;
    } catch (err) {
      console.error('Submit error:', err);
      errorMessage = err.message || 'Gagal mengirim skor. Coba lagi.';
    } finally {
      isSubmitting = false;
    }
  }
</script>

{#if isOpen}
  <div class="modal-backdrop">
    <div class="modal-card glass-card animate-fade-in">
      <div class="confetti-icon">🎉</div>

      <h2 class="modal-title">Selamat! Sudoku Selesai!</h2>
      <p class="modal-desc">
        Anda berhasil menyelesaikan puzzle tingkat <strong class="diff-highlight">{difficulty}</strong> dengan sempurna.
      </p>

      <div class="time-showcase">
        <span class="time-label">Waktu Penyelesaian:</span>
        <span class="time-value font-mono">{solveTime}</span>
      </div>

      {#if !isSubmitted}
        <form class="submit-form" onsubmit={handleSubmit}>
          <label for="player-name-input" class="input-label">
            Masukkan Nama Anda untuk Leaderboard:
          </label>
          <div class="input-group">
            <input
              id="player-name-input"
              type="text"
              bind:value={playerName}
              placeholder="Contoh: Riza"
              maxlength="40"
              class="name-input"
              required
              disabled={isSubmitting}
            />
          </div>

          {#if errorMessage}
            <div class="error-text">{errorMessage}</div>
          {/if}

          <button type="submit" class="btn-primary submit-btn" disabled={isSubmitting}>
            {#if isSubmitting}
              <span class="btn-spinner"></span>
              Menyimpan ke DB...
            {:else}
              <span>Catat ke Leaderboard Real-Time</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            {/if}
          </button>
        </form>
      {:else}
        <div class="success-box">
          <div class="success-check">✓</div>
          <h4>Skor Berhasil Disimpan!</h4>
          <p>Nama <strong>{playerName}</strong> telah dicatat di database leaderboard.</p>
          
          <div class="post-actions">
            <a href="/#leaderboard" class="btn-primary">
              Lihat Leaderboard Global
            </a>
            <button class="btn-secondary" onclick={onPlayAgain}>
              Mainkan Puzzle Baru
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(9, 13, 22, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1.5rem;
  }

  .modal-card {
    width: 100%;
    max-width: 480px;
    padding: 2.5rem 2rem;
    text-align: center;
    border-color: rgba(99, 102, 241, 0.35);
    box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8);
    position: relative;
  }

  .confetti-icon {
    font-size: 3.5rem;
    margin-bottom: 0.5rem;
    animation: bounce 1s infinite alternate;
  }

  @keyframes bounce {
    from { transform: translateY(0); }
    to { transform: translateY(-8px); }
  }

  .modal-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #f8fafc;
    margin-bottom: 0.5rem;
  }

  .modal-desc {
    color: var(--text-secondary);
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }

  .diff-highlight {
    color: var(--accent-cyan);
  }

  .time-showcase {
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid var(--border-glass);
    border-radius: 1rem;
    padding: 1.25rem;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
  }

  .time-label {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
  }

  .time-value {
    font-size: 2.25rem;
    font-weight: 800;
    color: #fbbf24;
    text-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
  }

  .submit-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    text-align: left;
  }

  .input-label {
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .name-input {
    width: 100%;
    padding: 0.85rem 1.15rem;
    background: rgba(15, 23, 42, 0.9);
    border: 1px solid var(--border-glass);
    border-radius: 0.75rem;
    color: #f8fafc;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;
  }

  .name-input:focus {
    border-color: var(--accent-indigo);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }

  .submit-btn {
    width: 100%;
    padding: 0.9rem;
    font-size: 1rem;
    font-weight: 700;
    margin-top: 0.5rem;
  }

  .error-text {
    color: #f43f5e;
    font-size: 0.85rem;
  }

  .success-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 0;
  }

  .success-check {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
    border: 2px solid #10b981;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 800;
  }

  .success-box h4 {
    font-size: 1.3rem;
    color: #f8fafc;
  }

  .success-box p {
    color: var(--text-secondary);
    font-size: 0.95rem;
  }

  .post-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
    margin-top: 1.5rem;
  }

  .btn-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
