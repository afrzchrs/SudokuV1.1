<script>
  let isScrolled = $state(false);

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      isScrolled = window.scrollY > 20;
    });
  }
</script>

<header class="navbar-wrapper {isScrolled ? 'scrolled' : ''}">
  <div class="container nav-content">
    <a href="/" class="brand">
      <div class="brand-icon">
        <span></span><span></span><span></span>
        <span></span><span></span><span></span>
        <span></span><span></span><span></span>
      </div>
      <div class="brand-text">
        <span class="brand-title">SUDOKU <span class="highlight">RUSH</span></span>
        <span class="brand-subtitle">Fast & Minimalist</span>
      </div>
    </a>

    <nav class="nav-links">
      <a href="/#difficulties" class="nav-link">Difficulties</a>
      <a href="/#leaderboard" class="nav-link">Leaderboard</a>
      <a href="/#how-to-play" class="nav-link">Rules</a>
      <a href="/#features" class="nav-link">Features</a>
    </nav>

    <div class="nav-actions">
      <a href="/play/easy" class="btn-primary btn-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
        Play Now
      </a>
    </div>
  </div>
</header>

<style>
  .navbar-wrapper {
    position: sticky;
    top: 0;
    z-index: 50;
    padding: 1.1rem 0;
    transition: all 0.3s ease;
    border-bottom: 1px solid transparent;
  }

  .navbar-wrapper.scrolled {
    background: rgba(9, 13, 22, 0.82);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom-color: var(--border-glass);
    padding: 0.8rem 0;
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.4);
  }

  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    text-decoration: none;
  }

  .brand-icon {
    display: grid;
    grid-template-columns: repeat(3, 7px);
    gap: 2.5px;
    padding: 6px;
    background: rgba(99, 102, 241, 0.15);
    border: 1px solid rgba(99, 102, 241, 0.4);
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
  }

  .brand-icon span {
    width: 7px;
    height: 7px;
    background: #818cf8;
    border-radius: 1.5px;
  }

  .brand-icon span:nth-child(2),
  .brand-icon span:nth-child(4),
  .brand-icon span:nth-child(9) {
    background: #38bdf8;
  }

  .brand-text {
    display: flex;
    flex-direction: column;
  }

  .brand-title {
    font-family: var(--font-heading);
    font-weight: 800;
    font-size: 1.25rem;
    letter-spacing: 0.04em;
    color: #f8fafc;
  }

  .brand-title .highlight {
    color: #38bdf8;
    text-shadow: 0 0 18px rgba(56, 189, 248, 0.5);
  }

  .brand-subtitle {
    font-size: 0.68rem;
    color: var(--text-muted);
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .nav-link {
    font-size: 0.92rem;
    color: var(--text-secondary);
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .nav-link:hover {
    color: #f8fafc;
  }

  .btn-sm {
    padding: 0.5rem 1.15rem;
    font-size: 0.85rem;
    border-radius: 0.6rem;
  }

  @media (max-width: 768px) {
    .nav-links {
      display: none;
    }
  }
</style>
