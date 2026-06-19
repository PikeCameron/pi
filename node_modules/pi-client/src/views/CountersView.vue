<template>
  <div class="counters-view">
    <!-- Per-player counters -->
    <div class="players-grid">
      <div v-for="p in players" :key="p.id" class="player-block">
        <div class="player-label" :style="{ color: p.color }">{{ p.name }}</div>
        <div class="widgets-row">
          <CounterWidget
            label="☠ Poison"
            :value="store.getCounter('poison', p.id)"
            :danger="store.isPoisonDead(p.id)"
            danger-label="DEAD"
            @inc="store.adjustCounter('poison', p.id, 1)"
            @dec="store.adjustCounter('poison', p.id, -1)"
          />
          <CounterWidget
            label="⚡ Energy"
            :value="store.getCounter('energy', p.id)"
            @inc="store.adjustCounter('energy', p.id, 1)"
            @dec="store.adjustCounter('energy', p.id, -1)"
          />
          <CounterWidget
            label="✨ Exp"
            :value="store.getCounter('experience', p.id)"
            @inc="store.adjustCounter('experience', p.id, 1)"
            @dec="store.adjustCounter('experience', p.id, -1)"
          />
        </div>
      </div>
    </div>

    <!-- Storm counter -->
    <div class="storm-row">
      <div class="storm-block">
        <span class="storm-label">🌪 Storm Count</span>
        <div class="storm-controls">
          <button class="storm-btn" @click="store.adjustStorm(-1)">−</button>
          <span class="storm-val">{{ store.raw.storm }}</span>
          <button class="storm-btn" @click="store.adjustStorm(1)">+</button>
          <button class="storm-reset" @click="store.resetStorm()">Reset</button>
        </div>
      </div>

      <button class="reset-all-btn" @click="store.reset()">Reset All</button>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useGameStore }    from '../stores/game.js'
import { useCounterStore } from '../stores/counters.js'
import CounterWidget from '../components/CounterWidget.vue'

const game  = useGameStore()
const store = useCounterStore()
const { players } = storeToRefs(game)
</script>

<style scoped>
.counters-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  gap: 10px;
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  flex: 1;
  min-height: 0;
}

.player-block {
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.player-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.widgets-row {
  display: flex;
  gap: 8px;
  flex: 1;
  align-items: center;
}

.storm-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  padding: 10px 16px;
  height: 64px;
  flex-shrink: 0;
}

.storm-block {
  display: flex;
  align-items: center;
  gap: 16px;
}

.storm-label {
  font-size: 13px;
  font-weight: 700;
  color: #8b5cf6;
}

.storm-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.storm-btn {
  width: 40px;
  height: 40px;
  background: #222;
  border: 1px solid #333;
  border-radius: 8px;
  color: #e5e7eb;
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
}

.storm-val {
  font-size: 32px;
  font-weight: 800;
  color: #8b5cf6;
  min-width: 48px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.storm-reset {
  height: 32px;
  padding: 0 12px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 6px;
  color: #888;
  font-size: 11px;
  cursor: pointer;
}

.reset-all-btn {
  height: 36px;
  padding: 0 16px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
  color: #888;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
</style>
