<script>
  const difficulties = [
    {
      id: 'easy',
      name: 'Easy.',
      tagline: 'Easy.....',
      description: 'Cocok untuk pemanasan otak atau pemula. 40 angka telah terisi untuk membantu Anda memecahkannya.',
      image: '/assets/images.jpeg',
      clues: '40 Petunjuk',
      estTime: '3 - 8 Menit',
      colorBadge: 'badge-easy',
      glowColor: 'rgba(16, 185, 129, 0.25)',
      href: '/play/easy'
    },
    {
      id: 'mediocre',
      name: 'Mediocre.',
      tagline: 'For All people.',
      description: 'Tantangan seimbang untuk penggemar teka-teki kasual. Membutuhkan penalaran dan sedikit eliminasi.',
      image: '/assets/download.jpeg',
      clues: '32 Petunjuk',
      estTime: '10 - 20 Menit',
      colorBadge: 'badge-mediocre',
      glowColor: 'rgba(245, 158, 11, 0.25)',
      href: '/play/mediocre'
    },
    {
      id: 'genius',
      name: 'Genius.',
      tagline: 'Nah.. I quit.',
      description: 'Hanya untuk pemikir sejati. Hanya ada 26 angka terisi, membutuhkan teknik eliminasi tingkat lanjut!',
      image: '/assets/consciousness-709143-400x300.jpg',
      clues: '26 Petunjuk',
      estTime: '25+ Menit',
      colorBadge: 'badge-genius',
      glowColor: 'rgba(244, 63, 94, 0.25)',
      href: '/play/genius'
    }
  ];
</script>

<section id="difficulties" class="difficulty-section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Pilih Tingkat Kesulitan</h2>
      <p class="section-subtitle">
        Tentukan tantangan Anda. Setiap level di-generate secara matematis untuk menjamin keunikan solusi.
      </p>
    </div>

    <div class="cards-grid">
      {#each difficulties as diff}
        <div class="diff-card glass-card" style="--card-glow: {diff.glowColor}">
          <div class="card-img-wrapper">
            <img src={diff.image} alt={diff.name} class="card-img" />
            <div class="card-badge-overlay">
              <span class="badge {diff.colorBadge}">{diff.clues}</span>
            </div>
          </div>

          <div class="card-body">
            <div class="card-heading">
              <h3 class="card-title">{diff.name}</h3>
              <span class="card-tagline">{diff.tagline}</span>
            </div>

            <p class="card-desc">{diff.description}</p>

            <div class="card-meta">
              <span class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Est: {diff.estTime}
              </span>
            </div>

            <a href={diff.href} class="btn-primary card-btn">
              <span>Start Solving</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .difficulty-section {
    padding: 3rem 0 5rem;
  }

  .section-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .section-title {
    font-size: 2.25rem;
    font-weight: 800;
    margin-bottom: 0.75rem;
  }

  .section-subtitle {
    font-size: 1rem;
    color: var(--text-secondary);
    max-width: 580px;
    margin: 0 auto;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  .diff-card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease, border-color 0.35s ease;
  }

  .diff-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px -10px var(--card-glow);
    border-color: rgba(255, 255, 255, 0.25);
  }

  .card-img-wrapper {
    position: relative;
    width: 100%;
    height: 190px;
    overflow: hidden;
    background: #000;
  }

  .card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
    opacity: 0.9;
  }

  .diff-card:hover .card-img {
    transform: scale(1.06);
    opacity: 1;
  }

  .card-badge-overlay {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .card-body {
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .card-heading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  .card-title {
    font-size: 1.5rem;
    font-weight: 800;
    color: #f8fafc;
  }

  .card-tagline {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--accent-cyan);
    font-style: italic;
  }

  .card-desc {
    color: var(--text-secondary);
    font-size: 0.92rem;
    line-height: 1.55;
    margin-bottom: 1.5rem;
    flex: 1;
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.25rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border-glass);
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .card-btn {
    width: 100%;
    padding: 0.85rem;
    font-size: 0.95rem;
    font-weight: 700;
  }

  @media (max-width: 960px) {
    .cards-grid {
      grid-template-columns: 1fr;
      max-width: 440px;
      margin: 0 auto;
    }
  }
</style>
