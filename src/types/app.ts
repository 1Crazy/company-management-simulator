export type ScreenMode = "game" | "menu";
export type ModalAction = "back-to-menu" | "delete-save" | "restart-run";

export type {
  DifficultyDefinition as DifficultySummary,
  DraftPlan,
  HistoryEntry,
  ImpactLabel,
  InsightItem,
  ObjectiveMilestoneStatus as ObjectiveMilestone,
  ObjectiveMilestoneItem as ObjectiveItem,
  ObjectiveStatus,
  PlanPreview as PreviewSummary,
  ScenarioDefinition as ScenarioSummary,
  SessionSnapshot,
  SimulationState as SessionState,
  TurnReport as PeriodReport
} from "./simulator";

export type {
  CompatibleSaveRecord as SaveRecordSummary,
  IncompatibleSaveRecord,
  SaveCatalog
} from "./save";

export interface ModalState {
  action: ModalAction;
  body: string;
  slotId?: string;
  title: string;
}
