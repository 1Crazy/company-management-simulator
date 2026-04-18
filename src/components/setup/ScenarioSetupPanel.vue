<script setup lang="ts">
import type { DifficultySummary, ScenarioSummary } from "@/types/app";

defineProps<{
  companyName: string;
  currentDifficulty: DifficultySummary;
  currentScenario: ScenarioSummary;
  difficulties: DifficultySummary[];
  scenarioId: string;
  scenarios: ScenarioSummary[];
}>();

defineEmits<{
  restoreAuto: [];
  selectDifficulty: [id: string];
  selectScenario: [id: string];
  startScenario: [];
  updateCompanyName: [value: string];
}>();
</script>

<template>
  <article class="panel-surface panel-glow relative overflow-hidden px-7 py-7">
    <div class="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(20,58,123,0.08),transparent)]"></div>
    <div class="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--control-navy)]">
      <span class="inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-br from-[var(--control-amber)] to-[var(--control-navy)]"></span>
      Pure Frontend Simulation
    </div>
    <h1 class="mono-title text-4xl leading-none text-[var(--control-navy)] md:text-6xl">公司经营模拟控制台</h1>
    <p class="mt-4 max-w-3xl text-base leading-7 text-slate-600">
      这是一个纯前端、规则驱动的经营沙盘。你需要在资金、研发、营销、人力、产能和融资之间做取舍，
      再观察财务结果、市场反馈和阶段目标如何相互牵引。
    </p>

    <div class="mt-6 grid gap-3 md:grid-cols-4">
      <div class="panel-soft px-4 py-4">
        <span class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">默认场景</span>
        <strong class="mono-title mt-2 block text-lg text-[var(--control-navy)]">{{ currentScenario.title }}</strong>
      </div>
      <div class="panel-soft px-4 py-4">
        <span class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">经营周期</span>
        <strong class="mono-title mt-2 block text-lg text-[var(--control-navy)]">{{ currentScenario.maxTurns }} 期</strong>
      </div>
      <div class="panel-soft px-4 py-4">
        <span class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">最终目标</span>
        <strong class="mono-title mt-2 block text-lg text-[var(--control-navy)]">
          {{ currentScenario.milestones.at(-1)?.label ?? currentScenario.finalObjective.label }}
        </strong>
      </div>
      <div class="panel-soft px-4 py-4">
        <span class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">当前难度</span>
        <strong class="mono-title mt-2 block text-lg text-[var(--control-navy)]">{{ currentDifficulty.label }}</strong>
      </div>
    </div>

    <div class="mt-7 grid gap-4">
      <div>
        <div class="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">场景选择</div>
        <div class="grid gap-3 lg:grid-cols-3">
          <button
            v-for="item in scenarios"
            :key="item.id"
            class="guide-card cursor-pointer text-left transition duration-200 hover:-translate-y-0.5 hover:border-[var(--control-navy)]/20 hover:bg-white/95"
            :class="item.id === scenarioId ? 'border-[var(--control-navy)]/28 bg-[var(--control-navy-soft)] shadow-[0_18px_36px_rgba(15,23,42,0.06)]' : 'border-slate-900/10 bg-white/82'"
            :aria-pressed="item.id === scenarioId"
            @click="$emit('selectScenario', item.id)"
          >
            <div class="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--control-navy)]">{{ item.subtitle }}</div>
            <h2 class="mb-2 text-lg font-semibold text-[var(--control-navy)]">{{ item.title }}</h2>
            <p class="text-sm leading-6 text-slate-600">{{ item.summary }}</p>
          </button>
        </div>
      </div>

      <div>
        <div class="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">难度</div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="item in difficulties"
            :key="item.id"
            class="status-pill transition duration-200"
            :class="item.id === currentDifficulty.id ? 'border-transparent bg-[var(--control-navy)] text-white' : 'status-pill-neutral hover:border-[var(--control-navy)]/20 hover:bg-white'"
            :aria-pressed="item.id === currentDifficulty.id"
            @click="$emit('selectDifficulty', item.id)"
          >
            {{ item.label }}
          </button>
        </div>
        <p class="mt-2 text-sm leading-6 text-slate-600">{{ currentDifficulty.summary }}</p>
      </div>

      <label class="grid gap-2">
        <span class="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">公司名称</span>
        <input
          :value="companyName"
          maxlength="24"
          type="text"
          aria-label="公司名称"
          class="min-h-12 rounded-2xl border border-slate-900/12 bg-white px-4 text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
          @input="$emit('updateCompanyName', ($event.target as HTMLInputElement).value)"
        />
      </label>

      <div class="flex flex-wrap gap-2">
        <button class="button-primary" @click="$emit('startScenario')">开始新一局</button>
        <button class="button-secondary" @click="$emit('restoreAuto')">继续自动存档</button>
      </div>
    </div>
  </article>
</template>
