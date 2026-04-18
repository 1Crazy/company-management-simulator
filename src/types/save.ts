import type { SessionSnapshot } from "./simulator";

export type ManualSaveSlotId = "slot-1" | "slot-2" | "slot-3";
export type SaveSlotId = "auto" | ManualSaveSlotId | (string & {});

export interface SaveRecord {
  savedAt: string;
  scenarioId: string;
  slotId: string;
  snapshot: SessionSnapshot;
  title: string;
  version: number;
}

export interface SaveEnvelope {
  slots: Record<string, unknown>;
}

export interface CompatibleSaveRecord {
  savedAt: string;
  scenarioId: string;
  slotId: string;
  summary: string;
  title: string;
}

export interface IncompatibleSaveRecord {
  savedAt: string;
  slotId: string;
  title: string;
  version: number | string;
}

export interface SaveCatalog {
  compatible: CompatibleSaveRecord[];
  incompatible: IncompatibleSaveRecord[];
  manualSlots: Array<CompatibleSaveRecord | null>;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
