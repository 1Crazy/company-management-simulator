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
  if (tone === "warning") return "border-[rgba(169,124,47,0.18)] bg-[linear-gradient(180deg,rgba(255,248,232,0.96),rgba(247,236,205,0.88))]";
  if (tone === "success") return "border-[rgba(63,110,106,0.16)] bg-[linear-gradient(180deg,rgba(239,250,247,0.94),rgba(226,242,237,0.86))]";
  if (tone === "accent") return "border-[rgba(31,63,102,0.16)] bg-[linear-gradient(180deg,rgba(241,247,253,0.96),rgba(226,236,247,0.9))]";
  return "border-slate-900/8 bg-white/92";
}
</script>

<template>
  <section class="panel-surface panel-glow px-5 py-5">
    <div class="flex items-start justify-between gap-3">
      <div>
        <div class="text-xs font-bold tracking-[0.12em] text-[var(--control-navy)]">本期提示</div>
        <h2 class="mono-title mt-2 text-2xl text-[var(--control-navy)]">短线判断板</h2>
        <p class="mt-2 text-sm leading-6 text-slate-600">这一栏只保留当前最该看的信息，帮助你少滚动、快落子。</p>
      </div>

      <button class="button-secondary" @click="$emit('openHelp')">查看玩法说明</button>
    </div>

    <div class="mt-5 grid gap-3">
      <article class="panel-soft px-4 py-4">
        <div class="grid gap-4">
          <div>
            <div class="flex items-center justify-between gap-3">
              <span class="text-xs font-bold tracking-[0.12em] text-slate-500">回合推进</span>
              <span class="mono-title text-sm text-[var(--control-navy)]">第 {{ session.state.turn + 1 }} / {{ session.state.maxTurns }} 期</span>
            </div>
            <div class="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-900/8">
              <div class="h-full rounded-full bg-gradient-to-r from-[var(--control-navy)] via-[var(--control-sky)] to-[var(--control-gold)]" :style="{ width: `${turnProgress()}%` }"></div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between gap-3">
              <span class="text-xs font-bold tracking-[0.12em] text-slate-500">年度达标度</span>
              <span class="mono-title text-sm text-[var(--control-navy)]">{{ objectiveStatus.final.targetsMet }} / {{ objectiveStatus.final.minimumTargetsMet }}</span>
            </div>
            <div class="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-900/8">
              <div class="h-full rounded-full bg-gradient-to-r from-[var(--control-gold-strong)] via-[var(--control-gold)] to-[var(--control-navy)]" :style="{ width: `${targetProgress()}%` }"></div>
            </div>
          </div>
        </div>
      </article>

      <article v-for="item in items" :key="item.id" class="guide-card border" :class="toneClass(item.tone)">
        <div class="text-xs font-bold tracking-[0.12em] text-slate-500">{{ item.label }}</div>
        <h3 class="mt-2 text-base font-semibold text-slate-900">{{ item.title }}</h3>
        <p class="mt-2 text-sm leading-6 text-slate-600">{{ item.body }}</p>
      </article>
    </div>
  </section>
</template>
