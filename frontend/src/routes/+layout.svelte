<script>
  import '../lib/styles/app.css';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { children } = $props();
</script>

<div class="app-shell">
  <Navbar />
  <main class="main-content">
    {@render children()}
  </main>
  <Footer />
</div>

<style>
  .app-shell {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
