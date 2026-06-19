<template>
  <div class="search-view">
    <div class="search-bar">
      <input
        ref="inputEl"
        class="search-input"
        v-model="query"
        placeholder="Card name…"
        @keyup.enter="search"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
      />
      <button class="search-btn" @click="search">Search</button>
      <button v-if="query" class="clear-btn" @click="clear">✕</button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="state-msg">Searching…</div>

    <!-- Error -->
    <div v-else-if="error" class="state-msg error">{{ error }}</div>

    <!-- Card result -->
    <div v-else-if="card" class="result">
      <div class="card-image-wrap" @click="imageFullscreen = !imageFullscreen">
        <img
          v-if="cardImageUrl"
          class="card-image"
          :src="cardImageUrl"
          :alt="card.name"
        />
        <div v-else class="no-image">No image available</div>
      </div>

      <div class="card-info">
        <div class="card-name">{{ card.name }}</div>
        <div class="card-type">{{ card.type_line }}</div>
        <div v-if="card.mana_cost" class="card-mana">{{ card.mana_cost }}</div>
        <div class="card-text">{{ card.oracle_text }}</div>
        <div v-if="card.power" class="card-pt">{{ card.power }}/{{ card.toughness }}</div>
        <div v-if="card.loyalty" class="card-pt">Loyalty: {{ card.loyalty }}</div>
        <div v-if="rulings.length" class="rulings">
          <div class="rulings-header">Rulings</div>
          <div v-for="r in rulings" :key="r.published_at" class="ruling">
            <span class="ruling-date">{{ r.published_at }}</span>
            <span class="ruling-text">{{ r.comment }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- List results -->
    <div v-else-if="results.length" class="results-list">
      <button
        v-for="r in results" :key="r.id"
        class="result-item"
        @click="selectCard(r)"
      >
        <span class="result-name">{{ r.name }}</span>
        <span class="result-type">{{ r.type_line }}</span>
      </button>
    </div>

    <!-- Fullscreen image overlay -->
    <div v-if="imageFullscreen && cardImageUrl" class="fullscreen" @click="imageFullscreen = false">
      <img :src="cardImageUrl" class="fullscreen-img" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const query           = ref('')
const loading         = ref(false)
const error           = ref('')
const card            = ref(null)
const results         = ref([])
const rulings         = ref([])
const imageFullscreen = ref(false)
const inputEl         = ref(null)

const cardImageUrl = computed(() => {
  if (!card.value) return null
  return card.value.image_uris?.normal
    ?? card.value.card_faces?.[0]?.image_uris?.normal
    ?? null
})

async function search() {
  if (!query.value.trim()) return
  loading.value = true
  error.value   = ''
  card.value    = null
  results.value = []
  rulings.value = []

  try {
    // Try exact/fuzzy match first
    const resp = await fetch(
      `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(query.value)}`
    )
    if (resp.ok) {
      card.value = await resp.json()
      fetchRulings(card.value.rulings_uri)
    } else {
      // Fall back to full search
      const sresp = await fetch(
        `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query.value)}`
      )
      if (sresp.ok) {
        const data = await sresp.json()
        if (data.data?.length === 1) {
          card.value = data.data[0]
          fetchRulings(card.value.rulings_uri)
        } else {
          results.value = data.data?.slice(0, 20) ?? []
        }
      } else {
        error.value = 'Card not found.'
      }
    }
  } catch {
    error.value = 'Network error — check Wi-Fi.'
  } finally {
    loading.value = false
  }
}

async function fetchRulings(uri) {
  if (!uri) return
  try {
    const r = await fetch(uri)
    if (r.ok) {
      const data = await r.json()
      rulings.value = data.data?.slice(0, 5) ?? []
    }
  } catch {}
}

function selectCard(c) {
  card.value    = c
  results.value = []
  fetchRulings(c.rulings_uri)
}

function clear() {
  query.value   = ''
  card.value    = null
  results.value = []
  error.value   = ''
  rulings.value = []
  inputEl.value?.focus()
}
</script>

<style scoped>
.search-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  gap: 10px;
  overflow: hidden;
}

.search-bar {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  height: 44px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  color: #e5e7eb;
  font-size: 15px;
  padding: 0 14px;
  outline: none;
}

.search-input:focus { border-color: #c6a000; }

.search-btn {
  height: 44px;
  padding: 0 20px;
  background: #c6a000;
  border: none;
  border-radius: 8px;
  color: #000;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.clear-btn {
  height: 44px;
  width: 44px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  color: #888;
  font-size: 16px;
  cursor: pointer;
}

.state-msg {
  text-align: center;
  color: #666;
  font-size: 14px;
  padding: 40px 0;
}

.state-msg.error { color: #ef4444; }

.result {
  display: flex;
  gap: 12px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.card-image-wrap {
  flex-shrink: 0;
  cursor: zoom-in;
}

.card-image {
  width: 210px;
  border-radius: 10px;
  display: block;
}

.no-image {
  width: 210px;
  height: 293px;
  background: #1a1a1a;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #444;
  font-size: 12px;
}

.card-info {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-name { font-size: 18px; font-weight: 800; color: #e5e7eb; }
.card-type { font-size: 12px; color: #888; font-style: italic; }
.card-mana { font-size: 13px; color: #c6a000; font-weight: 600; }
.card-text { font-size: 12px; color: #ccc; line-height: 1.5; white-space: pre-wrap; }
.card-pt   { font-size: 14px; color: #e5e7eb; font-weight: 700; }

.rulings { margin-top: 8px; display: flex; flex-direction: column; gap: 6px; }
.rulings-header { font-size: 10px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.07em; }
.ruling { display: flex; flex-direction: column; gap: 2px; border-left: 2px solid #333; padding-left: 8px; }
.ruling-date { font-size: 10px; color: #555; }
.ruling-text { font-size: 11px; color: #aaa; line-height: 1.4; }

.results-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  color: #e5e7eb;
}

.result-name { font-size: 14px; font-weight: 600; }
.result-type { font-size: 11px; color: #666; font-style: italic; }

.fullscreen {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  cursor: zoom-out;
}

.fullscreen-img {
  max-width: 90%;
  max-height: 90%;
  border-radius: 14px;
}
</style>
