<script setup lang="ts">
import type { SessionSnapshot } from "@/types/app";
import { createWaterfallChart } from "@/ui/charts";
import { formatCurrency, formatSignedCurrency } from "@/ui/formatters";

defineProps<{
  session: SessionSnapshot;
  tagClass: (tone: string) => string;
}>();
</script>

<template>
  <article class="panel-surface panel-glow px-5 py-5">
    <div class="text-xs font-bold uppercase tracking-[0.12em] text-[var(--control-navy)]">Board Report</div>
    <h2 class="mono-title mt-2 text-2xl text-[var(--control-navy)]">财务与经营反馈</h2>
    <p class="mt-3 text-sm leading-6 text-slate-600">
      {{
        session.state.lastReport
          ? `第 ${session.state.lastReport.turn} 期结算已完成，下面是本期的关键反馈。`
          : "推进首个周期后，这里会展示经营报表、影响标签和原因解释。"
      }}
    </p>

    <template v-if="session.state.lastReport">
      <div class="mt-4 grid gap-3">
        <article class="panel-soft px-4 py-4">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <strong class="text-sm text-slate-900">{{ session.state.lastReport.event.title }}</strong>
              <div class="mt-1 text-sm leading-6 text-slate-600">{{ session.state.lastReport.event.summary }}</div>
            </div>
            <span :class="tagClass(session.state.lastReport.event.tone)">{{ session.state.lastReport.event.tone }}</span>
          </div>
        </article>

        <div class="grid gap-3 md:grid-cols-2">
          <div class="panel-soft px-4 py-4">
            <span class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">营收</span>
            <strong class="mono-title mt-2 block text-xl text-[var(--control-navy)]">{{ formatCurrency(session.state.lastReport.financials.revenue) }}</strong>
          </div>
          <div class="panel-soft px-4 py-4">
            <span class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">经营利润</span>
            <strong
              class="mono-title mt-2 block text-xl"
              :class="session.state.lastReport.financials.operatingProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'"
            >
              {{ formatSignedCurrency(session.state.lastReport.financials.operatingProfit) }}
            </strong>
          </div>
          <div class="panel-soft px-4 py-4">
            <span class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">销量 / 需求</span>
            <strong class="mono-title mt-2 block text-xl text-[var(--control-navy)]">
              {{ session.state.lastReport.market.realizedSales }} / {{ session.state.lastReport.market.reachableDemand }}
            </strong>
          </div>
          <div class="panel-soft px-4 py-4">
            <span class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">库存</span>
            <strong class="mono-title mt-2 block text-xl text-[var(--control-navy)]">{{ session.state.lastReport.market.inventoryEnd }}</strong>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <span
            v-for="item in session.state.lastReport.impactLabels"
            :key="item.text"
            :class="tagClass(item.tone)"
          >
            {{ item.text }}
          </span>
        </div>

        <article v-for="item in session.state.lastReport.insights" :key="item.title" class="panel-soft px-4 py-4">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <strong class="text-sm text-slate-900">{{ item.title }}</strong>
            <span :class="tagClass(item.tone)">{{ item.tone }}</span>
          </div>
          <p class="mt-2 text-sm leading-6 text-slate-600">{{ item.body }}</p>
        </article>

        <article class="panel-soft px-4 py-4">
          <div
            class="grid gap-3"
            v-html="createWaterfallChart(session.state.lastReport.financials.cashFlowBridge, { title: '现金流桥', subtitle: '本期现金流入与流出的主要来源。' })"
          ></div>
        </article>
      </div>
    </template>

    <article v-else class="panel-soft mt-4 px-4 py-4">
      <strong class="text-sm text-slate-900">尚未生成报表</strong>
      <p class="mt-2 text-sm leading-6 text-slate-600">先提交第一期经营方案，系统会根据规则计算市场、利润、现金和事件反馈。</p>
    </article>
  </article>
</template>
