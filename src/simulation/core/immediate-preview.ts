import type { DraftPlan, SimulationState } from "../../types/simulator";
import { getDifficulty, getScenario } from "../data/lookups";

export interface ImmediateCostPreview {
  employeesAfter: number;
  immediateOutflow: number;
  interestReserve: number;
  payroll: number;
  workforceChangeCost: number;
}

export function buildImmediateCostPreview(state: SimulationState, plan: DraftPlan): ImmediateCostPreview {
  const scenario = getScenario(state.scenarioId);
  const difficulty = getDifficulty(state.difficultyId);
  const params = scenario.parameters;
  const employeesAfter = state.employees + plan.hiringChange;
  const workforceChangeCost =
    plan.hiringChange >= 0
      ? plan.hiringChange * params.hireCost
      : Math.abs(plan.hiringChange) * params.severanceCost;
  const payroll = Math.round(employeesAfter * params.salaryPerEmployee * difficulty.modifiers.salaryMultiplier);
  const interestReserve = Math.round(
    (state.debt + plan.borrowAmount * 0.6) * (params.interestRate * difficulty.modifiers.interestMultiplier)
  );
  const immediateOutflow =
    payroll +
    workforceChangeCost +
    params.fixedOpsCost +
    params.maintenanceCost +
    plan.marketingBudget +
    plan.rndBudget +
    plan.capacityInvestment +
    interestReserve +
    plan.repayAmount;

  return {
    employeesAfter,
    immediateOutflow,
    interestReserve,
    payroll,
    workforceChangeCost
  };
}
