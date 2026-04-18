<script setup lang="ts">
import type { DifficultySummary, ScenarioSummary } from "@/types/app";
import type { QuickStartStep } from "@/types/help";

defineProps<{
  currentDifficulty: DifficultySummary;
  currentScenario: ScenarioSummary;
  steps: QuickStartStep[];
}>();

defineEmits<{
  openHelp: [];
}>();
</script>

<template>
  <article class="panel-surface panel-glow px-5 py-5">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div class="text-xs font-bold uppercase tracking-[0.12em] text-[var(--control-navy)]">How To Play</div>
        <h2 class="mono-title mt-2 text-2xl text-[var(--control-navy)]">30 秒上手这局经营模拟</h2>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          你每回合只需要做一次资源分配，然后从报表里判断下一回合该继续冲增长，还是先守现金和组织状态。
        </p>
      </div>

      <button class="button-secondary" @click="$emit('openHelp')">打开完整帮助</button>
    </div>

    <div class="mt-5 grid gap-3 lg:grid-cols-3">
      <article v-for="step in steps" :key="step.id" class="guide-card">
        <div class="flex items-center justify-between gap-3">
          <span class="guide-badge">{{ step.index }}</span>
          <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Quick Loop</span>
        </div>
        <h3 class="mt-4 text-base font-semibold text-slate-900">{{ step.title }}</h3>
        <p class="mt-2 text-sm leading-6 text-slate-600">{{ step.body }}</p>
      </article>
    </div>

    <div class="mt-5 grid gap-3 md:grid-cols-3">
      <article class="panel-soft px-4 py-4">
        <div class="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">当前场景</div>
        <strong class="mono-title mt-2 block text-lg text-[var(--control-navy)]">{{ currentScenario.title }}</strong>
        <p class="mt-2 text-sm leading-6 text-slate-600">{{ currentScenario.brief }}</p>
      </article>

      <article class="panel-soft px-4 py-4">
        <div class="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">过关线</div>
        <strong class="mono-title mt-2 block text-lg text-[var(--control-navy)]">
          至少完成 {{ currentScenario.finalObjective.minimumTargetsMet }} 项年度目标
        </strong>
        <p class="mt-2 text-sm leading-6 text-slate-600">{{ currentScenario.finalObjective.label }}</p>
      </article>

      <article class="panel-soft px-4 py-4">
        <div class="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">当前难度</div>
        <strong class="mono-title mt-2 block text-lg text-[var(--control-navy)]">{{ currentDifficulty.label }}</strong>
        <p class="mt-2 text-sm leading-6 text-slate-600">{{ currentDifficulty.summary }}</p>
      </article>
    </div>
  </article>
</template>
