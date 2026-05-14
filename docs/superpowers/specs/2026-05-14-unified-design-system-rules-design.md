# 统一设计系统与项目规则 — 设计说明（spec）

**日期**：2026-05-14  
**状态**：用户已选定载体与主内容宽度策略  
**适用范围**：规范与 Cursor 规则**仅落在** `nuxt-template/`；`react-template/` 仅作对照与迁移证据，**不作为长期维护的第二套文档**，将来删除仓库中的 React 模板时**不迁移其独立规范**。

---

## 1. 目标

1. **统一分析** shadcn-admin 的 **React 模板**与 **Nuxt 模板**在排版、样式、组件习惯上的共性，输出**一份**叙述（不拆两套并行规约）。  
2. 在 `nuxt-template/` 内建立**人机双载体**：完整设计文档 + Cursor 规则，使后续组件与页面**自动对齐**同一视觉与布局语言。  
3. **主内容宽度**：与 React 模板中 `Main` 在**非 fluid** 下的行为对齐（见 §4）。

---

## 2. 交付物（方案 1）

| 路径 | 受众 | 内容 |
|------|------|------|
| `nuxt-template/docs/design-system.md` | 人读 / 全员参考 | 双模板共性归纳、权威源、`main.css` 语义色、间距与排版、壳层与主内容规则、组件约定、禁止项、与 React 差异一节（短表）、**宽度 B** 的正式描述 |
| `nuxt-template/.cursor/rules/design-system.mdc` | Cursor Agent | 可执行短规则（10–25 条）+ `globs` 覆盖 `nuxt-template` 内 `*.vue` / `*.ts`；长文仅指向 `design-system.md` |

**不在范围**：为 `react-template` 单独维护规范文件；在本 spec 中不写实现代码（实现归入后续 plan）。

---

## 3. 统一设计 DNA（两个模板的分析结论）

- **组件体系**：均为 **shadcn / new-york** 风格、**CSS 变量主题**、**Lucide** 图标；Nuxt 侧为 **shadcn-vue（Reka UI）**。  
- **主题源**：以 **`nuxt-template/app/assets/css/main.css`** 为**唯一权威**（含由 React `theme.css` / `index.css` 迁入的 oklch token、`.dark`、`@layer base`、工具类等）。  
- **`components.json` 差异**：React 侧曾为 `baseColor: slate`，Nuxt 为 `neutral`；**不以此 JSON 作为色彩最终来源**，以 `main.css` 中变量为准。  
- **后台壳**：`SidebarProvider` + **inset** 侧栏 + **`SidebarInset`** 承主列 + 顶栏 + 可滚动主内容。  
- **可达性**：保留 `Skip to main` 与主内容 **`#main-content`** 约定。  
- **暗色**：仅通过 **`html` 上的 `.dark`**（及已定义的 `@custom-variant dark`），禁止页面内局部自定义一套 dark palette。

---

## 4. 主内容宽度策略（宽度 B — 用户已选）

**要求**：Nuxt 侧主内容区在视觉与规则上与 React `Main` 在 **`fluid === false`（默认）** 时一致。

**参考行为（React）**：`src/components/layout/main.tsx` 在非 fluid 时使用：

- `@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl`

**Nuxt 条件**：`layouts/authenticated.vue` 中 `SidebarInset` 已使用 **`@container/content`**，满足上述 container query 的前置条件。

**规范结论**：

- **`AppMain`**（或今后唯一包裹认证内页正文的组件）**必须**在默认情况下包含与上述等价的 Tailwind 类，使主内容在宽屏下**居中且 `max-w-7xl`**，除非某页在规范中登记为 **fluid 例外**（本阶段无业务页例外清单，默认全部非 fluid）。  
- **padding / gap**：在采用宽度 B 的同时，**保留**当前 `AppMain` 的 **`p-4 md:p-6`** 与 **`gap-4 md:gap-6`**（与现 Nuxt 一致）；与 React `Main` 的 `px-4 py-6` 略有断点差异时，**以 Nuxt 现行 md 断点为准**，并在 `design-system.md` 中单句说明即可。

**实现备注（供后续 implementation plan）**：修改 `nuxt-template/app/components/layout/AppMain.vue`（或等效单一入口），加入 max-width 相关类；改后跑 `pnpm run build` 与手测宽屏下 Dashboard 不无限拉宽。

---

## 5. `design-system.md` 建议目录结构

1. 目的、范围、权威文件列表  
2. 色彩与语义 token（指向 `main.css` 片段说明，不重复粘贴大段 CSS）  
3. 字体与字重（Inter、`font-sans`、`text-muted-foreground` 等）  
4. 圆角与边框（`rounded-md`、`border`、`--radius`）  
5. 布局：认证壳、顶栏高度习惯、`AppMain` 与 **宽度 B**  
6. 间距与栅格（`gap-4`、响应式 `grid` 模式）  
7. 组件：优先 `@/components/ui/*`、`cn()`、禁止裸交互元素  
8. 图标：Lucide 尺寸惯例  
9. 禁止清单（硬编码色、随意 gray 系列、第二套 sidebar 等）  
10. **附录**：React 模板对照简表（仅历史，标明「以 Nuxt 为准」）

---

## 6. `.cursor/rules/design-system.mdc` 建议要点

- `description`：一句话说明遵从 Nuxt 设计系统。  
- `globs`：仅匹配 `nuxt-template/**/*.{vue,ts}`（若工作区根为 `shadcn-admin`，则使用 `nuxt-template/**` 前缀形式，以落地时目录为准）。  
- 正文：强制读 `docs/design-system.md`；摘录最短硬规则（token、`AppMain` 宽度 B、只用 ui 组件、Lucide、无 hex 等）。

---

## 7. 验证标准

- 新增页面与 Dashboard 并置：**背景、字色、圆角、主内容最大宽度**一致；宽屏主列不无限延展（**max-w-7xl** 生效）。  
- `pnpm run build`（在 `nuxt-template`）通过。

---

## 8. 后续步骤

1. 用户确认本 spec 文稿（「spec 已定稿」）。  
2. 使用 **writing-plans** 生成：撰写 `design-system.md`、`design-system.mdc`、**实现 AppMain 宽度 B** 的短任务列表（若希望规则与代码同一 PR）。  
3. **不代用户 git commit**。

---

## 9. Spec 自检

- 无 TBD/TODO。  
- 与聊天结论一致：方案 1、宽度 B、输出仅在 `nuxt-template`、双模板统一分析单份叙述。  
- 实现边界：`AppMain` 改动在 plan 中执行，本文件仅为设计约束。
