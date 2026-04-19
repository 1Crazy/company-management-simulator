<script setup lang="ts">
import type { DifficultySummary, SaveCatalog, ScenarioSummary } from "@/types/app";
import type { QuickStartStep } from "@/types/help";
import QuickStartPanel from "./QuickStartPanel.vue";
import ScenarioSetupPanel from "./ScenarioSetupPanel.vue";
import ScenarioSidebarPanel from "./ScenarioSidebarPanel.vue";

defineProps<{
  companyName: string;
  currentDifficulty: DifficultySummary;
  currentScenario: ScenarioSummary;
  difficulties: DifficultySummary[];
  quickStartSteps: QuickStartStep[];
  saveCatalog: SaveCatalog;
  scenarioId: string;
  scenarios: ScenarioSummary[];
}>();

defineEmits<{
  deleteSave: [slotId: string];
  openHelp: [];
  restoreSession: [slotId: string];
  selectDifficulty: [id: string];
  selectScenario: [id: string];
  startScenario: [];
  updateCompanyName: [value: string];
}>();
</script>

<template>
  <section class="grid items-start gap-5 xl:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)]">
    <div class="grid gap-4">
      <ScenarioSetupPanel
        :company-name="companyName"
        :current-difficulty="currentDifficulty"
        :current-scenario="currentScenario"
        :difficulties="difficulties"
        :scenario-id="scenarioId"
        :scenarios="scenarios"
        @restore-auto="$emit('restoreSession', 'auto')"
        @select-difficulty="$emit('selectDifficulty', $event)"
        @select-scenario="$emit('selectScenario', $event)"
        @start-scenario="$emit('startScenario')"
        @update-company-name="$emit('updateCompanyName', $event)"
      />

      <QuickStartPanel
        :current-difficulty="currentDifficulty"
        :current-scenario="currentScenario"
        :steps="quickStartSteps"
        @open-help="$emit('openHelp')"
      />
    </div>

    <div class="xl:sticky xl:top-28">
      <ScenarioSidebarPanel
        :current-scenario="currentScenario"
        :save-catalog="saveCatalog"
        @delete-save="$emit('deleteSave', $event)"
        @restore-session="$emit('restoreSession', $event)"
      />
    </div>
  </section>
</template>
