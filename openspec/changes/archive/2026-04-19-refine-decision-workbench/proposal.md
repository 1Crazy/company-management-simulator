## Why

当前“本回合经营方案”区域虽然已经具备完整字段和预提交摘要，但桌面端仍然存在输入卡被挤压、扫描路径过长、关键操作不够顺手的问题；同时现有浅蓝配色更像企业后台，而不像一款让人愿意继续推演的策略经营游戏。现在需要把经营方案区重构为更像“操盘台”的工作台，并同步提升色系吸引力。

## What Changes

- 重构经营方案区的桌面端布局，将决策输入、策略模板、预提交摘要和主操作组织为更稳定的操盘台结构
- 将经营字段按业务语义重新分组，降低逐项扫视成本，并为高频字段引入更顺手的快捷交互
- 调整趋势和反馈区的默认查看方式，减少进入主界面后的纵向滚动压力
- 重做游戏主界面的视觉配色，替换当前偏普通后台化的浅蓝控制台风格，提升策略游戏氛围和操作驱动力
- 引入 `vue-router` 管理开局页与经营主界面的主流程路由，并设置中文页面标题
- 将核心界面文案切换为中文优先，移除无必要的英文区块名和说明
- 保持移动端可访问性与现有经营规则不变，不引入后端依赖或 AI 能力

## Capabilities

### New Capabilities

- `simulation-navigation`: 管理开局页与经营主界面的路由切换、页面标题和无效访问处理

### Modified Capabilities

- `business-decision-panel`: 调整经营决策区的布局、字段分组、快捷交互和预提交摘要呈现方式
- `simulation-ui-experience`: 调整主界面布局优先级、趋势查看方式、中文文案策略和视觉配色系统，使其更像策略经营游戏控制台

## Impact

- Affected code:
  - `src/components/game/DecisionPanel.vue`
  - `src/components/game/DecisionFieldCard.vue`
  - `src/components/game/GameScreen.vue`
  - `src/components/game/ChartsPanel.vue`
  - `src/components/game/TurnGuidePanel.vue`
  - `src/components/common/AppTopBar.vue`
  - `src/main.ts`
  - `src/router/*`
  - `src/style.css`
  - `src/ui/playbook.ts`
- Affected systems:
  - 游戏主界面布局与视觉系统
  - 经营方案录入体验
  - 提交前风险判断与趋势查看体验
  - 开局页与经营主界面的导航方式
- Likely dependency change:
  - `vue-router`
