import 'dotenv/config'
import http from 'http'
import { refreshPeripheralBattery } from './devices.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { WebSocketServer } from 'ws'
import { collectStats } from './stats.js'
import { handleControl } from './controls.js'

const PORT = parseInt(process.env.PORT ?? '3000', 10)
const STATS_INTERVAL_MS = 1000

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST_DIR = path.resolve(__dirname, '../../pi-client/dist')

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
}

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0]
  let filePath = path.join(DIST_DIR, urlPath === '/' ? 'index.html' : urlPath)

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      // SPA fallback
      filePath = path.join(DIST_DIR, 'index.html')
    }
    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(404)
        res.end('Not found')
        return
      }
      const ext = path.extname(filePath)
      res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' })
      res.end(data)
    })
  })
})

// noServer: true so ws doesn't intercept plain HTTP requests
const wss = new WebSocketServer({ noServer: true })

server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req)
  })
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[pc-agent] Listening on http://0.0.0.0:${PORT}`)
  console.log(`[pc-agent] Open http://<your-pc-ip>:${PORT} on the Pi`)
})

wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress
  console.log(`[pc-agent] Client connected: ${ip}`)

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString())
      if (msg.type === 'control' && msg.action) {
        console.log(`[pc-agent] Control: ${msg.action}`)
        handleControl(msg.action)
      }
    } catch {
      console.warn('[pc-agent] Received non-JSON message, ignoring')
    }
  })

  ws.on('close', () => {
    console.log(`[pc-agent] Client disconnected: ${ip}`)
  })
})

function broadcast(data) {
  const payload = JSON.stringify(data)
  for (const client of wss.clients) {
    if (client.readyState === 1) {
      client.send(payload)
    }
  }
}

async function tick() {
  try {
    const stats = await collectStats()
    broadcast(stats)
  } catch (err) {
    console.error('[pc-agent] Stats collection error:', err.message)
  }
}

setInterval(tick, STATS_INTERVAL_MS)
tick()

// Battery reads are slow (HID), so refresh separately and cache the result
const BATTERY_INTERVAL_MS = 60_000
refreshPeripheralBattery()
setInterval(refreshPeripheralBattery, BATTERY_INTERVAL_MS)
