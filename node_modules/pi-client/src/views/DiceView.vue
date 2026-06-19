<template>
  <div class="dice-view">
    <div class="dice-grid">
      <DieButton v-for="d in dice" :key="d.sides" :sides="d.sides" :label="d.label" @rolled="onRoll" />
    </div>

    <div class="history-panel">
      <div class="history-header">Recent Rolls</div>
      <div class="history-list">
        <div v-if="!history.length" class="history-empty">Roll a die to get started</div>
        <div v-for="(r, i) in history" :key="i" class="history-entry">
          <span class="hist-label">{{ r.label }}</span>
          <span class="hist-result" :class="{ nat20: r.result === 20 && r.sides === 20, nat1: r.result === 1 && r.sides > 2 }">
            {{ r.result }}
          </span>
        </div>
      </div>
      <button class="clear-btn" @click="history = []">Clear</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DieButton from '../components/DieButton.vue'

const dice = [
  { sides: 4,  label: 'd4'   },
  { sides: 6,  label: 'd6'   },
  { sides: 8,  label: 'd8'   },
  { sides: 10, label: 'd10'  },
  { sides: 12, label: 'd12'  },
  { sides: 20, label: 'd20'  },
  { sides: 100,label: 'd100' },
  { sides: 2,  label: 'Coin' },
]

const history = ref([])

function onRoll(entry) {
  history.value.unshift(entry)
  if (history.value.length > 20) history.value.pop()
}
</script>

<style scoped>
.dice-view {
  display: flex;
  height: 100%;
  padding: 12px;
  gap: 12px;
}

.dice-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 8px;
  flex-shrink: 0;
  width: 240px;
}

.history-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  overflow: hidden;
}

.history-header {
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 700;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  border-bottom: 1px solid #222;
  flex-shrink: 0;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 6px 0;
}

.history-empty {
  padding: 20px;
  text-align: center;
  color: #444;
  font-size: 13px;
}

.history-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 14px;
  border-bottom: 1px solid #1e1e1e;
}

.hist-label {
  font-size: 12px;
  color: #666;
  font-weight: 600;
}

.hist-result {
  font-size: 22px;
  font-weight: 800;
  color: #e5e7eb;
  font-variant-numeric: tabular-nums;
  min-width: 48px;
  text-align: right;
}

.hist-result.nat20 { color: #c6a000; }
.hist-result.nat1  { color: #ef4444; }

.clear-btn {
  height: 32px;
  border-top: 1px solid #222;
  background: transparent;
  border-left: none;
  border-right: none;
  border-bottom: none;
  color: #555;
  font-size: 11px;
  cursor: pointer;
  flex-shrink: 0;
}
</style>
