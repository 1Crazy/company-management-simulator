<script setup lang="ts">
import type { ModalState } from "@/types/app";

defineProps<{
  modal: ModalState | null;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();
</script>

<template>
  <div
    v-if="modal"
    class="fixed inset-0 z-[160] grid place-items-center bg-slate-950/28 px-4 backdrop-blur-md"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <div class="panel-surface panel-glow w-full max-w-[520px] px-6 py-6">
      <h2 id="modal-title" class="mono-title text-2xl text-[var(--control-navy)]">{{ modal.title }}</h2>
      <p class="mt-3 text-sm leading-7 text-slate-600">{{ modal.body }}</p>
      <div class="mt-5 flex flex-wrap gap-2">
        <button class="button-primary" @click="emit('confirm')">确认</button>
        <button class="button-secondary" @click="$emit('close')">取消</button>
      </div>
    </div>
  </div>
</template>
