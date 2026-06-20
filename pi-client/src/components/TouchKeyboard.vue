<template>
  <Transition name="kb">
    <div v-if="visible" class="keyboard">
      <div class="kb-row" v-for="(row, ri) in rows" :key="ri">
        <button
          v-for="key in row"
          :key="key.id"
          class="kb-key"
          :class="key.cls"
          @pointerdown.prevent="tap(key)"
        >{{ key.label }}</button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'

defineProps({ visible: Boolean })
const emit = defineEmits(['done'])

const shifted = ref(false)
const numMode = ref(false)

function letter(c) {
  const l = shifted.value ? c.toUpperCase() : c
  return { id: c, label: l, val: l }
}
function sym(c) {
  return { id: c, label: c, val: c }
}

const alphaRows = computed(() => [
  [..."qwertyuiop"].map(letter),
  [
    ...([..."asdfghjkl"].map(letter)),
  ],
  [
    { id: 'shift', label: shifted.value ? '⇧' : '⇧', action: 'shift', cls: 'mod' },
    ...([..."zxcvbnm"].map(letter)),
    { id: 'back', label: '⌫', action: 'backspace', cls: 'mod' },
  ],
  [
    { id: 'num', label: '123', action: 'num', cls: 'mod' },
    { id: 'space', label: '', val: ' ', cls: 'space' },
    { id: 'done', label: 'Done', action: 'done', cls: 'done' },
  ],
])

const numRows = computed(() => [
  [..."1234567890"].map(sym),
  [..."-/:;()$&@\""].map(sym),
  [
    ...["!", "?", "'", ",", ".", "_", "+", "=", "#"].map(sym),
    { id: 'back', label: '⌫', action: 'backspace', cls: 'mod' },
  ],
  [
    { id: 'alpha', label: 'ABC', action: 'alpha', cls: 'mod' },
    { id: 'space', label: '', val: ' ', cls: 'space' },
    { id: 'done', label: 'Done', action: 'done', cls: 'done' },
  ],
])

const rows = computed(() => numMode.value ? numRows.value : alphaRows.value)

function tap(key) {
  if (key.action === 'shift') { shifted.value = !shifted.value; return }
  if (key.action === 'num')   { numMode.value = true;  return }
  if (key.action === 'alpha') { numMode.value = false; return }
  if (key.action === 'done')  { emit('done'); return }

  const el = document.activeElement
  if (!el || !['INPUT', 'TEXTAREA'].includes(el.tagName)) return

  if (key.action === 'backspace') {
    deleteChar(el)
  } else if (key.val != null) {
    insertChar(el, key.val)
    if (shifted.value && key.val.trim()) shifted.value = false
  }
}

function insertChar(el, char) {
  const s = el.selectionStart ?? el.value.length
  const e = el.selectionEnd   ?? el.value.length
  setVal(el, el.value.slice(0, s) + char + el.value.slice(e))
  el.setSelectionRange(s + char.length, s + char.length)
}

function deleteChar(el) {
  const s = el.selectionStart ?? el.value.length
  const e = el.selectionEnd   ?? el.value.length
  if (s === e && s === 0) return
  const [newVal, newPos] = s === e
    ? [el.value.slice(0, s - 1) + el.value.slice(e), s - 1]
    : [el.value.slice(0, s) + el.value.slice(e), s]
  setVal(el, newVal)
  el.setSelectionRange(newPos, newPos)
}

function setVal(el, value) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
  setter?.call(el, value)
  el.dispatchEvent(new Event('input', { bubbles: true }))
}
</script>

<style scoped>
.keyboard {
  position: fixed;
  bottom: 60px;
  left: 0;
  width: 800px;
  background: #111;
  border-top: 1px solid #2a2a2a;
  padding: 6px 4px 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 500;
  user-select: none;
}

.kb-row {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.kb-key {
  flex: 1;
  height: 44px;
  background: #2a2a2a;
  border: none;
  border-radius: 6px;
  color: #e5e7eb;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.08s;
  min-width: 0;
}

.kb-key:active { background: #444; }

.kb-key.mod {
  background: #1a1a1a;
  color: #aaa;
  font-size: 13px;
  flex: 1.4;
}

.kb-key.space {
  flex: 4;
  background: #1f1f1f;
}

.kb-key.done {
  background: #c6a000;
  color: #000;
  font-size: 13px;
  font-weight: 700;
  flex: 1.4;
}

.kb-enter { display: none; }

.kb-enter { display: none; }

/* slide-up animation */
.kb-enter-active, .kb-leave-active { transition: transform 0.15s ease; }
.kb-enter-from, .kb-leave-to { transform: translateY(100%); }
</style>
