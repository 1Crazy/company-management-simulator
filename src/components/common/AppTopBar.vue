<script setup lang="ts">
import type { PreviewSummary, ScreenMode, SessionSnapshot } from "@/types/app";
import { formatDateTime } from "@/ui/formatters";

const props = defineProps<{
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

function topBarEyebrow(screen: ScreenMode) {
  return screen === "game" ? "经营指挥席" : "董事会开局席";
}

function topBarTitle(screen: ScreenMode, session: SessionSnapshot | null) {
  if (screen === "game" && session) {
    return session.state.companyName;
  }

  return "公司经营沙盘";
}

function topBarSubtitle(screen: ScreenMode, session: SessionSnapshot | null) {
  if (screen === "game" && session) {
    return `${props.currentScenarioTitle} / ${props.currentDifficultyLabel}`;
  }

  return "选择剧本、命名公司，然后进入这局年度经营。";
}
</script>

<template>
  <header class="panel-surface panel-glow sticky top-3 z-40 mb-4 overflow-hidden px-5 py-4">
    <div class="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(90deg,rgba(226,194,122,0.18),rgba(93,134,181,0.12)_34%,transparent_55%,rgba(31,63,102,0.1))]"></div>
    <div class="pointer-events-none absolute right-[-36px] top-[-36px] h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(31,63,102,0.12),transparent_66%)]"></div>

    <div class="relative flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-5">
        <div class="flex items-center gap-4">
          <div class="flex h-14 w-14 items-center justify-center rounded-[18px] border border-[rgba(226,194,122,0.34)] bg-[linear-gradient(180deg,rgba(226,194,122,0.96),rgba(94,132,175,0.98)_22%,rgba(39,74,114,0.98)_72%,rgba(24,53,85,0.98))] shadow-[0_10px_22px_rgba(22,46,77,0.18)]">
            <span class="mono-title text-2xl text-white">{{ screen === "game" ? "营" : "局" }}</span>
          </div>

          <div class="flex flex-col gap-1">
            <span class="section-kicker">{{ topBarEyebrow(screen) }}</span>
            <strong class="text-lg text-[var(--control-ink)] md:text-xl">{{ topBarTitle(screen, session) }}</strong>
            <span class="max-w-2xl text-sm text-stone-700">{{ topBarSubtitle(screen, session) }}</span>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <template v-if="screen === 'game' && session">
            <span class="status-pill status-pill-neutral">第 {{ session.state.turn + 1 }} / {{ session.state.maxTurns }} 期</span>
            <span v-if="preview" class="status-pill" :class="riskClass(preview.riskLevel)">{{ riskLabel(preview.riskLevel) }}</span>
            <span v-if="autoSaveStamp" class="status-pill status-pill-neutral">最近自动存档 {{ formatDateTime(autoSaveStamp) }}</span>
            <span v-else class="status-pill status-pill-neutral">首轮结算后会生成自动存档</span>
          </template>
          <span v-else class="status-pill status-pill-neutral">新手建议：先从“稳健经营”难度热身</span>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <button class="button-secondary" :aria-pressed="helpOpen" @click="$emit('openHelp')">查看作战手册</button>

        <template v-if="screen === 'game' && session">
          <button class="button-secondary" @click="$emit('quickSave')">写入槽位 A</button>
          <button class="button-primary" :disabled="!canAdvance" @click="$emit('advanceTurn')">锁定方案并结算</button>
        </template>
      </div>
    </div>
  </header>
</template>
