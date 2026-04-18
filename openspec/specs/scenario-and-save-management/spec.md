# scenario-and-save-management Specification

## Purpose
TBD - created by archiving change add-company-management-simulator. Update Purpose after archive.
## Requirements
### Requirement: Scenario and difficulty selection
系统 SHALL 在新开局流程中提供预设场景与难度选择，并根据所选配置初始化目标、起始资源和事件参数。

#### Scenario: Starting a game from a selected scenario
- **WHEN** 玩家选择一个预设场景并确认开局
- **THEN** 系统按该场景的初始资金、目标回合和行业参数创建新存档

#### Scenario: Changing difficulty before starting
- **WHEN** 玩家切换难度配置
- **THEN** 系统同步更新目标阈值、市场压力或资源宽松度等难度说明

### Requirement: Local save and load slots
系统 SHALL 将经营进度保存在浏览器本地，并支持自动存档与手动读档。

#### Scenario: Autosaving after settlement
- **WHEN** 一个经营周期完成结算
- **THEN** 系统自动将当前局面保存到本地最近进度记录

#### Scenario: Loading a previous save
- **WHEN** 玩家在开始界面或暂停界面选择某个本地存档
- **THEN** 系统恢复对应的公司状态、回合历史和场景配置

### Requirement: Restart and new-run management
系统 SHALL 支持从当前场景重新开局、放弃当前局面或基于现有场景参数快速开始新一局。

#### Scenario: Restarting the current scenario
- **WHEN** 玩家在进行中或结算后的界面选择重新开局
- **THEN** 系统使用当前场景与难度参数创建一局全新的初始状态

#### Scenario: Confirming a destructive restart
- **WHEN** 玩家已有未完成进度并尝试覆盖当前局面
- **THEN** 系统要求明确确认后再执行覆盖或重开操作

### Requirement: Save compatibility handling
系统 SHALL 为本地存档记录版本信息，并在检测到不兼容存档时给出明确提示。

#### Scenario: Loading a compatible save
- **WHEN** 本地存档版本与当前应用支持版本一致
- **THEN** 系统正常读取并恢复游戏进度

#### Scenario: Encountering an incompatible save
- **WHEN** 玩家尝试读取不再兼容的旧版本存档
- **THEN** 系统说明该存档无法继续使用，并提供删除或重新开局选项

