import { getScenario } from "@/simulation/scenarios";
import { clamp } from "@/simulation/helpers/math";
import type { DraftPlan, ObjectiveStatus, PreviewSummary, SessionState } from "@/types/app";
import type { DecisionFieldDefinition, DecisionPreset, HelpSection, QuickStartStep, TurnGuideItem } from "@/types/help";

export const QUICK_START_STEPS: QuickStartStep[] = [
  {
    body: "先选场景和难度，再带着一个明确目标开局。难度越高，成本压力和随机事件会更凶。",
    id: "set-pace",
    index: "01",
    title: "先定经营节奏"
  },
  {
    body: "每回合先看目标和风险，再填写 8 个经营字段。提交前摘要会告诉你现金、债务和产能是否危险。",
    id: "review-before-submit",
    index: "02",
    title: "再做本期方案"
  },
  {
    body: "结算后重点看营收、利润、现金、质量和士气。不要只盯利润，现金和团队状态会先把你拖垮。",
    id: "read-feedback",
    index: "03",
    title: "最后根据反馈修正"
  }
];

export const DECISION_FIELD_DEFS: DecisionFieldDefinition[] = [
  {
    detail: "低价能抢需求，高价能抬毛利，但太离谱会同时伤销量和品牌。",
    field: "price",
    helper: "直接影响需求弹性与单位毛利",
    label: "定价",
    step: 1
  },
  {
    detail: "本期实际可卖量不会超过可用产能，计划过高只会把缺货风险暴露得更快。",
    field: "productionTarget",
    helper: "上限受当前产能约束",
    label: "计划生产",
    step: 1
  },
  {
    detail: "营销决定短期需求和品牌热度，砍得太狠往往下回合才开始痛。",
    field: "marketingBudget",
    helper: "拉动品牌认知与销量",
    label: "营销预算",
    step: 1000
  },
  {
    detail: "研发对质量和中长期竞争力更关键，连续几期过低会把后劲抽空。",
    field: "rndBudget",
    helper: "影响质量与长期竞争力",
    label: "研发预算",
    step: 1000
  },
  {
    detail: "招聘会推高当期现金流出，裁员会压士气；这是短期财务和组织稳定之间的取舍。",
    field: "hiringChange",
    helper: "正数为招聘，负数为裁撤",
    label: "人员增减",
    step: 1
  },
  {
    detail: "扩产本期先花钱，下期才释放能力，别在现金已经很紧的时候盲目加杠杆。",
    field: "capacityInvestment",
    helper: "会在下一期带来新增产能",
    label: "扩产投入",
    step: 1000
  },
  {
    detail: "新增融资可以救短期现金，但也会带来后续利息和更高失败风险。",
    field: "borrowAmount",
    helper: "立刻补现金，但未来利息更高",
    label: "新增融资",
    step: 1000
  },
  {
    detail: "主动还款能降低杠杆，但如果把安全垫还没了，下一次负面事件就可能直接失守。",
    field: "repayAmount",
    helper: "降低杠杆，但挤压当期现金",
    label: "主动还款",
    step: 1000
  }
];

function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function clampPlan(state: SessionState, plan: Partial<DraftPlan>): DraftPlan {
  const params = getScenario(state.scenarioId).parameters;
  const maxLayoff = Math.min(params.maxHirePerTurn, Math.max(0, state.employees - params.minEmployees));

  return {
    borrowAmount: roundToStep(clamp(plan.borrowAmount ?? 0, 0, params.maxBorrowPerTurn), 1000),
    capacityInvestment: roundToStep(clamp(plan.capacityInvestment ?? 0, 0, params.maxCapacityInvestment), 1000),
    hiringChange: Math.round(clamp(plan.hiringChange ?? 0, -maxLayoff, params.maxHirePerTurn)),
    marketingBudget: roundToStep(clamp(plan.marketingBudget ?? params.recommendedMarketing, 0, params.maxMarketing), 1000),
    price: Math.round(clamp(plan.price ?? params.referencePrice, params.minPrice, params.maxPrice)),
    productionTarget: Math.round(clamp(plan.productionTarget ?? state.capacity * 0.82, 0, state.capacity)),
    repayAmount: roundToStep(clamp(plan.repayAmount ?? 0, 0, state.debt), 1000),
    rndBudget: roundToStep(clamp(plan.rndBudget ?? params.recommendedRnD, 0, params.maxRnD), 1000)
  };
}

