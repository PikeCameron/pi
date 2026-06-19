<template>
  <div class="cmdr-view">
    <div class="grid" :style="gridStyle">
      <!-- corner -->
      <div class="header-cell corner">FROM ↓ / TO →</div>

      <!-- column headers (receiving players) -->
      <div
        v-for="p in players" :key="`col-${p.id}`"
        class="header-cell col-header"
        :style="{ color: p.color }"
      >{{ p.name }}</div>

      <!-- rows: for each source commander -->
      <template v-for="src in players" :key="`row-${src.id}`">
        <!-- row header -->
        <div class="header-cell row-header" :style="{ color: src.color }">
          {{ src.name }}
        </div>

        <!-- damage cells -->
        <div
          v-for="dst in players" :key="`cell-${src.id}-${dst.id}`"
          class="cell"
          :class="{
            self: src.id === dst.id,
            danger: src.id !== dst.id && cmdr.isDangerous(src.id, dst.id),
          }"
          @click="src.id !== dst.id && cmdr.adjust(src.id, dst.id, 1)"
          @contextmenu.prevent="src.id !== dst.id && cmdr.adjust(src.id, dst.id, -1)"
        >
          <template v-if="src.id !== dst.id">
            <span class="dmg-val">{{ cmdr.get(src.id, dst.id) }}</span>
          </template>
          <template v-else>
            <span class="self-mark">—</span>
          </template>
        </div>
      </template>
    </div>

    <div class="footer">
      <span class="hint">Tap to +1 · Right-tap / long-press to −1 · Red = 21+ (lethal)</span>
      <button class="reset-btn" @click="cmdr.reset()">Reset</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore }      from '../stores/game.js'
import { useCommanderStore } from '../stores/commander.js'

const game  = useGameStore()
const cmdr  = useCommanderStore()
const { players } = storeToRefs(game)

const gridStyle = computed(() => ({
  gridTemplateColumns: `100px repeat(${players.value.length}, 1fr)`,
  gridTemplateRows:    `40px repeat(${players.value.length}, 1fr)`,
}))

// Long-press for mobile right-click equivalent
let pressTimer = null
function startPress(fromId, toId) {
  pressTimer = setTimeout(() => cmdr.adjust(fromId, toId, -1), 500)
}
function endPress() { clearTimeout(pressTimer) }
</script>

<style scoped>
.cmdr-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 8px;
  gap: 6px;
}

.grid {
  flex: 1;
  display: grid;
  gap: 4px;
  min-height: 0;
}

.header-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  background: #111;
  border-radius: 6px;
  padding: 2px 4px;
  text-align: center;
  line-height: 1.2;
}

.corner {
  font-size: 8px;
  color: #444;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.col-header { color: #e5e7eb; }
.row-header { color: #e5e7eb; }

.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.1s, border-color 0.2s;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.cell:active:not(.self) { background: #222; }

.cell.self {
  background: #111;
  cursor: default;
}

.cell.danger {
  border-color: #ef4444;
  background: #2a0a0a;
}

.dmg-val {
  font-size: 28px;
  font-weight: 800;
  color: #e5e7eb;
  font-variant-numeric: tabular-nums;
}

.cell.danger .dmg-val { color: #ef4444; }

.self-mark { font-size: 20px; color: #333; }

.footer {
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.hint { font-size: 10px; color: #444; }

.reset-btn {
  height: 24px;
  padding: 0 12px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 6px;
  color: #888;
  font-size: 11px;
  cursor: pointer;
}
</style>
