<template>
  <nav class="tabbar">
    <RouterLink to="/"          class="tab" :class="{ active: route.path === '/' }">
      <svg class="tab-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      <span class="tab-label">Life</span>
    </RouterLink>
    <RouterLink to="/commander" class="tab" :class="{ active: route.path === '/commander' }">
      <svg class="tab-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm0 2h14v2H5v-2z"/></svg>
      <span class="tab-label">Commander</span>
    </RouterLink>
    <RouterLink to="/counters"  class="tab" :class="{ active: route.path === '/counters' }">
      <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="8" y1="4" x2="8" y2="20"/><line x1="16" y1="4" x2="16" y2="20"/><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/></svg>
      <span class="tab-label">Counters</span>
    </RouterLink>
    <RouterLink to="/dice"      class="tab" :class="{ active: route.path === '/dice' }">
      <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="8" cy="16" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none"/></svg>
      <span class="tab-label">Dice</span>
    </RouterLink>
    <RouterLink to="/search"    class="tab" :class="{ active: route.path === '/search' }">
      <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>
      <span class="tab-label">Search</span>
    </RouterLink>
    <button class="tab exit-btn" @click="exit">
      <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
      <span class="tab-label">Exit</span>
    </button>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
function exit() { window.close() }
</script>

<style scoped>
.tabbar {
  display: flex;
  height: 60px;
  background: #111;
  border-top: 1px solid #2a2a2a;
  flex-shrink: 0;
}

.tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  text-decoration: none;
  color: #555;
  transition: color 0.15s;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.tab.active {
  color: #c6a000;
  border-top: 2px solid #c6a000;
}

.tab-icon  { width: 22px; height: 22px; }
.tab-label { font-size: 10px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; font-family: inherit; }

.exit-btn {
  flex: 0 0 60px;
  border-left: 1px solid #1f1f1f;
  color: #4a2020;
}
.exit-btn:active { color: #ef4444; }
</style>
