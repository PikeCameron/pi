<template>
  <div class="stat-card">
    <div class="header">
      <span class="label">{{ label }}</span>
      <span v-if="temp" class="temp">{{ temp }}°C</span>
    </div>
    <div class="gauge-wrap">
      <svg class="gauge" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle class="track" cx="50" cy="50" r="40" />
        <circle
          class="fill"
          cx="50"
          cy="50"
          r="40"
          :style="{ stroke: color, strokeDashoffset: dashOffset }"
        />
      </svg>
      <span class="pct">{{ percent }}%</span>
    </div>
    <div v-if="detail" class="detail">{{ detail }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  percent: { type: Number, default: 0 },
  temp: Number,
  detail: String,
  color: { type: String, default: '#3b82f6' },
})

const CIRCUMFERENCE = 2 * Math.PI * 40

const dashOffset = computed(() => {
  const clamped = Math.min(100, Math.max(0, props.percent))
  return CIRCUMFERENCE * (1 - clamped / 100)
})
</script>

<style scoped>
.stat-card {
  background: #161b22;
  border: 1px solid #21262d;
  border-radius: 12px;
  padding: 10px 8px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 12px;
  font-weight: 600;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.temp {
  font-size: 11px;
  color: #f97316;
}

.gauge-wrap {
  position: relative;
  width: 110px;
  height: 110px;
}

.gauge {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.track {
  fill: none;
  stroke: #21262d;
  stroke-width: 10;
}

.fill {
  fill: none;
  stroke-width: 10;
  stroke-linecap: round;
  stroke-dasharray: v-bind(CIRCUMFERENCE);
  transition: stroke-dashoffset 0.6s ease;
}

.pct {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  color: #e6edf3;
}

.detail {
  font-size: 11px;
  color: #6e7681;
}
</style>
