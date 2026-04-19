<script setup lang="ts">
const props = defineProps<{
  finalScore: number | null;
  status: "lost" | "won";
  statusReasons: string[];
}>();

defineEmits<{
  openMenu: [];
  openRestart: [];
}>();

function bannerClass(status: "lost" | "won") {
  return status === "won"
    ? "border-[rgba(169,124,47,0.24)] bg-[linear-gradient(135deg,rgba(255,250,240,0.96),rgba(236,245,253,0.94)_52%,rgba(247,238,214,0.9))]"
    : "border-[rgba(156,82,75,0.22)] bg-[linear-gradient(135deg,rgba(251,242,241,0.95),rgba(239,245,252,0.93)_48%,rgba(246,232,229,0.9))]";
}

function title(status: "lost" | "won") {
  return status === "won" ? "董事会表决通过" : "经营战役失利";
}

function kicker(status: "lost" | "won") {
  return status === "won" ? "年度经营结算" : "结算复盘";
}

function scoreClass(status: "lost" | "won") {
  return status === "won"
    ? "border-[rgba(169,124,47,0.24)] bg-[linear-gradient(180deg,rgba(255,249,237,0.96),rgba(246,238,218,0.92))] text-[#7a5821]"
    : "border-[rgba(156,82,75,0.2)] bg-[linear-gradient(180deg,rgba(252,242,241,0.96),rgba(246,232,229,0.92))] text-[#8a4d47]";
}
</script>

<template>
  <section class="panel-surface panel-glow mb-4 overflow-hidden px-5 py-5" :class="bannerClass(status)">
    <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div class="min-w-0">
        <strong class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{{ kicker(status) }}</strong>
        <div class="mono-title mt-2 text-3xl text-[var(--control-navy)]">{{ title(status) }}</div>
        <div class="mt-3 inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold" :class="scoreClass(status)">
          最终得分 {{ finalScore ?? 0 }}
        </div>
      </div>

      <div class="grid max-w-2xl gap-2">
        <div
          v-for="reason in props.statusReasons"
          :key="reason"
          class="rounded-[18px] border border-white/60 bg-white/62 px-4 py-3 text-sm leading-6 text-slate-700 backdrop-blur-sm"
        >
          {{ reason }}
        </div>
      </div>
    </div>

    <div class="mt-4 flex flex-wrap gap-2">
      <button class="button-primary" @click="$emit('openRestart')">基于当前场景重开</button>
      <button class="button-secondary" @click="$emit('openMenu')">回到开局面板</button>
    </div>
  </section>
</template>
