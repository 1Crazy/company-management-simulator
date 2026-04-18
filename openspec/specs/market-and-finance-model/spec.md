# market-and-finance-model Specification

## Purpose
TBD - created by archiving change add-company-management-simulator. Update Purpose after archive.
## Requirements
### Requirement: Market response calculation
系统 SHALL 根据价格、产品质量、品牌热度、市场景气、竞争压力和产能供给计算销量、库存与市场份额结果。

#### Scenario: Lower price increases reachable demand
- **WHEN** 玩家在其他关键条件基本不变的情况下适度降低售价
- **THEN** 系统提高可触达需求，并在产能允许范围内增加销量

#### Scenario: Capacity limits realized sales
- **WHEN** 市场需求高于公司可交付产能
- **THEN** 系统按产能上限截断实际销量，并将缺口反映为机会损失或积压需求

### Requirement: Financial reporting after each operating period
系统 SHALL 在每个经营周期结束后生成结构化经营报告，至少包含损益摘要、现金变化、债务情况和关键指标环比变化。

#### Scenario: Viewing end-of-period financial results
- **WHEN** 当前回合结算完成
- **THEN** 系统展示收入、成本、利润、现金净变化和主要经营指标变化

#### Scenario: Showing the effect of financing actions
- **WHEN** 玩家在本回合进行贷款、还款或其他融资动作
- **THEN** 系统在报告中明确展示现金流改善与债务压力增加的对应变化

### Requirement: Trend and performance visualization
系统 SHALL 保存回合级历史数据，并以趋势图、阶段对比或排行榜式指标卡展示长期经营表现。

#### Scenario: Comparing current results with previous periods
- **WHEN** 玩家查看经营历史区域
- **THEN** 系统展示至少最近数个回合的收入、利润、现金或市场份额趋势

#### Scenario: Highlighting milestone performance
- **WHEN** 玩家达到或错过某个阶段目标
- **THEN** 系统在可视化区域突出显示该目标节点及其对应成绩

### Requirement: Rule-based management insights
系统 SHALL 基于固定规则、阈值和模板输出经营解读，不得使用 AI 生成文本。

#### Scenario: Explaining a positive outcome
- **WHEN** 营销投入提升品牌热度并带动销量增长
- **THEN** 系统使用规则模板解释“品牌提升推动需求增长”之类的原因标签

#### Scenario: Explaining a negative outcome
- **WHEN** 研发、人力或产能投入不足导致质量下降或交付受限
- **THEN** 系统使用规则模板解释对应的经营后果和受影响指标

