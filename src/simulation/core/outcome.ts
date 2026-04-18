import type { OutcomeEvaluation, SimulationState } from "../../types/simulator";
import { getScenario } from "../data/lookups";
import { GAME_STATUS } from "../helpers/constants";
import { clamp } from "../helpers/math";
import { getObjectiveStatus } from "./objectives";

function computeFinalScore(state: SimulationState, targetsMet: number): number {
  const profitability = clamp(state.accumulatedProfit / 500000, 0, 1.4) * 32;
  const balanceSheet = clamp(state.cash / 900000, 0, 1.3) * 24;
  const market = clamp(state.marketShare / 0.22, 0, 1.3) * 18;
  const quality = clamp(state.quality / 85, 0, 1.2) * 14;
  const morale = clamp(state.morale / 85, 0, 1.2) * 6;
  const milestones = targetsMet * 4;
  return Math.round(profitability + balanceSheet + market + quality + morale + milestones);
}

export function evaluateOutcome(state: SimulationState): OutcomeEvaluation {
  const scenario = getScenario(state.scenarioId);
  const objectiveStatus = getObjectiveStatus(state);
  const reasons: string[] = [];

  if (state.cash <= scenario.parameters.cashFloor) {
    reasons.push("现金流彻底失守，董事会触发了紧急止损。");
  }

  if (state.consecutiveNegativeCash >= 3) {
    reasons.push("已经连续三个周期现金为负，经营无法继续。");
  }

  if (state.morale <= 24) {
    reasons.push("团队士气崩盘，执行效率已无法维持基本运营。");
  }

  if (state.quality <= 34) {
    reasons.push("质量指标跌破底线，市场信任与交付能力同时失效。");
  }

  if (reasons.length > 0) {
    return {
      finalScore: computeFinalScore(state, objectiveStatus.final.targetsMet),
      objectiveStatus,
      reasons,
      status: GAME_STATUS.LOST
    };
  }

  if (state.turn >= state.maxTurns) {
    const success = objectiveStatus.final.targetsMet >= objectiveStatus.final.minimumTargetsMet;
    return {
      finalScore: computeFinalScore(state, objectiveStatus.final.targetsMet),
      objectiveStatus,
      reasons: [
        success
          ? `完成了 ${objectiveStatus.final.targetsMet}/${objectiveStatus.final.minimumTargetsMet} 项核心年度目标。`
          : `仅完成了 ${objectiveStatus.final.targetsMet}/${objectiveStatus.final.minimumTargetsMet} 项核心年度目标。`
      ],
      status: success ? GAME_STATUS.WON : GAME_STATUS.LOST
    };
  }

  return {
    finalScore: null,
    objectiveStatus,
    reasons: [],
    status: GAME_STATUS.PLAYING
  };
}
