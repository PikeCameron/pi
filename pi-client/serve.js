import { createServer } from 'http'
import { readFile } from 'fs/promises'
import { extname, join } from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'

const DIST = join(fileURLToPath(new URL('.', import.meta.url)), 'dist')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
}

createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/shutdown') {
    res.writeHead(200)
    res.end()
    setTimeout(() => exec('pkill chromium; pkill chromium-browser'), 200)
    return
  }

  const filePath = join(DIST, req.url === '/' ? 'index.html' : req.url)
  try {
    const data = await readFile(filePath)
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream' })
    res.end(data)
  } catch {
    const html = await readFile(join(DIST, 'index.html'))
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(html)
  }
}).listen(8080, () => console.log('MTG app: http://localhost:8080'))
