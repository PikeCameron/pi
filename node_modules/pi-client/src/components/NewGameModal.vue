<template>
  <div class="overlay">
    <div class="modal">
      <h2 class="title">New Game</h2>

      <section class="section">
        <label class="section-label">Format</label>
        <div class="btn-group">
          <button
            v-for="f in formats" :key="f.id"
            class="opt-btn"
            :class="{ active: form.format === f.id }"
            @click="selectFormat(f)"
          >{{ f.label }}</button>
        </div>
      </section>

      <section class="section">
        <label class="section-label">Players</label>
        <div class="btn-group">
          <button
            v-for="n in [2, 3, 4, 5]" :key="n"
            class="opt-btn"
            :class="{ active: form.playerCount === n }"
            @click="form.playerCount = n"
          >{{ n }}</button>
        </div>
      </section>

      <section class="section">
        <label class="section-label">Starting Life</label>
        <div class="life-row">
          <button class="life-adj" @click="form.startingLife = Math.max(1, form.startingLife - 5)">−5</button>
          <span class="life-val">{{ form.startingLife }}</span>
          <button class="life-adj" @click="form.startingLife += 5">+5</button>
        </div>
      </section>

      <section class="section names-section">
        <label class="section-label">Player Names</label>
        <div class="names-grid" :style="form.playerCount === 5 ? 'grid-template-columns: repeat(3, 1fr)' : ''">
          <input
            v-for="i in form.playerCount" :key="i"
            class="name-input"
            :placeholder="`Player ${i}`"
            v-model="form.names[i - 1]"
            maxlength="14"
          />
        </div>
      </section>

      <button class="start-btn" @click="start">Start Game</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useGameStore } from '../stores/game.js'
import { useCommanderStore } from '../stores/commander.js'
import { useCounterStore } from '../stores/counters.js'

const game      = useGameStore()
const commander = useCommanderStore()
const counters  = useCounterStore()

const formats = [
  { id: 'commander', label: 'Commander', life: 40 },
  { id: 'standard',  label: 'Standard',  life: 20 },
]

const form = reactive({
  format: game.raw.format ?? 'commander',
  playerCount: game.raw.playerCount ?? 4,
  startingLife: game.raw.startingLife ?? 40,
  names: Array.from({ length: 5 }, (_, i) => game.raw.players?.[i]?.name ?? ''),
})

function selectFormat(f) {
  form.format = f.id
  if (f.id !== 'custom') form.startingLife = f.life
}

function start() {
  commander.reset()
  counters.reset()
  game.startGame({
    format: form.format,
    playerCount: form.playerCount,
    startingLife: form.startingLife,
    names: form.names,
  })
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #1a1a1a;
  border: 1px solid #c6a000;
  border-radius: 12px;
  padding: 20px 28px;
  width: 680px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: #c6a000;
  text-align: center;
  letter-spacing: 0.06em;
}

.section { display: flex; flex-direction: column; gap: 6px; }

.section-label {
  font-size: 11px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.btn-group { display: flex; gap: 8px; }

.opt-btn {
  flex: 1;
  height: 44px;
  background: #222;
  border: 1px solid #333;
  border-radius: 8px;
  color: #aaa;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.1s;
}

.opt-btn.active {
  background: #2a2000;
  border-color: #c6a000;
  color: #c6a000;
}

.life-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.life-adj {
  width: 56px;
  height: 44px;
  background: #222;
  border: 1px solid #333;
  border-radius: 8px;
  color: #e5e7eb;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
}

.life-val {
  font-size: 28px;
  font-weight: 700;
  color: #e5e7eb;
  width: 60px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.names-section { flex-direction: column; }

.names-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.name-input {
  height: 40px;
  background: #222;
  border: 1px solid #333;
  border-radius: 8px;
  color: #e5e7eb;
  font-size: 14px;
  padding: 0 12px;
  outline: none;
}

.name-input:focus { border-color: #c6a000; }

.start-btn {
  margin-top: 4px;
  height: 50px;
  background: #c6a000;
  border: none;
  border-radius: 10px;
  color: #000;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.05em;
}
</style>
