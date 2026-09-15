<script>
  import HeroSection from '$lib/components/HeroSection.svelte';
  import DifficultyCards from '$lib/components/DifficultyCards.svelte';
  import LeaderboardSection from '$lib/components/LeaderboardSection.svelte';
  import FeaturesSection from '$lib/components/FeaturesSection.svelte';
  import HowToPlaySection from '$lib/components/HowToPlaySection.svelte';
</script>

<svelte:head>
  <title>Sudoku Rush - Kecepatan Logika & Real-Time Leaderboard</title>
  <meta name="description" content="Pecahkan teka-teki Sudoku dalam berbagai tingkat kesulitan (Easy, Mediocre, Genius) dan catat nama Anda di leaderboard global secara real-time!" />
</svelte:head>

<div class="landing-page">
  <HeroSection />
  <DifficultyCards />
  <LeaderboardSection />
  <FeaturesSection />
  <HowToPlaySection />
</div>

<style>
  .landing-page {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
