# simulation-core Specification

## Purpose
TBD - created by archiving change add-company-management-simulator. Update Purpose after archive.
## Requirements
### Requirement: Local deterministic simulation loop
系统 SHALL 在浏览器本地以固定经营周期推进模拟，且所有经营结果 MUST 由本地规则、公式和事件表计算，不得依赖远程 AI 服务、后端接口或云端结算。

#### Scenario: Advancing to the next operating period
- **WHEN** 玩家锁定当前回合决策并推进到下一回合
- **THEN** 系统在本地完成事件抽取、经营结算、状态更新并生成新的回合数据

#### Scenario: Continuing play while offline
- **WHEN** 用户在离线环境中继续已加载的经营局
- **THEN** 回合推进、结果计算和状态展示仍然可以正常完成

### Requirement: Unified company state model
系统 SHALL 维护统一的公司状态模型，至少包含现金、收入、成本、利润、债务、员工规模、士气、产能、产品质量、品牌热度和市场份额。

#### Scenario: Updating company metrics after settlement
- **WHEN** 一个经营周期完成结算
- **THEN** 系统更新所有受影响的公司指标并记录本回合前后差值

#### Scenario: Triggering an operating failure state
- **WHEN** 公司现金连续为负或关键经营指标跌破场景设定阈值
- **THEN** 系统判定本局失败并展示失败原因与最终成绩

### Requirement: Scenario objectives and end conditions
系统 SHALL 为每个场景定义目标回合数、阶段性目标和结局判定条件，并在满足胜利或失败条件时结束当前经营局。

#### Scenario: Completing a scenario successfully
- **WHEN** 玩家在最终回合结束时达到场景要求的核心指标
- **THEN** 系统显示胜利结局、关键成绩和阶段复盘

#### Scenario: Tracking milestone progress during play
- **WHEN** 玩家处于进行中的经营周期
- **THEN** 系统显示当前距离阶段目标和最终目标的完成进度

### Requirement: Event-driven operating changes
系统 SHALL 支持按场景规则和公司状态触发经营事件，并将事件结果纳入同一回合的经营结算。

#### Scenario: Applying a market shock event
- **WHEN** 当前回合触发原材料涨价、政策变化或竞争加剧等市场事件
- **THEN** 系统将事件影响同步反映到成本、需求、产能或风险指标中

#### Scenario: Triggering a state-based internal event
- **WHEN** 公司连续多回合压缩研发或人力投入并达到预设阈值
- **THEN** 系统触发对应的内部事件并更新士气、质量或执行效率

