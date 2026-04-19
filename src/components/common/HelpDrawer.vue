<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from "vue";
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

const originalBodyOverflow = typeof document !== "undefined" ? document.body.style.overflow : "";
const originalBodyOverscroll = typeof document !== "undefined" ? document.body.style.overscrollBehavior : "";
const originalBodyPosition = typeof document !== "undefined" ? document.body.style.position : "";
const originalBodyTop = typeof document !== "undefined" ? document.body.style.top : "";
const originalBodyWidth = typeof document !== "undefined" ? document.body.style.width : "";
let lockedScrollY = 0;

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && props.open) {
    emit("close");
  }
}

function syncBodyScrollLock(open: boolean) {
  if (typeof document === "undefined") {
    return;
  }

  if (open) {
    lockedScrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.width = "100%";
    return;
  }

  document.body.style.overflow = originalBodyOverflow;
  document.body.style.overscrollBehavior = originalBodyOverscroll;
  document.body.style.position = originalBodyPosition;
  document.body.style.top = originalBodyTop;
  document.body.style.width = originalBodyWidth;
  window.scrollTo(0, lockedScrollY);
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  syncBodyScrollLock(false);
});

watch(
  () => props.open,
  (open) => {
    syncBodyScrollLock(open);
  },
  { immediate: true }
);

function sectionToneClass(tone: HelpSection["tone"]) {
  if (tone === "warning") return "border-[rgba(143,111,56,0.16)] bg-[rgba(143,111,56,0.1)]";
  if (tone === "success") return "border-[rgba(63,110,106,0.16)] bg-[rgba(63,110,106,0.1)]";
  if (tone === "accent") return "border-[rgba(31,63,102,0.16)] bg-[rgba(43,86,138,0.1)]";
  return "border-slate-900/8 bg-[rgba(244,248,253,0.94)]";
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
    <aside class="relative ml-auto flex h-full w-full max-w-[780px] flex-col overflow-hidden rounded-[32px] border border-[rgba(31,63,102,0.12)] bg-[linear-gradient(180deg,rgba(248,250,253,0.98),rgba(237,243,249,0.96))] shadow-[0_24px_56px_rgba(24,45,74,0.2)]">
      <div class="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(90deg,rgba(226,194,122,0.18),rgba(93,134,181,0.14)_30%,transparent_54%,rgba(31,63,102,0.1))]"></div>

      <header class="relative border-b border-[rgba(31,63,102,0.08)] bg-white/64 px-6 py-5 backdrop-blur-xl">
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-4">
            <div class="flex h-14 w-14 items-center justify-center rounded-[18px] border border-[rgba(226,194,122,0.34)] bg-[linear-gradient(180deg,rgba(226,194,122,0.96),rgba(94,132,175,0.98)_22%,rgba(39,74,114,0.98)_72%,rgba(24,53,85,0.98))] shadow-[0_10px_22px_rgba(22,46,77,0.18)]">
              <span class="mono-title text-2xl text-white">策</span>
            </div>

            <div>
              <div class="section-kicker">{{ screen === "game" ? "局内参谋手册" : "开局作战简报" }}</div>
              <h2 id="help-drawer-title" class="mono-title mt-3 text-2xl text-[var(--control-ink)]">玩法手册与经营字段</h2>
              <p class="mt-3 max-w-2xl text-sm leading-6 text-stone-700">
                当前剧本是「{{ currentScenarioTitle }}」。这里整理了开局步骤、经营提示和 8 个决策字段，卡住时可以随时回来复盘。
              </p>
            </div>
          </div>

          <button class="button-secondary shrink-0" @click="$emit('close')">收起手册</button>
        </div>
      </header>

      <div class="relative flex-1 overflow-y-auto px-6 py-6">
        <section>
          <div class="flex items-center justify-between gap-3">
            <div class="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">三步上手</div>
            <span class="guide-badge-subtle">先看这一列</span>
          </div>
          <div class="mt-4 grid gap-3 md:grid-cols-3">
            <article v-for="step in steps" :key="step.id" class="guide-card">
              <div class="flex items-center justify-between gap-3">
                <span class="guide-badge">{{ step.index }}</span>
                <span class="guide-badge-subtle">经营回环</span>
              </div>
              <h3 class="mt-4 text-base font-semibold text-slate-900">{{ step.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-slate-600">{{ step.body }}</p>
            </article>
          </div>
          <div class="tactical-note mt-4">先围绕目标和现金安全垫定节奏，再决定本期是冲增长还是先守住经营质量。</div>
        </section>

        <section class="mt-6">
          <div class="flex items-center justify-between gap-3">
            <div class="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">经营提示</div>
            <span class="guide-badge-subtle">局内速查</span>
          </div>
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
                  <span class="mt-2 h-2 w-2 rounded-full bg-[rgba(74,117,165,0.88)]"></span>
                  <span>{{ bullet }}</span>
                </li>
              </ul>
            </article>
          </div>
        </section>

        <section class="mt-6">
          <div class="flex items-center justify-between gap-3">
            <div class="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">决策字段</div>
            <span class="guide-badge-subtle">共 8 项</span>
          </div>
          <div class="mt-4 grid gap-3 md:grid-cols-2">
            <article v-for="item in decisionFields" :key="item.field" class="panel-soft px-4 py-4">
              <div class="flex items-start justify-between gap-3">
                <h3 class="text-base font-semibold text-slate-900">{{ item.label }}</h3>
                <span class="guide-badge-subtle">调整步长 {{ item.step }}</span>
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
