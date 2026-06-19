import { ref, readonly, onUnmounted } from 'vue'

// In production pc-agent serves this page, so derive the WS URL from the
// page host — works regardless of IP address changes.
// In dev the Vite server runs on a different port, so fall back to env var.
function resolveWsUrl() {
  if (import.meta.env.PROD) {
    const { hostname, port } = window.location
    return `ws://${hostname}:${port || 3000}`
  }
  return import.meta.env.VITE_PC_WS_URL ?? 'ws://localhost:3000'
}

const WS_URL = resolveWsUrl()
const MIN_RETRY_MS = 1000
const MAX_RETRY_MS = 30000

export function useWebSocket() {
  const stats = ref(null)
  const connected = ref(false)

  let ws = null
  let retryDelay = MIN_RETRY_MS
  let retryTimer = null
  let destroyed = false

  function connect() {
    if (destroyed) return
    ws = new WebSocket(WS_URL)

    ws.onopen = () => {
      connected.value = true
      retryDelay = MIN_RETRY_MS
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.type === 'stats') {
          stats.value = msg
        }
      } catch {
        // ignore malformed messages
      }
    }

    ws.onclose = () => {
      connected.value = false
      scheduleRetry()
    }

    ws.onerror = () => {
      ws.close()
    }
  }

  function scheduleRetry() {
    if (destroyed) return
    retryTimer = setTimeout(() => {
      connect()
      retryDelay = Math.min(retryDelay * 2, MAX_RETRY_MS)
    }, retryDelay)
  }

  function sendCommand(action) {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'control', action }))
    }
  }

  connect()

  onUnmounted(() => {
    destroyed = true
    clearTimeout(retryTimer)
    ws?.close()
  })

  return {
    stats: readonly(stats),
    connected: readonly(connected),
    sendCommand,
  }
}
