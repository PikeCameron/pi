import { execSync } from 'child_process'

function ps(script) {
  execSync(`powershell -NoProfile -NonInteractive -Command "${script}"`, {
    stdio: 'ignore',
  })
}

function sendMediaKey(keyCode) {
  ps(
    `$wshell = New-Object -ComObject WScript.Shell; $wshell.SendKeys([char]${keyCode})`
  )
}

const MEDIA_PLAY_PAUSE = 179
const MEDIA_NEXT = 176
const MEDIA_PREV = 177
const VOLUME_MUTE = 173
const VOLUME_DOWN = 174
const VOLUME_UP = 175

const handlers = {
  media_play_pause: () => sendMediaKey(MEDIA_PLAY_PAUSE),
  media_next: () => sendMediaKey(MEDIA_NEXT),
  media_prev: () => sendMediaKey(MEDIA_PREV),
  volume_mute: () => sendMediaKey(VOLUME_MUTE),
  volume_down: () => sendMediaKey(VOLUME_DOWN),
  volume_up: () => sendMediaKey(VOLUME_UP),
}

export function handleControl(action) {
  const fn = handlers[action]
  if (!fn) {
    console.warn(`Unknown control action: ${action}`)
    return
  }
  try {
    fn()
  } catch (err) {
    console.error(`Control action "${action}" failed:`, err.message)
  }
}
