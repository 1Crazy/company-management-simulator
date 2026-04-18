import type { ScenarioDefinition } from "../../../types/simulator";

export const SENSOR_FACTORY: ScenarioDefinition = {
  id: "sensor-factory",
  title: "工业传感器工厂重整",
  subtitle: "工业制造",
  summary: "带领一家毛利承压的工业传感器厂完成质量修复、订单稳定和债务控制。",
  brief: "这条线融资空间更小，质量和交付比营销更重要，任何供应波动都更致命。",
  defaultCompanyName: "砺石传感",
  maxTurns: 10,
  initial: {
    accumulatedProfit: 0,
    brand: 40,
    capacity: 320,
    cash: 610000,
    debt: 210000,
    employees: 42,
    inventory: 20,
    marketShare: 0.07,
    morale: 62,
    quality: 58
  },
  parameters: {
    baseCompetition: 0.22,
    baseDemand: 300,
    baseUnitCost: 1640,
    capacityExpansionUnitCost: 3400,
    cashFloor: -180000,
    cashSafetyBuffer: 120000,
    fixedOpsCost: 22000,
    hireCost: 4600,
    interestRate: 0.017,
    maintenanceCost: 31000,
    maxBorrowPerTurn: 160000,
    maxCapacityInvestment: 210000,
    maxHirePerTurn: 6,
    maxMarketing: 90000,
    maxPrice: 4980,
    maxRnD: 140000,
    minEmployees: 20,
    minPrice: 2680,
    priceElasticity: 0.92,
    qualityDecay: 1.4,
    recommendedMarketing: 18000,
    recommendedRnD: 42000,
    referencePrice: 3480,
    salaryPerEmployee: 8900,
    severanceCost: 5500
  },
  milestones: [
    {
      label: "完成质量止血",
      metrics: { cash: 560000, quality: 63, revenue: 860000 },
      turn: 3
    },
    {
      label: "恢复客户信任",
      metrics: { accumulatedProfit: 90000, cash: 660000, marketShare: 0.1, quality: 70 },
      turn: 6
    },
    {
      label: "完成债务重整",
      metrics: { accumulatedProfit: 280000, cash: 900000, debt: 120000, quality: 78 },
      turn: 10
    }
  ],
  finalObjective: {
    label: "债务重整",
    minimumTargetsMet: 3
  }
};
