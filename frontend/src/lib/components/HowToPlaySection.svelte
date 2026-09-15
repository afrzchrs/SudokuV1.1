<section id="how-to-play" class="how-section">
  <div class="container">
    <div class="section-header">
      <div class="badge-rules">
        <span>Aturan &amp; Strategi</span>
      </div>
      <h2 class="section-title">Cara Bermain Sudoku</h2>
      <p class="section-subtitle">
        Teka-teki logika angka 9x9 tanpa memerlukan perhitungan matematika. Cukup eliminasi dan deduksi.
      </p>
    </div>

    <div class="rules-grid">
      <div class="rule-card glass-card">
        <div class="rule-number">01</div>
        <h3>Aturan Baris</h3>
        <p>Setiap baris horizontal yang terdiri dari 9 sel harus memuat angka 1 sampai 9 tepat satu kali tanpa ada angka kembar.</p>
      </div>

      <div class="rule-card glass-card">
        <div class="rule-number">02</div>
        <h3>Aturan Kolom</h3>
        <p>Setiap kolom vertikal yang terdiri dari 9 sel harus memuat angka 1 sampai 9 secara lengkap tanpa duplikasi.</p>
      </div>

      <div class="rule-card glass-card">
        <div class="rule-number">03</div>
        <h3>Aturan Blok 3×3</h3>
        <p>Setiap kotak tebal 3×3 (berisi 9 sel) juga wajib memuat angka 1 sampai 9 tanpa boleh ada angka berulang.</p>
      </div>
    </div>

    <!-- Tips Banner -->
    <div class="tips-card glass-card">
      <div class="tips-icon">💡</div>
      <div class="tips-content">
        <h4>Tips Pro untuk Kecepatan Tinggi (Speedrun)</h4>
        <p>
          Gunakan fitur <strong>Mode Catatan (Notes)</strong> untuk mencatat kandidat kemungkinan angka di sel yang ragu.
          Fokuslah terlebih dahulu pada baris atau blok yang sudah memiliki banyak angka terisi (7 atau 8 angka) untuk menemukan angka tersisa secara instan!
        </p>
      </div>
    </div>
  </div>
</section>

<style>
  .how-section {
    padding: 3rem 0 6rem;
  }

  .section-header {
    text-align: center;
    margin-bottom: 3.5rem;
  }

  .badge-rules {
    display: inline-block;
    padding: 0.35rem 0.9rem;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: 9999px;
    font-size: 0.8rem;
    font-weight: 700;
    color: #34d399;
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

  .rules-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.75rem;
    margin-bottom: 2.5rem;
  }

  .rule-card {
    padding: 2rem 1.75rem;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .rule-number {
    font-family: var(--font-heading);
    font-size: 2.5rem;
    font-weight: 800;
    color: rgba(99, 102, 241, 0.25);
    margin-bottom: 0.5rem;
  }

  .rule-card h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #f8fafc;
    margin-bottom: 0.75rem;
  }

  .rule-card p {
    color: var(--text-secondary);
    font-size: 0.92rem;
    line-height: 1.6;
  }

  .tips-card {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.75rem 2rem;
    border-color: rgba(245, 158, 11, 0.3);
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(30, 41, 59, 0.6) 100%);
  }

  .tips-icon {
    font-size: 2.5rem;
    flex-shrink: 0;
  }

  .tips-content h4 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #fbbf24;
    margin-bottom: 0.4rem;
  }

  .tips-content p {
    color: var(--text-secondary);
    font-size: 0.92rem;
    line-height: 1.6;
  }

  .tips-content strong {
    color: #f8fafc;
  }

  @media (max-width: 960px) {
    .rules-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
