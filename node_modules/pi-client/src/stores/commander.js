import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { useGameStore } from './game.js'

export const useCommanderStore = defineStore('commander', () => {
  // damage[fromId][toId] = amount
  const raw = useLocalStorage('mtg-commander-v2', {})

  function key(fromId, toId) {
    return `${fromId}-${toId}`
  }

  function get(fromId, toId) {
    return raw.value[key(fromId, toId)] ?? 0
  }

  function adjust(fromId, toId, delta) {
    const k = key(fromId, toId)
    raw.value[k] = Math.max(0, (raw.value[k] ?? 0) + delta)
  }

  function reset() {
    raw.value = {}
  }

  function isDangerous(fromId, toId) {
    return get(fromId, toId) >= 21
  }

  return { get, adjust, reset, isDangerous }
})
