<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import type { ObjectiveStatus, SaveCatalog, SessionSnapshot } from "@/types/app";
import { formatDateTime, formatMetricValue, formatCurrency, formatSignedCurrency, metricLabel, saveSlotLabel } from "@/ui/formatters";

const props = defineProps<{
  objectiveStatus: ObjectiveStatus;
  saveCatalog: SaveCatalog;
  session: SessionSnapshot;
}>();

defineEmits<{
  openMenu: [];
  openRestart: [];
  restoreSession: [slotId: string];
  saveSlot: [slotId: string];
}>();

const recentlyAchievedLabels = ref<string[]>([]);
let achievedBadgeTimer: number | null = null;
const milestoneSnapshots = computed(() =>
  props.objectiveStatus.milestones.map((item) => ({ achieved: item.achieved, label: item.label }))
);

function progressPercent(items: ObjectiveStatus["milestones"][number]["items"]) {
  return Math.min(100, Math.round((items.reduce((sum, item) => sum + Math.min(item.progress, 1), 0) / items.length) * 100));
}

function achievedMilestonesCount(objectiveStatus: ObjectiveStatus) {
  return objectiveStatus.milestones.filter((item) => item.achieved).length;
}

function finalProgressPercent(objectiveStatus: ObjectiveStatus) {
  return Math.min(100, Math.round((objectiveStatus.final.targetsMet / Math.max(1, objectiveStatus.final.minimumTargetsMet)) * 100));
}

function milestoneCardClass(achieved: boolean) {
  return achieved
    ? "border-[rgba(169,124,47,0.22)] bg-[linear-gradient(180deg,rgba(255,250,240,0.98),rgba(238,245,252,0.95))] shadow-[0_14px_30px_rgba(24,45,74,0.1)]"
    : "";
}

function milestoneCardAnimatedClass(label: string, achieved: boolean) {
  return achieved ? ["milestone-achieved-card", recentlyAchievedLabels.value.includes(label) ? "milestone-achieved-card-flash" : ""] : [];
}

function milestoneChipClass(achieved: boolean) {
  return achieved ? "guide-badge-subtle border-[rgba(169,124,47,0.2)] text-[#7a5821]" : "metric-chip-neutral";
}

function milestoneChipAnimatedClass(label: string, achieved: boolean) {
  return achieved && recentlyAchievedLabels.value.includes(label) ? "milestone-achieved-badge-flash" : "";
}

watch(
  milestoneSnapshots,
  (nextMilestones, previousMilestones) => {
    if (!previousMilestones?.length) {
      return;
    }

    const nextSet = new Set(nextMilestones.filter((item) => item.achieved).map((item) => item.label));
    const previousSet = new Set(previousMilestones.filter((item) => item.achieved).map((item) => item.label));
    const newlyAchieved = [...nextSet].filter((label) => !previousSet.has(label));

    if (!newlyAchieved.length) {
      return;
    }

    recentlyAchievedLabels.value = newlyAchieved;
    if (achievedBadgeTimer !== null) {
      window.clearTimeout(achievedBadgeTimer);
    }
    achievedBadgeTimer = window.setTimeout(() => {
      recentlyAchievedLabels.value = [];
      achievedBadgeTimer = null;
    }, 1400);
  },
  { deep: true }
);

onBeforeUnmount(() => {
  if (achievedBadgeTimer !== null) {
    window.clearTimeout(achievedBadgeTimer);
  }
});
</script>

