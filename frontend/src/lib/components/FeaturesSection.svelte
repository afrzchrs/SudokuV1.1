<section id="features" class="features-section">
  <div class="container">
    <div class="section-header">
      <div class="badge-feature">
        <span>Arsitektur &amp; Pengalaman</span>
      </div>
      <h2 class="section-title">Mengapa Bermain di Sudoku Rush?</h2>
      <p class="section-subtitle">
        Dirancang dari awal untuk kecepatan, kenyamanan visual, dan tantangan logika tanpa gangguan iklan ataupun login rumit.
      </p>
    </div>

    <div class="features-grid">
      <div class="feature-card glass-card">
        <div class="icon-box cyan">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        </div>
        <h3>Microservice Architecture</h3>
        <p>
          Komputasi puzzle berat, verifikasi unik, dan algoritma backtracking diproses oleh microservice JavaScript independen agar frontend selalu ringan dan mulus.
        </p>
      </div>

      <div class="feature-card glass-card">
        <div class="icon-box indigo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
          </svg>
        </div>
        <h3>Supabase + Drizzle ORM</h3>
        <p>
          Data leaderboard tersimpan aman dan terindeks di Supabase PostgreSQL menggunakan Drizzle ORM dengan performa query milidetik dan sinkronisasi real-time.
        </p>
      </div>

      <div class="feature-card glass-card">
        <div class="icon-box emerald">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
        </div>
        <h3>Mode Catatan &amp; Pintasan Cerdas</h3>
        <p>
          Dilengkapi mode pensil (pencil notes 1-9) mini dalam sel, undo tak terbatas, penghapus, dan keyboard navigation lengkap untuk pengalaman bermain yang nyaman.
        </p>
      </div>

      <div class="feature-card glass-card">
        <div class="icon-box amber">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <h3>Tanpa Registrasi / Login</h3>
        <p>
          Langsung klik dan mainkan teka-teki favorit Anda. Cukup masukkan nama panggilan saat berhasil menyelesaikan game untuk memvalidasi rekor Anda di leaderboard.
        </p>
      </div>
    </div>
  </div>
</section>

<style>
  .features-section {
    padding: 3rem 0 6rem;
  }

  .section-header {
    text-align: center;
    margin-bottom: 3.5rem;
  }

  .badge-feature {
    display: inline-block;
    padding: 0.35rem 0.9rem;
    background: rgba(99, 102, 241, 0.12);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 9999px;
    font-size: 0.8rem;
    font-weight: 700;
    color: #a5b4fc;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .section-title {
    font-size: 2.25rem;
    font-weight: 800;
    margin-bottom: 0.75rem;
  }

  .section-subtitle {
    font-size: 1rem;
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.75rem;
  }

  .feature-card {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: transform 0.25s ease, border-color 0.25s ease;
  }

  .feature-card:hover {
    transform: translateY(-4px);
    border-color: rgba(99, 102, 241, 0.35);
  }

  .icon-box {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
  }

  .icon-box.cyan {
    background: rgba(6, 182, 212, 0.15);
    color: #38bdf8;
    border: 1px solid rgba(6, 182, 212, 0.3);
  }

  .icon-box.indigo {
    background: rgba(99, 102, 241, 0.15);
    color: #818cf8;
    border: 1px solid rgba(99, 102, 241, 0.3);
  }

  .icon-box.emerald {
    background: rgba(16, 185, 129, 0.15);
    color: #34d399;
    border: 1px solid rgba(16, 185, 129, 0.3);
  }

  .icon-box.amber {
    background: rgba(245, 158, 11, 0.15);
    color: #fbbf24;
    border: 1px solid rgba(245, 158, 11, 0.3);
  }

  .feature-card h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #f8fafc;
  }

  .feature-card p {
    color: var(--text-secondary);
    font-size: 0.92rem;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    .features-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
