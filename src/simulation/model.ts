export { deepClone } from "./helpers/clone";
export { GAME_STATUS, TONE_CLASS } from "./helpers/constants";
export { clamp, round, toNumber } from "./helpers/math";
export { metricValue } from "./helpers/metrics";

export const STORAGE_VERSION = 1;
export const SAVE_SLOTS = ["slot-1", "slot-2", "slot-3"] as const;
