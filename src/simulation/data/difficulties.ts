import type { DifficultyDefinition } from "../../types/simulator";

export const DIFFICULTIES: DifficultyDefinition[] = [
  {
    id: "easy",
    label: "新手",
    summary: "现金缓冲更厚，目标略宽松，适合先熟悉经营循环。",
    modifiers: {
      costMultiplier: 0.96,
      demandMultiplier: 1.06,
      eventPressure: -0.14,
      interestMultiplier: 0.92,
      salaryMultiplier: 0.98,
      targetMultiplier: 0.94,
      volatilityMultiplier: 0.72
    }
  },
  {
    id: "standard",
    label: "标准",
    summary: "经营压力与机会均衡，适合作为默认玩法。",
    modifiers: {
      costMultiplier: 1,
      demandMultiplier: 1,
      eventPressure: 0,
      interestMultiplier: 1,
      salaryMultiplier: 1,
      targetMultiplier: 1,
      volatilityMultiplier: 1
    }
  },
  {
    id: "hard",
    label: "挑战",
    summary: "需求更波动，融资更贵，目标更硬，需要更稳的节奏。",
    modifiers: {
      costMultiplier: 1.05,
      demandMultiplier: 0.93,
      eventPressure: 0.18,
      interestMultiplier: 1.18,
      salaryMultiplier: 1.04,
      targetMultiplier: 1.08,
      volatilityMultiplier: 1.28
    }
  }
];
