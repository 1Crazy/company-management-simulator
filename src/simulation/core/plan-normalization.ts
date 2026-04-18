import type { DraftPlan, SimulationState } from "../../types/simulator";
import { getScenario } from "../data/lookups";
import { clamp, toNumber } from "../helpers/math";

export function normalizePlan(state: SimulationState, rawPlan: Partial<DraftPlan>): DraftPlan {
  const params = getScenario(state.scenarioId).parameters;
  const maxLayoff = Math.max(0, state.employees - params.minEmployees);

  return {
    borrowAmount: clamp(Math.round(toNumber(rawPlan.borrowAmount, 0)), 0, params.maxBorrowPerTurn),
    capacityInvestment: clamp(Math.round(toNumber(rawPlan.capacityInvestment, 0)), 0, params.maxCapacityInvestment),
    hiringChange: clamp(Math.round(toNumber(rawPlan.hiringChange, 0)), -maxLayoff, params.maxHirePerTurn),
    marketingBudget: clamp(
      Math.round(toNumber(rawPlan.marketingBudget, params.recommendedMarketing)),
      0,
      params.maxMarketing
    ),
    price: clamp(Math.round(toNumber(rawPlan.price, params.referencePrice)), params.minPrice, params.maxPrice),
    productionTarget: clamp(Math.round(toNumber(rawPlan.productionTarget, state.capacity)), 0, state.capacity),
    repayAmount: clamp(Math.round(toNumber(rawPlan.repayAmount, 0)), 0, state.debt),
    rndBudget: clamp(Math.round(toNumber(rawPlan.rndBudget, params.recommendedRnD)), 0, params.maxRnD)
  };
}
