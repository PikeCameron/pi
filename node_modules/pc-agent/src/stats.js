import si from 'systeminformation'
import { getCachedPeripheralBattery } from './devices.js'

const HISTORY_LENGTH = 60

const networkHistory = { rx: [], tx: [] }

async function getNetworkInterface() {
  const defaultNet = await si.networkInterfaceDefault()
  return defaultNet
}

let _netIface = null

export async function collectStats() {
  if (!_netIface) {
    _netIface = await getNetworkInterface()
  }

  const [cpu, cpuTemp, mem, graphics, netStats, diskIO] = await Promise.all([
    si.currentLoad(),
    si.cpuTemperature(),
    si.mem(),
    si.graphics(),
    si.networkStats(_netIface),
    si.disksIO(),
  ])

  const rxSec = netStats[0]?.rx_sec ?? 0
  const txSec = netStats[0]?.tx_sec ?? 0

  networkHistory.rx.push(Math.round(rxSec / 1024))
  networkHistory.tx.push(Math.round(txSec / 1024))
  if (networkHistory.rx.length > HISTORY_LENGTH) networkHistory.rx.shift()
  if (networkHistory.tx.length > HISTORY_LENGTH) networkHistory.tx.shift()

  const gpu = graphics.controllers[0]
  const ramUsedGB = (mem.active / 1073741824).toFixed(1)
  const ramTotalGB = (mem.total / 1073741824).toFixed(1)

  return {
    type: 'stats',
    cpu: {
      load: Math.round(cpu.currentLoad),
      temp: Math.round(cpuTemp.main ?? cpuTemp.cores?.[0] ?? 0),
    },
    ram: {
      used: parseFloat(ramUsedGB),
      total: parseFloat(ramTotalGB),
      percent: Math.round((mem.active / mem.total) * 100),
    },
    gpu: gpu
      ? {
          load: Math.round(gpu.utilizationGpu ?? 0),
          temp: Math.round(gpu.temperatureGpu ?? 0),
          vram: {
            used: parseFloat((( gpu.memoryUsed ?? 0) / 1024).toFixed(1)),
            total: parseFloat(((gpu.memoryTotal ?? 0) / 1024).toFixed(1)),
          },
          name: gpu.model ?? 'GPU',
        }
      : null,
    network: {
      rx: Math.round(rxSec / 1024),
      tx: Math.round(txSec / 1024),
      rxHistory: [...networkHistory.rx],
      txHistory: [...networkHistory.tx],
    },
    disk: {
      read: Math.round(((diskIO?.rIO_sec) ?? 0) / 1024),
      write: Math.round(((diskIO?.wIO_sec) ?? 0) / 1024),
    },
    peripherals: getCachedPeripheralBattery(),
  }
}
