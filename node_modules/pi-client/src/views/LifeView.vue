<template>
  <div class="life-view">
    <NewGameModal v-if="game.raw.showSetup" />

    <ConfirmModal
      v-if="pending === 'reset'"
      message="Reset all life totals?"
      confirm-label="Reset"
      @confirm="game.resetLife(); pending = null"
      @cancel="pending = null"
    />
    <ConfirmModal
      v-if="pending === 'new'"
      message="Start a new game? All progress will be lost."
      confirm-label="New Game"
      @confirm="game.openSetup(); pending = null"
      @cancel="pending = null"
    />

    <template v-else>
      <!-- 2-player: two rows -->
      <template v-if="game.raw.playerCount === 2">
        <PlayerPanel class="panel-half" :player="players[1]" :rotation="180" />
        <PlayerPanel class="panel-half" :player="players[0]" :rotation="0" />
      </template>

      <!-- 3-player: two on top, one on bottom -->
      <template v-else-if="game.raw.playerCount === 3">
        <div class="row top-row">
          <PlayerPanel class="panel-quarter" :player="players[1]" :rotation="180" />
          <PlayerPanel class="panel-quarter" :player="players[2]" :rotation="180" />
        </div>
        <PlayerPanel class="panel-half" :player="players[0]" :rotation="0" />
      </template>

      <!-- 4-player: 2x2 grid -->
      <template v-else-if="game.raw.playerCount === 4">
        <div class="row">
          <PlayerPanel class="panel-quarter" :player="players[2]" :rotation="180" />
          <PlayerPanel class="panel-quarter" :player="players[3]" :rotation="180" />
        </div>
        <div class="row">
          <PlayerPanel class="panel-quarter" :player="players[0]" :rotation="0" />
          <PlayerPanel class="panel-quarter" :player="players[1]" :rotation="0" />
        </div>
      </template>

      <!-- 5-player: 3 on top (rotated), 2 on bottom -->
      <template v-else>
        <div class="row">
          <PlayerPanel class="panel-third" :player="players[2]" :rotation="180" />
          <PlayerPanel class="panel-third" :player="players[3]" :rotation="180" />
          <PlayerPanel class="panel-third" :player="players[4]" :rotation="180" />
        </div>
        <div class="row">
          <PlayerPanel class="panel-half" :player="players[0]" :rotation="0" />
          <PlayerPanel class="panel-half" :player="players[1]" :rotation="0" />
        </div>
      </template>

      <!-- toolbar: reset + new game -->
      <div class="toolbar">
        <button class="tool-btn" @click="pending = 'reset'">↺ Reset Life</button>
        <button class="tool-btn new" @click="pending = 'new'">New Game</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '../stores/game.js'
import PlayerPanel    from '../components/PlayerPanel.vue'
import NewGameModal   from '../components/NewGameModal.vue'
import ConfirmModal   from '../components/ConfirmModal.vue'

const game = useGameStore()
const { players } = storeToRefs(game)
const pending = ref(null)
</script>

<style scoped>
.life-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.row {
  display: flex;
  flex: 1;
  min-height: 0;
}

.panel-half    { flex: 1; min-height: 0; }
.panel-quarter { flex: 1; min-height: 0; }
.panel-third   { flex: 1; min-height: 0; }
.top-row       { display: flex; flex: 1; min-height: 0; }

.toolbar {
  height: 36px;
  flex-shrink: 0;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
  padding: 0 10px;
  background: #0d0d0d;
  border-top: 1px solid #222;
}

.tool-btn {
  height: 26px;
  padding: 0 14px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 6px;
  color: #aaa;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

.tool-btn.new {
  border-color: #c6a000;
  color: #c6a000;
}
</style>
