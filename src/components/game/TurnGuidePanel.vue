<script setup lang="ts">
import type { ObjectiveStatus, SessionSnapshot } from "@/types/app";
import type { TurnGuideItem } from "@/types/help";

const props = defineProps<{
  items: TurnGuideItem[];
  objectiveStatus: ObjectiveStatus;
  session: SessionSnapshot;
}>();

defineEmits<{
  openHelp: [];
}>();

function turnProgress() {
  return Math.min(100, Math.round((props.session.state.turn / props.session.state.maxTurns) * 100));
}

function targetProgress() {
  return Math.min(
    100,
    Math.round((props.objectiveStatus.final.targetsMet / Math.max(1, props.objectiveStatus.final.minimumTargetsMet)) * 100)
  );
}

function toneClass(tone: TurnGuideItem["tone"]) {
  if (tone === "warning") return "border-amber-500/20 bg-amber-50/80";
  if (tone === "success") return "border-emerald-500/20 bg-emerald-50/80";
  if (tone === "accent") return "border-[var(--control-navy)]/18 bg-[var(--control-navy-soft)]";
  return "border-slate-900/8 bg-white/88";
}
</script>

<template>
  <section class="panel-surface panel-glow mb-4 px-5 py-5">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div class="text-xs font-bold uppercase tracking-[0.12em] text-[var(--control-navy)]">Operating Loop</div>
        <h2 class="mono-title mt-2 text-2xl text-[var(--control-navy)]">本回合操作提示</h2>
        <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          这一栏只保留当前最该看的东西，帮助你少滚动、快判断。
        </p>
      </div>

      <button class="button-secondary" @click="$emit('openHelp')">查看玩法说明</button>
    </div>

    <div class="mt-5 grid gap-3 xl:grid-cols-[minmax(260px,0.9fr)_repeat(3,minmax(0,1fr))]">
      <article class="panel-soft px-4 py-4">
        <div class="grid gap-4">
          <div>
            <div class="flex items-center justify-between gap-3">
              <span class="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">回合推进</span>
              <span class="mono-title text-sm text-[var(--control-navy)]">第 {{ session.state.turn + 1 }} / {{ session.state.maxTurns }} 期</span>
            </div>
            <div class="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-900/8">
              <div class="h-full rounded-full bg-gradient-to-r from-[var(--control-navy)] to-[#6da6ff]" :style="{ width: `${turnProgress()}%` }"></div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between gap-3">
              <span class="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">年度达标度</span>
              <span class="mono-title text-sm text-[var(--control-navy)]">{{ objectiveStatus.final.targetsMet }} / {{ objectiveStatus.final.minimumTargetsMet }}</span>
            </div>
            <div class="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-900/8">
              <div class="h-full rounded-full bg-gradient-to-r from-[var(--control-amber)] to-[#fcd34d]" :style="{ width: `${targetProgress()}%` }"></div>
            </div>
          </div>
        </div>
      </article>

      <div class="grid gap-3 md:grid-cols-3 xl:col-span-3">
        <article v-for="item in items" :key="item.id" class="guide-card border" :class="toneClass(item.tone)">
          <div class="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{{ item.label }}</div>
          <h3 class="mt-2 text-base font-semibold text-slate-900">{{ item.title }}</h3>
          <p class="mt-2 text-sm leading-5 text-slate-600">{{ item.body }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
