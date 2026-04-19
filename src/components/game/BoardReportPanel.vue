<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import type { SessionSnapshot } from "@/types/app";
import { createWaterfallChart } from "@/ui/charts";
import { formatCurrency, formatSignedCurrency } from "@/ui/formatters";

const props = defineProps<{
  session: SessionSnapshot;
  tagClass: (tone: string) => string;
}>();

const celebrateTurn = ref<number | null>(null);
let celebrateTimer: number | null = null;

function toneLabel(tone: string) {
  if (tone === "positive") return "正向";
  if (tone === "negative" || tone === "danger") return "负向";
  if (tone === "warning") return "预警";
  return "中性";
}

function reportMilestones(session: SessionSnapshot) {
  return session.state.lastReport?.objectiveStatus.milestones ?? [];
}

function achievedMilestones(session: SessionSnapshot) {
  return reportMilestones(session).filter((item) => item.achieved).length;
}

function newlyAchievedMilestones(session: SessionSnapshot) {
  return session.state.lastReport?.newlyAchievedMilestones ?? [];
}

function finalTargetProgress(session: SessionSnapshot) {
  const final = session.state.lastReport?.objectiveStatus.final;
  if (!final) return 0;
  return Math.min(100, Math.round((final.targetsMet / Math.max(1, final.minimumTargetsMet)) * 100));
}

watch(
  () => props.session.state.lastReport?.turn ?? null,
  (nextTurn, previousTurn) => {
    if (previousTurn === null || nextTurn === null || nextTurn === previousTurn) {
      return;
    }

    if (!newlyAchievedMilestones(props.session).length) {
      return;
    }

    celebrateTurn.value = nextTurn;
    if (celebrateTimer !== null) {
      window.clearTimeout(celebrateTimer);
    }
    celebrateTimer = window.setTimeout(() => {
      if (celebrateTurn.value === nextTurn) {
        celebrateTurn.value = null;
      }
      celebrateTimer = null;
    }, 1600);
  }
);

onBeforeUnmount(() => {
  if (celebrateTimer !== null) {
    window.clearTimeout(celebrateTimer);
  }
});
</script>

