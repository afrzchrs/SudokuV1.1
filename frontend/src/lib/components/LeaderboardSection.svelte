<script>
  import { onMount } from 'svelte';
  import { fetchLeaderboard } from '$lib/api.js';

  let currentTab = $state('All');
  let leaderboardData = $state([]);
  let isLoading = $state(true);
  let isRefreshing = $state(false);

  const tabs = ['All', 'Easy', 'Mediocre', 'Genius'];

  async function loadData(difficulty = currentTab, showSpinner = true) {
    if (showSpinner) isLoading = true;
    else isRefreshing = true;

    try {
      const data = await fetchLeaderboard(difficulty);
      leaderboardData = data || [];
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      isLoading = false;
      isRefreshing = false;
    }
  }

  function handleTabChange(tab) {
    currentTab = tab;
    loadData(tab, true);
  }

  onMount(() => {
    loadData('All', true);
  });

  // Top 3 Podium items
  let topThree = $derived(leaderboardData.slice(0, 3));
  let restList = $derived(leaderboardData.slice(3));

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  }

  function getBadgeClass(diff) {
    const d = (diff || '').toLowerCase();
    if (d === 'easy') return 'badge-easy';
    if (d === 'mediocre' || d === 'medium') return 'badge-mediocre';
    if (d === 'genius' || d === 'hard') return 'badge-genius';
    return 'badge-easy';
  }
</script>

