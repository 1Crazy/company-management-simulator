import { describe, expect, it } from "vitest";

import { getObjectiveStatus, summarizePlan } from "../src/simulation/engine";
import { createInitialState } from "../src/simulation/scenarios";
import { buildHelpSections, buildTurnGuideItems, createPlanFromPreset } from "../src/ui/playbook";

function buildState() {
  return createInitialState({
    companyName: "测试企业",
    difficultyId: "standard",
    scenarioId: "smart-gadget-lab"
  });
}

describe("ui playbook", () => {
  it("keeps strategy presets within scenario bounds", () => {
    const state = buildState();

    for (const presetId of ["balanced", "growth", "cash"]) {
      const plan = createPlanFromPreset(state, presetId);

      expect(plan.productionTarget).toBeLessThanOrEqual(state.capacity);
      expect(plan.productionTarget).toBeGreaterThanOrEqual(0);
      expect(plan.borrowAmount).toBeGreaterThanOrEqual(0);
      expect(plan.repayAmount).toBeLessThanOrEqual(state.debt);
      expect(plan.marketingBudget % 1000).toBe(0);
      expect(plan.rndBudget % 1000).toBe(0);
    }
  });

  it("builds three turn guide cards from the current session context", () => {
    const state = buildState();
    const preview = summarizePlan(state, createPlanFromPreset(state, "balanced"));
    const objectiveStatus = getObjectiveStatus(state);
    const items = buildTurnGuideItems(state, preview, objectiveStatus);

    expect(items).toHaveLength(3);
    expect(items.every((item) => item.body.length > 0)).toBe(true);
  });

  it("produces help sections with dynamic objective hints", () => {
    const state = buildState();
    const objectiveStatus = getObjectiveStatus(state);
    const sections = buildHelpSections(state, objectiveStatus);

    expect(sections).toHaveLength(3);
    expect(sections[2].bullets.some((bullet) => bullet.includes("年度目标线"))).toBe(true);
  });
});
