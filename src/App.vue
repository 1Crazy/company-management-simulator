<script setup lang="ts">
import AppTopBar from "@/components/common/AppTopBar.vue";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import HelpDrawer from "@/components/common/HelpDrawer.vue";
import GameScreen from "@/components/game/GameScreen.vue";
import MenuScreen from "@/components/setup/MenuScreen.vue";
import { useSimulatorApp } from "@/composables/useSimulatorApp";

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
  screen,
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

function tagClass(tone: string) {
  if (tone === "positive") return "metric-chip-positive";
  if (tone === "warning" || tone === "negative") return "metric-chip-warning";
  if (tone === "danger") return "metric-chip-danger";
  return "metric-chip-neutral";
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
    <div class="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(circle_at_top,rgba(30,64,175,0.18),transparent_58%)]"></div>
    <div class="pointer-events-none absolute right-[-120px] top-24 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.18),transparent_64%)] blur-3xl"></div>
    <div class="pointer-events-none absolute left-[-80px] top-[40%] h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.14),transparent_62%)] blur-3xl"></div>

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
        <MenuScreen
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
          @restore-session="restoreSession"
          @select-difficulty="selectDifficulty"
          @select-scenario="selectScenario"
          @start-scenario="startScenario"
          @update-company-name="setCompanyName"
        />

        <GameScreen
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
          @restore-session="restoreSession"
          @save-slot="persistManualSave"
          @update-field="updateDraftField"
        />
      </main>
    </div>

    <div class="sr-only" aria-live="polite">{{ liveMessage }}</div>

    <ConfirmModal :modal="modal" @close="modal = null" @confirm="confirmModal" />
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