<section id="leaderboard" class="leaderboard-section">
  <div class="container">
    <div class="section-header">
      <div class="header-badge">
        <span class="trophy-icon">🏆</span>
        <span>Hall of Fame</span>
      </div>
      <h2 class="section-title">Papan Skor Global Real-Time</h2>
      <p class="section-subtitle">
        Peringkat pemain tercepat yang berhasil menaklukkan Sudoku Rush. Data disinkronkan langsung dengan database Supabase.
      </p>
    </div>

    <!-- Filter Tabs & Refresh Action -->
    <div class="controls-bar">
      <div class="tabs-container">
        {#each tabs as tab}
          <button
            class="tab-btn {currentTab === tab ? 'active' : ''}"
            onclick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        {/each}
      </div>

      <button
        class="refresh-btn {isRefreshing ? 'spinning' : ''}"
        onclick={() => loadData(currentTab, false)}
        title="Muat Ulang Skor"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
        </svg>
        <span>Refresh</span>
      </button>
    </div>

    {#if isLoading}
      <div class="loading-state glass-card">
        <div class="spinner"></div>
        <p>Memuat rekor pemain...</p>
      </div>
    {:else if leaderboardData.length === 0}
      <div class="empty-state glass-card">
        <span class="empty-icon">🧩</span>
        <h3>Belum Ada Rekor</h3>
        <p>Jadilah pemain pertama yang menaklukkan tingkat kesulitan {currentTab}!</p>
        <a href="/play/{currentTab === 'All' ? 'easy' : currentTab.toLowerCase()}" class="btn-primary" style="margin-top: 1rem;">
          Mulai Bermain Sekarang
        </a>
      </div>
    {:else}
      <!-- Podium Top 3 (if at least 1 record exists) -->
      {#if topThree.length > 0}
        <div class="podium-container">
          <!-- 2nd Place -->
          {#if topThree[1]}
            <div class="podium-card podium-silver glass-card">
              <div class="podium-rank">🥈 2nd</div>
              <div class="avatar-circle silver">{topThree[1].name.charAt(0).toUpperCase()}</div>
              <div class="player-name">{topThree[1].name}</div>
              <div class="player-time">{topThree[1].time}</div>
              <span class="badge {getBadgeClass(topThree[1].difficulty || topThree[1].dificulty)}">
                {topThree[1].difficulty || topThree[1].dificulty}
              </span>
            </div>
          {/if}

          <!-- 1st Place (Winner) -->
          <div class="podium-card podium-gold glass-card">
            <div class="crown-badge">👑 Juara 1</div>
            <div class="podium-rank">🥇 1st</div>
            <div class="avatar-circle gold">{topThree[0].name.charAt(0).toUpperCase()}</div>
            <div class="player-name">{topThree[0].name}</div>
            <div class="player-time highlight-time">{topThree[0].time}</div>
            <span class="badge {getBadgeClass(topThree[0].difficulty || topThree[0].dificulty)}">
              {topThree[0].difficulty || topThree[0].dificulty}
            </span>
          </div>

          <!-- 3rd Place -->
          {#if topThree[2]}
            <div class="podium-card podium-bronze glass-card">
              <div class="podium-rank">🥉 3rd</div>
              <div class="avatar-circle bronze">{topThree[2].name.charAt(0).toUpperCase()}</div>
              <div class="player-name">{topThree[2].name}</div>
              <div class="player-time">{topThree[2].time}</div>
              <span class="badge {getBadgeClass(topThree[2].difficulty || topThree[2].dificulty)}">
                {topThree[2].difficulty || topThree[2].dificulty}
              </span>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Detailed Table -->
      <div class="table-wrapper glass-card">
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th style="width: 70px;">Rank</th>
              <th>Pemain</th>
              <th>Waktu Selesai</th>
              <th>Kesulitan</th>
              <th>Dicatat Pada</th>
            </tr>
          </thead>
          <tbody>
            {#each leaderboardData as item, idx}
              <tr class="table-row {idx < 3 ? 'top-row' : ''}">
                <td class="rank-cell">
                  {#if idx === 0}🥇{:else if idx === 1}🥈{:else if idx === 2}🥉{:else}#{idx + 1}{/if}
                </td>
                <td class="name-cell">
                  <div class="user-badge">
                    <span class="mini-avatar">{item.name.charAt(0).toUpperCase()}</span>
                    <span class="full-name">{item.name}</span>
                  </div>
                </td>
                <td class="time-cell font-mono">{item.time}</td>
                <td>
                  <span class="badge {getBadgeClass(item.difficulty || item.dificulty)}">
                    {item.difficulty || item.dificulty}
                  </span>
                </td>
                <td class="date-cell">{formatDate(item.timestamp)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</section>

<style>
  .leaderboard-section {
    padding: 4rem 0 6rem;
    position: relative;
  }

  .section-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .header-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.9rem;
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: 9999px;
    font-size: 0.8rem;
    font-weight: 700;
    color: #fcd34d;
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

  .controls-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2.5rem;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .tabs-container {
    display: flex;
    background: rgba(15, 23, 42, 0.7);
    padding: 0.35rem;
    border-radius: 0.85rem;
    border: 1px solid var(--border-glass);
    gap: 0.35rem;
  }

  .tab-btn {
    padding: 0.55rem 1.35rem;
    border-radius: 0.6rem;
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text-secondary);
    transition: all 0.2s ease;
  }

  .tab-btn.active {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: #fff;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  .tab-btn:hover:not(.active) {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.05);
  }

  .refresh-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-glass);
    border-radius: 0.75rem;
    color: var(--text-secondary);
    font-size: 0.88rem;
    font-weight: 600;
    transition: all 0.25s ease;
  }

  .refresh-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  .refresh-btn.spinning svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Podium */
  .podium-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    align-items: flex-end;
    margin-bottom: 2.5rem;
  }

  .podium-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.75rem 1.25rem;
    text-align: center;
    position: relative;
  }

  .podium-gold {
    order: 2;
    padding-bottom: 2.5rem;
    border-color: rgba(245, 158, 11, 0.4);
    background: linear-gradient(180deg, rgba(245, 158, 11, 0.1) 0%, rgba(30, 41, 59, 0.8) 100%);
    box-shadow: 0 10px 30px -10px rgba(245, 158, 11, 0.3);
  }

  .podium-silver {
    order: 1;
    border-color: rgba(148, 163, 184, 0.3);
  }

  .podium-bronze {
    order: 3;
    border-color: rgba(180, 83, 9, 0.3);
  }

  .crown-badge {
    position: absolute;
    top: -12px;
    background: #f59e0b;
    color: #000;
    font-size: 0.75rem;
    font-weight: 800;
    padding: 0.2rem 0.65rem;
    border-radius: 9999px;
    letter-spacing: 0.05em;
  }

  .podium-rank {
    font-size: 0.9rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }

  .avatar-circle {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    font-weight: 800;
    margin-bottom: 0.75rem;
  }

  .avatar-circle.gold {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: #000;
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
  }

  .avatar-circle.silver {
    background: linear-gradient(135deg, #94a3b8, #64748b);
    color: #fff;
  }

  .avatar-circle.bronze {
    background: linear-gradient(135deg, #d97706, #78350f);
    color: #fff;
  }

  .player-name {
    font-weight: 700;
    font-size: 1.1rem;
    color: #fff;
    margin-bottom: 0.25rem;
  }

  .player-time {
    font-size: 1.15rem;
    font-weight: 800;
    font-family: monospace;
    color: var(--accent-cyan);
    margin-bottom: 0.65rem;
  }

  .highlight-time {
    font-size: 1.4rem;
    color: #fbbf24;
    text-shadow: 0 0 15px rgba(251, 191, 36, 0.4);
  }

  /* Table */
  .table-wrapper {
    overflow-x: auto;
  }

  .leaderboard-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }

  .leaderboard-table th {
    padding: 1.1rem 1.5rem;
    background: rgba(15, 23, 42, 0.6);
    color: var(--text-muted);
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid var(--border-glass);
  }

  .leaderboard-table td {
    padding: 1.1rem 1.5rem;
    border-bottom: 1px solid var(--border-glass);
    font-size: 0.95rem;
  }

  .table-row:last-child td {
    border-bottom: none;
  }

  .table-row:hover td {
    background: rgba(255, 255, 255, 0.03);
  }

  .rank-cell {
    font-weight: 800;
    font-size: 1.1rem;
    color: var(--text-secondary);
  }

  .user-badge {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .mini-avatar {
    width: 30px;
    height: 30px;
    background: rgba(99, 102, 241, 0.2);
    border: 1px solid rgba(99, 102, 241, 0.4);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 700;
    color: #a5b4fc;
  }

  .full-name {
    font-weight: 600;
    color: #f8fafc;
  }

  .time-cell {
    font-family: monospace;
    font-weight: 700;
    color: var(--accent-cyan);
    font-size: 1.05rem;
  }

  .date-cell {
    color: var(--text-muted);
    font-size: 0.85rem;
  }

  .loading-state, .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(99, 102, 241, 0.2);
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .empty-icon {
    font-size: 3rem;
  }

  @media (max-width: 768px) {
    .podium-container {
      grid-template-columns: 1fr;
    }
    .podium-gold {
      order: 1;
    }
    .podium-silver {
      order: 2;
    }
    .podium-bronze {
      order: 3;
    }
  }
</style>
