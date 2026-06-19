<template>
  <div class="overlay" @click.self="$emit('cancel')">
    <div class="dialog">
      <p class="message">{{ message }}</p>
      <div class="actions">
        <button class="btn cancel" @click="$emit('cancel')">Cancel</button>
        <button class="btn confirm" @click="$emit('confirm')">{{ confirmLabel }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message:      { type: String, required: true },
  confirmLabel: { type: String, default: 'Confirm' },
})
defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.dialog {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 14px;
  padding: 28px 32px 22px;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.message {
  font-size: 16px;
  font-weight: 600;
  color: #e5e7eb;
  text-align: center;
  line-height: 1.4;
}

.actions {
  display: flex;
  gap: 12px;
}

.btn {
  flex: 1;
  height: 44px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  border: none;
}

.btn.cancel {
  background: #2a2a2a;
  color: #888;
  border: 1px solid #333;
}

.btn.confirm {
  background: #c6a000;
  color: #000;
}
</style>
