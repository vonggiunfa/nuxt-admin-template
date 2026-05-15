# Nuxt 组件约定整合（文档 + Cursor 规则）— 设计说明

**日期**：2026-05-15  
**状态**：已落地（文档与 `design-system.mdc` 摘要已更新）  
**范围**：**仅 `nuxt-template`**；`react-template` 不新增 Cursor 规则，仅在 `docs/design-system.md` §11 等处分历史对照。

---

## 1. 目标

在 **新增或修改** Vue/TS 组件时，有固定可对齐的权威顺序：**排版布局（壳层 + `AppMain` 宽度 B）→ 样式（`main.css` 语义 token、`ui/*`、`cn()`）→ 交互（含表单、loading、toast）→ 可达性（`#main-content` 等）**，避免风格漂移。

---

## 2. 非目标

- 不为 `react-template` 编写或扩充 `.cursor/rules`。  
- 不重写现有业务组件（本 spec 仅约束**文档与规则入口**）。  
- 不在仓库根强制新增指针规则（可选；若常从 monorepo 根打开且规则未命中，可自行增加跳转用 `.mdc`）。

---

## 3. 权威栈（摘要）

1. **`app/assets/css/main.css`** — 主题 token。  
2. **`docs/design-system.md`** — 排版与样式唯一长文权威（含 **§12** 组件工作流）。  
3. **壳层组件** — `authenticated` 布局、`AppSidebar`、`AppHeader`、`AppMain`。  
4. **`app/components/ui/*`** — shadcn-vue primitive。  
5. **`.cursor/rules/forms-paradigm.mdc`**、**`vue-v-model.mdc`** — 表单与 `v-model` 硬约定。  
6. **`docs/superpowers/specs/`** — 与壳层/模块强相关的已定行为。

---

## 4. 交付物

| 交付物 | 说明 |
|--------|------|
| `docs/design-system.md` | 新增 **§12 组件新增与修改**（阅读顺序 + 检查清单）；原 §12/§13 顺延为 §13/§14；§14 补充「以 `nuxt-template/` 为工作区」的加载说明。 |
| `.cursor/rules/design-system.mdc` | `description` 与正文要求：改组件前先读 **§12**，并读 **§4–§9**；摘要条目不变更语义。 |

---

## 5. 验收

- 维护者能按 **§12.1 / §12.2** 逐项自检，且不引入第二套壳层、裸色、或绕过 `FormMessage` 的表单 UX。  
- `nuxt-template` 下 **`pnpm run build`** 通过（文档-only 变更不改变构建产物行为）。

---

## 6. 后续（实现计划）

经人工审阅本 spec 无异议后，可单独编写 implementation plan（例如仅含「团队 onboarding：打开 `nuxt-template` 作为 Cursor 工作区」等运维项）；**本变更不包含业务代码修改**。

---

## Spec 自检

- **占位符**：无。  
- **一致性**：与 §11「React 仅附录」、现有 `forms-paradigm` / `vue-v-model` 分工一致。  
- **范围**：单仓文档+规则入口，可单独收尾。  
- **歧义**：「全宽例外」须在需求或本文档中显式说明（已在 §12.2 清单中写明）。
