<template>
  <div class="peripheral-section">
    <PeripheralDevice
      v-if="peripherals?.mouse"
      icon="🖱️"
      :name="peripherals.mouse.name"
      :level="peripherals.mouse.level"
    />
    <div v-else class="no-device">
      <span class="icon">🖱️</span>
      <span class="label">Mouse not detected</span>
    </div>

    <div class="divider" />

    <PeripheralDevice
      v-if="peripherals?.headset"
      icon="🎧"
      :name="peripherals.headset.name"
      :level="peripherals.headset.level"
    />
    <div v-else class="no-device">
      <span class="icon">🎧</span>
      <span class="label">Headset not detected</span>
    </div>
  </div>
</template>

<script setup>
import PeripheralDevice from './PeripheralDevice.vue'

defineProps({
  peripherals: Object,
})
</script>

<style scoped>
.peripheral-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  height: 100%;
  padding: 0 24px;
}

.divider {
  width: 1px;
  height: 60px;
  background: #21262d;
  margin: 0 40px;
  flex-shrink: 0;
}

.no-device {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 280px;
  opacity: 0.35;
}

.icon { font-size: 28px; }
.label { font-size: 12px; color: #8b949e; }
</style>
