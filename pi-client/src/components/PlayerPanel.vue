<template>
  <div class="panel" :style="{ '--player-color': player.color, transform: `rotate(${rotation}deg)` }">
    <div class="panel-header">
      <span class="color-dot" />
      <template v-if="editing">
        <input
          ref="nameInput"
          class="name-edit"
          v-model="editName"
          maxlength="14"
          @blur="saveName"
          @keyup.enter="saveName"
        />
      </template>
      <template v-else>
        <span class="player-name" @click="startEdit">{{ player.name }}</span>
      </template>
    </div>

    <div class="life-area">
      <div class="adj-col left">
        <button class="adj-btn big" @click="game.adjustLife(player.id, -5)">−5</button>
        <button class="adj-btn"     @click="game.adjustLife(player.id, -1)">−1</button>
      </div>

      <div class="life-display" :class="{ dead: player.life <= 0 }">
        {{ player.life }}
      </div>

      <div class="adj-col right">
        <button class="adj-btn big" @click="game.adjustLife(player.id, +5)">+5</button>
        <button class="adj-btn"     @click="game.adjustLife(player.id, +1)">+1</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useGameStore } from '../stores/game.js'

const props = defineProps({
  player: Object,
  rotation: { type: Number, default: 0 },
})

const game     = useGameStore()
const editing  = ref(false)
const editName = ref('')
const nameInput = ref(null)

function startEdit() {
  editName.value = props.player.name
  editing.value  = true
  nextTick(() => nameInput.value?.focus())
}

function saveName() {
  game.setName(props.player.id, editName.value.trim())
  editing.value = false
}
</script>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  background: #141414;
  border: 1px solid #2a2a2a;
  border-left: 3px solid var(--player-color);
  overflow: hidden;
  user-select: none;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #111;
  border-bottom: 1px solid #222;
  height: 34px;
  flex-shrink: 0;
}

.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--player-color);
  flex-shrink: 0;
}

.player-name {
  font-size: 13px;
  font-weight: 600;
  color: #aaa;
  cursor: pointer;
  flex: 1;
}

.name-edit {
  flex: 1;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--player-color);
  color: #e5e7eb;
  font-size: 13px;
  font-weight: 600;
  outline: none;
  padding: 0;
}

.life-area {
  flex: 1;
  display: flex;
  align-items: stretch;
  min-height: 0;
}

.adj-col {
  display: flex;
  flex-direction: column;
  width: 72px;
  flex-shrink: 0;
  border-color: #222;
}

.adj-col.left  { border-right: 1px solid #222; }
.adj-col.right { border-left: 1px solid #222; }

.adj-btn {
  flex: 1;
  background: #1a1a1a;
  border: none;
  color: #ccc;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.1s;
  -webkit-tap-highlight-color: transparent;
}

.adj-btn + .adj-btn { border-top: 1px solid #222; }

.adj-btn.big { color: #e5e7eb; }

.adj-btn:active { background: #2a2a2a; }

.life-display {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
  font-weight: 800;
  color: #e5e7eb;
  font-variant-numeric: tabular-nums;
  letter-spacing: -2px;
  line-height: 1;
}

.life-display.dead { color: #ef4444; }
</style>
