<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import type { ScreenMode } from "@/types/app";
import type { DecisionFieldDefinition, HelpSection, QuickStartStep } from "@/types/help";

const props = defineProps<{
  currentScenarioTitle: string;
  decisionFields: DecisionFieldDefinition[];
  open: boolean;
  screen: ScreenMode;
  sections: HelpSection[];
  steps: QuickStartStep[];
}>();

const emit = defineEmits<{
  close: [];
}>();

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && props.open) {
    emit("close");
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});

function sectionToneClass(tone: HelpSection["tone"]) {
  if (tone === "warning") return "border-amber-500/18 bg-amber-50/80";
  if (tone === "success") return "border-emerald-500/18 bg-emerald-50/80";
  if (tone === "accent") return "border-[var(--control-navy)]/18 bg-[var(--control-navy-soft)]";
  return "border-slate-900/8 bg-white/90";
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-[180] bg-slate-950/34 px-3 py-3 backdrop-blur-md"
    role="dialog"
    aria-modal="true"
    aria-labelledby="help-drawer-title"
    @click.self="$emit('close')"
  >
    <aside class="ml-auto flex h-full w-full max-w-[760px] flex-col overflow-hidden rounded-[28px] border border-white/60 bg-[#f6f9fc] shadow-[0_28px_64px_rgba(15,23,42,0.22)]">
      <header class="border-b border-slate-900/8 bg-white/82 px-6 py-5 backdrop-blur-xl">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="text-xs font-bold uppercase tracking-[0.12em] text-[var(--control-navy)]">
              {{ screen === "game" ? "In-Run Help" : "Launch Briefing" }}
            </div>
            <h2 id="help-drawer-title" class="mono-title mt-2 text-2xl text-[var(--control-navy)]">玩法与字段说明</h2>
            <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              当前场景是 {{ currentScenarioTitle }}。这里把核心规则、回合步骤和 8 个决策字段都整理好了，随时可以打开看。
            </p>
          </div>

          <button class="button-secondary" @click="$emit('close')">关闭</button>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto px-6 py-6">
        <section>
          <div class="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Quick Start</div>
          <div class="mt-4 grid gap-3 md:grid-cols-3">
            <article v-for="step in steps" :key="step.id" class="guide-card">
              <span class="guide-badge">{{ step.index }}</span>
              <h3 class="mt-4 text-base font-semibold text-slate-900">{{ step.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-slate-600">{{ step.body }}</p>
            </article>
          </div>
        </section>

        <section class="mt-6">
          <div class="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Operating Notes</div>
          <div class="mt-4 grid gap-3">
            <article v-for="section in sections" :key="section.id" class="guide-card border" :class="sectionToneClass(section.tone)">
              <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div class="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{{ section.label }}</div>
                  <h3 class="mt-2 text-lg font-semibold text-slate-900">{{ section.title }}</h3>
                </div>
                <span class="guide-badge-subtle">{{ section.label }}</span>
              </div>
              <p class="mt-3 text-sm leading-6 text-slate-600">{{ section.description }}</p>
              <ul class="mt-4 grid gap-2">
                <li v-for="bullet in section.bullets" :key="bullet" class="flex items-start gap-3 text-sm leading-6 text-slate-700">
                  <span class="mt-2 h-2 w-2 rounded-full bg-[var(--control-amber)]"></span>
                  <span>{{ bullet }}</span>
                </li>
              </ul>
            </article>
          </div>
        </section>

        <section class="mt-6">
          <div class="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Decision Fields</div>
          <div class="mt-4 grid gap-3 md:grid-cols-2">
            <article v-for="item in decisionFields" :key="item.field" class="panel-soft px-4 py-4">
              <div class="flex items-start justify-between gap-3">
                <h3 class="text-base font-semibold text-slate-900">{{ item.label }}</h3>
                <span class="guide-badge-subtle">步进 {{ item.step }}</span>
              </div>
              <p class="mt-2 text-sm leading-6 text-slate-500">{{ item.helper }}</p>
              <p class="mt-3 text-sm leading-6 text-slate-600">{{ item.detail }}</p>
            </article>
          </div>
        </section>
      </div>
    </aside>
  </div>
</template>
