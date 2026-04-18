import type { DraftPlan, PlanPreview, PlanValidation, SimulationState } from "../../types/simulator";
import { getScenario } from "../data/lookups";
import { normalizePlan } from "./plan-normalization";
import { buildImmediateCostPreview } from "./immediate-preview";

export function validatePlan(state: SimulationState, rawPlan: Partial<DraftPlan>): PlanValidation {
  const scenario = getScenario(state.scenarioId);
  const params = scenario.parameters;
  const normalizedPlan = normalizePlan(state, rawPlan);
  const { employeesAfter, immediateOutflow, interestReserve, payroll, workforceChangeCost } =
    buildImmediateCostPreview(state, normalizedPlan);

  const errors: string[] = [];
  const warnings: string[] = [];
  const debtAfter = state.debt + normalizedPlan.borrowAmount - normalizedPlan.repayAmount;
  const availableCash = state.cash + normalizedPlan.borrowAmount;
  const leverageRatio = debtAfter / Math.max(1, state.cash + state.capacity * params.baseUnitCost * 0.2);
  const projectedBuffer = availableCash - immediateOutflow;
  const capacityUsage = normalizedPlan.productionTarget / Math.max(1, state.capacity);

  if (availableCash < immediateOutflow) {
    errors.push("当前方案在结算前会出现现金缺口，请降低开支或提高融资。");
  }

  if (debtAfter > params.maxBorrowPerTurn * 2.4) {
    errors.push("债务规模超出当前场景允许的融资上限。");
  }

  if (projectedBuffer < params.cashSafetyBuffer) {
    warnings.push("本期现金缓冲偏薄，遇到负面事件时很容易失守。");
  }

  if (normalizedPlan.marketingBudget < params.recommendedMarketing * 0.65) {
    warnings.push("营销投入低于建议值，品牌热度可能回落。");
  }

  if (normalizedPlan.rndBudget < params.recommendedRnD * 0.65) {
    warnings.push("研发预算偏低，质量指标将更容易下滑。");
  }

  if (capacityUsage > 0.92) {
    warnings.push("产能利用率接近上限，任何供应波动都会放大缺货风险。");
  }

  if (leverageRatio > 1.05) {
    warnings.push("融资杠杆正在升高，后续利息压力会明显放大。");
  }

  if (normalizedPlan.hiringChange < 0 && state.morale < 66) {
    warnings.push("当前士气不高，再裁员会进一步冲击执行稳定性。");
  }

  return {
    errors,
    plan: normalizedPlan,
    summary: {
      availableCash,
      capacityUsage,
      debtAfter,
      employeesAfter,
      immediateOutflow,
      interestReserve,
      payroll,
      projectedBuffer,
      workforceChangeCost
    },
    valid: errors.length === 0,
    warnings
  };
}

export function summarizePlan(state: SimulationState, rawPlan: Partial<DraftPlan>): PlanPreview {
  const validation = validatePlan(state, rawPlan);
  const { plan, summary } = validation;

  return {
    ...summary,
    errors: validation.errors,
    plan,
    riskLevel:
      validation.errors.length > 0
        ? "critical"
        : validation.warnings.length >= 3 || summary.projectedBuffer < 0
          ? "high"
          : validation.warnings.length >= 1
            ? "medium"
            : "stable",
    warnings: validation.warnings
  };
}
