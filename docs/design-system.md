# Nuxt 模板设计系统（统一规范）

本文档是 **shadcn-admin 仓库内 Vue/Nuxt 工程** 的唯一排版与样式权威。历史 **React 模板**（`react-template/`）仅作为迁移与对照来源；**不以 React 另建一套规约**；React 目录删除后，**仍以本文件 + `app/assets/css/main.css` 为准**。

---

## 1. 权威源（修改样式的顺序）

1. **`app/assets/css/main.css`** — 主题 token（`:root` / `.dark`）、Tailwind、`@layer base`、工具类、动画。**改色、改圆角、改全局底色必先改此文件**。  
2. **`components.json`** — shadcn-vue 别名、样式预设（`new-york`、`neutral`、CSS 变量开关）。**不把它当作最终颜色来源**；颜色以 `main.css` 中变量为准。  
3. **壳层布局** — `app/layouts/authenticated.vue`、`app/components/layout/AppSidebar.vue`、`AppHeader.vue`、`AppMain.vue`。  
4. **UI  primitive** — `app/components/ui/*`（CLI 生成，业务避免直接大改结构；定制优先 `variant`/`class`/`cn()`）。

---

## 2. 双模板统一结论（DNA）

| 维度 | 结论 |
|------|------|
| UI 语言 | **shadcn new-york** + **CSS 变量**；Vue 侧为 **shadcn-vue（Reka UI）**。 |
| 图标 | **Lucide**（`lucide-vue-next`）。 |
| 主题 | 语义色 **oklch**，亮/暗由 **`html.dark`** 切换；与历史 React 模板 token 对齐部分已并入 `main.css`。 |
| 后台壳 | **SidebarProvider** + **inset** 侧栏 + **SidebarInset** 主列 + **顶栏** + **可滚动主内容**。 |
| 可达性 | **跳到主内容**链接；主内容根节点 **`id="main-content"`**（见 `AppMain`）。 |
| 表单校验与反馈 | **字段可见错误、`toast`、`loading`** 等 MOCK 交互：与 **`react-template/` 同源页面表单**对齐；实现栈：**vee-validate + zod**；**语义色与排版仍仅以本文件 + `main.css` + `docs/superpowers/specs/2026-05-14-auth-form-validation-parity-design.md` 为准。** |

---

## 3. 色彩与语义（用法约定）

在组件中**优先使用语义类名**，勿写死 hex/rgb：

- **页面背景 / 正文**：`bg-background`、`text-foreground`。  
- **次要说明**：`text-muted-foreground`。  
- **卡片 / 弹层**：`bg-card`、`text-card-foreground`；`popover-*` 用于浮层。  
- **主操作**：`bg-primary`、`text-primary-foreground`。  
- **破坏性操作**：`text-destructive` / `bg-destructive`（按组件 API）。  
- **边框与输入**：`border-border`、`border-input`。  
- **侧栏**：`bg-sidebar`、`text-sidebar-foreground` 等（与 token 映射一致）。  
- **图表**：`chart-1` … `chart-5`（Tailwind 已映射到变量）。

具体变量值只在 **`main.css`** 维护；本文不复制完整 CSS。

---

## 4. 字体与排版

- **字体**：**Inter**（`main.css` 通过 Google Fonts 引入）；`body` 使用 `font-sans`、**`antialiased`**。  
- **页面主标题（后台）**：典型为 **`text-2xl font-bold tracking-tight`**（与仪表盘页一致）。  
- **卡片小标题 / KPI**：常见 **`text-sm font-medium`**。  
- **辅助信息**：**`text-xs text-muted-foreground`**。

---

## 5. 圆角、边框与阴影

- **全局圆角基准**：`--radius`（见 `main.css`）；组件常用 **`rounded-md`**。  
- **分割线**：`border`、`Separator` 组件；勿用随意 `border-gray-200`。  
- **顶栏**：与 `AppHeader` 一致时使用 **`border-b`**；不要随意加与壳层冲突的 `shadow`（除非与现有 Header 行为一致并有理由）。

---

## 6. 布局：认证壳与主内容（含宽度 B）

### 6.1 结构

- **`layouts/authenticated.vue`**：`SidebarProvider` → `SkipToMain` → `AppSidebar` → **`SidebarInset`（须含 `@container/content`）** → 页面插槽。  
- 页面内：**`AppHeader`** + **`AppMain`** 包住正文（与当前仪表盘页一致）。

