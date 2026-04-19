<script setup lang="ts">
import { computed } from "vue";
import { getDifficulty, getScenario } from "@/simulation/scenarios";
import type { DraftPlan, PreviewSummary, SessionSnapshot } from "@/types/app";
import type { DecisionPreset } from "@/types/help";
import { buildDecisionWorkbenchGroups } from "@/ui/playbook";
import DecisionGroupSection from "./DecisionGroupSection.vue";
import DecisionPresetStrip from "./DecisionPresetStrip.vue";
import DecisionSummaryPanel from "./DecisionSummaryPanel.vue";

const props = defineProps<{
  presets: DecisionPreset[];
  preview: PreviewSummary;
  session: SessionSnapshot;
}>();

defineEmits<{
  applyPreset: [presetId: string];
  advanceTurn: [];
  openRestart: [];
  updateField: [field: keyof DraftPlan, value: number];
}>();

const workbenchGroups = computed(() => buildDecisionWorkbenchGroups(props.session.state));
</script>

<template>
  <article class="panel-surface panel-glow overflow-hidden px-5 py-5">
    <div class="flex flex-col gap-3 border-b border-slate-900/8 pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        <div class="text-xs font-bold tracking-[0.12em] text-[var(--control-navy)]">经营操盘台</div>
        <h2 class="mono-title mt-2 text-2xl text-[var(--control-navy)]">本回合经营方案</h2>
        <p class="mt-2 text-sm leading-6 text-slate-600">
          第 {{ session.state.turn + 1 }} / {{ session.state.maxTurns }} 期，{{ getScenario(session.state.scenarioId).title }} /
          {{ getDifficulty(session.state.difficultyId).label }}。
        </p>
      </div>
      <span class="guide-badge-subtle">字段说明已收进帮助面板，这里只保留高频操作</span>
    </div>

    <div class="mt-5 grid gap-4">
      <DecisionPresetStrip :presets="presets" @apply-preset="$emit('applyPreset', $event)" />

      <DecisionSummaryPanel :preview="preview" :session="session" @advance-turn="$emit('advanceTurn')" @open-restart="$emit('openRestart')" />

      <section class="grid gap-4 xl:grid-cols-2">
        <DecisionGroupSection
          v-for="group in workbenchGroups"
          :key="group.id"
          :group="group"
          :values="session.draftPlan"
          @update-field="(field, value) => $emit('updateField', field, value)"
        />
      </section>
    </div>
  </article>
</template>
