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
  <article class="panel-surface panel-glow relative overflow-hidden px-5 py-5">
    <div class="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(90deg,rgba(93,134,181,0.14),transparent_55%,rgba(31,63,102,0.1))]"></div>

    <div class="relative">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div class="section-kicker">开局流程</div>
          <h2 class="mono-title mt-3 text-2xl text-[var(--control-ink)]">30 秒进入你的第一轮经营</h2>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-stone-700">
            先定这局是守现金还是抢增长，再按三步闭环推进。每回合只做一次资源分配，但每次取舍都会改写后面的局势。
          </p>
        </div>

        <div class="flex max-w-sm flex-col items-start gap-3">
          <button class="button-secondary" @click="$emit('openHelp')">查看完整手册</button>
          <p class="text-sm leading-6 text-stone-600">如果还不熟字段，建议先从“稳健经营”节奏热身，再去挑战高压局面。</p>
        </div>
      </div>

      <div class="mt-5 grid gap-3 lg:grid-cols-3">
        <article v-for="step in steps" :key="step.id" class="guide-card">
          <div class="flex items-center justify-between gap-3">
            <span class="guide-badge">{{ step.index }}</span>
            <span class="guide-badge-subtle">经营闭环</span>
          </div>
          <h3 class="mt-4 text-base font-semibold text-slate-900">{{ step.title }}</h3>
          <p class="mt-2 text-sm leading-6 text-slate-600">{{ step.body }}</p>
        </article>
      </div>

      <div class="mt-5 grid gap-3 md:grid-cols-3">
        <article class="panel-soft px-4 py-4">
          <div class="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">当前剧本</div>
          <strong class="mono-title mt-2 block text-lg text-[var(--control-navy)]">{{ currentScenario.title }}</strong>
          <p class="mt-2 text-sm leading-6 text-slate-600">{{ currentScenario.brief }}</p>
        </article>

        <article class="panel-soft px-4 py-4">
          <div class="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">年度过关线</div>
          <strong class="mono-title mt-2 block text-lg text-[var(--control-navy)]">
            至少完成 {{ currentScenario.finalObjective.minimumTargetsMet }} 项年度目标
          </strong>
          <p class="mt-2 text-sm leading-6 text-slate-600">{{ currentScenario.finalObjective.label }}</p>
        </article>

        <article class="panel-soft px-4 py-4">
          <div class="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">本局难度</div>
          <strong class="mono-title mt-2 block text-lg text-[var(--control-navy)]">{{ currentDifficulty.label }}</strong>
          <p class="mt-2 text-sm leading-6 text-slate-600">{{ currentDifficulty.summary }}</p>
        </article>
      </div>
    </div>
  </article>
</template>
