import type { SimulationEventDefinition } from "../../../types/simulator";

export const CALM_EVENT: SimulationEventDefinition = {
  baseWeight: 1.5,
  effects: {},
  id: "steady-month",
  summary: "市场没有出现超预期波动，主要结果由你的经营决策决定。",
  title: "平稳经营月",
  tone: "neutral"
};

export const EVENTS: SimulationEventDefinition[] = [
  {
    baseWeight: 0.95,
    effects: {
      demandMultiplier: 1.16,
      brandDelta: 4
    },
    id: "viral-review",
    minTurn: 2,
    summary: "一波真实用户好评带来额外曝光，品牌被更多潜在客户关注。",
    title: "口碑扩散",
    tone: "positive",
    when: (state) => state.quality >= 60
  },
  {
    baseWeight: 1,
    effects: {
      unitCostMultiplier: 1.12
    },
    id: "supplier-shock",
    minTurn: 2,
    summary: "上游关键原料涨价，短期采购成本明显抬升。",
    title: "原料涨价",
    tone: "negative",
    when: () => true
  },
  {
    baseWeight: 0.86,
    effects: {
      moraleDelta: -4,
      qualityDelta: -2
    },
    id: "talent-poaching",
    minTurn: 3,
    summary: "竞争对手高薪挖角，团队稳定性受到挑战。",
    title: "核心人才被挖",
    tone: "negative",
    when: (state) => state.employees >= 20
  },
  {
    baseWeight: 0.8,
    effects: {
      demandMultiplier: 1.1,
      qualityDelta: 2
    },
    id: "policy-subsidy",
    minTurn: 4,
    summary: "行业支持政策落地，市场接受度与试点资源同步改善。",
    title: "政策扶持窗口",
    tone: "positive",
    when: () => true
  },
  {
    baseWeight: 0.92,
    effects: {
      interestDelta: 0.004
    },
    id: "credit-tightening",
    minTurn: 2,
    summary: "银行授信收紧，融资边际成本上行。",
    title: "授信收紧",
    tone: "negative",
    when: (state) => state.debt > 0
  },
  {
    baseWeight: 0.78,
    effects: {
      competitionDelta: 0.08,
      demandMultiplier: 0.93
    },
    id: "competitor-launch",
    minTurn: 3,
    summary: "对手推出更激进的促销方案，部分潜在订单被分流。",
    title: "竞争加剧",
    tone: "negative",
    when: () => true
  },
  {
    baseWeight: 0.75,
    effects: {
      demandMultiplier: 1.08,
      moraleDelta: 2
    },
    id: "channel-win",
    minTurn: 3,
    summary: "新的渠道合作打开额外订单入口，团队信心也随之回升。",
    title: "拿下重点渠道",
    tone: "positive",
    when: (state) => state.brand >= 45
  },
  {
    baseWeight: 0.72,
    effects: {
      brandDelta: -5,
      demandMultiplier: 0.95,
      qualityDelta: -3
    },
    id: "quality-complaint",
    minTurn: 2,
    summary: "一批次产品出现反馈问题，需要更谨慎地修复信任。",
    title: "质量投诉",
    tone: "negative",
    when: (state) => state.rngState > 0 && state.quality < 68
  }
];
