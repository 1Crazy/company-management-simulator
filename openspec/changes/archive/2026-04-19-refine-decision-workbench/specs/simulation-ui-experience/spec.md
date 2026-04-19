## MODIFIED Requirements

### Requirement: Operations control-room layout
系统 SHALL 在桌面端采用“主操作区 + 侧边控制塔”的非对称控制室布局，使经营方案区获得足够宽度，趋势与反馈区使用渐进披露而不是默认全量堆叠。

#### Scenario: Viewing the main layout on desktop
- **WHEN** 玩家在桌面端进入经营主界面
- **THEN** 系统优先保证经营方案工作台拥有可容纳分组输入和摘要的主宽度，并将目标、存档和近几回合信息放入稳定侧栏

#### Scenario: Reviewing trends without excessive scrolling
- **WHEN** 玩家查看财务、现金或组织趋势
- **THEN** 系统通过标签切换或同等的渐进披露方式展示图表，而不是默认同时展开全部趋势区块

#### Scenario: Viewing the main layout on mobile
- **WHEN** 玩家在移动端进入经营主界面
- **THEN** 系统将核心区域按优先级重排为纵向分段布局，并保留对关键摘要和主操作按钮的快速访问

### Requirement: `ui-ux-pro-max`-driven visual system
系统 SHALL 使用更具策略经营游戏氛围的视觉系统，采用暖石背景、深炭标题、金色主操作强调和清晰的盈亏/风险状态色，同时保持文本对比度和数据可读性。

#### Scenario: Rendering the control-room palette
- **WHEN** 玩家进入开局面板或经营主界面
- **THEN** 系统使用统一的暖中性色背景、深炭主文字、金色 CTA、冷色数据辅助色和独立的成功/失败状态色，替换当前偏普通后台化的浅蓝体系

#### Scenario: Distinguishing financial states
- **WHEN** 界面展示盈利、亏损、风险或预警状态
- **THEN** 系统同时使用颜色、文本和标签表达状态，而不是只依赖颜色

#### Scenario: Rendering typography hierarchy
- **WHEN** 界面展示经营指标、正文说明和操作标签
- **THEN** 系统对高权重数字和标题使用更强对比的标题层级，对正文和表单维持长时间操作下的可读性

## ADDED Requirements

### Requirement: Chinese-first interface copy
系统 SHALL 在核心操作界面中优先使用中文文案，避免无必要的英文标签和说明。

#### Scenario: Viewing primary section labels
- **WHEN** 玩家进入开局页或经营主界面
- **THEN** 顶部栏、区域标题、趋势标签、帮助抽屉和主要操作按钮使用中文优先表达

#### Scenario: Preserving English only when necessary
- **WHEN** 某个内容属于技术术语、依赖名或必须保留的专有标识
- **THEN** 系统仅在确有必要时保留英文，并保持中文作为主要界面语言
