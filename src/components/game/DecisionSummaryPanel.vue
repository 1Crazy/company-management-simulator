<script setup lang="ts">
import type { PreviewSummary, SessionSnapshot } from "@/types/app";
import { formatCurrency, formatPercent, formatSignedCurrency } from "@/ui/formatters";

defineProps<{
  preview: PreviewSummary;
  session: SessionSnapshot;
}>();

defineEmits<{
  advanceTurn: [];
  openRestart: [];
}>();

function riskClass(riskLevel: PreviewSummary["riskLevel"]) {
  if (riskLevel === "stable") return "metric-chip-positive";
  if (riskLevel === "medium") return "metric-chip-warning";
  return "metric-chip-danger";
}

function riskLabel(riskLevel: PreviewSummary["riskLevel"]) {
  if (riskLevel === "stable") return "风险可控";
  if (riskLevel === "medium") return "需要复核";
  if (riskLevel === "high") return "风险偏高";
  return "先修硬错误";
}
</script>

<template>
  <section class="panel-soft grid gap-4 px-4 py-4 xl:grid-cols-[minmax(0,1fr)_300px]">
    <div class="grid gap-4">
      <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div class="text-xs font-bold tracking-[0.12em] text-[var(--control-navy)]">提交前摘要</div>
          <h3 class="mt-1 text-lg font-semibold text-slate-900">先看关键约束，再决定要不要锁定本期</h3>
        </div>
        <span :class="riskClass(preview.riskLevel)">{{ riskLabel(preview.riskLevel) }}</span>
      </div>

      <div class="grid gap-3 md:grid-cols-2 min-[2200px]:grid-cols-4">
        <article class="panel-soft px-4 py-4">
          <span class="block text-xs font-bold tracking-[0.12em] text-slate-500">当期刚性流出</span>
          <strong class="metric-value-emphasis mono-title mt-2 block text-[var(--control-navy)]">{{ formatCurrency(preview.immediateOutflow) }}</strong>
        </article>

        <article class="panel-soft px-4 py-4">
          <span class="block text-xs font-bold tracking-[0.12em] text-slate-500">结算前现金缓冲</span>
          <strong class="metric-value-emphasis mono-title mt-2 block" :class="preview.projectedBuffer >= 0 ? 'text-emerald-700' : 'text-rose-700'">
            {{ formatSignedCurrency(preview.projectedBuffer) }}
          </strong>
        </article>

        <article class="panel-soft px-4 py-4">
          <span class="block text-xs font-bold tracking-[0.12em] text-slate-500">产能占用</span>
          <strong class="metric-value-emphasis mono-title mt-2 block text-[var(--control-navy)]">{{ formatPercent(preview.capacityUsage) }}</strong>
        </article>

        <article class="panel-soft px-4 py-4">
          <span class="block text-xs font-bold tracking-[0.12em] text-slate-500">期末债务</span>
          <strong class="metric-value-emphasis mono-title mt-2 block text-[var(--control-navy)]">{{ formatCurrency(preview.debtAfter) }}</strong>
        </article>
      </div>
    </div>

    <aside class="grid gap-3 rounded-[24px] border border-slate-900/8 bg-white/80 px-4 py-4">
      <div class="flex items-center justify-between gap-3">
        <strong class="text-base text-slate-900">操作建议</strong>
        <span class="guide-badge-subtle">第 {{ session.state.turn + 1 }} 期</span>
      </div>

      <div
        class="grid gap-2 rounded-[20px] border px-4 py-4"
        :class="
          preview.errors.length
            ? 'border-[rgba(156,82,75,0.22)] bg-[linear-gradient(180deg,rgba(252,241,240,0.94),rgba(247,232,229,0.88))]'
            : preview.warnings.length
              ? 'border-[rgba(143,111,56,0.18)] bg-[linear-gradient(180deg,rgba(255,249,235,0.94),rgba(247,238,214,0.86))]'
              : 'border-[rgba(63,110,106,0.18)] bg-[linear-gradient(180deg,rgba(239,250,247,0.94),rgba(226,242,237,0.86))]'
        "
        :role="preview.errors.length ? 'alert' : 'status'"
      >
        <template v-if="preview.errors.length">
          <div v-for="message in preview.errors" :key="message" class="flex items-start gap-3 text-sm leading-6 text-rose-700">
            <span class="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-current"></span>
            <span>{{ message }}</span>
          </div>
        </template>

        <template v-else-if="preview.warnings.length">
          <div v-for="message in preview.warnings.slice(0, 2)" :key="message" class="flex items-start gap-3 text-sm leading-6 text-amber-800">
            <span class="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-current"></span>
            <span>{{ message }}</span>
          </div>
        </template>

        <div v-else class="flex items-start gap-3 text-sm leading-6 text-emerald-700">
          <span class="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-current"></span>
          <span>当前方案已通过硬约束校验，可以进入本期结算。</span>
        </div>
      </div>

      <div class="grid gap-2">
        <button class="button-primary w-full" :disabled="session.state.status !== 'playing'" @click="$emit('advanceTurn')">锁定并结算本期</button>
        <button class="button-secondary w-full" @click="$emit('openRestart')">重开当前场景</button>
      </div>
    </aside>
  </section>
</template>
