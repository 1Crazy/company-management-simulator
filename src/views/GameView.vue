<script setup lang="ts">
import GameScreen from "@/components/game/GameScreen.vue";
import type { DraftPlan, ObjectiveStatus, PreviewSummary, SaveCatalog, SessionSnapshot } from "@/types/app";
import type { DecisionPreset, TurnGuideItem } from "@/types/help";

defineProps<{
  autoSaveStamp?: string;
  decisionPresets: DecisionPreset[];
  objectiveStatus: ObjectiveStatus;
  preview: PreviewSummary;
  saveCatalog: SaveCatalog;
  session: SessionSnapshot;
  tagClass: (tone: string) => string;
  turnGuideItems: TurnGuideItem[];
}>();

defineEmits<{
  advanceTurn: [];
  applyPreset: [presetId: string];
  openHelp: [];
  openMenu: [];
  openRestart: [];
  restoreSession: [slotId: string];
  saveSlot: [slotId: string];
  updateField: [field: keyof DraftPlan, value: number];
}>();
</script>

<template>
  <GameScreen
    :auto-save-stamp="autoSaveStamp"
    :decision-presets="decisionPresets"
    :objective-status="objectiveStatus"
    :preview="preview"
    :save-catalog="saveCatalog"
    :session="session"
    :tag-class="tagClass"
    :turn-guide-items="turnGuideItems"
    @advance-turn="$emit('advanceTurn')"
    @apply-preset="$emit('applyPreset', $event)"
    @open-help="$emit('openHelp')"
    @open-menu="$emit('openMenu')"
    @open-restart="$emit('openRestart')"
    @restore-session="$emit('restoreSession', $event)"
    @save-slot="$emit('saveSlot', $event)"
    @update-field="(field, value) => $emit('updateField', field, value)"
  />
</template>
