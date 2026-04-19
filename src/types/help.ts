import type { DraftPlan } from "./simulator";

export type GuideTone = "accent" | "neutral" | "success" | "warning";
export type DecisionFieldGroupKey = "finance" | "market" | "organization" | "production";

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
  group: DecisionFieldGroupKey;
  helper: string;
  label: string;
  step: number;
}

export interface DecisionQuickOption {
  label: string;
  value: number;
}

export interface DecisionWorkbenchField extends DecisionFieldDefinition {
  baseline: string;
  limitHint: string;
  max: number;
  min: number;
  quickOptions: DecisionQuickOption[];
}

export interface DecisionFieldGroup {
  description: string;
  fields: DecisionWorkbenchField[];
  id: DecisionFieldGroupKey;
  title: string;
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
