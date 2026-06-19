<template>
  <nav class="tabbar">
    <RouterLink to="/"          class="tab" :class="{ active: route.path === '/' }">
      <span class="tab-icon">⚔️</span>
      <span class="tab-label">Life</span>
    </RouterLink>
    <RouterLink to="/commander" class="tab" :class="{ active: route.path === '/commander' }">
      <span class="tab-icon">👑</span>
      <span class="tab-label">Commander</span>
    </RouterLink>
    <RouterLink to="/counters"  class="tab" :class="{ active: route.path === '/counters' }">
      <span class="tab-icon">🔢</span>
      <span class="tab-label">Counters</span>
    </RouterLink>
    <RouterLink to="/dice"      class="tab" :class="{ active: route.path === '/dice' }">
      <span class="tab-icon">🎲</span>
      <span class="tab-label">Dice</span>
    </RouterLink>
    <RouterLink to="/search"    class="tab" :class="{ active: route.path === '/search' }">
      <span class="tab-icon">🔍</span>
      <span class="tab-label">Search</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
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
  gap: 2px;
  text-decoration: none;
  color: #555;
  transition: color 0.15s;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.tab.active {
  color: #c6a000;
  border-top: 2px solid #c6a000;
}

.tab-icon  { font-size: 20px; line-height: 1; }
.tab-label { font-size: 10px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
</style>
