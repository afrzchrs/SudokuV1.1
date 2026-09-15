<footer class="footer-wrapper">
  <div class="container footer-content">
    <div class="footer-top">
      <div class="footer-brand">
        <div class="brand-title">SUDOKU <span class="highlight">RUSH</span></div>
        <p class="brand-desc">
          Modern, minimalis, dan berkecepatan tinggi. Didukung microservice backend JavaScript & Supabase via Drizzle ORM.
        </p>
      </div>

      <div class="footer-links-grid">
        <div class="links-col">
          <h4>Game Modes</h4>
          <ul>
            <li><a href="/play/easy">Easy (40 Clues)</a></li>
            <li><a href="/play/mediocre">Mediocre (32 Clues)</a></li>
            <li><a href="/play/genius">Genius (26 Clues)</a></li>
          </ul>
        </div>

        <div class="links-col">
          <h4>Explore</h4>
          <ul>
            <li><a href="/#leaderboard">Live Leaderboard</a></li>
            <li><a href="/#how-to-play">Rules & Guide</a></li>
            <li><a href="/#features">Architecture</a></li>
          </ul>
        </div>

        <div class="links-col">
          <h4>Tech Stack</h4>
          <div class="tech-tags">
            <span class="tech-tag">SvelteKit</span>
            <span class="tech-tag">Drizzle ORM</span>
            <span class="tech-tag">Supabase</span>
            <span class="tech-tag">Node Microservice</span>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; {new Date().getFullYear()} Sudoku Rush. All rights reserved.</p>
      <div class="status-indicator">
        <span class="status-dot"></span>
        <span>Real-Time Leaderboard Active</span>
      </div>
    </div>
  </div>
</footer>

<style>
  .footer-wrapper {
    margin-top: auto;
    border-top: 1px solid var(--border-glass);
    background: rgba(10, 14, 24, 0.95);
    padding: 3.5rem 0 2rem;
  }

  .footer-content {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .footer-top {
    display: flex;
    justify-content: space-between;
    gap: 3rem;
    flex-wrap: wrap;
  }

  .footer-brand {
    max-width: 360px;
  }

  .brand-title {
    font-family: var(--font-heading);
    font-size: 1.4rem;
    font-weight: 800;
    color: #f8fafc;
    margin-bottom: 0.75rem;
  }

  .brand-title .highlight {
    color: #38bdf8;
  }

  .brand-desc {
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .footer-links-grid {
    display: flex;
    gap: 3.5rem;
    flex-wrap: wrap;
  }

  .links-col h4 {
    font-size: 0.9rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }

  .links-col ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .links-col a {
    color: var(--text-secondary);
    font-size: 0.88rem;
    transition: color 0.2s ease;
  }

  .links-col a:hover {
    color: #38bdf8;
  }

  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    max-width: 220px;
  }

  .tech-tag {
    font-size: 0.75rem;
    padding: 0.25rem 0.6rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-glass);
    border-radius: 6px;
    color: var(--text-secondary);
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 1.5rem;
    color: var(--text-muted);
    font-size: 0.82rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #34d399;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    background-color: #10b981;
    border-radius: 50%;
    box-shadow: 0 0 10px #10b981;
  }
</style>
