<script setup lang="ts">
import type { DecisionFieldDefinition } from "@/types/help";

const props = defineProps<{
  definition: DecisionFieldDefinition;
  value: number;
}>();

const emit = defineEmits<{
  update: [value: number];
}>();

const numberFormatter = new Intl.NumberFormat("zh-CN");

function nudge(delta: number) {
  emit("update", props.value + delta);
}
</script>

<template>
  <label class="panel-soft grid gap-3 px-4 py-3">
    <div class="flex items-start justify-between gap-3">
      <div>
        <span class="text-sm font-semibold text-slate-900">{{ definition.label }}</span>
        <p class="mt-1 text-xs leading-5 text-slate-500">{{ definition.helper }}</p>
      </div>
      <span class="guide-badge-subtle">步进 {{ numberFormatter.format(definition.step) }}</span>
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
        :step="definition.step"
        type="number"
        class="field-input"
        :aria-label="definition.label"
        @input="emit('update', Number(($event.target as HTMLInputElement).value))"
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
  </label>
</template>
