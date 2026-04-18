## ADDED Requirements

### Requirement: Operations control-room layout
系统 SHALL 采用面向经营模拟的高信息密度控制台布局，在同一主界面内并置经营决策区、关键 KPI 区、财务与趋势图区以及事件/目标历史区。

#### Scenario: Viewing the main layout on desktop
- **WHEN** 玩家在桌面端进入经营主界面
- **THEN** 系统在单屏内呈现决策、结果和历史三类核心区域，并保证当前回合的关键指标始终可见

#### Scenario: Viewing the main layout on mobile
- **WHEN** 玩家在移动端进入经营主界面
- **THEN** 系统将核心区域按优先级重排为纵向分段布局，并保留对当前回合关键指标和主要操作的快速访问

### Requirement: `ui-ux-pro-max`-driven visual system
系统 SHALL 使用基于 `ui-ux-pro-max` 检索结果整理出的视觉系统，采用经营控制台风格的中性浅底、深蓝主色、琥珀强调色，以及独立的盈利/亏损状态色。

#### Scenario: Distinguishing financial states
- **WHEN** 界面展示盈利、亏损、风险或预警状态
- **THEN** 系统同时使用颜色、文本和图标或标签表达状态，而不是只依赖颜色

#### Scenario: Rendering typography hierarchy
- **WHEN** 界面展示经营指标、正文说明和操作标签
- **THEN** 系统对高权重数字和标题使用技术感更强的字体层级，对正文和表单使用高可读字体层级

### Requirement: Accessible dense interactions
系统 SHALL 保证数据密集界面中的卡片、图标按钮、表单项和错误提示具备完整的可访问性交互。

#### Scenario: Using keyboard navigation
- **WHEN** 用户仅通过键盘浏览主界面并操作经营控件
- **THEN** 系统提供符合视觉顺序的焦点移动、可见焦点态和可触达的核心功能

#### Scenario: Triggering a validation error
- **WHEN** 玩家提交无效经营方案而触发校验错误
- **THEN** 系统以可见文本和可播报提示展示错误信息，并定位到对应问题区域

### Requirement: Controlled feedback and motion
系统 SHALL 为关键数据变化和交互热点提供克制、稳定的反馈效果，并尊重减少动态效果设置。

#### Scenario: Hovering over an interactive card
- **WHEN** 用户悬停或聚焦可点击卡片、表格行或图表数据点
- **THEN** 系统展示阴影、描边、高亮或 tooltip 等明确反馈，而不造成布局跳动

#### Scenario: Preferring reduced motion
- **WHEN** 用户设备启用了减少动态效果偏好
- **THEN** 系统停用非必要动画，仅保留不影响理解的最小状态反馈