### 6.2 主内容宽度（宽度 B，与历史 React `Main` 非 fluid 对齐）

- **`AppMain`** 在默认情况下**必须**包含容器查询类：  
  **`@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl`**  
- **前提**：父级 **`SidebarInset` 使用 `@container/content`**（已满足）。  
- **内边距与纵向节奏**（以 Nuxt 为准，与 React `px-4 py-6` 略有断点差异）：  
  **`p-4 md:p-6`**、**`gap-4 md:gap-6`**。  
- **Fluid 例外**：若某页需要全宽主内容，须在业务需求中显式说明，并在该页单独处理；**默认全部为非 fluid**。

### 6.3 认证页（无侧栏）

- 使用 **`layouts/auth.vue`** + **`AuthLayout`**：居中、`h-svh`、品牌区 + Card；**不沿用 `AppMain` 的 max-width**。

---

## 7. 间距与栅格习惯

- 区块之间默认 **`gap-4`**；响应式升级到 **`md:gap-6`**（与 `AppMain` 一致）。  
- 仪表盘类页面：**`grid gap-4`**，`sm:grid-cols-2`、`lg:grid-cols-4` 等；大区块可用 **`lg:grid-cols-7`** 分栏（7 栅格与现页面一致时可复用）。  
- **`container` utility**：`main.css` 中 `@utility container` 已定义；需要与全局 padding 一致时再使用，避免与 `AppMain` 双重容器冲突。

---

## 8. 组件与代码约定

- **交互与版式**：优先使用 **`@/components/ui/*`**（Button、Card、Tabs、Input、Dropdown…），**禁止**用裸 `div` + `cursor-pointer` 冒充按钮。  
- **类名合并**：使用 **`cn()`**（`@/lib/utils`）。  
- **路由链接**：导航使用 **`NuxtLink`**；在 Sidebar 等需 `as-child` 时遵循现有 `SidebarMenuButton` 写法。  
- **新组件位置**：业务组件放 `app/components/...`；可复用原子仍走 shadcn `add` 生成到 `ui/`。

---

## 9. 图标（Lucide）

- 包名：**`lucide-vue-next`**。  
- 常见尺寸：**`size-4`**（行内图标）、与 shadcn 示例一致即可。  
- 颜色：默认 **继承 `currentColor`**；次要信息用 **`text-muted-foreground`**。

---

## 10. 禁止清单（保持一致性）

- 在业务代码中 **硬编码颜色**（`#fff`、`rgb()`、任意 Tailwind **非语义** 的 `text-gray-*`、`bg-zinc-*` 等），除非在 `main.css` 引入新 token 并更新本文。  
- 绕过 **`main.css`** 在单页写一套「自己的」背景/文字色体系。  
- 自造第二套 **侧栏 / 顶栏** 布局（应用壳层仅一套）。  
- 在无文档的情况下去掉 **`#main-content`** 或「跳到主内容」链接。  
- 暗色：**禁止**仅在局部子树自定义完整 palette；统一 **`html` + `.dark`**。

---

## 11. 附录：历史 React 模板对照（仅供参考）

| 项 | React（旧） | Nuxt（准） |
|----|-------------|------------|
| `components.json` baseColor | slate | neutral |
| 主题值 | `theme.css` + `index.css` | 已迁入 **`app/assets/css/main.css`** |
| `Main` 宽度 | `@7xl/content:*` + `max-w-7xl` | **`AppMain` 对齐（宽度 B）** |
| `Main` padding | `px-4 py-6` | **`p-4 md:p-6`（以 Nuxt 为准）** |

**结论：一切以 Nuxt 仓库内本文 + `main.css` + 壳层组件为准。**

---

## 12. 变更与验收

- 改设计 token 后：跑 **`pnpm run build`**；宽屏检查 **`AppMain` 内容不超过 `max-w-7xl` 且居中**。  
- 新增页面：与仪表盘并置对比 **背景、字色、圆角、主内容宽度**，无跳变。

---

## 13. Cursor 规则放置说明

- **规则文件**：**`.cursor/rules/design-system.mdc`**（相对于本 Nuxt 工程根）。`globs` 为 `**/*.{vue,ts}`，在 Cursor 中以**本仓库根目录**打开工程即可加载。  
- **单一事实来源**：**`docs/design-system.md`（本文件）**；流程类文档见 **`docs/superpowers/`**。
