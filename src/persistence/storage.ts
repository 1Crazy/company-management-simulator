import { deepClone, SAVE_SLOTS, STORAGE_VERSION } from "@/simulation/model";
import type {
  CompatibleSaveRecord,
  IncompatibleSaveRecord,
  SaveCatalog,
  SaveEnvelope,
  SaveRecord,
  SaveSlotId,
  StorageLike
} from "@/types/save";
import type { SessionSnapshot } from "@/types/simulator";

const STORAGE_KEY = "company-management-simulator-saves";

function getStorage(): StorageLike | null {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return null;
  }

  return window.localStorage;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readSnapshot(value: unknown): SessionSnapshot | null {
  if (!isRecord(value) || !isRecord(value.draftPlan) || !isRecord(value.state)) {
    return null;
  }

  return value as unknown as SessionSnapshot;
}

function readEnvelope(): SaveEnvelope {
  const storage = getStorage();
  if (!storage) {
    return { slots: {} };
  }

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return { slots: {} };
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) {
      return { slots: {} };
    }

    return {
      slots: isRecord(parsed.slots) ? parsed.slots : {}
    };
  } catch {
    return { slots: {} };
  }
}

function writeEnvelope(envelope: SaveEnvelope): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(STORAGE_KEY, JSON.stringify(envelope));
}

function buildRecord(slotId: SaveSlotId, session: SessionSnapshot, title: string): SaveRecord {
  return {
    savedAt: new Date().toISOString(),
    scenarioId: session.state.scenarioId,
    slotId,
    snapshot: deepClone(session),
    title,
    version: STORAGE_VERSION
  };
}

function toCompatibleRecord(slotId: string, value: unknown): CompatibleSaveRecord | null {
  if (!isRecord(value) || value.version !== STORAGE_VERSION) {
    return null;
  }

  const snapshot = readSnapshot(value.snapshot);
  if (!snapshot) {
    return null;
  }

  return {
    savedAt: typeof value.savedAt === "string" ? value.savedAt : "",
    scenarioId: typeof value.scenarioId === "string" ? value.scenarioId : "",
    slotId,
    summary: snapshot.state?.companyName ?? String(value.title ?? slotId),
    title: typeof value.title === "string" ? value.title : slotId
  };
}

function toIncompatibleRecord(slotId: string, value: unknown): IncompatibleSaveRecord | null {
  if (!isRecord(value) || value.version === STORAGE_VERSION) {
    return null;
  }

  return {
    savedAt: typeof value.savedAt === "string" ? value.savedAt : "",
    slotId,
    title: typeof value.title === "string" ? value.title : slotId,
    version: typeof value.version === "number" || typeof value.version === "string" ? value.version : "unknown"
  };
}

export function listSaveRecords(): SaveCatalog {
  const envelope = readEnvelope();
  const compatible: CompatibleSaveRecord[] = [];
  const incompatible: IncompatibleSaveRecord[] = [];

  for (const [slotId, record] of Object.entries(envelope.slots)) {
    const compatibleRecord = toCompatibleRecord(slotId, record);
    if (compatibleRecord) {
      compatible.push(compatibleRecord);
      continue;
    }

    const incompatibleRecord = toIncompatibleRecord(slotId, record);
    if (incompatibleRecord) {
      incompatible.push(incompatibleRecord);
    }
  }

  compatible.sort((left, right) => right.savedAt.localeCompare(left.savedAt));

  return {
    compatible,
    incompatible,
    manualSlots: SAVE_SLOTS.map((slotId) => compatible.find((item) => item.slotId === slotId) ?? null)
  };
}

export function loadSaveRecord(slotId: string): SessionSnapshot | null {
  const record = readEnvelope().slots[slotId];
  const compatibleRecord = toCompatibleRecord(slotId, record);

  if (!compatibleRecord || !isRecord(record)) {
    return null;
  }

  const snapshot = readSnapshot(record.snapshot);
  return snapshot ? deepClone(snapshot) : null;
}

export function saveSession(slotId: SaveSlotId, session: SessionSnapshot, title: string): void {
  const envelope = readEnvelope();
  envelope.slots[slotId] = buildRecord(slotId, session, title);
  writeEnvelope(envelope);
}

export function saveAutosave(session: SessionSnapshot): void {
  saveSession("auto", session, `${session.state.companyName} 自动存档`);
}

export function deleteSaveRecord(slotId: string): void {
  const envelope = readEnvelope();
  delete envelope.slots[slotId];
  writeEnvelope(envelope);
}
