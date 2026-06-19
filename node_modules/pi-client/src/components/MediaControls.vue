<template>
  <div class="media-controls">
    <div class="playback">
      <button class="ctrl-btn" @click="send('media_prev')" title="Previous">&#9664;&#9664;</button>
      <button class="ctrl-btn play" @click="send('media_play_pause')" title="Play / Pause">&#9654;&#10074;&#10074;</button>
      <button class="ctrl-btn" @click="send('media_next')" title="Next">&#9654;&#9654;</button>
    </div>
    <div class="volume">
      <button class="ctrl-btn sm" @click="send('volume_mute')" title="Mute">&#128263;</button>
      <button class="ctrl-btn sm" @click="send('volume_down')" title="Volume Down">&#128264;</button>
      <button class="ctrl-btn sm" @click="send('volume_up')" title="Volume Up">&#128266;</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  sendCommand: {
    type: Function,
    required: true,
  },
})

function send(action) {
  props.sendCommand(action)
}
</script>

<style scoped>
.media-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  height: 100%;
  padding: 0 16px;
}

.playback,
.volume {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ctrl-btn {
  background: #1e2939;
  border: 1px solid #2d3748;
  color: #e2e8f0;
  border-radius: 12px;
  width: 72px;
  height: 72px;
  font-size: 20px;
  cursor: pointer;
  transition: background 0.1s, transform 0.08s;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.ctrl-btn:active {
  background: #2d3f55;
  transform: scale(0.93);
}

.ctrl-btn.play {
  width: 88px;
  height: 88px;
  font-size: 24px;
  background: #1d4ed8;
  border-color: #2563eb;
}

.ctrl-btn.play:active {
  background: #2563eb;
}

.ctrl-btn.sm {
  width: 60px;
  height: 60px;
  font-size: 18px;
}
</style>
