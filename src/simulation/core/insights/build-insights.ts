import type {
  DraftPlan,
  InsightItem,
  MarketOutcome,
  ScenarioDefinition,
  SimulationEventDefinition,
  SimulationState,
  TurnDeltas,
  TurnReport
} from "../../../types/simulator";

interface BuildInsightsInput {
  deltas: TurnDeltas;
  event: SimulationEventDefinition;
  market: MarketOutcome;
  plan: DraftPlan;
  report: TurnReport;
  scenario: ScenarioDefinition;
  state: SimulationState;
}

export function buildInsights({
  deltas,
  event,
  market,
  plan,
  report,
  scenario,
  state
}: BuildInsightsInput): InsightItem[] {
  const insights: InsightItem[] = [];

  if (event.id !== "steady-month") {
    insights.push({
      body: event.summary,
      title: `事件影响：${event.title}`,
      tone: event.tone === "negative" ? "warning" : event.tone === "positive" ? "positive" : "neutral"
    });
  }

  if (market.reachableDemand > 0 && market.realizedSales / market.reachableDemand >= 0.95) {
    insights.push({
      body: "本期供给几乎吃满了市场需求，执行效率较高，说明当前定价和供给组合较为健康。",
      title: "供需匹配稳定",
      tone: "positive"
    });
  } else if (market.lostDemand > 0) {
    insights.push({
      body: "需求高于可交付供给，说明扩产、提效或提前备货会比单纯压价更有效。",
      title: "需求大于供给",
      tone: "warning"
    });
  }

  if (plan.marketingBudget < scenario.parameters.recommendedMarketing * 0.7 && deltas.brand < 0) {
    insights.push({
      body: "营销投入低于建议值，品牌热度开始自然回落，后续拉新会更贵。",
      title: "品牌蓄水不足",
      tone: "warning"
    });
  }

  if (plan.rndBudget < scenario.parameters.recommendedRnD * 0.7 && deltas.quality < 0) {
    insights.push({
      body: "研发投入过低时，产品力会缓慢下滑，尤其在质量事件出现时会放大损失。",
      title: "研发投入偏弱",
      tone: "warning"
    });
  }

  if (report.financials.operatingProfit > 0 && report.financials.cashChange > 0) {
    insights.push({
      body: "利润和现金同时改善，说明本回合不只是账面漂亮，而是真正增强了经营韧性。",
      title: "经营质量健康",
      tone: "positive"
    });
  }

  if (plan.borrowAmount > 0 && report.financials.interest > state.debt * 0.015) {
    insights.push({
      body: "融资给了你一口气，但利息压力会在后续周期继续压缩可用现金。",
      title: "杠杆正在积累",
      tone: "neutral"
    });
  }

  return insights.slice(0, 4);
}
