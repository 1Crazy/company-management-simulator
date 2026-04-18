import type { DraftPlan, SimulationState } from "../../types/simulator";
import { getDifficulty, getScenario } from "../data/lookups";
import { GAME_STATUS } from "../helpers/constants";
import { clamp } from "../helpers/math";
import { hashStringToSeed } from "../helpers/rng";

interface InitialStateInput {
  companyName: string;
  difficultyId: string;
  scenarioId: string;
}

export function createInitialState({ companyName, difficultyId, scenarioId }: InitialStateInput): SimulationState {
  const scenario = getScenario(scenarioId);
  const difficulty = getDifficulty(difficultyId);
  const resolvedCompanyName = companyName.trim() || scenario.defaultCompanyName;
  const opening = scenario.initial;

  return {
    accumulatedProfit: opening.accumulatedProfit,
    activeEvent: null,
    brand: opening.brand,
    capacity: opening.capacity,
    cash: opening.cash,
    companyName: resolvedCompanyName,
    consecutiveNegativeCash: 0,
    debt: opening.debt,
    difficultyId: difficulty.id,
    employees: opening.employees,
    finalScore: null,
    history: [],
    inventory: opening.inventory,
    lastDemand: 0,
    lastReport: null,
    marketShare: opening.marketShare,
    maxTurns: scenario.maxTurns,
    morale: opening.morale,
    quality: opening.quality,
    rngState: hashStringToSeed(`${scenario.id}|${difficulty.id}|${resolvedCompanyName}`),
    scenarioId: scenario.id,
    status: GAME_STATUS.PLAYING,
    statusReasons: [],
    turn: 0
  };
}

export function createDefaultPlan(state: SimulationState): DraftPlan {
  const scenario = getScenario(state.scenarioId);
  const params = scenario.parameters;
  // 默认方案刻意偏保守，避免首次进入场景时直接给出高风险动作。
  const expectedDemand = params.baseDemand * (0.84 + state.brand / 420);
  const desiredProduction = Math.round(clamp(expectedDemand, params.baseDemand * 0.65, state.capacity));

  return {
    borrowAmount: 0,
    capacityInvestment: 0,
    hiringChange: 0,
    marketingBudget: Math.round(params.recommendedMarketing),
    price: params.referencePrice,
    productionTarget: desiredProduction,
    repayAmount: Math.min(Math.round(state.debt * 0.04), Math.max(0, Math.round(state.cash * 0.05))),
    rndBudget: Math.round(params.recommendedRnD)
  };
}
