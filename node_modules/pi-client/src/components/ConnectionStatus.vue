<template>
  <div class="connection-status" :class="{ connected }">
    <span class="dot" />
    <span class="label">{{ connected ? 'Connected' : 'Reconnecting…' }}</span>
  </div>
</template>

<script setup>
defineProps({
  connected: Boolean,
})
</script>

<style scoped>
.connection-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #ef4444;
}
.connection-status.connected {
  color: #22c55e;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}
</style>
