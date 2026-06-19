<template>
  <div class="device">
    <div class="device-header">
      <span class="icon">{{ icon }}</span>
      <span class="device-name">{{ shortName }}</span>
    </div>
    <div class="battery-row">
      <div class="bar-track">
        <div class="bar-fill" :style="{ width: level + '%', background: barColor }" />
      </div>
      <span class="pct" :style="{ color: barColor }">{{ level }}%</span>
    </div>
    <span class="status">{{ statusLabel }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: String,
  name: String,
  level: Number,
})

const shortName = computed(() => {
  if (!props.name) return ''
  // Trim common verbose suffixes to fit the display
  return props.name.replace(/(wireless|gaming|optical|mouse|headset)/gi, '').trim().slice(0, 22)
})

const barColor = computed(() => {
  if (props.level <= 15) return '#ef4444'
  if (props.level <= 35) return '#f97316'
  return '#22c55e'
})

const statusLabel = computed(() => {
  if (props.level <= 15) return 'Low — charge soon'
  if (props.level <= 35) return 'Below half'
  if (props.level >= 90) return 'Fully charged'
  return 'Good'
})
</script>

<style scoped>
.device {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 280px;
}

.device-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon { font-size: 26px; }

.device-name {
  font-size: 13px;
  font-weight: 600;
  color: #e6edf3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.battery-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bar-track {
  flex: 1;
  height: 10px;
  background: #21262d;
  border-radius: 5px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 1s ease, background 0.3s;
}

.pct {
  font-size: 16px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  width: 42px;
  text-align: right;
  flex-shrink: 0;
}

.status {
  font-size: 11px;
  color: #6e7681;
}
</style>
