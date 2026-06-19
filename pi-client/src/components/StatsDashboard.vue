<template>
  <div class="stats-dashboard">
    <StatCard label="CPU" :percent="stats?.cpu?.load ?? 0" :temp="stats?.cpu?.temp" color="#3b82f6" />
    <StatCard
      label="RAM"
      :percent="stats?.ram?.percent ?? 0"
      :detail="`${stats?.ram?.used ?? 0} / ${stats?.ram?.total ?? 0} GB`"
      color="#8b5cf6"
    />
    <StatCard
      v-if="stats?.gpu"
      :label="gpuLabel"
      :percent="stats.gpu.load"
      :temp="stats.gpu.temp"
      :detail="`${stats.gpu.vram.used} / ${stats.gpu.vram.total} GB`"
      color="#10b981"
    />
    <NetworkCard :network="stats?.network" :disk="stats?.disk" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import StatCard from './StatCard.vue'
import NetworkCard from './NetworkCard.vue'

const props = defineProps({
  stats: Object,
})

const gpuLabel = computed(() => {
  const name = props.stats?.gpu?.name ?? 'GPU'
  return name.replace(/nvidia\s*/i, '').replace(/amd\s*/i, '').slice(0, 12)
})
</script>

<style scoped>
.stats-dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 10px;
  height: 100%;
}
</style>
