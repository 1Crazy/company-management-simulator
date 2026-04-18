import type { ObjectiveMetricKey, ObjectiveStatus, SimulationState } from "../../types/simulator";
import { getDifficulty, getScenario } from "../data/lookups";
import { metricValue } from "../helpers/metrics";
import { clamp } from "../helpers/math";

export function getObjectiveStatus(state: SimulationState): ObjectiveStatus {
  const scenario = getScenario(state.scenarioId);
  const difficulty = getDifficulty(state.difficultyId);

  const milestones = scenario.milestones.map((milestone) => {
    const items = (Object.entries(milestone.metrics) as Array<[ObjectiveMetricKey, number]>).map(([key, baseTarget]) => {
      const scaledTarget = key === "debt" ? baseTarget : Math.round(baseTarget * difficulty.modifiers.targetMultiplier);
      const current = metricValue(state, key);
      const progress =
        key === "debt"
          ? clamp(scaledTarget / Math.max(1, current), 0, 1.4)
          : clamp(current / Math.max(1, scaledTarget), 0, 1.4);

      return {
        current,
        key,
        progress,
        scaledTarget
      };
    });

    return {
      achieved: items.every((item) => item.progress >= 1),
      items,
      label: milestone.label,
      turn: milestone.turn
    };
  });

  const finalMilestone = milestones.at(-1);
  const targetsMet = finalMilestone?.items.filter((item) => item.progress >= 1).length ?? 0;

  return {
    final: {
      label: scenario.finalObjective.label,
      minimumTargetsMet: scenario.finalObjective.minimumTargetsMet,
      targetsMet
    },
    milestones
  };
}
