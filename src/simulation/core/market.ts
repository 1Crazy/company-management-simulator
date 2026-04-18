import type {
  DifficultyDefinition,
  DraftPlan,
  MarketOutcome,
  ScenarioDefinition,
  SimulationEventDefinition,
  SimulationState
} from "../../types/simulator";
import { clamp, round } from "../helpers/math";

function computeSeasonality(turn: number): number {
  return 1 + Math.sin((turn + 1) * 0.8) * 0.04;
}

interface MarketResponseInput {
  difficulty: DifficultyDefinition;
  event: SimulationEventDefinition;
  plan: DraftPlan;
  randomFactor: number;
  scenario: ScenarioDefinition;
  state: SimulationState;
}

export function calculateMarketResponse({
  difficulty,
  event,
  plan,
  randomFactor,
  scenario,
  state
}: MarketResponseInput): MarketOutcome {
  const params = scenario.parameters;
  const effectiveCompetition =
    params.baseCompetition * (1 + difficulty.modifiers.eventPressure * 0.35) + (event.effects.competitionDelta ?? 0);
  const marketDemand =
    params.baseDemand *
    difficulty.modifiers.demandMultiplier *
    computeSeasonality(state.turn) *
    (1 + (randomFactor - 0.5) * 0.18 * difficulty.modifiers.volatilityMultiplier) *
    (event.effects.demandMultiplier ?? 1);

  const priceEffect = clamp(Math.pow(params.referencePrice / plan.price, params.priceElasticity), 0.68, 1.38);
  const qualityEffect = 0.76 + state.quality / 175;
  const brandEffect = 0.8 + state.brand / 190;
  const moraleEffect = 0.88 + state.morale / 250;
  const competitionEffect = clamp(1.06 - effectiveCompetition, 0.68, 1.08);
  const reachableDemand = Math.max(
    0,
    Math.round(marketDemand * priceEffect * qualityEffect * brandEffect * moraleEffect * competitionEffect)
  );
  const producedUnits = Math.round(plan.productionTarget * (event.effects.supplyYieldMultiplier ?? 1));
  const availableSupply = state.inventory + producedUnits;
  const realizedSales = Math.min(availableSupply, reachableDemand);
  const lostDemand = Math.max(0, reachableDemand - realizedSales);
  const inventoryEnd = Math.max(0, availableSupply - realizedSales);
  const efficiencyModifier = clamp(1.12 - state.morale / 520 - state.quality / 760, 0.82, 1.14);
  const unitCost = Math.round(
    params.baseUnitCost *
      difficulty.modifiers.costMultiplier *
      efficiencyModifier *
      (event.effects.unitCostMultiplier ?? 1)
  );

  return {
    availableSupply,
    inventoryEnd,
    lostDemand,
    marketDemand: Math.round(marketDemand),
    marketShare: round(realizedSales / Math.max(1, marketDemand), 4),
    producedUnits,
    reachableDemand,
    realizedSales,
    unitCost
  };
}
