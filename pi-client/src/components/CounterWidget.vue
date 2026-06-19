<template>
  <div class="widget" :class="{ danger }">
    <span class="label">{{ label }}</span>
    <div class="controls">
      <button class="adj" @click="$emit('dec')">−</button>
      <span class="value">{{ value }}</span>
      <button class="adj" @click="$emit('inc')">+</button>
    </div>
    <span v-if="danger" class="danger-label">{{ dangerLabel }}</span>
  </div>
</template>

<script setup>
defineProps({
  label:       String,
  value:       Number,
  danger:      Boolean,
  dangerLabel: String,
})
defineEmits(['inc', 'dec'])
</script>

<style scoped>
.widget {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  min-width: 90px;
  transition: border-color 0.2s;
}

.widget.danger { border-color: #ef4444; }

.label {
  font-size: 10px;
  font-weight: 700;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.adj {
  width: 36px;
  height: 36px;
  background: #222;
  border: 1px solid #333;
  border-radius: 8px;
  color: #e5e7eb;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  line-height: 1;
  -webkit-tap-highlight-color: transparent;
}

.adj:active { background: #2a2a2a; }

.value {
  font-size: 28px;
  font-weight: 800;
  color: #e5e7eb;
  min-width: 40px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.widget.danger .value { color: #ef4444; }

.danger-label {
  font-size: 9px;
  color: #ef4444;
  font-weight: 600;
}
</style>
