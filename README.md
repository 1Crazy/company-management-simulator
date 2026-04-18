# 公司经营模拟器

一个基于 `Vue 3 + TypeScript + Tailwind CSS` 构建的纯前端公司经营模拟项目。  
玩家需要在定价、营销、研发、人力、产能和融资之间持续做取舍，在有限回合内完成阶段目标，并守住现金流、质量和团队状态。

## 项目特点

- 纯前端逻辑驱动，不接入 AI 能力，也不依赖后端服务
- 支持多场景、多难度的经营开局
- 包含完整的月度经营回合结算、事件触发与胜负判定
- 提供本地自动存档与手动存档槽位
- 使用控制室式数据密集界面，支持帮助面板、策略模板与趋势图查看
- 核心经营公式、即时预览与结算流程均拆分为独立 TypeScript 模块，便于维护

## 你可以在游戏里做什么

每一回合都围绕同一个经营闭环展开：

1. 查看阶段目标、风险状态和上期反馈
2. 调整本期经营方案
3. 在提交前摘要里确认现金、债务和产能是否安全
4. 结算本期并观察报表、事件和趋势变化
5. 根据反馈继续修正下一回合策略

项目当前内置了以下类型的经营决策：

- 定价
- 计划生产
- 营销预算
- 研发预算
- 人员增减
- 扩产投入
- 新增融资
- 主动还款

## 技术栈

- `Vue 3`
- `TypeScript`
- `Tailwind CSS`
- `Vite`
- `Vitest`
- `OpenSpec`

## 本地开发

### 安装依赖

```bash
pnpm install
```

### 启动开发环境

```bash
pnpm dev
```

### 运行测试

```bash
pnpm test
```

### 生成生产构建

```bash
pnpm build
```

## 项目结构

```text
src/
  components/
    common/          通用组件
    game/            游戏中控界面组件
    setup/           开局与场景配置组件
  composables/       组合式状态编排
  persistence/       本地存档读写
  simulation/        核心经营规则、场景数据与工具函数
  types/             共享类型定义
  ui/                图表、格式化与交互辅助模块

tests/               单元测试
openspec/            OpenSpec 规格、变更与归档
design-system/       UI 设计系统沉淀
```

## OpenSpec 状态

当前项目已完成一次完整的 OpenSpec 变更落地，并已同步到主 spec：

- 主 spec 目录：`openspec/specs/`
- 已归档变更：`openspec/changes/archive/2026-04-18-add-company-management-simulator/`

主 spec 当前覆盖以下能力域：

- `business-decision-panel`
- `market-and-finance-model`
- `scenario-and-save-management`
- `simulation-core`
- `simulation-ui-experience`

## 当前脚本

`package.json` 中提供了以下常用脚本：

- `pnpm dev`：启动本地开发服务
- `pnpm test`：运行 Vitest 单元测试
- `pnpm build`：执行类型检查并生成生产构建
- `pnpm preview`：预览生产构建结果

## 适合继续扩展的方向

- 增加更多行业场景与事件库
- 引入更细的经营指标和难度曲线
- 优化移动端交互和更高密度的数据对比视图
- 补充分组决策、快捷档位和更强的策略编辑体验
