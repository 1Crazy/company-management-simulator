import type {
  DraftPlan,
  ImpactLabel,
  MarketOutcome,
  ScenarioDefinition,
  SimulationEventDefinition,
  TurnDeltas,
  TurnReport
} from "../../../types/simulator";

interface BuildImpactLabelsInput {
  deltas: TurnDeltas;
  event: SimulationEventDefinition;
  market: MarketOutcome;
  plan: DraftPlan;
  report: TurnReport;
  scenario: ScenarioDefinition;
}

export function buildImpactLabels({
  deltas,
  event,
  market,
  plan,
  report,
  scenario
}: BuildImpactLabelsInput): ImpactLabel[] {
  const labels: ImpactLabel[] = [];

  if (event.id !== "steady-month") {
    labels.push({
      text: event.title,
      tone: event.tone === "negative" ? "warning" : event.tone === "positive" ? "positive" : "neutral"
    });
  }

  if (market.lostDemand > market.reachableDemand * 0.18) {
    labels.push({ text: "产能不足错失需求", tone: "warning" });
  }

  if (plan.marketingBudget >= scenario.parameters.recommendedMarketing * 1.1 && deltas.brand > 0) {
    labels.push({ text: "营销拉动品牌认知", tone: "positive" });
  }

  if (plan.rndBudget >= scenario.parameters.recommendedRnD * 1.1 && deltas.quality > 0) {
    labels.push({ text: "研发巩固产品力", tone: "positive" });
  }

  if (report.financials.cashChange < -80000) {
    labels.push({ text: "现金消耗偏高", tone: "warning" });
  }

  if (report.financials.operatingProfit > 0) {
    labels.push({ text: "经营利润转正", tone: "positive" });
  }

  if (plan.borrowAmount > 0) {
    labels.push({ text: "融资缓解了当期压力", tone: "neutral" });
  }

  return labels.slice(0, 4);
}