function buildBalancedPlan(state: SessionState): DraftPlan {
  const params = getScenario(state.scenarioId).parameters;
  const freeCash = Math.max(0, state.cash - params.cashSafetyBuffer * 1.1);

  return clampPlan(state, {
    borrowAmount: 0,
    capacityInvestment: 0,
    hiringChange: 0,
    marketingBudget: params.recommendedMarketing,
    price: params.referencePrice,
    productionTarget: state.capacity * 0.84,
    repayAmount: Math.min(state.debt * 0.12, freeCash * 0.35),
    rndBudget: params.recommendedRnD
  });
}

function buildGrowthPlan(state: SessionState): DraftPlan {
  const params = getScenario(state.scenarioId).parameters;
  const marketingBudget = params.recommendedMarketing * 1.3;
  const rndBudget = params.recommendedRnD * 1.15;
  const hiringChange = Math.max(2, Math.round(state.employees * 0.06));
  const capacityInvestment = Math.max(params.capacityExpansionUnitCost * 6, params.maxCapacityInvestment * 0.28);
  const desiredSpend = marketingBudget + rndBudget + capacityInvestment + Math.max(0, hiringChange) * params.hireCost;
  const borrowAmount = Math.max(0, desiredSpend + params.cashSafetyBuffer * 1.1 - state.cash);

  return clampPlan(state, {
    borrowAmount,
    capacityInvestment,
    hiringChange,
    marketingBudget,
    price: params.referencePrice * 0.96,
    productionTarget: state.capacity,
    repayAmount: 0,
    rndBudget
  });
}

function buildCashPlan(state: SessionState): DraftPlan {
  const params = getScenario(state.scenarioId).parameters;
  const freeCash = Math.max(0, state.cash - params.cashSafetyBuffer * 1.35);

  return clampPlan(state, {
    borrowAmount: 0,
    capacityInvestment: 0,
    hiringChange: state.morale < 55 ? -1 : 0,
    marketingBudget: params.recommendedMarketing * 0.58,
    price: params.referencePrice * 1.05,
    productionTarget: state.capacity * 0.7,
    repayAmount: Math.min(state.debt * 0.18, freeCash * 0.45),
    rndBudget: params.recommendedRnD * 0.62
  });
}

export function createPlanFromPreset(state: SessionState, presetId: string): DraftPlan {
  if (presetId === "growth") {
    return buildGrowthPlan(state);
  }

  if (presetId === "cash") {
    return buildCashPlan(state);
  }

  return buildBalancedPlan(state);
}

export function buildDecisionPresets(state: SessionState): DecisionPreset[] {
  return [
    {
      caution: "适合第一轮和局势不明的时候，优先保稳定。",
      id: "balanced",
      summary: "围绕建议营销和研发水平，维持产能与现金的基本平衡。",
      title: "稳健经营",
      tone: "accent"
    },
    {
      caution: "会抬高现金压力和融资依赖，适合抢市场窗口。",
      id: "growth",
      summary: "降低价格、抬高营销与产能，优先冲销量和市场份额。",
      title: "进攻扩张",
      tone: "warning"
    },
    {
      caution: "能缓冲风险，但连续几期过于保守会牺牲增长和目标达成。",
      id: "cash",
      summary: "先守住现金和杠杆，再慢慢恢复品牌与质量投入。",
      title: "现金防守",
      tone: "success"
    }
  ];
}

function buildRiskGuide(state: SessionState, preview: PreviewSummary): TurnGuideItem {
  const scenario = getScenario(state.scenarioId);

  if (preview.errors.length > 0) {
    return {
      body: preview.errors[0],
      id: "risk",
      label: "本期风险",
      title: "先修硬错误再结算",
      tone: "warning"
    };
  }

  if (preview.warnings.length > 0) {
    return {
      body: preview.warnings[0],
      id: "risk",
      label: "本期风险",
      title: "方案可提交，但先看薄弱点",
      tone: "warning"
    };
  }

  if (preview.projectedBuffer < scenario.parameters.cashSafetyBuffer) {
    return {
      body: "虽然没有直接报错，但现金安全垫偏薄，下一次负面事件会很难扛。",
      id: "risk",
      label: "本期风险",
      title: "现金还不够厚",
      tone: "warning"
    };
  }

  return {
    body: "当前方案通过了预算、产能和债务校验，可以进入结算观察市场反馈。",
    id: "risk",
    label: "本期风险",
    title: "方案处于可控区间",
    tone: "success"
  };
}

