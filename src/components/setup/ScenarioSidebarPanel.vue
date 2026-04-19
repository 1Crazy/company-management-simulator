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
    <article class="panel-surface panel-glow relative overflow-hidden px-5 py-5">
      <div class="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(90deg,rgba(93,134,181,0.14),transparent_54%,rgba(31,63,102,0.1))]"></div>

      <div class="relative">
        <div class="mb-3 flex items-center justify-between gap-3">
          <div class="text-xs font-bold uppercase tracking-[0.12em] text-[var(--control-navy)]">董事会目标</div>
          <span class="guide-badge-subtle">终局评审</span>
        </div>
        <h2 class="mono-title text-2xl text-[var(--control-ink)]">
          {{ currentScenario.milestones.at(-1)?.label ?? currentScenario.finalObjective.label }}
        </h2>
        <p class="mt-3 text-sm leading-6 text-stone-700">{{ currentScenario.brief }}</p>
        <div class="mt-4 grid gap-3">
          <div
            v-for="(value, key) in currentScenario.milestones.at(-1)?.metrics"
            :key="String(key)"
            class="panel-soft px-4 py-4"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <strong class="text-sm text-stone-700">{{ metricLabel(String(key)) }}</strong>
                <p class="mt-1 text-xs text-stone-500">终局达成线</p>
              </div>
              <span class="mono-title text-base text-[var(--control-navy)]">{{ formatMetricValue(String(key), Number(value)) }}</span>
            </div>
          </div>
        </div>
      </div>
    </article>

    <article class="panel-surface panel-glow relative overflow-hidden px-5 py-5">
      <div class="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(90deg,rgba(93,134,181,0.14),transparent_54%,rgba(31,63,102,0.1))]"></div>

      <div class="relative">
        <div class="mb-3 flex items-center justify-between gap-3">
          <div class="text-xs font-bold uppercase tracking-[0.12em] text-[var(--control-navy)]">存档账本</div>
          <span class="guide-badge-subtle">本地浏览器</span>
        </div>
        <h2 class="mono-title text-2xl text-[var(--control-ink)]">继续上次经营</h2>
        <p class="mt-3 text-sm leading-6 text-stone-700">每次结算后都会刷新自动存档，你也可以把关键节点写入 A/B/C 三个槽位。</p>

        <div class="mt-4 grid gap-3">
          <article v-if="!saveCatalog.compatible.length" class="panel-soft px-4 py-4">
            <strong class="text-sm text-slate-900">还没有可继续的经营局</strong>
            <p class="mt-2 text-sm leading-6 text-slate-600">进入一局后系统会自动写入自动存档，你也可以手动保留三个关键节点。</p>
          </article>

          <article v-for="record in saveCatalog.compatible" :key="record.slotId" class="panel-soft px-4 py-4">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <strong class="text-sm text-slate-900">{{ saveSlotLabel(record.slotId) }}</strong>
                <div class="mono-title mt-1 text-base text-[var(--control-navy)]">{{ record.summary }}</div>
                <p class="mt-1 text-sm text-slate-600">{{ record.title }}</p>
              </div>
              <small class="text-sm text-stone-500">{{ formatDateTime(record.savedAt) }}</small>
            </div>
            <div class="mt-3 flex flex-wrap gap-2">
              <button class="button-secondary" @click="$emit('restoreSession', record.slotId)">继续这局</button>
              <button class="button-secondary" @click="$emit('deleteSave', record.slotId)">删除记录</button>
            </div>
          </article>

          <article v-for="record in saveCatalog.incompatible" :key="record.slotId" class="panel-soft px-4 py-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <strong class="text-sm text-slate-900">{{ record.title }}</strong>
                <p class="mt-1 text-sm text-slate-600">版本 {{ record.version }} 与当前实现不兼容。</p>
              </div>
              <button class="button-secondary border-rose-500/20 text-rose-700 hover:border-rose-500/32" @click="$emit('deleteSave', record.slotId)">
                清理旧档
              </button>
            </div>
          </article>
        </div>
      </div>
    </article>
  </div>
</template>