<template>
  <article class="panel-surface panel-glow px-5 py-5">
    <div class="text-xs font-bold tracking-[0.12em] text-[var(--control-navy)]">经营复盘</div>
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
            <span :class="tagClass(session.state.lastReport.event.tone)">{{ toneLabel(session.state.lastReport.event.tone) }}</span>
          </div>
        </article>

        <article class="panel-soft px-4 py-4">
          <div class="flex items-center justify-between gap-3">
            <strong class="text-sm text-slate-900">上期落子</strong>
            <span class="guide-badge-subtle">已提交方案</span>
          </div>
          <div class="mt-3 flex flex-wrap gap-2">
            <span class="guide-badge-subtle">定价 {{ session.state.lastReport.plan.price }} 元</span>
            <span class="guide-badge-subtle">生产 {{ session.state.lastReport.plan.productionTarget }} 台</span>
            <span class="guide-badge-subtle">营销 {{ formatCurrency(session.state.lastReport.plan.marketingBudget) }}</span>
            <span class="guide-badge-subtle">研发 {{ formatCurrency(session.state.lastReport.plan.rndBudget) }}</span>
            <span class="guide-badge-subtle">融资 {{ formatCurrency(session.state.lastReport.plan.borrowAmount) }}</span>
            <span class="guide-badge-subtle">还款 {{ formatCurrency(session.state.lastReport.plan.repayAmount) }}</span>
          </div>
        </article>

        <article
          v-if="newlyAchievedMilestones(session).length"
          class="overflow-hidden rounded-[28px] border border-[rgba(169,124,47,0.22)] bg-[linear-gradient(135deg,rgba(255,249,236,0.98),rgba(237,245,253,0.96)_42%,rgba(247,238,214,0.94))] px-5 py-5 shadow-[0_16px_34px_rgba(24,45,74,0.1)]"
          :class="{ 'milestone-celebrate-card': celebrateTurn === session.state.lastReport.turn }"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div class="text-xs font-bold tracking-[0.16em] text-[#7a5821]">本期攻克里程碑</div>
              <h3 class="mono-title mt-2 text-2xl text-[var(--control-navy)]">董事会已记录你的阶段突破</h3>
              <p class="mt-2 text-sm leading-6 text-slate-700">本期有新的经营关口被正式攻克，这会直接抬高你完成年度目标的胜率。</p>
            </div>
            <span
              class="guide-badge"
              :class="{ 'milestone-celebrate-badge': celebrateTurn === session.state.lastReport.turn }"
            >
              {{ String(newlyAchievedMilestones(session).length).padStart(2, "0") }}
            </span>
          </div>

          <div class="mt-4 grid gap-3 md:grid-cols-2">
            <article
              v-for="milestone in newlyAchievedMilestones(session)"
              :key="`${milestone.turn}-${milestone.label}`"
              class="rounded-[22px] border border-[rgba(169,124,47,0.2)] bg-white/72 px-4 py-4 backdrop-blur-sm"
            >
              <div class="flex items-center justify-between gap-3">
                <strong class="text-sm text-slate-900">{{ milestone.label }}</strong>
                <span class="guide-badge-subtle">第 {{ milestone.turn }} 期</span>
              </div>
              <p class="mt-2 text-sm leading-6 text-slate-600">对应关口已全部过线，本轮经营成果已被计入年度达成进度。</p>
            </article>
          </div>
        </article>

        <div class="grid gap-3 md:grid-cols-2">
          <div class="panel-soft px-4 py-4 md:col-span-2">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span class="block text-xs font-bold tracking-[0.12em] text-slate-500">年度目标推进</span>
                <strong class="mono-title mt-2 block text-xl text-[var(--control-navy)]">
                  {{ session.state.lastReport.objectiveStatus.final.targetsMet }} / {{ session.state.lastReport.objectiveStatus.final.minimumTargetsMet }}
                </strong>
                <p class="mt-2 text-sm leading-6 text-slate-600">{{ session.state.lastReport.objectiveStatus.final.label }}</p>
              </div>
              <span class="guide-badge-subtle">{{ achievedMilestones(session) }} 道里程碑已攻克</span>
            </div>

            <div class="mt-4 h-3 overflow-hidden rounded-full bg-slate-900/8">
              <div
                class="h-full rounded-full bg-gradient-to-r from-[var(--control-navy)] via-[var(--control-sky)] to-[var(--control-gold)] shadow-[0_0_18px_rgba(192,151,72,0.18)]"
                :style="{ width: `${finalTargetProgress(session)}%` }"
              ></div>
            </div>
          </div>

          <div class="panel-soft px-4 py-4">
            <span class="block text-xs font-bold tracking-[0.12em] text-slate-500">营收</span>
            <strong class="mono-title mt-2 block text-xl text-[var(--control-navy)]">{{ formatCurrency(session.state.lastReport.financials.revenue) }}</strong>
          </div>
          <div class="panel-soft px-4 py-4">
            <span class="block text-xs font-bold tracking-[0.12em] text-slate-500">经营利润</span>
            <strong
              class="mono-title mt-2 block text-xl"
              :class="session.state.lastReport.financials.operatingProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'"
            >
              {{ formatSignedCurrency(session.state.lastReport.financials.operatingProfit) }}
            </strong>
          </div>
          <div class="panel-soft px-4 py-4">
            <span class="block text-xs font-bold tracking-[0.12em] text-slate-500">销量 / 需求</span>
            <strong class="mono-title mt-2 block text-xl text-[var(--control-navy)]">
              {{ session.state.lastReport.market.realizedSales }} / {{ session.state.lastReport.market.reachableDemand }}
            </strong>
          </div>
          <div class="panel-soft px-4 py-4">
            <span class="block text-xs font-bold tracking-[0.12em] text-slate-500">库存</span>
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
            <span :class="tagClass(item.tone)">{{ toneLabel(item.tone) }}</span>
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
