import { computed, ref } from "vue";
import { deleteSaveRecord, listSaveRecords, loadSaveRecord, saveAutosave, saveSession } from "@/persistence/storage";
import { getObjectiveStatus, settleTurn, summarizePlan } from "@/simulation/engine";
import { createDefaultPlan, createInitialState, DIFFICULTIES, getDifficulty, getScenario, SCENARIOS } from "@/simulation/scenarios";
import type {
  DifficultySummary,
  DraftPlan,
  ModalState,
  ObjectiveStatus,
  PreviewSummary,
  SaveCatalog,
  ScenarioSummary,
  SessionSnapshot,
  SessionState
} from "@/types/app";
import { DECISION_FIELD_DEFS, QUICK_START_STEPS, buildDecisionPresets, buildHelpSections, buildTurnGuideItems, createPlanFromPreset } from "@/ui/playbook";
import { saveSlotLabel } from "@/ui/formatters";

function createSimulatorApp() {
  const scenarioId = ref<string>(SCENARIOS[0].id);
  const difficultyId = ref<string>(DIFFICULTIES[1].id);
  const companyName = ref<string>(getScenario(SCENARIOS[0].id).defaultCompanyName);
  const helpOpen = ref<boolean>(false);
  const liveMessage = ref<string>("");
  const modal = ref<ModalState | null>(null);
  const saveCatalog = ref<SaveCatalog>(listSaveRecords() as SaveCatalog);
  const session = ref<SessionSnapshot | null>(null);

  const scenarios = SCENARIOS as unknown as ScenarioSummary[];
  const difficulties = DIFFICULTIES as DifficultySummary[];

  const currentScenario = computed(() => getScenario(scenarioId.value) as unknown as ScenarioSummary);
  const currentDifficulty = computed(() => getDifficulty(difficultyId.value) as DifficultySummary);
  const preview = computed<PreviewSummary | null>(() =>
    session.value ? (summarizePlan(session.value.state, session.value.draftPlan) as PreviewSummary) : null
  );
  const objectiveStatus = computed<ObjectiveStatus | null>(() =>
    session.value ? (getObjectiveStatus(session.value.state) as ObjectiveStatus) : null
  );
  const decisionPresets = computed(() => (session.value ? buildDecisionPresets(session.value.state) : []));
  const helpSections = computed(() => buildHelpSections(session.value?.state ?? null, objectiveStatus.value));
  const turnGuideItems = computed(() =>
    session.value && preview.value && objectiveStatus.value
      ? buildTurnGuideItems(session.value.state, preview.value, objectiveStatus.value)
      : []
  );
  const autoSaveStamp = computed(() =>
    saveCatalog.value.compatible.find((item) => item.slotId === "auto")?.savedAt
  );
  const canAdvance = computed(
    () => Boolean(session.value && preview.value && preview.value.errors.length === 0 && session.value.state.status === "playing")
  );

  function refreshSaveCatalog() {
    saveCatalog.value = listSaveRecords() as SaveCatalog;
  }

  function announce(message: string) {
    liveMessage.value = message;
  }

  function openHelp() {
    helpOpen.value = true;
  }

  function closeHelp() {
    helpOpen.value = false;
  }

  function createSession(state: SessionState): SessionSnapshot {
    return {
      draftPlan: createDefaultPlan(state) as DraftPlan,
      state
    };
  }

  function startScenario() {
    const state = createInitialState({
      companyName: companyName.value,
      difficultyId: difficultyId.value,
      scenarioId: scenarioId.value
    }) as SessionState;

    session.value = createSession(state);
    announce(`已启动 ${state.companyName} 的新经营局。`);
    return true;
  }

  function restoreSession(slotId: string) {
    const snapshot = loadSaveRecord(slotId) as SessionSnapshot | null;
    if (!snapshot) {
      announce("这个存档不可用，可能已经失效。");
      refreshSaveCatalog();
      return false;
    }

    session.value = snapshot;
    scenarioId.value = snapshot.state.scenarioId;
    difficultyId.value = snapshot.state.difficultyId;
    companyName.value = snapshot.state.companyName;
    refreshSaveCatalog();
    announce(`已读取 ${saveSlotLabel(slotId)}。`);
    return true;
  }

  function persistManualSave(slotId: string) {
    if (!session.value) {
      return;
    }

    saveSession(slotId, session.value, `${session.value.state.companyName} ${saveSlotLabel(slotId)}`);
    refreshSaveCatalog();
    announce(`已保存到 ${saveSlotLabel(slotId)}。`);
  }

  function advanceTurn() {
    if (!session.value) {
      return;
    }

    const result = settleTurn(session.value.state, session.value.draftPlan);
    if (!result.ok) {
      announce("当前方案未通过校验，请先修正错误项。");
      return;
    }

    session.value = {
      draftPlan: result.nextDefaultPlan as DraftPlan,
      state: result.state as SessionState
    };
    saveAutosave(session.value);
    refreshSaveCatalog();
    announce(
      result.state.status === "playing"
        ? `已推进到第 ${result.state.turn} 期，并写入自动存档。`
        : `本局已结束：${result.state.status === "won" ? "经营成功" : "经营失败"}。`
    );
  }

  function resetScenario() {
    if (!session.value) {
      return;
    }

    const state = createInitialState({
      companyName: session.value.state.companyName,
      difficultyId: session.value.state.difficultyId,
      scenarioId: session.value.state.scenarioId
    }) as SessionState;
    session.value = createSession(state);
    announce("当前场景已重新开局。");
  }

  function backToMenu() {
    modal.value = null;
    announce("已返回开局面板。");
  }

  function confirmModal() {
    if (!modal.value) {
      return null;
    }

    const { action, slotId } = modal.value;

    if (action === "delete-save" && slotId) {
      deleteSaveRecord(slotId);
      refreshSaveCatalog();
      announce(`${saveSlotLabel(slotId)} 已删除。`);
    }

    if (action === "restart-run") {
      resetScenario();
    }

    if (action === "back-to-menu") {
      backToMenu();
      return action;
    }

    modal.value = null;
    return action;
  }

  function updateDraftField(field: keyof DraftPlan, value: number) {
    if (!session.value) {
      return;
    }

    session.value = {
      ...session.value,
      draftPlan: {
        ...session.value.draftPlan,
        [field]: Number.isFinite(value) ? value : 0
      }
    };
  }

  function applyDecisionPreset(presetId: string) {
    if (!session.value) {
      return;
    }

    const nextPlan = createPlanFromPreset(session.value.state, presetId);
    const preset = buildDecisionPresets(session.value.state).find((item) => item.id === presetId);

    session.value = {
      ...session.value,
      draftPlan: nextPlan as DraftPlan
    };
    announce(`已套用${preset?.title ?? "策略模板"}，请再看一眼提交前摘要。`);
  }

  function selectScenario(nextId: string) {
    scenarioId.value = nextId;
    companyName.value = getScenario(nextId).defaultCompanyName;
  }

  function selectDifficulty(nextId: string) {
    difficultyId.value = nextId;
  }

  function openDeleteModal(slotId: string) {
    modal.value = {
      action: "delete-save",
      body: `确认删除 ${saveSlotLabel(slotId)} 吗？这个操作无法撤销。`,
      slotId,
      title: "删除本地存档"
    };
  }

  function openRestartModal() {
    modal.value = {
      action: "restart-run",
      body: "将基于当前场景、当前难度和当前公司名重新开局，未保存的手动进度不会自动保留。",
      title: "重新开局"
    };
  }

  function openMenuModal() {
    modal.value = {
      action: "back-to-menu",
      body: "返回开局面板后，当前运行中的局面仍可通过自动存档继续读取。",
      title: "返回开局面板"
    };
  }

  function setCompanyName(value: string) {
    companyName.value = value;
  }

  return {
    applyDecisionPreset,
    autoSaveStamp,
    canAdvance,
    closeHelp,
    companyName,
    confirmModal,
    currentDifficulty,
    currentScenario,
    decisionFields: DECISION_FIELD_DEFS,
    decisionPresets,
    difficulties,
    difficultyId,
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
    quickStartSteps: QUICK_START_STEPS,
    saveCatalog,
    scenarioId,
    scenarios,
    selectDifficulty,
    selectScenario,
    session,
    setCompanyName,
    startScenario,
    advanceTurn,
    restoreSession,
    turnGuideItems,
    updateDraftField
  };
}

const simulatorApp = createSimulatorApp();

export function useSimulatorApp() {
  return simulatorApp;
}
