import type { ScenarioDefinition } from "../../../types/simulator";

export const SMART_GADGET_LAB: ScenarioDefinition = {
  id: "smart-gadget-lab",
  title: "智能家居创业实验室",
  subtitle: "消费电子",
  summary: "在 12 个经营周期内把一家具备研发潜力的智能硬件公司推向规模化增长。",
  brief: "你需要平衡定价、品牌投入和产能扩张，避免现金流被库存和融资成本拖垮。",
  defaultCompanyName: "星港智造",
  maxTurns: 12,
  initial: {
    accumulatedProfit: 0,
    brand: 48,
    capacity: 460,
    cash: 520000,
    debt: 120000,
    employees: 26,
    inventory: 40,
    marketShare: 0.08,
    morale: 69,
    quality: 63
  },
  parameters: {
    baseCompetition: 0.24,
    baseDemand: 470,
    baseUnitCost: 910,
    capacityExpansionUnitCost: 2100,
    cashFloor: -140000,
    cashSafetyBuffer: 90000,
    fixedOpsCost: 18000,
    hireCost: 3800,
    interestRate: 0.015,
    maintenanceCost: 26000,
    maxBorrowPerTurn: 220000,
    maxCapacityInvestment: 180000,
    maxHirePerTurn: 8,
    maxMarketing: 150000,
    maxPrice: 2990,
    maxRnD: 120000,
    minEmployees: 12,
    minPrice: 1690,
    priceElasticity: 1.12,
    qualityDecay: 1.2,
    recommendedMarketing: 36000,
    recommendedRnD: 28000,
    referencePrice: 2280,
    salaryPerEmployee: 7600,
    severanceCost: 4600
  },
  milestones: [
    {
      label: "完成首轮渠道铺货",
      metrics: { cash: 500000, marketShare: 0.1, quality: 66, revenue: 780000 },
      turn: 4
    },
    {
      label: "形成稳定复购曲线",
      metrics: { accumulatedProfit: 140000, cash: 650000, marketShare: 0.14, quality: 72 },
      turn: 8
    },
    {
      label: "通过年度董事会审查",
      metrics: { accumulatedProfit: 360000, cash: 900000, marketShare: 0.18, quality: 78 },
      turn: 12
    }
  ],
  finalObjective: {
    label: "年度董事会审查",
    minimumTargetsMet: 3
  }
};
