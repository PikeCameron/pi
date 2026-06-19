<template>
  <div class="net-card">
    <div class="header">
      <span class="label">NETWORK</span>
    </div>
    <div class="sparklines">
      <div class="spark-row">
        <span class="dir rx">↓</span>
        <Line :data="rxChartData" :options="chartOptions" class="chart" />
        <span class="val">{{ network?.rx ?? 0 }} KB/s</span>
      </div>
      <div class="spark-row">
        <span class="dir tx">↑</span>
        <Line :data="txChartData" :options="chartOptions" class="chart" />
        <span class="val">{{ network?.tx ?? 0 }} KB/s</span>
      </div>
    </div>
    <div class="disk-row">
      <span class="disk-label">Disk</span>
      <span class="disk-val">R: {{ disk?.read ?? 0 }} KB/s</span>
      <span class="disk-val">W: {{ disk?.write ?? 0 }} KB/s</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
} from 'chart.js'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler)

const props = defineProps({
  network: Object,
  disk: Object,
})

const EMPTY = Array(60).fill(0)

const rxChartData = computed(() => ({
  labels: EMPTY.map((_, i) => i),
  datasets: [
    {
      data: props.network?.rxHistory ?? EMPTY,
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34,197,94,0.15)',
      fill: true,
      tension: 0.3,
      pointRadius: 0,
      borderWidth: 1.5,
    },
  ],
}))

const txChartData = computed(() => ({
  labels: EMPTY.map((_, i) => i),
  datasets: [
    {
      data: props.network?.txHistory ?? EMPTY,
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245,158,11,0.15)',
      fill: true,
      tension: 0.3,
      pointRadius: 0,
      borderWidth: 1.5,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  scales: {
    x: { display: false },
    y: { display: false, min: 0 },
  },
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
}
</script>

<style scoped>
.net-card {
  background: #161b22;
  border: 1px solid #21262d;
  border-radius: 12px;
  padding: 10px 8px 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header {
  display: flex;
}

.label {
  font-size: 12px;
  font-weight: 600;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sparklines {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.spark-row {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 48px;
}

.dir {
  font-size: 14px;
  font-weight: 700;
  width: 14px;
  flex-shrink: 0;
}

.rx { color: #22c55e; }
.tx { color: #f59e0b; }

.chart {
  flex: 1;
  height: 100%;
}

.val {
  font-size: 10px;
  color: #6e7681;
  width: 56px;
  text-align: right;
  flex-shrink: 0;
}

.disk-row {
  display: flex;
  gap: 8px;
  font-size: 10px;
  color: #6e7681;
  border-top: 1px solid #21262d;
  padding-top: 6px;
}

.disk-label {
  color: #8b949e;
  font-weight: 600;
}
</style>
