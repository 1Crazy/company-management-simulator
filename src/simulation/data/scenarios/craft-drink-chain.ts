import type { ScenarioDefinition } from "../../../types/simulator";

export const CRAFT_DRINK_CHAIN: ScenarioDefinition = {
  id: "craft-drink-chain",
  title: "精品饮品连锁扩张战",
  subtitle: "消费零售",
  summary: "把一条精品饮品品牌从区域明星店打造成更大规模的多店经营体。",
  brief: "营销和人力波动会更直接地影响口碑与服务效率，扩店过快也会拖累现金。",
  defaultCompanyName: "山岚饮研",
  maxTurns: 14,
  initial: {
    accumulatedProfit: 0,
    brand: 54,
    capacity: 690,
    cash: 430000,
    debt: 90000,
    employees: 34,
    inventory: 60,
    marketShare: 0.11,
    morale: 73,
    quality: 67
  },
  parameters: {
    baseCompetition: 0.28,
    baseDemand: 760,
    baseUnitCost: 72,
    capacityExpansionUnitCost: 520,
    cashFloor: -100000,
    cashSafetyBuffer: 70000,
    fixedOpsCost: 14000,
    hireCost: 2200,
    interestRate: 0.013,
    maintenanceCost: 18000,
    maxBorrowPerTurn: 180000,
    maxCapacityInvestment: 100000,
    maxHirePerTurn: 12,
    maxMarketing: 100000,
    maxPrice: 38,
    maxRnD: 70000,
    minEmployees: 16,
    minPrice: 18,
    priceElasticity: 1.35,
    qualityDecay: 1.1,
    recommendedMarketing: 26000,
    recommendedRnD: 16000,
    referencePrice: 26,
    salaryPerEmployee: 5900,
    severanceCost: 3100
  },
  milestones: [
    {
      label: "稳住区域头部门店效率",
      metrics: { cash: 430000, marketShare: 0.12, quality: 69, revenue: 15000 },
      turn: 5
    },
    {
      label: "形成品牌复利效应",
      metrics: { accumulatedProfit: 120000, cash: 540000, marketShare: 0.17, morale: 75 },
      turn: 9
    },
    {
      label: "通过扩张评估",
      metrics: { accumulatedProfit: 320000, cash: 760000, marketShare: 0.22, quality: 77 },
      turn: 14
    }
  ],
  finalObjective: {
    label: "扩张评估",
    minimumTargetsMet: 3
  }
};
