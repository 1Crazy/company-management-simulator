import { describe, expect, it } from "vitest";

import { buildPageTitle } from "../src/router/page-title";
import { createInitialState } from "../src/simulation/scenarios";
import { buildDecisionWorkbenchGroups } from "../src/ui/playbook";

function buildState() {
  return createInitialState({
    companyName: "测试公司",
    difficultyId: "standard",
    scenarioId: "smart-gadget-lab"
  });
}

describe("navigation copy", () => {
  it("renders Chinese page titles for setup and active run", () => {
    expect(buildPageTitle("menu")).toBe("公司经营模拟器");
    expect(buildPageTitle("game", "测试公司")).toBe("经营中 - 测试公司");
  });
});

describe("decision workbench", () => {
  it("builds four grouped sections with quick options and bounds", () => {
    const groups = buildDecisionWorkbenchGroups(buildState());

    expect(groups.map((group) => group.id)).toEqual(["market", "production", "organization", "finance"]);
    expect(groups.every((group) => group.fields.length > 0)).toBe(true);
    expect(groups.every((group) => group.fields.every((field) => field.quickOptions.length >= 3))).toBe(true);
    expect(groups.every((group) => group.fields.every((field) => field.min <= field.max))).toBe(true);
  });
});
