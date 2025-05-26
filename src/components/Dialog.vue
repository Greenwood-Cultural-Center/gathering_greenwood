<script lang="ts" setup>
import {
  ref,
  watch,
  onBeforeUnmount,
  defineExpose,
} from 'vue'

const props = defineProps({
  showBackdrop: { type: Boolean, default: true },
  closeOnBackdropClick: { type: Boolean, default: true },
  closeOnEscape: { type: Boolean, default: true },
  showCloseButton: { type: Boolean, default: true },
  titleId: String,
  dialogClass: String,
  backdropClass: String,
  closeButtonClass: String,
  enterActiveClass: { type: String, default: 'fade-enter-active' },
  leaveActiveClass: { type: String, default: 'fade-leave-active' },
  transitionDuration: { type: Number, default: 300 },
} as const);

const dialogEl = ref<HTMLDialogElement | null>(null)
const isVisible = ref<boolean>(false)

// Define the emits for the component
const emit = defineEmits(['open', 'close']);

function openDialog(): void {
  isVisible.value = true;
}

function closeDialog(): void {
  isVisible.value = false;
}

function handleBackdropClick(event: MouseEvent): void {
  if (event.target === event.currentTarget && props.closeOnBackdropClick) {
    closeDialog()
  }
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && props.closeOnEscape) {
    closeDialog()
  }
}

watch(isVisible, (visible) => {
  if (visible) {
    window.addEventListener('keydown', handleKeydown)
  } else {
    window.removeEventListener('keydown', handleKeydown)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

defineExpose<{
  openDialog: () => void
  closeDialog: () => void
}>({
  openDialog,
  closeDialog,
})
</script>

<template>
  <transition :enter-active-class="enterActiveClass" @after-enter="$emit('open')" :leave-active-class="leaveActiveClass" @after-leave="$emit('close')">
    <div v-show="isVisible && showBackdrop" :class="['backdrop',backdropClass]" @pointerup="handleBackdropClick" role="presentation" :style="{ '--transition-duration': transitionDuration + 'ms' }">
      <dialog ref="dialogEl" open :class="['dialog', dialogClass]" role="dialog" @click.stop @touchend.stop aria-modal="true" :aria-describedby="titleId">
        <div role="document">
          <button v-if="showCloseButton" :class="['close-button', closeButtonClass]" @pointerup="closeDialog" aria-label="Close the modal">×</button>
          <slot />
        </div>
      </dialog>
    </div>
  </transition>
</template>

<style scoped>
:root {
  --transition-duration: 300ms;
}

.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  /* Animate backdrop */
  transition: background-color var(--transition-duration) ease;
}

/* Dialog base */
.dialog {
  position: relative;
  background: white;
  border: none;
  border-radius: 8px;
  padding: 1.5rem;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  transition: transform var(--transition-duration) ease,
    opacity var(--transition-duration) ease;
  opacity: 1;
}

.dialog div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* Close button */
.close-button {
  position: absolute;
  top: 8px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  user-select: none;
}

/* Default transition classes */
.fade-enter-active {
  animation: fadeIn var(--transition-duration) ease forwards;
}

.fade-leave-active {
  animation: fadeOut var(--transition-duration) ease forwards;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}
</style>