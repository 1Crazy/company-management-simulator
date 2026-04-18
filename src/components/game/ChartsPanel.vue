<script setup lang="ts">
import { computed, ref } from "vue";
import type { SessionSnapshot } from "@/types/app";
import { createMultiSeriesChart } from "@/ui/charts";
import { formatCurrency, formatDateTime } from "@/ui/formatters";

type ChartView = "cash" | "finance" | "operations";

const props = defineProps<{
  autoSaveStamp?: string;
  session: SessionSnapshot;
}>();

defineEmits<{
  openMenu: [];
  openRestart: [];
}>();

const activeView = ref<ChartView>("finance");

const chartTabs: Array<{ id: ChartView; label: string; subtitle: string }> = [
  { id: "finance", label: "财务趋势", subtitle: "看营收和利润是否同步走强。" },
  { id: "cash", label: "现金韧性", subtitle: "看生存线有没有被持续压薄。" },
  { id: "operations", label: "组织状态", subtitle: "看质量和士气是否在透支。" }
];

const chartMarkup = computed(() => {
  if (activeView.value === "cash") {
    return createMultiSeriesChart(
      props.session.state.history,
      [{ color: "var(--control-success)", fill: "rgba(15, 159, 110, 0.12)", key: "cash", label: "现金" }],
      { title: "现金韧性", subtitle: "现金是第一道生死线，不能只盯利润。" }
    );
  }

  if (activeView.value === "operations") {
    return createMultiSeriesChart(
      props.session.state.history,
      [
        { color: "var(--control-navy)", fill: "rgba(20, 58, 123, 0.12)", key: "quality", label: "质量" },
        { color: "var(--control-amber)", key: "morale", label: "士气" }
      ],
      { title: "质量与士气", subtitle: "产品力和团队状态决定长周期上限。" }
    );
  }

  return createMultiSeriesChart(
    props.session.state.history,
    [
      { color: "var(--control-navy)", fill: "rgba(20, 58, 123, 0.12)", key: "revenue", label: "营收" },
      { color: "var(--control-amber)", key: "profit", label: "经营利润" }
    ],
    { title: "营收与利润趋势", subtitle: "观察营收增长和利润拐点是否同步出现。" }
  );
});

function tabClass(tabId: ChartView) {
  return activeView.value === tabId
    ? "border-transparent bg-[var(--control-navy)] text-white shadow-[0_10px_24px_rgba(20,58,123,0.18)]"
    : "border-slate-900/10 bg-white/88 text-slate-700 hover:border-[var(--control-navy)]/22 hover:bg-white";
}
</script>

<template>
  <section class="mt-4 grid items-start gap-4 xl:grid-cols-[minmax(0,1.22fr)_minmax(300px,0.78fr)]">
    <article class="panel-surface panel-glow px-4 py-4">
      <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div class="text-xs font-bold uppercase tracking-[0.12em] text-[var(--control-navy)]">Trend Lens</div>
          <h2 class="mono-title mt-2 text-2xl text-[var(--control-navy)]">趋势观察</h2>
          <p class="mt-2 text-sm leading-6 text-slate-600">不再把图表全部堆开，按问题切换查看，减少纵向滚动。</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            v-for="tab in chartTabs"
            :key="tab.id"
            class="status-pill transition duration-200"
            :class="tabClass(tab.id)"
            @click="activeView = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="mt-4 rounded-[24px] border border-slate-900/8 bg-white/82 px-4 py-4">
        <div class="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
          {{ chartTabs.find((item) => item.id === activeView)?.subtitle }}
        </div>
        <div v-html="chartMarkup"></div>
      </div>
    </article>

    <article class="panel-surface panel-glow px-5 py-5">
      <div class="grid gap-3">
        <div>
          <div class="text-xs font-bold uppercase tracking-[0.12em] text-[var(--control-navy)]">Operating Status</div>
          <h2 class="mono-title mt-2 text-2xl text-[var(--control-navy)]">经营状态面板</h2>
          <p class="mt-2 text-sm leading-6 text-slate-600">保留当前局面最值得盯的状态值，不再单独占一整行。</p>
        </div>

        <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
          <div class="panel-soft px-4 py-4">
            <span class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">债务</span>
            <strong class="mono-title mt-2 block text-xl text-[var(--control-navy)]">{{ formatCurrency(session.state.debt) }}</strong>
          </div>
          <div class="panel-soft px-4 py-4">
            <span class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">品牌</span>
            <strong class="mono-title mt-2 block text-xl text-[var(--control-navy)]">{{ Math.round(session.state.brand) }}</strong>
          </div>
          <div class="panel-soft px-4 py-4">
            <span class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">员工规模</span>
            <strong class="mono-title mt-2 block text-xl text-[var(--control-navy)]">{{ session.state.employees }} 人</strong>
          </div>
          <div class="panel-soft px-4 py-4">
            <span class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">自动存档</span>
            <strong class="mono-title mt-2 block text-xl text-[var(--control-navy)]">{{ formatDateTime(autoSaveStamp) }}</strong>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <button class="button-secondary" @click="$emit('openMenu')">回到开局面板</button>
          <button class="button-secondary" @click="$emit('openRestart')">重新开局</button>
        </div>
      </div>
    </article>
  </section>
</template>
