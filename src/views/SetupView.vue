<script setup lang="ts">
import MenuScreen from "@/components/setup/MenuScreen.vue";
import type { DifficultySummary, SaveCatalog, ScenarioSummary } from "@/types/app";
import type { QuickStartStep } from "@/types/help";

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
  <MenuScreen
    :company-name="companyName"
    :current-difficulty="currentDifficulty"
    :current-scenario="currentScenario"
    :difficulties="difficulties"
    :quick-start-steps="quickStartSteps"
    :save-catalog="saveCatalog"
    :scenario-id="scenarioId"
    :scenarios="scenarios"
    @delete-save="$emit('deleteSave', $event)"
    @open-help="$emit('openHelp')"
    @restore-session="$emit('restoreSession', $event)"
    @select-difficulty="$emit('selectDifficulty', $event)"
    @select-scenario="$emit('selectScenario', $event)"
    @start-scenario="$emit('startScenario')"
    @update-company-name="$emit('updateCompanyName', $event)"
  />
</template>
