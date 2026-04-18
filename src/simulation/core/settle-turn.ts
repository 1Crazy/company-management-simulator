import type {
  ActiveEventSummary,
  HistoryEntry,
  SettlementResult,
  SimulationState,
  TurnDeltas,
  TurnReport
} from "../../types/simulator";
import { createDefaultPlan } from "./session";
import { calculateTurnResults } from "./turn-financials";
import { getObjectiveStatus } from "./objectives";
import { buildImpactLabels, buildInsights } from "./insights";
import { calculateMarketResponse } from "./market";
import { resolveEvent } from "./events";
import { evaluateOutcome } from "./outcome";
import { validatePlan } from "./plan-validation";
import { getDifficulty, getScenario } from "../data/lookups";
import { clamp, round } from "../helpers/math";
import { nextRandom } from "../helpers/rng";

export function settleTurn(state: SimulationState, rawPlan: Partial<TurnReport["plan"]>): SettlementResult {
  const scenario = getScenario(state.scenarioId);
  const difficulty = getDifficulty(state.difficultyId);
  const validation = validatePlan(state, rawPlan);

  if (!validation.valid) {
    return {
      ok: false,
      validation
    };
  }

  const plan = validation.plan;
  const eventSelection = resolveEvent(state, difficulty);
  const volatilityRoll = nextRandom(eventSelection.nextRngState);
  const event = eventSelection.event;
  const market = calculateMarketResponse({
    difficulty,
    event,
    plan,
    randomFactor: volatilityRoll.value,
    scenario,
    state
  });
  const turnResult = calculateTurnResults({
    difficulty,
    event,
    immediate: validation.summary,
    market,
    plan,
    scenario,
    state
  });
  const activeEvent: ActiveEventSummary = {
    id: event.id,
    summary: event.summary,
    title: event.title,
    tone: event.tone
  };
  const deltas: TurnDeltas = {
    brand: round(turnResult.brandDelta, 1),
    capacity: turnResult.addedCapacity,
    cash: turnResult.cashAfter - state.cash,
    debt: turnResult.debtAfter - state.debt,
    morale: round(turnResult.moraleDelta, 1),
    quality: round(turnResult.qualityDelta, 1)
  };
  const historyEntry: HistoryEntry = {
    cash: turnResult.cashAfter,
    eventTitle: event.title,
    label: `M${String(state.turn + 1).padStart(2, "0")}`,
    marketShare: market.marketShare,
    morale: clamp(round(state.morale + turnResult.moraleDelta), 10, 100),
    profit: Math.round(turnResult.operatingProfit),
    quality: clamp(round(state.quality + turnResult.qualityDelta), 30, 100),
    revenue: Math.round(turnResult.revenue),
    turn: state.turn + 1
  };
  const nextState: SimulationState = {
    ...state,
    accumulatedProfit: Math.round(state.accumulatedProfit + turnResult.operatingProfit),
    activeEvent,
    brand: clamp(round(state.brand + turnResult.brandDelta), 20, 100),
    capacity: state.capacity + turnResult.addedCapacity,
    cash: turnResult.cashAfter,
    consecutiveNegativeCash: turnResult.cashAfter < 0 ? state.consecutiveNegativeCash + 1 : 0,
    debt: turnResult.debtAfter,
    employees: turnResult.employeesAfter,
    history: [...state.history, historyEntry],
    inventory: market.inventoryEnd,
    lastDemand: market.reachableDemand,
    lastReport: null,
    marketShare: market.marketShare,
    morale: historyEntry.morale,
    quality: historyEntry.quality,
    rngState: volatilityRoll.nextState,
    turn: state.turn + 1
  };
  const baseReport: TurnReport = {
    deltas,
    event: activeEvent,
    financials: {
      cashChange: Math.round(turnResult.cashChange),
      cashFlowBridge: [
        { label: "销售回款", value: turnResult.revenue },
        { label: "融资到账", value: plan.borrowAmount },
        { label: "制造成本", value: -turnResult.productionCost },
        { label: "薪酬", value: -validation.summary.payroll },
        { label: "营销", value: -plan.marketingBudget },
        { label: "研发", value: -plan.rndBudget },
        { label: "人力调整", value: -validation.summary.workforceChangeCost },
        { label: "扩产投资", value: -plan.capacityInvestment },
        { label: "利息", value: -turnResult.interest },
        { label: "还款", value: -plan.repayAmount }
      ],
      fixedOpsCost: scenario.parameters.fixedOpsCost + scenario.parameters.maintenanceCost,
      interest: turnResult.interest,
      operatingProfit: Math.round(turnResult.operatingProfit),
      productionCost: Math.round(turnResult.productionCost),
      revenue: Math.round(turnResult.revenue)
    },
    impactLabels: [],
    insights: [],
    market,
    objectiveStatus: getObjectiveStatus(nextState),
    plan,
    turn: nextState.turn,
    warnings: validation.warnings
  };

  baseReport.impactLabels = buildImpactLabels({
    deltas,
    event,
    market,
    plan,
    report: baseReport,
    scenario
  });
  baseReport.insights = buildInsights({
    deltas,
    event,
    market,
    plan,
    report: baseReport,
    scenario,
    state
  });

  const stateWithReport: SimulationState = {
    ...nextState,
    lastReport: baseReport
  };
  const outcome = evaluateOutcome(stateWithReport);
  baseReport.objectiveStatus = outcome.objectiveStatus;

  const finalState: SimulationState = {
    ...stateWithReport,
    finalScore: outcome.finalScore,
    status: outcome.status,
    statusReasons: outcome.reasons
  };

  return {
    nextDefaultPlan: createDefaultPlan(finalState),
    objectiveStatus: outcome.objectiveStatus,
    ok: true,
    report: baseReport,
    state: finalState,
    validation
  };
}
