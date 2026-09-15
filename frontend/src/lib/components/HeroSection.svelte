<script>
</script>

<section class="hero-section">
  <div class="container hero-content">
    <div class="hero-badge animate-fade-in">
      <span class="pulse-dot"></span>
      <span>Speedrun Sudoku &amp; Real-time Leaderboard</span>
    </div>

    <h1 class="hero-title animate-fade-in">
      Selesaikan Sudoku Lebih Cepat, <br />
      <span class="gradient-text">Raih Puncak Leaderboard</span>
    </h1>

    <p class="hero-subtitle animate-fade-in">
      Uji kecepatan analisa dan logika Anda. Ditenagai microservice backend berkinerja tinggi,
      pilih tingkat kesulitan, pecahkan puzzle tanpa distraksi, dan catat rekor nama Anda secara real-time.
    </p>

    <div class="hero-actions animate-fade-in">
      <a href="#difficulties" class="btn-primary btn-lg">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
        Pilih Kesulitan
      </a>
      <a href="#leaderboard" class="btn-secondary btn-lg">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
          <path d="M4 22h16"></path>
          <path d="M10 14.66V17c0 .55-.45 1-1 1H7v2h10v-2h-2c-.55 0-1-.45-1-1v-2.34c3.41-.7 6-3.7 6-7.32V4H4v3.34c0 3.62 2.59 6.62 6 7.32z"></path>
        </svg>
        Lihat Leaderboard
      </a>
    </div>

    <!-- Quick Stats Bar -->
    <div class="stats-bar glass-card">
      <div class="stat-item">
        <span class="stat-num">3</span>
        <span class="stat-label">Tingkat Kesulitan</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-num">Realtime</span>
        <span class="stat-label">Supabase Sync</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-num">0%</span>
        <span class="stat-label">Tanpa Perlu Login</span>
      </div>
    </div>
  </div>
</section>

<style>
  .hero-section {
    padding: 4.5rem 0 3.5rem;
    text-align: center;
    position: relative;
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 860px;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 1rem;
    background: rgba(99, 102, 241, 0.12);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 9999px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #a5b4fc;
    margin-bottom: 1.75rem;
  }

  .pulse-dot {
    width: 8px;
    height: 8px;
    background-color: #38bdf8;
    border-radius: 50%;
    box-shadow: 0 0 10px #38bdf8;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.85); }
  }

  .hero-title {
    font-size: 3.25rem;
    font-weight: 800;
    line-height: 1.15;
    margin-bottom: 1.25rem;
  }

  .hero-subtitle {
    font-size: 1.15rem;
    color: var(--text-secondary);
    line-height: 1.6;
    max-width: 680px;
    margin-bottom: 2.25rem;
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
    margin-bottom: 3.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .btn-lg {
    padding: 0.85rem 1.8rem;
    font-size: 1.02rem;
  }

  .stats-bar {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    max-width: 640px;
    padding: 1.25rem 2rem;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
  }

  .stat-num {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    font-weight: 800;
    color: #f8fafc;
  }

  .stat-label {
    font-size: 0.8rem;
    color: var(--text-muted);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .stat-divider {
    width: 1px;
    height: 32px;
    background: var(--border-glass);
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.25rem;
    }
    .hero-subtitle {
      font-size: 1rem;
    }
    .stats-bar {
      flex-direction: column;
      gap: 1rem;
    }
    .stat-divider {
      display: none;
    }
  }
</style>
