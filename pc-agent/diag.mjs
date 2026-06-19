import HID from 'node-hid'

function hex(n, pad = 2) { return '0x' + n.toString(16).padStart(pad, '0') }
function bytes(arr) { return Array.from(arr).slice(0, 16).map(b => hex(b)).join(' ') }

function safeRead(dev, ms = 300) {
  try { return dev.readSync(ms) ?? [] } catch { return [] }
}

// ── Logitech: try all ff00 interfaces ────────────────────────────────────────
console.log('\n=== LOGITECH HID++ probe ===')
const logiInterfaces = HID.devices().filter(d => d.vendorId === 0x046d && d.productId === 0xc539 && d.usagePage === 0xff00)
for (const info of logiInterfaces) {
  console.log(`\n  Interface usage:${hex(info.usage)}  path: ${info.path}`)
  let dev
  try {
    dev = new HID.HID(info.path)
    // HID++ root feature (0x0000) getFeature(0x1004 = UNIFIED_BATTERY), swId=1
    const req = [0x10, 0x01, 0x00, 0x01, 0x10, 0x04, 0x00]
    dev.write(req)
    console.log(`    wrote: ${bytes(req)}`)
    for (let i = 0; i < 5; i++) {
      const r = safeRead(dev)
      if (!r.length) { console.log('    read: (timeout)'); break }
      console.log(`    read: ${bytes(r)}`)
    }
  } catch (e) {
    console.log(`    ERROR: ${e.message}`)
  } finally {
    try { dev?.close() } catch {}
  }
}

// ── SteelSeries: probe the ffc0 interface ────────────────────────────────────
console.log('\n=== STEELSERIES 0x220e probe ===')
const ssInterfaces = HID.devices().filter(d => d.vendorId === 0x1038 && d.productId === 0x220e)
for (const info of ssInterfaces) {
  console.log(`\n  Interface usagePage:${hex(info.usagePage, 4)} usage:${hex(info.usage)}`)
  if (info.usagePage !== 0xffc0) { console.log('  (skipping — not ffc0)'); continue }
  let dev
  try {
    dev = new HID.HID(info.path)

    // Try 1: classic Arctis feature report [0x06, 0x18]
    const feat = new Array(64).fill(0x00)
    feat[0] = 0x00; feat[1] = 0x06; feat[2] = 0x18
    console.log('  sendFeatureReport:', bytes(feat))
    try {
      dev.sendFeatureReport(feat)
      for (let i = 0; i < 3; i++) {
        const r = safeRead(dev, 400)
        if (!r.length) { console.log('    read: (timeout)'); break }
        console.log(`    read[${i}]: ${bytes(r)}`)
      }
    } catch (e) { console.log('  sendFeatureReport ERROR:', e.message) }

    // Try 2: interrupt write [0x00, 0x06, 0x18]
    const wr = new Array(65).fill(0x00)
    wr[0] = 0x00; wr[1] = 0x06; wr[2] = 0x18
    console.log('  write:', bytes(wr))
    try {
      dev.write(wr)
      for (let i = 0; i < 3; i++) {
        const r = safeRead(dev, 400)
        if (!r.length) { console.log('    read: (timeout)'); break }
        console.log(`    read[${i}]: ${bytes(r)}`)
      }
    } catch (e) { console.log('  write ERROR:', e.message) }

  } catch (e) {
    console.log(`  OPEN ERROR: ${e.message}`)
  } finally {
    try { dev?.close() } catch {}
  }
}
