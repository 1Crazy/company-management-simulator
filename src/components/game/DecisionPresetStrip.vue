<script setup lang="ts">
import type { DecisionPreset } from "@/types/help";

defineProps<{
  presets: DecisionPreset[];
}>();

defineEmits<{
  applyPreset: [presetId: string];
}>();

function presetClass(tone: DecisionPreset["tone"]) {
  if (tone === "warning") return "border-[rgba(143,111,56,0.16)] bg-[linear-gradient(180deg,rgba(255,249,235,0.94),rgba(247,238,214,0.86))]";
  if (tone === "success") return "border-[rgba(63,110,106,0.16)] bg-[linear-gradient(180deg,rgba(239,250,247,0.94),rgba(226,242,237,0.86))]";
  return "border-[rgba(31,63,102,0.16)] bg-[linear-gradient(180deg,rgba(241,247,253,0.96),rgba(226,236,247,0.9))]";
}
</script>

<template>
  <section class="grid gap-3">
    <div class="flex items-center justify-between gap-3">
      <div>
        <div class="text-xs font-bold tracking-[0.12em] text-slate-500">策略模板</div>
        <h3 class="mt-1 text-lg font-semibold text-slate-900">先定打法，再做微调</h3>
      </div>
      <span class="guide-badge-subtle">一键起稿</span>
    </div>

    <div class="grid gap-3 lg:grid-cols-3">
      <button
        v-for="item in presets"
        :key="item.id"
        class="rounded-[24px] border px-4 py-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(24,45,74,0.08)]"
        :class="presetClass(item.tone)"
        @click="$emit('applyPreset', item.id)"
      >
        <div class="flex items-center justify-between gap-3">
          <h4 class="text-base font-semibold text-slate-900">{{ item.title }}</h4>
          <span class="guide-badge-subtle">{{ item.id }}</span>
        </div>
        <p class="mt-3 text-sm leading-6 text-slate-600">{{ item.summary }}</p>
        <p class="mt-3 text-xs leading-5 text-slate-500">{{ item.caution }}</p>
      </button>
    </div>
  </section>
</template>
