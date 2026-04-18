import type { GameStatus, InsightTone } from "../../types/simulator";

export const GAME_STATUS = {
  LOST: "lost",
  PLAYING: "playing",
  WON: "won"
} as const satisfies Record<string, GameStatus>;

export const TONE_CLASS = {
  danger: "danger",
  neutral: "neutral",
  positive: "positive",
  warning: "warning"
} as const satisfies Record<InsightTone, InsightTone>;
