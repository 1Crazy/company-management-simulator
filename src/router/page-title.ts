import type { ScreenMode } from "@/types/app";

export function buildPageTitle(screen: ScreenMode, companyName?: string) {
  if (screen === "game" && companyName) {
    return `经营中 - ${companyName}`;
  }

  return "公司经营模拟器";
}
