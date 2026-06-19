<template>
  <button class="die" :class="{ rolling }" @click="roll">
    <span class="die-label">{{ label }}</span>
    <span class="die-result">{{ display }}</span>
  </button>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  sides: Number,
  label: String,
})

const emit = defineEmits(['rolled'])

const display = ref('?')
const rolling = ref(false)
let scrambleTimer = null

function roll() {
  if (rolling.value) return
  rolling.value = true
  display.value = '?'

  let ticks = 0
  const maxTicks = 12
  scrambleTimer = setInterval(() => {
    ticks++
    display.value = props.sides === 2
      ? (Math.random() < 0.5 ? 'H' : 'T')
      : String(Math.floor(Math.random() * props.sides) + 1)

    if (ticks >= maxTicks) {
      clearInterval(scrambleTimer)
      const result = props.sides === 2
        ? (Math.random() < 0.5 ? 'H' : 'T')
        : Math.floor(Math.random() * props.sides) + 1
      display.value = String(result)
      rolling.value = false
      emit('rolled', { sides: props.sides, result, label: props.label })
    }
  }, 35)
}
</script>

<style scoped>
.die {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: #1a1a1a;
  border: 2px solid #333;
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.1s;
  padding: 8px;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.die:active { transform: scale(0.93); }
.die.rolling { border-color: #c6a000; }

.die-label {
  font-size: 11px;
  font-weight: 700;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.die-result {
  font-size: 32px;
  font-weight: 800;
  color: #e5e7eb;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  min-width: 48px;
  text-align: center;
}

.rolling .die-result { color: #c6a000; }
</style>