function buildFocusGuide(state: SessionState, objectiveStatus: ObjectiveStatus): TurnGuideItem {
  const nextMilestone = objectiveStatus.milestones.find((item) => !item.achieved) ?? objectiveStatus.milestones.at(-1);

  if (nextMilestone) {
    return {
      body: `下一道关口是第 ${nextMilestone.turn} 期的「${nextMilestone.label}」，优先补离目标最远的指标。`,
      id: "goal",
      label: "当前目标",
      title: "先围绕里程碑做决策",
      tone: "accent"
    };
  }

  return {
    body: `当前已完成 ${objectiveStatus.final.targetsMet}/${objectiveStatus.final.minimumTargetsMet} 项年度目标，继续保住现金和质量。`,
    id: "goal",
    label: "当前目标",
    title: "保持终局达标线",
    tone: "accent"
  };
}

function buildFeedbackGuide(state: SessionState): TurnGuideItem {
  if (!state.lastReport) {
    return {
      body: "第一期先提交一个稳健方案，拿到首份报表后再根据营收、利润和现金变动来调参数。",
      id: "feedback",
      label: "结算之后",
      title: "先拿到第一份报表",
      tone: "neutral"
    };
  }

  return {
    body: `上一期事件是「${state.lastReport.event.title}」，先看现金变化、销量兑现率和影响标签，再决定继续扩张还是收缩。`,
    id: "feedback",
    label: "结算之后",
    title: "用上期反馈修正本期",
    tone: "neutral"
  };
}

export function buildTurnGuideItems(
  state: SessionState,
  preview: PreviewSummary,
  objectiveStatus: ObjectiveStatus
): TurnGuideItem[] {
  return [buildFocusGuide(state, objectiveStatus), buildRiskGuide(state, preview), buildFeedbackGuide(state)];
}

export function buildHelpSections(
  state: SessionState | null,
  objectiveStatus: ObjectiveStatus | null
): HelpSection[] {
  const nextMilestone = objectiveStatus?.milestones.find((item) => !item.achieved) ?? objectiveStatus?.milestones.at(-1);

  return [
    {
      bullets: [
        "每回合都遵循“看目标 -> 调方案 -> 看摘要 -> 结算 -> 读反馈”的闭环。",
        "先把现金缺口、债务超限这类硬错误清掉，再去优化增长速度。",
        "建议把第一局当成熟悉系统，第二局再开始主动冲高分。"
      ],
      description: "这个游戏不是拼一次神操作，而是拼连续几个回合的资源分配质量。",
      id: "core-loop",
      label: "怎么玩",
      title: "经营闭环只有五步",
      tone: "accent"
    },
    {
      bullets: [
        "现金是第一生存线，连续三期为负或者跌穿场景现金底线都会直接失败。",
        "质量过低会同时打掉需求和信任，士气太低会让执行效率快速塌陷。",
        "债务不是不能用，但它应该换增长窗口，而不是填无底洞。"
      ],
      description: "利润可以波动，现金和组织状态不能持续失守。",
      id: "risk",
      label: "先看什么",
      title: "先保生存，再谈扩张",
      tone: "warning"
    },
    {
      bullets: [
        `当前局面优先盯住 ${nextMilestone ? `「${nextMilestone.label}」` : "年度终局目标"}。`,
        state ? `现在是第 ${state.turn + 1}/${state.maxTurns} 期，越接近尾声，越要减少无效试错。` : "开局阶段建议先用稳健模板理解系统反馈。",
        objectiveStatus
          ? `年度目标线是至少完成 ${objectiveStatus.final.minimumTargetsMet} 项核心目标。`
          : "不同场景的里程碑关注点不同，开局前先读一下目标卡片。"
      ],
      description: "不是所有指标都要同时拉满，先对准最近的里程碑最划算。",
      id: "objectives",
      label: "赢法",
      title: "围绕里程碑而不是围绕感觉",
      tone: "success"
    }
  ];
}
