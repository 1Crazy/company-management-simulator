import type { ScenarioDefinition } from "../../../types/simulator";
import { CRAFT_DRINK_CHAIN } from "./craft-drink-chain";
import { SENSOR_FACTORY } from "./sensor-factory";
import { SMART_GADGET_LAB } from "./smart-gadget-lab";

export const SCENARIOS: ScenarioDefinition[] = [SMART_GADGET_LAB, CRAFT_DRINK_CHAIN, SENSOR_FACTORY];
