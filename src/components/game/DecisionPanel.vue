<script setup lang="ts">
import { getDifficulty, getScenario } from "@/simulation/scenarios";
import type { DraftPlan, PreviewSummary, SessionSnapshot } from "@/types/app";
import type { DecisionPreset } from "@/types/help";
import { formatCurrency, formatPercent, formatSignedCurrency } from "@/ui/formatters";
import { DECISION_FIELD_DEFS } from "@/ui/playbook";
import DecisionFieldCard from "./DecisionFieldCard.vue";

defineProps<{
  presets: DecisionPreset[];
  preview: PreviewSummary;
  session: SessionSnapshot;
}>();

defineEmits<{
  applyPreset: [presetId: string];
  advanceTurn: [];
  openRestart: [];
  updateField: [field: keyof DraftPlan, value: number];
}>();

function presetClass(tone: DecisionPreset["tone"]) {
  if (tone === "warning") return "border-amber-500/18 bg-amber-50/76";
  if (tone === "success") return "border-emerald-500/18 bg-emerald-50/76";
  return "border-[var(--control-navy)]/18 bg-[var(--control-navy-soft)]";
}

function riskClass(riskLevel: PreviewSummary["riskLevel"]) {
  if (riskLevel === "stable") return "metric-chip-positive";
  if (riskLevel === "medium") return "metric-chip-warning";
  return "metric-chip-danger";
}

function riskLabel(riskLevel: PreviewSummary["riskLevel"]) {
  if (riskLevel === "stable") return "风险可控";
  if (riskLevel === "medium") return "中等风险";
  if (riskLevel === "high") return "高风险方案";
  return "存在硬错误";
}
</script>

<template>
  <article class="panel-surface panel-glow px-5 py-5">
    <div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <div class="text-xs font-bold uppercase tracking-[0.12em] text-[var(--control-navy)]">Decision Room</div>
        <h2 class="mono-title mt-2 text-2xl text-[var(--control-navy)]">本回合经营方案</h2>
        <p class="mt-2 text-sm leading-6 text-slate-600">
          第 {{ session.state.turn + 1 }} / {{ session.state.maxTurns }} 期，{{ getScenario(session.state.scenarioId).title }} /
          {{ getDifficulty(session.state.difficultyId).label }}。
        </p>
      </div>
      <span :class="riskClass(preview.riskLevel)">{{ riskLabel(preview.riskLevel) }}</span>
    </div>

    <div class="mt-5 grid gap-4">
      <section>
        <div class="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Strategy Presets</div>
        <div class="grid gap-2 md:grid-cols-3">
          <button
            v-for="item in presets"
            :key="item.id"
            class="rounded-[22px] border px-4 py-3 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)]"
            :class="presetClass(item.tone)"
            @click="$emit('applyPreset', item.id)"
          >
            <div class="flex items-center justify-between gap-3">
              <h3 class="text-sm font-semibold text-slate-900">{{ item.title }}</h3>
              <span class="guide-badge-subtle">{{ item.id }}</span>
            </div>
            <p class="mt-2 text-xs leading-5 text-slate-600">{{ item.summary }}</p>
          </button>
        </div>
      </section>

      <article class="panel-soft px-4 py-4">
        <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div class="text-xs font-bold uppercase tracking-[0.12em] text-[var(--control-navy)]">Pre-Submit Review</div>
            <h3 class="mono-title mt-2 text-xl text-[var(--control-navy)]">提交前摘要</h3>
          </div>
          <span class="text-xs leading-5 text-slate-500">先看这四个数，再决定是否要继续加杠杆或砍投入。</span>
        </div>

        <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div class="panel-soft px-4 py-4">
            <span class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">当期刚性流出</span>
            <strong class="mono-title mt-2 block text-xl text-[var(--control-navy)]">{{ formatCurrency(preview.immediateOutflow) }}</strong>
          </div>
          <div class="panel-soft px-4 py-4">
            <span class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">结算前现金缓冲</span>
            <strong class="mono-title mt-2 block text-xl" :class="preview.projectedBuffer >= 0 ? 'text-emerald-700' : 'text-rose-700'">
              {{ formatSignedCurrency(preview.projectedBuffer) }}
            </strong>
          </div>
          <div class="panel-soft px-4 py-4">
            <span class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">产能占用</span>
            <strong class="mono-title mt-2 block text-xl text-[var(--control-navy)]">{{ formatPercent(preview.capacityUsage) }}</strong>
          </div>
          <div class="panel-soft px-4 py-4">
            <span class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">期末债务</span>
            <strong class="mono-title mt-2 block text-xl text-[var(--control-navy)]">{{ formatCurrency(preview.debtAfter) }}</strong>
          </div>
        </div>

        <div
          class="mt-4 grid gap-2 rounded-2xl border px-4 py-4"
          :class="preview.errors.length ? 'border-rose-500/22 bg-rose-50/80' : 'border-amber-500/18 bg-white/88'"
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
            <span>当前方案通过校验，可以推进到下一期。</span>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <button class="button-primary" :disabled="session.state.status !== 'playing'" @click="$emit('advanceTurn')">锁定并结算</button>
          <button class="button-secondary" @click="$emit('openRestart')">重开当前场景</button>
        </div>
      </article>

      <section>
        <div class="mb-3 flex items-center justify-between gap-3">
          <div class="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Decision Inputs</div>
          <span class="text-xs leading-5 text-slate-500">字段说明已经收进帮助面板，先把这一屏专注在操作上。</span>
        </div>

        <div class="grid gap-3 lg:grid-cols-2">
          <DecisionFieldCard
            v-for="item in DECISION_FIELD_DEFS"
            :key="item.field"
            :definition="item"
            :value="session.draftPlan[item.field]"
            @update="$emit('updateField', item.field, $event)"
          />
        </div>
      </section>
    </div>
  </article>
</template>