<template>
  <article class="panel-surface panel-glow px-5 py-5">
    <div class="text-xs font-bold tracking-[0.12em] text-[var(--control-navy)]">控制塔</div>
    <h2 class="mono-title mt-2 text-2xl text-[var(--control-navy)]">目标与存档</h2>
    <p class="mt-2 text-sm leading-6 text-slate-600">把年度目标、存档入口和最近几期信号固定在右侧，避免打断主操作台。</p>

    <article class="panel-soft mt-4 overflow-hidden px-4 py-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="text-xs font-bold tracking-[0.12em] text-[var(--control-navy)]">年度达成板</div>
          <strong class="mt-2 block text-base text-slate-900">已完成 {{ objectiveStatus.final.targetsMet }} / {{ objectiveStatus.final.minimumTargetsMet }} 项核心目标</strong>
          <p class="mt-2 text-sm leading-6 text-slate-600">{{ objectiveStatus.final.label }}</p>
        </div>
        <span class="guide-badge-subtle">
          {{ achievedMilestonesCount(objectiveStatus) }} / {{ objectiveStatus.milestones.length }} 道关口
        </span>
      </div>

      <div class="mt-4 h-3 overflow-hidden rounded-full bg-slate-900/8">
        <div
          class="h-full rounded-full bg-gradient-to-r from-[var(--control-navy)] via-[var(--control-sky)] to-[var(--control-gold)] shadow-[0_0_18px_rgba(192,151,72,0.18)]"
          :style="{ width: `${finalProgressPercent(objectiveStatus)}%` }"
        ></div>
      </div>
    </article>

    <div class="mt-4 grid gap-3">
      <article
        v-for="milestone in objectiveStatus.milestones"
        :key="milestone.label"
        class="panel-soft px-4 py-4"
        :class="[milestoneCardClass(milestone.achieved), milestoneCardAnimatedClass(milestone.label, milestone.achieved)]"
      >
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <strong class="text-sm text-slate-900">{{ milestone.label }}</strong>
            <div class="mt-1 text-sm text-slate-500">第 {{ milestone.turn }} 期里程碑</div>
          </div>
          <span :class="[milestoneChipClass(milestone.achieved), milestoneChipAnimatedClass(milestone.label, milestone.achieved)]">
            {{ milestone.achieved ? "已攻克" : `${progressPercent(milestone.items)}%` }}
          </span>
        </div>

        <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-900/8">
          <div
            class="h-full rounded-full"
            :class="
              milestone.achieved
                ? 'bg-gradient-to-r from-[var(--control-gold)] via-[var(--control-gold-strong)] to-[var(--control-navy)] shadow-[0_0_20px_rgba(192,151,72,0.22)]'
                : 'bg-gradient-to-r from-[var(--control-navy)] via-[var(--control-sky)] to-[var(--control-gold)]'
            "
            :style="{ width: `${progressPercent(milestone.items)}%` }"
          ></div>
        </div>

        <div class="mt-3 grid gap-2">
          <div v-for="item in milestone.items" :key="item.key" class="flex items-center justify-between gap-3 text-sm">
            <span class="text-slate-600">{{ metricLabel(item.key) }}</span>
            <strong class="text-slate-900">{{ formatMetricValue(item.key, item.current) }} / {{ formatMetricValue(item.key, item.scaledTarget) }}</strong>
          </div>
        </div>
      </article>
    </div>

    <div class="mt-4 grid gap-3">
      <article class="panel-soft px-4 py-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <strong class="text-sm text-slate-900">手动存档槽位</strong>
            <p class="mt-1 text-sm leading-6 text-slate-600">自动存档会在每回合结束后写入，手动槽位适合保留关键分叉。</p>
          </div>
        </div>
        <div class="mt-3 grid gap-3">
          <article v-for="(record, index) in saveCatalog.manualSlots" :key="index" class="panel-soft px-4 py-4">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <strong class="text-sm text-slate-900">{{ saveSlotLabel(['slot-1', 'slot-2', 'slot-3'][index]) }}</strong>
                <p class="mt-1 text-sm text-slate-600">{{ record ? record.summary : "空槽位" }}</p>
              </div>
              <small class="text-sm text-slate-500">{{ record ? formatDateTime(record.savedAt) : "未保存" }}</small>
            </div>
            <div class="mt-3 flex flex-wrap gap-2">
              <button class="button-secondary" @click="$emit('saveSlot', ['slot-1', 'slot-2', 'slot-3'][index])">保存</button>
              <button class="button-secondary disabled:cursor-not-allowed disabled:opacity-55" :disabled="!record" @click="$emit('restoreSession', ['slot-1', 'slot-2', 'slot-3'][index])">
                读取
              </button>
            </div>
          </article>
        </div>
      </article>

      <article class="panel-soft px-4 py-4">
        <strong class="text-sm text-slate-900">最近回合</strong>
        <p class="mt-1 text-sm leading-6 text-slate-600">先看事件名和利润跳变，再决定是否需要大幅改打法。</p>
        <div class="mt-3 grid max-h-[320px] gap-3 overflow-auto">
          <div v-if="!session.state.history.length" class="text-sm leading-6 text-slate-600">还没有历史记录。</div>
          <div
            v-for="entry in [...session.state.history].reverse()"
            :key="entry.label"
            class="flex items-start justify-between gap-3 border-b border-slate-900/6 pb-3 last:border-none last:pb-0"
          >
            <div>
              <strong class="mono-title text-sm text-[var(--control-navy)]">{{ entry.label }}</strong>
              <div class="mt-1 text-sm text-slate-600">{{ entry.eventTitle }}</div>
            </div>
            <div class="text-right">
              <div class="text-sm text-slate-900">{{ formatCurrency(entry.revenue) }}</div>
              <small :class="entry.profit >= 0 ? 'text-emerald-700' : 'text-rose-700'">{{ formatSignedCurrency(entry.profit) }}</small>
            </div>
          </div>
        </div>
      </article>
    </div>
  </article>
</template>
