import type { DraftPlan } from "./simulator";

export type GuideTone = "accent" | "neutral" | "success" | "warning";

export interface QuickStartStep {
  body: string;
  id: string;
  index: string;
  title: string;
}

export interface HelpSection {
  bullets: string[];
  description: string;
  id: string;
  label: string;
  title: string;
  tone: GuideTone;
}

export interface DecisionFieldDefinition {
  detail: string;
  field: keyof DraftPlan;
  helper: string;
  label: string;
  step: number;
}

export interface DecisionPreset {
  caution: string;
  id: string;
  summary: string;
  title: string;
  tone: GuideTone;
}

export interface TurnGuideItem {
  body: string;
  id: string;
  label: string;
  title: string;
  tone: GuideTone;
}
