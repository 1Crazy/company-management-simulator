<script setup lang="ts">
import type { SessionSnapshot } from "@/types/app";
import { formatCurrency, formatPercent, formatSignedCurrency } from "@/ui/formatters";

defineProps<{
  session: SessionSnapshot;
}>();
</script>

<template>
  <section class="grid gap-3 md:grid-cols-4">
    <article class="panel-surface panel-glow px-4 py-4">
      <span class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">现金</span>
      <div class="metric-value-emphasis mono-title mt-2 text-[var(--control-navy)]">{{ formatCurrency(session.state.cash) }}</div>
      <div
        class="mt-2 text-sm"
        :class="(session.state.lastReport?.deltas.cash ?? 0) >= 0 ? 'text-emerald-700' : 'text-rose-700'"
      >
        {{ session.state.lastReport ? formatSignedCurrency(session.state.lastReport.deltas.cash) : "等待首个结算" }}
      </div>
    </article>

    <article class="panel-surface panel-glow px-4 py-4">
      <span class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">累计利润</span>
      <div class="metric-value-emphasis mono-title mt-2 text-[var(--control-navy)]">{{ formatCurrency(session.state.accumulatedProfit) }}</div>
      <div
        class="mt-2 text-sm"
        :class="
          (session.state.lastReport?.financials.operatingProfit ?? 0) >= 0 ? 'text-emerald-700' : 'text-rose-700'
        "
      >
        {{ session.state.lastReport ? formatSignedCurrency(session.state.lastReport.financials.operatingProfit) : "暂无" }}
      </div>
    </article>

    <article class="panel-surface panel-glow px-4 py-4">
      <span class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">市场份额</span>
      <div class="metric-value-emphasis mono-title mt-2 text-[var(--control-navy)]">{{ formatPercent(session.state.marketShare) }}</div>
      <div class="mt-2 text-sm text-slate-600">{{ session.state.lastDemand ? `本期需求 ${session.state.lastDemand}` : "等待市场反馈" }}</div>
    </article>

    <article class="panel-surface panel-glow px-4 py-4">
      <span class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">质量 / 士气</span>
      <div class="metric-value-emphasis mono-title mt-2 text-[var(--control-navy)]">{{ Math.round(session.state.quality) }} / {{ Math.round(session.state.morale) }}</div>
      <div class="mt-2 text-sm text-slate-600">品牌 {{ Math.round(session.state.brand) }} / 产能 {{ session.state.capacity }}</div>
    </article>
  </section>
</template>
