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
    <div class="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[linear-gradient(180deg,rgba(93,134,181,0.16),transparent)]"></div>
    <div class="pointer-events-none absolute right-[-120px] top-[-80px] h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(31,63,102,0.12),transparent_64%)] blur-3xl"></div>
    <div class="pointer-events-none absolute left-[-60px] bottom-[-100px] h-[220px] w-[220px] rounded-full bg-[radial-gradient(circle,rgba(74,117,165,0.1),transparent_66%)] blur-3xl"></div>

    <div class="relative">
      <div class="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div class="max-w-3xl">
          <div class="section-kicker">年度经营沙盘</div>
          <h1 class="mono-title mt-4 text-4xl leading-none text-[var(--control-ink)] md:text-6xl">接管这家公司</h1>
          <p class="mt-4 max-w-3xl text-base leading-7 text-stone-700">
            从 {{ currentScenario.title }} 出发，在资金、研发、营销、人力、产能和融资之间做取舍。
            每个季度只给你一次下注机会，董事会最终只看目标有没有被你真正打下来。
          </p>
        </div>

        <div class="tactical-note max-w-[420px]">
          本局需要在 {{ currentScenario.maxTurns }} 期内，至少完成 {{ currentScenario.finalObjective.minimumTargetsMet }}
          项年度目标。建议先守住现金与质量，再决定什么时候提速扩张。
        </div>
      </div>

      <div class="mt-6 grid gap-3 md:grid-cols-4">
        <div class="panel-soft px-4 py-4">
          <span class="block text-xs font-bold uppercase tracking-[0.12em] text-stone-500">当前剧本</span>
          <strong class="mono-title mt-2 block text-lg text-[var(--control-navy)]">{{ currentScenario.title }}</strong>
        </div>
        <div class="panel-soft px-4 py-4">
          <span class="block text-xs font-bold uppercase tracking-[0.12em] text-stone-500">经营年限</span>
          <strong class="mono-title mt-2 block text-lg text-[var(--control-navy)]">{{ currentScenario.maxTurns }} 期</strong>
        </div>
        <div class="panel-soft px-4 py-4">
          <span class="block text-xs font-bold uppercase tracking-[0.12em] text-stone-500">终局评审</span>
          <strong class="mono-title mt-2 block text-lg text-[var(--control-navy)]">
            {{ currentScenario.milestones.at(-1)?.label ?? currentScenario.finalObjective.label }}
          </strong>
        </div>
        <div class="panel-soft px-4 py-4">
          <span class="block text-xs font-bold uppercase tracking-[0.12em] text-stone-500">当前难度</span>
          <strong class="mono-title mt-2 block text-lg text-[var(--control-navy)]">{{ currentDifficulty.label }}</strong>
        </div>
      </div>

      <div class="mt-7 grid gap-4">
        <div>
          <div class="mb-3 flex items-center justify-between gap-3">
            <div class="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">可选剧本</div>
            <span class="guide-badge-subtle">先选战场</span>
          </div>
          <div class="grid gap-3 lg:grid-cols-3">
          <button
            v-for="item in scenarios"
            :key="item.id"
            class="guide-card cursor-pointer text-left transition duration-200 hover:-translate-y-0.5 hover:border-[var(--control-navy)]/22 hover:bg-white/95"
            :class="
              item.id === scenarioId
                ? 'border-[rgba(169,124,47,0.22)] bg-[linear-gradient(180deg,rgba(255,251,242,0.98),rgba(235,243,251,0.96))] shadow-[0_14px_28px_rgba(24,45,74,0.08)]'
                : 'border-[rgba(31,63,102,0.08)] bg-[rgba(249,252,255,0.92)]'
            "
            :aria-pressed="item.id === scenarioId"
            @click="$emit('selectScenario', item.id)"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--control-navy)]">{{ item.subtitle }}</div>
              <span class="guide-badge-subtle">{{ item.id === scenarioId ? "已选剧本" : "切换剧本" }}</span>
            </div>
            <h2 class="mb-2 text-lg font-semibold text-[var(--control-ink)]">{{ item.title }}</h2>
            <p class="text-sm leading-6 text-stone-700">{{ item.summary }}</p>
          </button>
          </div>
        </div>

        <div>
          <div class="mb-3 flex items-center justify-between gap-3">
            <div class="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">董事会难度</div>
            <span class="guide-badge-subtle">再定压力</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in difficulties"
              :key="item.id"
              class="status-pill transition duration-200"
              :class="
                item.id === currentDifficulty.id
                  ? 'border-[rgba(169,124,47,0.24)] bg-[linear-gradient(180deg,#6f94bf_0%,#2a4e78_58%,#183555_100%)] text-white shadow-[0_10px_22px_rgba(22,46,77,0.18)]'
                  : 'status-pill-neutral hover:border-[var(--control-navy)]/20 hover:bg-white'
              "
              :aria-pressed="item.id === currentDifficulty.id"
              @click="$emit('selectDifficulty', item.id)"
            >
              {{ item.label }}
            </button>
          </div>
          <p class="mt-2 text-sm leading-6 text-stone-700">{{ currentDifficulty.summary }}</p>
        </div>

        <label class="grid gap-2">
          <span class="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">公司名号</span>
          <input
            :value="companyName"
            maxlength="24"
            type="text"
            aria-label="公司名称"
            placeholder="为你的公司命名"
            class="field-input min-h-12 w-full"
            @input="$emit('updateCompanyName', ($event.target as HTMLInputElement).value)"
          />
          <span class="text-sm text-stone-600">公司名称会同步出现在顶部栏和本地存档标题里，最多 24 个字符。</span>
        </label>

        <div class="flex flex-wrap gap-2">
          <button class="button-primary" @click="$emit('startScenario')">进入这局经营</button>
          <button class="button-secondary" @click="$emit('restoreAuto')">继续自动存档</button>
        </div>

        <p class="text-sm leading-6 text-stone-600">所有进度都只保存在当前浏览器，你可以在右侧账本里继续或清理旧档。</p>
      </div>
    </div>
  </article>
</template>
