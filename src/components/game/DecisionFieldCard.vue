<script setup lang="ts">
import type { DecisionWorkbenchField } from "@/types/help";

const props = defineProps<{
  definition: DecisionWorkbenchField;
  value: number;
}>();

const emit = defineEmits<{
  update: [value: number];
}>();

const numberFormatter = new Intl.NumberFormat("zh-CN");

function clampValue(value: number) {
  return Math.min(props.definition.max, Math.max(props.definition.min, value));
}

function nudge(delta: number) {
  emit("update", clampValue(props.value + delta));
}

function setExactValue(value: number) {
  emit("update", clampValue(value));
}
</script>

<template>
  <div class="rounded-[24px] border border-slate-900/8 bg-white/86 px-4 py-4">
    <div class="grid gap-3">
      <div class="flex items-start justify-between gap-3">
        <div>
          <span class="text-sm font-semibold text-slate-900">{{ definition.label }}</span>
          <p class="mt-1 text-xs leading-5 text-slate-500">{{ definition.helper }}</p>
        </div>
        <span class="guide-badge-subtle">步进 {{ numberFormatter.format(definition.step) }}</span>
      </div>

      <div class="flex flex-wrap gap-2">
        <span class="guide-badge-subtle">{{ definition.baseline }}</span>
        <span class="guide-badge-subtle">{{ definition.limitHint }}</span>
      </div>

      <div class="grid gap-2 sm:grid-cols-3">
        <button
          v-for="option in definition.quickOptions"
          :key="option.label"
          type="button"
          class="rounded-2xl border border-slate-900/8 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--control-navy)]/18 hover:text-[var(--control-navy)]"
          @click="setExactValue(option.value)"
        >
          {{ option.label }}
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="stepper-button"
          :aria-label="`减少${definition.label}`"
          @click="nudge(-definition.step)"
        >
          -
        </button>
        <input
          :value="value"
          :max="definition.max"
          :min="definition.min"
          :step="definition.step"
          type="number"
          class="field-input"
          :aria-label="definition.label"
          @input="setExactValue(Number(($event.target as HTMLInputElement).value))"
        />
        <button
          type="button"
          class="stepper-button"
          :aria-label="`增加${definition.label}`"
          @click="nudge(definition.step)"
        >
          +
        </button>
      </div>
    </div>
  </div>
</template>
