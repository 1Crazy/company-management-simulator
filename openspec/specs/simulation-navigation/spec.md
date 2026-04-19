# simulation-navigation Specification

## Purpose
定义公司经营模拟项目的主流程路由、页面标题和无效访问回退规则，确保开局页与经营主界面具备清晰、稳定且中文优先的导航体验。

## Requirements
### Requirement: Route-based primary simulation flow
系统 SHALL 使用显式路由管理开局页与经营主界面的主流程，而不是仅依赖内存态切屏。

#### Scenario: Entering the setup page
- **WHEN** 用户访问应用根路径
- **THEN** 系统渲染开局面板，并允许用户在该页面选择场景、难度和公司名称

#### Scenario: Starting or restoring a run
- **WHEN** 用户开始新一局或读取可用存档
- **THEN** 系统导航到经营主界面路由，并显示当前局面的经营控制台

#### Scenario: Visiting the game route without a valid session
- **WHEN** 用户直接访问经营主界面路由但当前没有可用局面
- **THEN** 系统返回开局页或给出明确的中文引导，而不是停留在无效空白状态

### Requirement: Chinese route titles
系统 SHALL 根据当前路由和局面状态设置中文页面标题。

#### Scenario: Viewing the setup route
- **WHEN** 用户位于开局页
- **THEN** 页面标题使用中文产品名，而不是英文标题或空标题

#### Scenario: Viewing an active run
- **WHEN** 用户位于经营主界面且已有有效局面
- **THEN** 页面标题使用中文经营状态表达，并可包含当前公司名
