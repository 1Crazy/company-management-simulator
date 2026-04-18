## ADDED Requirements

### Requirement: Department-based decision inputs
系统 SHALL 在每个经营周期提供结构化经营决策项，至少覆盖定价、营销预算、研发投入、招聘或裁员、产能安排和融资行为。

#### Scenario: Editing a full operating plan
- **WHEN** 玩家进入一个新回合的决策阶段
- **THEN** 系统展示所有可调整的部门决策项及其当前默认值

#### Scenario: Restricting unavailable actions by scenario
- **WHEN** 某个场景或难度禁用特定经营动作
- **THEN** 系统对对应控件显示不可用状态并说明限制原因

### Requirement: Constraint validation before submission
系统 SHALL 在提交经营方案前校验预算、现金、产能、人力和债务约束，并阻止明显无效的方案进入结算。

#### Scenario: Blocking an over-budget plan
- **WHEN** 玩家提交的方案导致当期现金无法覆盖必要支出
- **THEN** 系统阻止提交并指出超支来源

#### Scenario: Warning on a high-risk but valid plan
- **WHEN** 玩家选择高杠杆融资或极端压缩人员等高风险策略但仍满足硬性约束
- **THEN** 系统允许提交，同时展示主要风险提示

### Requirement: Pre-submit summary and post-settlement review
系统 SHALL 支持在提交前查看本回合决策摘要，并在结算后查看主要决策对结果的影响标签。

#### Scenario: Reviewing the plan before confirmation
- **WHEN** 玩家准备锁定本回合经营方案
- **THEN** 系统展示本回合关键调整项、预算占比和预估风险摘要

#### Scenario: Inspecting decision impact after settlement
- **WHEN** 当前回合结算完成
- **THEN** 系统展示哪些经营决策推动了收入、成本、品牌或士气变化
