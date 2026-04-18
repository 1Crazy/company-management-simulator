import { describe, expect, it } from "vitest";

import { getObjectiveStatus, settleTurn, validatePlan } from "../src/simulation/engine";
import { createDefaultPlan, createInitialState } from "../src/simulation/scenarios";

function buildState() {
  return createInitialState({
    companyName: "测试工厂",
    difficultyId: "standard",
    scenarioId: "smart-gadget-lab"
  });
}

describe("simulation engine", () => {
  it("produces deterministic settlement results for the same starting state and plan", () => {
    const stateA = buildState();
    const planA = createDefaultPlan(stateA);
    const resultA = settleTurn(stateA, planA);

    const stateB = buildState();
    const planB = createDefaultPlan(stateB);
    const resultB = settleTurn(stateB, planB);

    expect(resultA.ok).toBe(true);
    expect(resultB.ok).toBe(true);

    if (resultA.ok && resultB.ok) {
      expect(resultA.state.cash).toBe(resultB.state.cash);
      expect(resultA.state.marketShare).toBe(resultB.state.marketShare);
      expect(resultA.report.event.id).toBe(resultB.report.event.id);
      expect(resultA.report.financials.operatingProfit).toBe(resultB.report.financials.operatingProfit);
    }
  });

  it("rejects plans that create an immediate cash shortfall", () => {
    const state = buildState();
    const invalidPlan = {
      ...createDefaultPlan(state),
      borrowAmount: 0,
      capacityInvestment: 180000,
      marketingBudget: 150000,
      repayAmount: state.debt,
      rndBudget: 120000
    };

    const validation = validatePlan(state, invalidPlan);

    expect(validation.valid).toBe(false);
    expect(validation.errors.some((message) => message.includes("现金缺口"))).toBe(true);
  });

  it("returns milestone progress for the active scenario", () => {
    const state = buildState();
    const objectiveStatus = getObjectiveStatus(state);

    expect(objectiveStatus.milestones.length).toBeGreaterThan(0);
    expect(objectiveStatus.final.minimumTargetsMet).toBeGreaterThan(0);
    expect(objectiveStatus.milestones[0].items.every((item) => item.progress >= 0)).toBe(true);
  });

  it("marks the run as lost when core health indicators have already collapsed", () => {
    const riskyState = {
      ...buildState(),
      cash: 50000,
      consecutiveNegativeCash: 2,
      morale: 22,
      quality: 32
    };
    const desperatePlan = {
      ...createDefaultPlan(riskyState),
      borrowAmount: 220000,
      capacityInvestment: 0,
      hiringChange: -14,
      marketingBudget: 0,
      productionTarget: 0,
      repayAmount: 0,
      rndBudget: 0
    };

    const result = settleTurn(riskyState, desperatePlan);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.state.status).toBe("lost");
      expect(result.state.statusReasons.length).toBeGreaterThan(0);
    }
  });
});
