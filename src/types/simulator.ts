export type GameStatus = "lost" | "playing" | "won";
export type EventTone = "negative" | "neutral" | "positive";
export type InsightTone = "danger" | "neutral" | "positive" | "warning";
export type ObjectiveMetricKey =
  | "accumulatedProfit"
  | "cash"
  | "debt"
  | "marketShare"
  | "morale"
  | "quality"
  | "revenue";
export type ObjectiveMetricMap = Partial<Record<ObjectiveMetricKey, number>>;
export type PreviewRiskLevel = "critical" | "high" | "medium" | "stable";

export interface DraftPlan {
  borrowAmount: number;
  capacityInvestment: number;
  hiringChange: number;
  marketingBudget: number;
  price: number;
  productionTarget: number;
  repayAmount: number;
  rndBudget: number;
}

export interface ActiveEventSummary {
  id: string;
  summary: string;
  title: string;
  tone: EventTone;
}

export interface HistoryEntry {
  cash: number;
  eventTitle: string;
  label: string;
  marketShare: number;
  morale: number;
  profit: number;
  quality: number;
  revenue: number;
  turn: number;
}

export interface ImpactLabel {
  text: string;
  tone: InsightTone;
}

export interface InsightItem {
  body: string;
  title: string;
  tone: InsightTone;
}

export interface CashFlowItem {
  label: string;
  value: number;
}

export interface TurnDeltas {
  brand: number;
  capacity: number;
  cash: number;
  debt: number;
  morale: number;
  quality: number;
}

export interface MarketOutcome {
  availableSupply: number;
  inventoryEnd: number;
  lostDemand: number;
  marketDemand: number;
  marketShare: number;
  producedUnits: number;
  reachableDemand: number;
  realizedSales: number;
  unitCost: number;
}

export interface ObjectiveMilestoneItem {
  current: number;
  key: ObjectiveMetricKey;
  progress: number;
  scaledTarget: number;
}

export interface ObjectiveMilestoneStatus {
  achieved: boolean;
  items: ObjectiveMilestoneItem[];
  label: string;
  turn: number;
}

export interface ObjectiveStatus {
  final: {
    label: string;
    minimumTargetsMet: number;
    targetsMet: number;
  };
  milestones: ObjectiveMilestoneStatus[];
}

export interface FinancialSummary {
  cashChange: number;
  cashFlowBridge: CashFlowItem[];
  fixedOpsCost: number;
  interest: number;
  operatingProfit: number;
  productionCost: number;
  revenue: number;
}

export interface TurnReport {
  deltas: TurnDeltas;
  event: ActiveEventSummary;
  financials: FinancialSummary;
  impactLabels: ImpactLabel[];
  insights: InsightItem[];
  market: MarketOutcome;
  newlyAchievedMilestones: ObjectiveMilestoneStatus[];
  objectiveStatus: ObjectiveStatus;
  plan: DraftPlan;
  turn: number;
  warnings: string[];
}

export interface SimulationState {
  accumulatedProfit: number;
  activeEvent: ActiveEventSummary | null;
  brand: number;
  capacity: number;
  cash: number;
  companyName: string;
  consecutiveNegativeCash: number;
  debt: number;
  difficultyId: string;
  employees: number;
  finalScore: number | null;
  history: HistoryEntry[];
  inventory: number;
  lastDemand: number;
  lastReport: TurnReport | null;
  marketShare: number;
  maxTurns: number;
  morale: number;
  quality: number;
  rngState: number;
  scenarioId: string;
  status: GameStatus;
  statusReasons: string[];
  turn: number;
}

export interface SessionSnapshot {
  draftPlan: DraftPlan;
  state: SimulationState;
}

export interface DifficultyModifiers {
  costMultiplier: number;
  demandMultiplier: number;
  eventPressure: number;
  interestMultiplier: number;
  salaryMultiplier: number;
  targetMultiplier: number;
  volatilityMultiplier: number;
}

export interface DifficultyDefinition {
  id: string;
  label: string;
  modifiers: DifficultyModifiers;
  summary: string;
}

export interface ScenarioOpeningState {
  accumulatedProfit: number;
  brand: number;
  capacity: number;
  cash: number;
  debt: number;
  employees: number;
  inventory: number;
  marketShare: number;
  morale: number;
  quality: number;
}

export interface ScenarioParameters {
  baseCompetition: number;
  baseDemand: number;
  baseUnitCost: number;
  capacityExpansionUnitCost: number;
  cashFloor: number;
  cashSafetyBuffer: number;
  fixedOpsCost: number;
  hireCost: number;
  interestRate: number;
  maintenanceCost: number;
  maxBorrowPerTurn: number;
  maxCapacityInvestment: number;
  maxHirePerTurn: number;
  maxMarketing: number;
  maxPrice: number;
  maxRnD: number;
  minEmployees: number;
  minPrice: number;
  priceElasticity: number;
  qualityDecay: number;
  recommendedMarketing: number;
  recommendedRnD: number;
  referencePrice: number;
  salaryPerEmployee: number;
  severanceCost: number;
}

export interface MilestoneDefinition {
  label: string;
  metrics: ObjectiveMetricMap;
  turn: number;
}

export interface FinalObjectiveDefinition {
  label: string;
  minimumTargetsMet: number;
}

export interface ScenarioDefinition {
  brief: string;
  defaultCompanyName: string;
  finalObjective: FinalObjectiveDefinition;
  id: string;
  initial: ScenarioOpeningState;
  maxTurns: number;
  milestones: MilestoneDefinition[];
  parameters: ScenarioParameters;
  subtitle: string;
  summary: string;
  title: string;
}

export interface ScenarioChoiceSummary {
  challenge: string;
  headline: string;
  metrics: ObjectiveMetricMap;
  scenario: ScenarioDefinition;
  subtitle: string;
}

export interface ValidationSummary {
  availableCash: number;
  capacityUsage: number;
  debtAfter: number;
  employeesAfter: number;
  immediateOutflow: number;
  interestReserve: number;
  payroll: number;
  projectedBuffer: number;
  workforceChangeCost: number;
}

export interface PlanValidation {
  errors: string[];
  plan: DraftPlan;
  summary: ValidationSummary;
  valid: boolean;
  warnings: string[];
}

export interface PlanPreview extends ValidationSummary {
  errors: string[];
  plan: DraftPlan;
  riskLevel: PreviewRiskLevel;
  warnings: string[];
}

export interface OutcomeEvaluation {
  finalScore: number | null;
  objectiveStatus: ObjectiveStatus;
  reasons: string[];
  status: GameStatus;
}

export interface SettlementSuccess {
  nextDefaultPlan: DraftPlan;
  objectiveStatus: ObjectiveStatus;
  ok: true;
  report: TurnReport;
  state: SimulationState;
  validation: PlanValidation;
}

export interface SettlementFailure {
  ok: false;
  validation: PlanValidation;
}

export type SettlementResult = SettlementFailure | SettlementSuccess;

export interface SimulationEventEffects {
  brandDelta?: number;
  cashDelta?: number;
  competitionDelta?: number;
  demandMultiplier?: number;
  interestDelta?: number;
  moraleDelta?: number;
  qualityDelta?: number;
  supplyYieldMultiplier?: number;
  unitCostMultiplier?: number;
}

export interface SimulationEventDefinition {
  baseWeight: number;
  effects: SimulationEventEffects;
  id: string;
  minTurn?: number;
  summary: string;
  title: string;
  tone: EventTone;
  when?: (state: SimulationState) => boolean;
}

export interface WeightedSimulationEvent extends SimulationEventDefinition {
  weight: number;
}
