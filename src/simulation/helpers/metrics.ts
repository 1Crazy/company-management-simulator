import type { ObjectiveMetricKey, SimulationState } from "../../types/simulator";

export function metricValue(state: SimulationState, key: ObjectiveMetricKey): number {
  switch (key) {
    case "accumulatedProfit":
      return state.accumulatedProfit;
    case "cash":
      return state.cash;
    case "debt":
      return state.debt;
    case "marketShare":
      return state.marketShare;
    case "morale":
      return state.morale;
    case "quality":
      return state.quality;
    case "revenue":
      return state.lastReport?.financials.revenue ?? state.history.at(-1)?.revenue ?? 0;
    default:
      return 0;
  }
}
