<script setup lang="ts">
import type { SaveCatalog, ScenarioSummary } from "@/types/app";
import { formatDateTime, formatMetricValue, metricLabel, saveSlotLabel } from "@/ui/formatters";

defineProps<{
  currentScenario: ScenarioSummary;
  saveCatalog: SaveCatalog;
}>();

defineEmits<{
  deleteSave: [slotId: string];
  restoreSession: [slotId: string];
}>();
</script>

<template>
  <div class="grid gap-4">
    <article class="panel-surface panel-glow px-5 py-5">
      <div class="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--control-navy)]">Board Target</div>
      <h2 class="mono-title text-2xl text-[var(--control-navy)]">
        {{ currentScenario.milestones.at(-1)?.label ?? currentScenario.finalObjective.label }}
      </h2>
      <p class="mt-3 text-sm leading-6 text-slate-600">{{ currentScenario.brief }}</p>
      <div class="mt-4 grid gap-3">
        <div
          v-for="(value, key) in currentScenario.milestones.at(-1)?.metrics"
          :key="String(key)"
          class="panel-soft px-4 py-4"
        >
          <div class="flex items-center justify-between gap-3">
            <strong class="text-sm text-slate-700">{{ metricLabel(String(key)) }}</strong>
            <span class="mono-title text-base text-[var(--control-navy)]">{{ formatMetricValue(String(key), Number(value)) }}</span>
          </div>
        </div>
      </div>
    </article>

    <article class="panel-surface panel-glow px-5 py-5">
      <div class="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--control-navy)]">Save Center</div>
      <h2 class="mono-title text-2xl text-[var(--control-navy)]">本地存档</h2>
      <p class="mt-3 text-sm leading-6 text-slate-600">自动存档会在每回合结算后生成，手动存档可以覆盖到 A/B/C 三个槽位。</p>

      <div class="mt-4 grid gap-3">
        <article v-if="!saveCatalog.compatible.length" class="panel-soft px-4 py-4">
          <strong class="text-sm text-slate-900">还没有可继续的经营局</strong>
          <p class="mt-2 text-sm leading-6 text-slate-600">开始一局后系统会自动写入自动存档，你也可以手动保存到 A/B/C 三个槽位。</p>
        </article>

        <article v-for="record in saveCatalog.compatible" :key="record.slotId" class="panel-soft px-4 py-4">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <strong class="text-sm text-slate-900">{{ saveSlotLabel(record.slotId) }}</strong>
              <div class="mono-title mt-1 text-base text-[var(--control-navy)]">{{ record.summary }}</div>
              <p class="mt-1 text-sm text-slate-600">{{ record.title }}</p>
            </div>
            <small class="text-sm text-slate-500">{{ formatDateTime(record.savedAt) }}</small>
          </div>
          <div class="mt-3 flex flex-wrap gap-2">
            <button class="button-secondary" @click="$emit('restoreSession', record.slotId)">读取存档</button>
            <button class="button-secondary" @click="$emit('deleteSave', record.slotId)">删除</button>
          </div>
        </article>

        <article v-for="record in saveCatalog.incompatible" :key="record.slotId" class="panel-soft px-4 py-4">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <strong class="text-sm text-slate-900">{{ record.title }}</strong>
              <p class="mt-1 text-sm text-slate-600">版本 {{ record.version }} 与当前实现不兼容。</p>
            </div>
            <button class="button-secondary border-rose-500/20 text-rose-700 hover:border-rose-500/32" @click="$emit('deleteSave', record.slotId)">
              清理失效存档
            </button>
          </div>
        </article>
      </div>
    </article>
  </div>
</template>
