import HID from 'node-hid'

// ─── Device IDs ──────────────────────────────────────────────────────────────

const LOGITECH_VID = 0x046d

// USB receiver PIDs (Unifying + LIGHTSPEED family)
const LOGITECH_RECEIVER_PIDS = new Set([
  0xc52b, // Unifying
  0xc52f, // Unifying Mini
  0xc534, // Nano
  0xc539, // LIGHTSPEED
  0xc53a, // LIGHTSPEED (G Pro Wireless, G502 X, etc.)
  0xc53d, // LIGHTSPEED
  0xc541, // LIGHTSPEED
  0xc545, // LIGHTSPEED
  0xc547, // LIGHTSPEED
  0xc548, // LIGHTSPEED
  0xc550, // LIGHTSPEED Bolt
])

const STEELSERIES_VID = 0x1038

// Arctis 7-era (classic): send feature report [0x06, 0x18], battery at byte 3/4
const ARCTIS_CLASSIC_PIDS = new Set([
  0x1260, // Arctis 7 (2017)
  0x1294, // Arctis 7 (2019)
  0x12b3, // Arctis 1 Wireless
  0x12c2, // Arctis 9 Wireless
  0x22d0, // Arctis 7 (2022 Ed.)
  0x220e, // Arctis 7+ (2022)
])

// Arctis Nova era: write interrupt [0x00, 0xb0], battery at byte 3
const ARCTIS_NOVA_PIDS = new Set([
  0x2236, // Arctis Nova 7
  0x2202, // Arctis Nova Pro Wireless
  0x2206, // Arctis Nova Pro Wireless (Xbox)
])

// ─── Helpers ─────────────────────────────────────────────────────────────────

function findHid(vid, pidSet, usagePage) {
  return HID.devices().find(
    d => d.vendorId === vid && pidSet.has(d.productId) &&
         (usagePage == null || d.usagePage === usagePage)
  ) ?? null
}

// readSync with a per-call timeout; returns [] on timeout or error
function safeRead(device, ms = 150) {
  try {
    return device.readSync(ms) ?? []
  } catch {
    return []
  }
}

// ─── Logitech HID++ 2.0 ──────────────────────────────────────────────────────

const SW_ID = 0x01 // arbitrary software ID used to tag our requests

// Ask Root feature (0x0000) for the index of a given feature ID.
// Returns 0 if not found or device errored.
function hidppGetFeatureIndex(device, featureId) {
  // funcInfo = (funcNdx=0 << 4) | SW_ID
  const funcInfo = SW_ID
  device.write([0x10, 0x01, 0x00, funcInfo, (featureId >> 8) & 0xff, featureId & 0xff, 0x00])

  for (let i = 0; i < 5; i++) {
    const r = safeRead(device)
    if (!r.length) break
    if (r[0] === 0x8f) return 0 // error packet
    if (r[0] === 0x10 && r[1] === 0x01 && r[2] === 0x00 && r[3] === funcInfo) {
      return r[4] // feature index (0 = not supported)
    }
  }
  return 0
}

function logitechBattery() {
  // HID++ lives on the usage-page 0xff00 interface of the receiver
  const info = findHid(LOGITECH_VID, LOGITECH_RECEIVER_PIDS, 0xff00)
  if (!info) return null

  let dev
  try {
    dev = new HID.HID(info.path)

    // ── Try UNIFIED_BATTERY (0x1004) — modern mice ──
    let idx = hidppGetFeatureIndex(dev, 0x1004)
    if (idx > 0) {
      // getStatus = function 1 → funcInfo = (1 << 4) | SW_ID
      const funcInfo = (1 << 4) | SW_ID
      dev.write([0x10, 0x01, idx, funcInfo, 0x00, 0x00, 0x00])

      for (let i = 0; i < 5; i++) {
        const r = safeRead(dev)
        if (!r.length) break
        if (r[0] === 0x8f) break
        if (r[0] === 0x10 && r[1] === 0x01 && r[2] === idx && r[3] === funcInfo) {
          const level = r[4]
          if (level >= 0 && level <= 100) {
            return { name: info.product ?? 'Logitech Mouse', level }
          }
        }
      }
    }

    // ── Fallback: BATTERY_STATUS (0x1000) — older mice ──
    idx = hidppGetFeatureIndex(dev, 0x1000)
    if (idx > 0) {
      const funcInfo = SW_ID // function 0
      dev.write([0x10, 0x01, idx, funcInfo, 0x00, 0x00, 0x00])

      for (let i = 0; i < 5; i++) {
        const r = safeRead(dev)
        if (!r.length) break
        if (r[0] === 0x8f) break
        if (r[0] === 0x10 && r[1] === 0x01 && r[2] === idx && r[3] === funcInfo) {
          // discharge level 0–7, scale to 0–100
          return { name: info.product ?? 'Logitech Mouse', level: Math.round(r[4] / 7 * 100) }
        }
      }
    }
  } catch {
    // Device locked by G HUB or inaccessible
  } finally {
    try { dev?.close() } catch {}
  }
  return null
}

// ─── SteelSeries Arctis ───────────────────────────────────────────────────────

function steelseriesBattery() {
  // Vendor-specific HID interface is on usage page 0xffc0
  let info = findHid(STEELSERIES_VID, ARCTIS_NOVA_PIDS, 0xffc0)
  const isNova = !!info
  if (!info) info = findHid(STEELSERIES_VID, ARCTIS_CLASSIC_PIDS, 0xffc0)
  if (!info) return null

  const name = info.product ?? 'SteelSeries Headset'
  let dev
  try {
    dev = new HID.HID(info.path)

    if (isNova) {
      // Arctis Nova: interrupt write with command 0xb0
      const buf = new Array(65).fill(0x00)
      buf[1] = 0xb0
      dev.write(buf)
      for (let i = 0; i < 5; i++) {
        const r = safeRead(dev, 400)
        if (!r.length) break
        // response[1] echoes the command; battery is at [3]
        if (r[1] === 0xb0) {
          const level = r[3]
          if (level >= 0 && level <= 100) return { name, level }
        }
      }
    } else {
      // Arctis 7 / classic: feature report [0x06, 0x18]
      const buf = new Array(65).fill(0x00)
      buf[0] = 0x00 // report ID
      buf[1] = 0x06
      buf[2] = 0x18
      dev.sendFeatureReport(buf)
      for (let i = 0; i < 5; i++) {
        const r = safeRead(dev, 400)
        if (!r.length) break
        // byte 3 or 4 holds battery % (varies by whether report ID is prepended)
        const level = (r[4] >= 0 && r[4] <= 100) ? r[4] : (r[3] >= 0 && r[3] <= 100 ? r[3] : -1)
        if (level >= 0) return { name, level }
      }
    }
  } catch {
    // Device locked by SteelSeries GG or inaccessible
  } finally {
    try { dev?.close() } catch {}
  }
  return null
}

// ─── Cache + exports ──────────────────────────────────────────────────────────

let _cache = { mouse: null, headset: null }

export function getCachedPeripheralBattery() {
  return _cache
}

// Called by a 60-second setInterval in index.js.
// Uses readSync internally, so it briefly blocks the event loop.
export function refreshPeripheralBattery() {
  try {
    _cache = {
      mouse: logitechBattery(),
      headset: steelseriesBattery(),
    }
  } catch (err) {
    console.error('[devices] Battery refresh error:', err.message)
  }
}
