## ADDED Requirements

### Requirement: Preset-assisted decision drafting
系统 SHALL 在经营方案区提供策略模板或快捷档位，帮助玩家快速形成可提交的经营初稿。

#### Scenario: Starting a turn with a preset
- **WHEN** 玩家进入新回合且尚未形成完整方案
- **THEN** 系统允许玩家一键套用稳健、扩张或防守等模板，并立即更新预提交摘要

#### Scenario: Revising after preset application
- **WHEN** 玩家套用策略模板后继续手动调整字段
- **THEN** 系统保留手动编辑能力，不锁定字段，也不强制维持模板数值

## MODIFIED Requirements

### Requirement: Department-based decision inputs
系统 SHALL 在每个经营周期提供按业务语义分组的经营决策工作台，至少覆盖市场、生产、组织和资金四类区域，并在每个区域内提供当前默认值、快捷调整和必要的硬性限制。

#### Scenario: Viewing grouped workbench on desktop
- **WHEN** 玩家在桌面端进入一个新回合的决策阶段
- **THEN** 系统以宽主栏展示按业务语义分组的经营字段，而不是把所有字段压成同质列表

#### Scenario: Adjusting a high-frequency field quickly
- **WHEN** 玩家需要微调价格、产量或预算类字段
- **THEN** 系统提供输入框之外的快捷步进或快捷档位控件，以减少重复输入

#### Scenario: Restricting unavailable actions by scenario
- **WHEN** 某个场景或难度禁用特定经营动作
- **THEN** 系统在对应分组内显示不可用状态并说明限制原因，而不影响其他分组继续编辑

### Requirement: Pre-submit summary and post-settlement review
系统 SHALL 在经营方案区内提供紧凑、优先级明确的预提交摘要，并在结算后保留与本回合决策直接相关的结果解释。

#### Scenario: Reviewing the plan before confirmation
- **WHEN** 玩家准备锁定本回合经营方案
- **THEN** 系统在输入区附近优先展示现金缓冲、刚性流出、产能占用和期末债务等关键指标，以及本回合最重要的错误或预警

#### Scenario: Acting on a risky plan without losing context
- **WHEN** 方案存在硬错误或高风险预警
- **THEN** 系统在主操作按钮附近展示可见的文本提示，使玩家无需滚动到其他区域即可判断是否继续提交

#### Scenario: Inspecting decision impact after settlement
- **WHEN** 当前回合结算完成
- **THEN** 系统展示哪些经营决策推动了收入、成本、品牌或士气变化
