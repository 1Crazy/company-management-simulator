import type {
  DifficultyDefinition,
  DraftPlan,
  MarketOutcome,
  ScenarioDefinition,
  SimulationEventDefinition,
  SimulationState,
  ValidationSummary
} from "../../types/simulator";
import { round } from "../helpers/math";

type ImmediateSettlementSummary = Pick<ValidationSummary, "employeesAfter" | "payroll" | "workforceChangeCost">;

export interface TurnCalculation {
  addedCapacity: number;
  brandDelta: number;
  cashAfter: number;
  cashChange: number;
  debtAfter: number;
  employeesAfter: number;
  interest: number;
  moraleDelta: number;
  operatingProfit: number;
  productionCost: number;
  qualityDelta: number;
  revenue: number;
}

interface TurnCalculationInput {
  difficulty: DifficultyDefinition;
  event: SimulationEventDefinition;
  immediate: ImmediateSettlementSummary;
  market: MarketOutcome;
  plan: DraftPlan;
  scenario: ScenarioDefinition;
  state: SimulationState;
}

export function calculateTurnResults({
  difficulty,
  event,
  immediate,
  market,
  plan,
  scenario,
  state
}: TurnCalculationInput): TurnCalculation {
  const params = scenario.parameters;
  const debtAfter = Math.max(0, state.debt + plan.borrowAmount - plan.repayAmount);
  const employeesAfter = immediate.employeesAfter;
  const addedCapacity = Math.floor(plan.capacityInvestment / params.capacityExpansionUnitCost);
  const revenue = market.realizedSales * plan.price;
  const productionCost = market.producedUnits * market.unitCost;
  const interest = Math.round(
    (state.debt + plan.borrowAmount * 0.55) *
      ((params.interestRate + (event.effects.interestDelta ?? 0)) * difficulty.modifiers.interestMultiplier)
  );
  const operatingProfit =
    revenue -
    productionCost -
    immediate.payroll -
    plan.marketingBudget -
    plan.rndBudget -
    immediate.workforceChangeCost -
    plan.capacityInvestment -
    params.fixedOpsCost -
    params.maintenanceCost -
    interest;
  const cashChange =
    revenue +
    plan.borrowAmount +
    (event.effects.cashDelta ?? 0) -
    productionCost -
    immediate.payroll -
    plan.marketingBudget -
    plan.rndBudget -
    immediate.workforceChangeCost -
    plan.capacityInvestment -
    plan.repayAmount -
    params.fixedOpsCost -
    params.maintenanceCost -
    interest;
  const cashAfter = Math.round(state.cash + cashChange);
  const qualityDelta = round(
    (plan.rndBudget / params.recommendedRnD - 1) * 3.5 +
      (event.effects.qualityDelta ?? 0) +
      (market.lostDemand > market.reachableDemand * 0.2 ? -0.5 : 0.8) -
      params.qualityDecay,
    1
  );
  const brandDelta = round(
    (plan.marketingBudget / params.recommendedMarketing - 1) * 4.2 +
      (event.effects.brandDelta ?? 0) +
      (operatingProfit > 0 ? 1 : -1) -
      1.8,
    1
  );
  const moraleDelta = round(
    (operatingProfit > 0 ? 1.8 : -2.2) +
      (event.effects.moraleDelta ?? 0) +
      (plan.hiringChange < 0 ? -1.4 : 0) +
      (market.lostDemand > market.reachableDemand * 0.18 ? -1.2 : 0.6),
    1
  );

  return {
    addedCapacity,
    brandDelta,
    cashAfter,
    cashChange,
    debtAfter,
    employeesAfter,
    interest,
    moraleDelta,
    operatingProfit,
    productionCost,
    qualityDelta,
    revenue
  };
}
