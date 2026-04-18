<script setup lang="ts">
defineProps<{
  finalScore: number | null;
  status: "lost" | "won";
  statusReasons: string[];
}>();

defineEmits<{
  openMenu: [];
  openRestart: [];
}>();
</script>

<template>
  <section
    class="panel-surface panel-glow mb-4 px-5 py-5"
    :class="status === 'won' ? 'border-emerald-600/20 bg-emerald-50/88' : 'border-rose-600/20 bg-rose-50/88'"
  >
    <strong class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
      {{ status === "won" ? "经营成功" : "经营失败" }}
    </strong>
    <div class="mono-title mt-2 text-2xl text-[var(--control-navy)]">最终得分 {{ finalScore ?? 0 }}</div>
    <p class="mt-3 text-sm leading-6 text-slate-600">{{ statusReasons.join(" ") }}</p>
    <div class="mt-4 flex flex-wrap gap-2">
      <button class="button-primary" @click="$emit('openRestart')">基于当前场景重开</button>
      <button class="button-secondary" @click="$emit('openMenu')">回到开局面板</button>
    </div>
  </section>
</template>
