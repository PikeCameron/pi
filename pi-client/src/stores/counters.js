import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useCounterStore = defineStore('counters', () => {
  const raw = useLocalStorage('mtg-counters-v2', {
    poison: {},
    energy: {},
    experience: {},
    storm: 0,
  })

  function getCounter(type, playerId) {
    return raw.value[type]?.[playerId] ?? 0
  }

  function adjustCounter(type, playerId, delta) {
    if (!raw.value[type]) raw.value[type] = {}
    const cur = raw.value[type][playerId] ?? 0
    raw.value[type][playerId] = Math.max(0, cur + delta)
  }

  function adjustStorm(delta) {
    raw.value.storm = Math.max(0, (raw.value.storm ?? 0) + delta)
  }

  function resetStorm() {
    raw.value.storm = 0
  }

  function reset() {
    raw.value = { poison: {}, energy: {}, experience: {}, storm: 0 }
  }

  function isPoisonDead(playerId) {
    return (raw.value.poison?.[playerId] ?? 0) >= 10
  }

  return {
    raw,
    getCounter,
    adjustCounter,
    adjustStorm,
    resetStorm,
    reset,
    isPoisonDead,
  }
})
