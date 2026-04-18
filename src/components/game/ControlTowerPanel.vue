<script setup lang="ts">
import type { ObjectiveStatus, SaveCatalog, SessionSnapshot } from "@/types/app";
import { formatDateTime, formatMetricValue, formatCurrency, formatSignedCurrency, metricLabel, saveSlotLabel } from "@/ui/formatters";

defineProps<{
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

function progressPercent(items: ObjectiveStatus["milestones"][number]["items"]) {
  return Math.min(100, Math.round((items.reduce((sum, item) => sum + Math.min(item.progress, 1), 0) / items.length) * 100));
}
</script>

<template>
  <article class="panel-surface panel-glow px-5 py-5">
    <div class="text-xs font-bold uppercase tracking-[0.12em] text-[var(--control-navy)]">Control Tower</div>
    <h2 class="mono-title mt-2 text-2xl text-[var(--control-navy)]">目标与存档</h2>

    <div class="mt-4 grid gap-3">
      <article v-for="milestone in objectiveStatus.milestones" :key="milestone.label" class="panel-soft px-4 py-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <strong class="text-sm text-slate-900">{{ milestone.label }}</strong>
            <div class="mt-1 text-sm text-slate-500">第 {{ milestone.turn }} 期里程碑</div>
          </div>
          <span :class="milestone.achieved ? 'metric-chip-positive' : 'metric-chip-neutral'">
            {{ milestone.achieved ? "已达成" : `${progressPercent(milestone.items)}%` }}
          </span>
        </div>

        <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-900/8">
          <div
            class="h-full rounded-full bg-gradient-to-r from-[var(--control-navy)] to-[var(--control-amber)]"
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
            <p class="mt-1 text-sm leading-6 text-slate-600">自动存档会在每回合结束后写入。</p>
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
