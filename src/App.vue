<script setup lang="ts">
import { computed, watchEffect } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import AppTopBar from "@/components/common/AppTopBar.vue";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import HelpDrawer from "@/components/common/HelpDrawer.vue";
import { buildPageTitle } from "@/router/page-title";
import type { ScreenMode } from "@/types/app";
import { useSimulatorApp } from "@/composables/useSimulatorApp";

const route = useRoute();
const router = useRouter();

const {
  applyDecisionPreset,
  autoSaveStamp,
  canAdvance,
  closeHelp,
  companyName,
  confirmModal,
  decisionFields,
  decisionPresets,
  currentDifficulty,
  currentScenario,
  difficulties,
  helpOpen,
  helpSections,
  liveMessage,
  modal,
  objectiveStatus,
  openDeleteModal,
  openHelp,
  openMenuModal,
  openRestartModal,
  persistManualSave,
  preview,
  quickStartSteps,
  saveCatalog,
  scenarioId,
  scenarios,
  selectDifficulty,
  selectScenario,
  session,
  setCompanyName,
  startScenario,
  advanceTurn,
  restoreSession,
  turnGuideItems,
  updateDraftField
} = useSimulatorApp();

const screen = computed<ScreenMode>(() => (route.name === "game" ? "game" : "menu"));

watchEffect(() => {
  document.title = buildPageTitle(screen.value, session.value?.state.companyName);
});

function tagClass(tone: string) {
  if (tone === "positive") return "metric-chip-positive";
  if (tone === "warning" || tone === "negative") return "metric-chip-warning";
  if (tone === "danger") return "metric-chip-danger";
  return "metric-chip-neutral";
}

async function navigateToGame() {
  if (route.name !== "game") {
    await router.push({ name: "game" });
  }
}

async function navigateToSetup() {
  if (route.name !== "setup") {
    await router.push({ name: "setup" });
  }
}

async function handleStartScenario() {
  if (!startScenario()) {
    return;
  }

  await navigateToGame();
}

async function handleRestoreSession(slotId: string) {
  if (!restoreSession(slotId)) {
    return;
  }

  await navigateToGame();
}

async function handleConfirmModal() {
  const action = confirmModal();
  if (action === "back-to-menu") {
    await navigateToSetup();
  }
}
</script>

<template>
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[var(--control-navy)] focus:px-4 focus:py-2 focus:text-white"
  >
    跳到主内容
  </a>

  <div class="relative isolate min-h-screen overflow-hidden">
    <div class="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(circle_at_top,rgba(95,136,179,0.16),transparent_58%)]"></div>
    <div class="pointer-events-none absolute right-[-120px] top-24 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(35,74,115,0.14),transparent_64%)] blur-3xl"></div>
    <div class="pointer-events-none absolute left-[-80px] top-[40%] h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,rgba(35,74,115,0.12),transparent_62%)] blur-3xl"></div>

    <div class="mx-auto w-full max-w-[1440px] px-3 py-5 md:px-4">
      <AppTopBar
        :auto-save-stamp="autoSaveStamp"
        :can-advance="canAdvance"
        :current-difficulty-label="currentDifficulty.label"
        :current-scenario-title="currentScenario.title"
        :help-open="helpOpen"
        :preview="preview"
        :screen="screen"
        :session="session"
        @advance-turn="advanceTurn"
        @open-help="openHelp"
        @quick-save="persistManualSave('slot-1')"
      />

      <main id="main-content">
        <RouterView v-slot="{ Component }">
          <component
            :is="Component"
            v-if="screen === 'menu'"
            :company-name="companyName"
            :current-difficulty="currentDifficulty"
            :current-scenario="currentScenario"
            :difficulties="difficulties"
            :quick-start-steps="quickStartSteps"
            :save-catalog="saveCatalog"
            :scenario-id="scenarioId"
            :scenarios="scenarios"
            @delete-save="openDeleteModal"
            @open-help="openHelp"
            @restore-session="handleRestoreSession"
            @select-difficulty="selectDifficulty"
            @select-scenario="selectScenario"
            @start-scenario="handleStartScenario"
            @update-company-name="setCompanyName"
          />

          <component
            :is="Component"
            v-else-if="session && preview && objectiveStatus"
            :auto-save-stamp="autoSaveStamp"
            :decision-presets="decisionPresets"
            :objective-status="objectiveStatus"
            :preview="preview"
            :save-catalog="saveCatalog"
            :session="session"
            :tag-class="tagClass"
            :turn-guide-items="turnGuideItems"
            @advance-turn="advanceTurn"
            @apply-preset="applyDecisionPreset"
            @open-help="openHelp"
            @open-menu="openMenuModal"
            @open-restart="openRestartModal"
            @restore-session="handleRestoreSession"
            @save-slot="persistManualSave"
            @update-field="updateDraftField"
          />
        </RouterView>
      </main>
    </div>

    <div class="sr-only" aria-live="polite">{{ liveMessage }}</div>

    <ConfirmModal :modal="modal" @close="modal = null" @confirm="handleConfirmModal" />
    <HelpDrawer
      :current-scenario-title="currentScenario.title"
      :decision-fields="decisionFields"
      :open="helpOpen"
      :screen="screen"
      :sections="helpSections"
      :steps="quickStartSteps"
      @close="closeHelp"
    />
  </div>
</template>
