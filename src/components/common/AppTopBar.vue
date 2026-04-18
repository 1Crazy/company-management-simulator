<script setup lang="ts">
import type { PreviewSummary, ScreenMode, SessionSnapshot } from "@/types/app";
import { formatDateTime } from "@/ui/formatters";

defineProps<{
  autoSaveStamp?: string;
  canAdvance: boolean;
  currentDifficultyLabel: string;
  currentScenarioTitle: string;
  helpOpen: boolean;
  preview: PreviewSummary | null;
  screen: ScreenMode;
  session: SessionSnapshot | null;
}>();

defineEmits<{
  advanceTurn: [];
  openHelp: [];
  quickSave: [];
}>();

function riskClass(riskLevel: PreviewSummary["riskLevel"] | undefined) {
  if (riskLevel === "stable") return "status-pill-success";
  if (riskLevel === "medium") return "status-pill-warning";
  return "status-pill-danger";
}

function riskLabel(riskLevel: PreviewSummary["riskLevel"] | undefined) {
  if (riskLevel === "stable") return "方案稳定";
  if (riskLevel === "medium") return "需要复核";
  return "高风险";
}
</script>

<template>
  <header class="panel-surface panel-glow sticky top-3 z-40 mb-4 px-5 py-4">
    <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div class="flex flex-col gap-2">
        <span class="text-xs font-bold uppercase tracking-[0.12em] text-[var(--control-navy)]">Simulation Control Room</span>
        <strong class="text-base text-slate-900 md:text-lg">
          {{ screen === "game" && session ? session.state.companyName : "Company Management Simulator" }}
        </strong>
        <span class="text-sm text-slate-600">
          {{
            screen === "game" && session
              ? `${currentScenarioTitle} / ${currentDifficultyLabel}`
              : "Vue 3 + TypeScript + TailwindCSS / 纯前端逻辑驱动 / 本地存档。"
          }}
        </span>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <template v-if="screen === 'game' && session">
          <span class="status-pill status-pill-neutral">第 {{ session.state.turn + 1 }} / {{ session.state.maxTurns }} 期</span>
          <span v-if="preview" class="status-pill" :class="riskClass(preview.riskLevel)">{{ riskLabel(preview.riskLevel) }}</span>
          <span class="status-pill status-pill-neutral">自动存档 {{ formatDateTime(autoSaveStamp) }}</span>
        </template>
        <span v-else class="status-pill status-pill-neutral">上手建议：先从“稳健经营”开始</span>
      </div>

      <div class="flex flex-wrap gap-2">
        <button class="button-secondary" :aria-pressed="helpOpen" @click="$emit('openHelp')">玩法帮助</button>

        <template v-if="screen === 'game' && session">
          <button class="button-secondary" @click="$emit('quickSave')">快速保存 A</button>
          <button class="button-primary" :disabled="!canAdvance" @click="$emit('advanceTurn')">结算本期</button>
        </template>
      </div>
    </div>
  </header>
</template>
