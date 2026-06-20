<template>
  <div class="app">
    <div class="content">
      <RouterView />
    </div>
    <TabBar />
    <TouchKeyboard :visible="kbVisible" @done="hideKeyboard" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TabBar        from './components/TabBar.vue'
import TouchKeyboard from './components/TouchKeyboard.vue'

const kbVisible = ref(false)

function onFocusIn(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    kbVisible.value = true
  }
}

function onFocusOut() {
  setTimeout(() => {
    const a = document.activeElement
    if (!a || !['INPUT', 'TEXTAREA'].includes(a.tagName)) {
      kbVisible.value = false
    }
  }, 80)
}

function hideKeyboard() {
  kbVisible.value = false
  document.activeElement?.blur()
}

onMounted(() => {
  window.addEventListener('focusin', onFocusIn)
  window.addEventListener('focusout', onFocusOut)
})
onUnmounted(() => {
  window.removeEventListener('focusin', onFocusIn)
  window.removeEventListener('focusout', onFocusOut)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; user-select: none; -webkit-user-select: none; }

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: #0a0a0a;
  color: #e5e7eb;
  width: 800px;
  height: 480px;
  overflow: hidden;
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
</style>

<style scoped>
.app {
  width: 800px;
  height: 480px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
