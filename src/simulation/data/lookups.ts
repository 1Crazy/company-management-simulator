import type { DifficultyDefinition, ScenarioChoiceSummary, ScenarioDefinition } from "../../types/simulator";
import { deepClone } from "../helpers/clone";
import { DIFFICULTIES } from "./difficulties";
import { SCENARIOS } from "./scenarios";

export function getScenario(scenarioId: string): ScenarioDefinition {
  return SCENARIOS.find((scenario) => scenario.id === scenarioId) ?? SCENARIOS[0];
}

export function getDifficulty(difficultyId: string): DifficultyDefinition {
  return DIFFICULTIES.find((difficulty) => difficulty.id === difficultyId) ?? DIFFICULTIES[1];
}

export function scenarioChoiceSummary(scenarioId: string, difficultyId: string): ScenarioChoiceSummary {
  const scenario = getScenario(scenarioId);
  const difficulty = getDifficulty(difficultyId);
  const finalMilestone = scenario.milestones.at(-1);

  return {
    challenge: difficulty.summary,
    headline: finalMilestone?.label ?? scenario.finalObjective.label,
    metrics: finalMilestone?.metrics ?? {},
    scenario,
    subtitle: `${scenario.subtitle} / ${difficulty.label}`
  };
}

export function listScenarioCards(): ScenarioDefinition[] {
  return deepClone(SCENARIOS);
}

export { DIFFICULTIES, SCENARIOS };
