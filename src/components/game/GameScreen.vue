<script setup lang="ts">
import type { DraftPlan, ObjectiveStatus, PreviewSummary, SaveCatalog, SessionSnapshot } from "@/types/app";
import type { DecisionPreset, TurnGuideItem } from "@/types/help";
import BoardReportPanel from "./BoardReportPanel.vue";
import ChartsPanel from "./ChartsPanel.vue";
import ControlTowerPanel from "./ControlTowerPanel.vue";
import DecisionPanel from "./DecisionPanel.vue";
import KpiGrid from "./KpiGrid.vue";
import StatusBanner from "./StatusBanner.vue";
import TurnGuidePanel from "./TurnGuidePanel.vue";

defineProps<{
  autoSaveStamp?: string;
  decisionPresets: DecisionPreset[];
  preview: PreviewSummary;
  saveCatalog: SaveCatalog;
  session: SessionSnapshot;
  objectiveStatus: ObjectiveStatus;
  tagClass: (tone: string) => string;
  turnGuideItems: TurnGuideItem[];
}>();

defineEmits<{
  advanceTurn: [];
  applyPreset: [presetId: string];
  openMenu: [];
  openHelp: [];
  openRestart: [];
  restoreSession: [slotId: string];
  saveSlot: [slotId: string];
  updateField: [field: keyof DraftPlan, value: number];
}>();
</script>

<template>
  <StatusBanner
    v-if="session.state.status !== 'playing'"
    :final-score="session.state.finalScore"
    :status="session.state.status"
    :status-reasons="session.state.statusReasons"
    @open-menu="$emit('openMenu')"
    @open-restart="$emit('openRestart')"
  />

  <KpiGrid :session="session" />

  <section class="mt-4 grid items-start gap-4 xl:grid-cols-[minmax(0,1.42fr)_340px]">
    <div class="grid gap-4 min-w-0">
      <DecisionPanel
        :presets="decisionPresets"
        :preview="preview"
        :session="session"
        @apply-preset="$emit('applyPreset', $event)"
        @advance-turn="$emit('advanceTurn')"
        @open-restart="$emit('openRestart')"
        @update-field="(field, value) => $emit('updateField', field, value)"
      />

      <BoardReportPanel :session="session" :tag-class="tagClass" />
    </div>

    <aside class="grid gap-4 xl:sticky xl:top-28">
      <TurnGuidePanel
        :items="turnGuideItems"
        :objective-status="objectiveStatus"
        :session="session"
        @open-help="$emit('openHelp')"
      />

      <ControlTowerPanel
        :objective-status="objectiveStatus"
        :save-catalog="saveCatalog"
        :session="session"
        @open-menu="$emit('openMenu')"
        @open-restart="$emit('openRestart')"
        @restore-session="$emit('restoreSession', $event)"
        @save-slot="$emit('saveSlot', $event)"
      />
    </aside>
  </section>

  <ChartsPanel
    :auto-save-stamp="autoSaveStamp"
    :session="session"
    @open-menu="$emit('openMenu')"
    @open-restart="$emit('openRestart')"
  />
</template>
