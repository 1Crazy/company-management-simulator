import type {
  DifficultyDefinition,
  SimulationEventDefinition,
  SimulationState,
  WeightedSimulationEvent
} from "../../../types/simulator";
import { nextRandom } from "../../helpers/rng";
import { CALM_EVENT, EVENTS } from "./catalog";

export function resolveEvent(
  state: SimulationState,
  difficulty: DifficultyDefinition
): { event: SimulationEventDefinition; nextRngState: number } {
  const eligible = EVENTS.filter((event) => {
    const reachedTurn = state.turn + 1 >= (event.minTurn ?? 1);
    const canTrigger = typeof event.when === "function" ? event.when(state) : true;
    return reachedTurn && canTrigger;
  });

  const weightedEvents: WeightedSimulationEvent[] = [...eligible, CALM_EVENT].map((event) => {
    let weight = event.baseWeight;

    if (event.tone === "positive") {
      weight *= 1 - difficulty.modifiers.eventPressure;
    }

    if (event.tone === "negative") {
      weight *= 1 + difficulty.modifiers.eventPressure;
    }

    return {
      ...event,
      weight: Math.max(0.2, weight)
    };
  });

  const totalWeight = weightedEvents.reduce((sum, event) => sum + event.weight, 0);
  const roll = nextRandom(state.rngState);
  let threshold = roll.value * totalWeight;
  let selected = weightedEvents.at(-1) ?? weightedEvents[0];

  for (const event of weightedEvents) {
    threshold -= event.weight;
    if (threshold <= 0) {
      selected = event;
      break;
    }
  }

  return {
    event: selected,
    nextRngState: roll.nextState
  };
}
