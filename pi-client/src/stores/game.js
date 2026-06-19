import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'

const PLAYER_COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#a855f7', '#f97316']
const FORMAT_LIFE   = { standard: 20, commander: 40, brawl: 25, custom: 20 }

function defaultState() {
  return {
    format: 'commander',
    playerCount: 4,
    startingLife: 40,
    showSetup: true,
    players: Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `Player ${i + 1}`,
      life: 40,
      color: PLAYER_COLORS[i],
    })),
  }
}

export const useGameStore = defineStore('game', () => {
  const raw = useLocalStorage('mtg-game-v2', defaultState())

  const players = computed(() => raw.value.players.slice(0, raw.value.playerCount))

  function adjustLife(id, delta) {
    const p = raw.value.players.find(p => p.id === id)
    if (p) p.life = Math.max(-99, Math.min(999, p.life + delta))
  }

  function setName(id, name) {
    const p = raw.value.players.find(p => p.id === id)
    if (p) p.name = name || p.name
  }

  function resetLife() {
    raw.value.players.forEach(p => { p.life = raw.value.startingLife })
  }

  function startGame({ format, playerCount, startingLife, names }) {
    raw.value.format      = format
    raw.value.playerCount = playerCount
    raw.value.startingLife = startingLife
    raw.value.showSetup   = false
    raw.value.players     = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: names?.[i] || `Player ${i + 1}`,
      life: startingLife,
      color: PLAYER_COLORS[i],
    }))
  }

  function openSetup() {
    raw.value.showSetup = true
  }

  return {
    raw,
    players,
    adjustLife,
    setName,
    resetLife,
    startGame,
    openSetup,
    FORMAT_LIFE,
  }
})
