# Nuxt「数据采集」首页与底部采集输入区 — 设计说明

**日期**: 2026-05-15  
**范围**: `nuxt-template/` 认证壳内原仪表盘路由 `/`，侧栏与命令面板文案一致改名；不接真实采集后端（MOCK 交互）。

---

## 1. 目标

1. **去掉** 当前首页仪表盘的所有 KPI/Tabs/Cards 等业务占位内容。
2. 将该页定位为 **数据采集**，并保持与 **`docs/design-system.md`**、`AppHeader` + **`AppMain`** 壳层及 **shadcn-vue（new-york + 语义 Token）** 一致。
3. 在 **主栏（SidebarInset）** 右侧内容区底部，提供 **类 AI 聊天** 的多行输入区；**固定在主内容可视区域底部**，不随上方正文滚动。
4. 输入区内：**左侧**上传资源；**中部**主要输入；**右侧**采集页数控件（**`Select` 档位**：如 1 / 5 / 10 / 20 页）与发送按钮。

---

## 2. 非目标

- 不实现服务端采集、排队、爬虫或文件存储。
- 不在 `/users`、`/settings` 等非首页路由挂载底部输入条。
- 不改动全局 `layouts/authenticated.vue` 以增加通用 footer slot。
- **不**在业务中引入硬编码 HEX 或非语义调色；不上第二套壳层。

---

## 3. 布局与滚动（推荐方案）

采用 **`AppMain` 的 `layout="fixed"`**（与现行设计系统中对标 React fixed 高度的约定一致）：

- 首页根结构保持 **`flex min-h-0 flex-1 flex-col`**（与现有 `index.vue` 外层一致）。
- **`AppMain layout="fixed"`** 产出 `min-h-0 overflow-hidden` 的主容器。
- **`AppMain` slot 内部**划分为：
  1. **可滚动区**：`flex flex-1 min-h-0 flex-col overflow-y-auto`，内含 `AppHeader` 下方标题行与正文占位；
  2. **底部条**：`shrink-0`，**不包在**滚动容器内。

**不推荐**：仅靠 `sticky bottom-0` 且 `AppMain` 仍为 `layout="auto"`，易与祖先滚动链冲突或出现多余滚动条。

---

## 4. 信息与导航

| 位置 | 变更 |
|------|------|
| `app/pages/index.vue` | 标题 **`数据采集`**；标题行 **`flex flex-wrap items-center justify-between gap-4`**，右侧 **「导出」** 按钮（**`outline`**、**小号**、`disabled`，MOCK）；删除仪表盘 blocks |
| `AppSidebar.vue` | 文案与 **`tooltip`**：仪表盘 → 数据采集（路由仍为 `/`） |
| `CommandMenu.vue` | 命令面板项：**数据采集**，目标 `/` |
| **图标** | 暂保留 **`LayoutDashboard`**，避免无讨论下的额外视觉变更；若产品希望区分语义，可在实现时改为 **`Database`** 等 Lucide 图标并单独评审 |

---

## 5. 底部输入条（组件与交互）

新建业务能力组件建议路径：**`app/features/data-collection/DataCollectionComposer.vue`**（或与项目既有 `features/` / `components/` 命名一致的唯一位置）。

### 5.1 视觉与结构

- 外层容器：**圆角边框**、**语义色**（例如 `rounded-md border border-input bg-card`），与现有输入/卡片体系一致；类名合并用 **`cn()`**。
- 内层 **`InputGroup` + addon 区**：**`flex`** 对齐，必要时 **wrap**，避免挤出视口（与 **`InputGroup` 组件**语义一致）。
- **左**：**上传**——**真实的 `Button`（`outline`、`size="icon"`）**，**`type="button"`**，点击后对 **DOM 隐藏的 `input[type=file]`** 调用 **`click()`** 打开文件选择；图标 **Lucide `Paperclip`**（`size-4`）；`accept` / 文件类型白名单见 **§9**。
- **中**：多行 **`Textarea`**，占位「描述要采集的内容或粘贴链接…」，最小/最大高度与内部滚动对齐常见聊天输入。
- **右**：
  - **采集页数**：**`Select`**，选项为常量档位（示例：`1`、`5`、`10`、`20`）；**占位**「选择页数」。**初始无选中**。**`SelectTrigger`** 上使用 **`cn()`** 强化文案对比度：**`text-foreground`**，必要时 **`font-medium`**（避免占位/选中态过淡）。
  - **发送**：**`Button`** 默认主按钮 + **`Send`** 图标；在未合法选中页数时 **`disabled`**，禁止 MOCK 套用隐式默认页数。
- **禁止**用 **`div`** 冒充可点击主控件；隐藏的 file input **不参与 Tab 顺序**（如 **`tabindex="-1"`**）或等价约定，键盘焦点落在可见上传按钮。

### 5.2 无障碍

- 页数 **`SelectTrigger`**：**`aria-label="采集页数"`**（或与占位语义一致）。
- 上传：**可见按钮**承担键盘操作与 **`aria-label`**（如「上传资源」）。
- （可选）**`Select`** 可加 **`aria-describedby`** 指向 **screen-reader-only** 的简短说明「须先选择页数后方可发送」，不撑开布局。

### 5.3 状态与 MOCK（本阶段）

- **`ref`** 绑定提示文案、采集页 **`Select`** 的值（字符串以与 Radix/Reka Select 对齐）、文件 **input ref**。
- **发送**：仅在 **已选中合法档位**时可用并触发 MOCK **`toast`**；**未选中时按钮 `disabled`**，与 **§10** 确认的 **A** 策略一致。
- 选中文件后 **`toast`** 文件数量（与现行演示一致）。
- **导出**：见 **§6**，本阶段恒定 **`disabled`**，无后端与解禁条件。
- 不做防抖/重试等非必要防御逻辑。

---

## 6. 首页正文区

去除仪表盘后在可滚动顶部保留：

- **标题行**：**`flex flex-wrap items-center justify-between gap-4`**（窄屏时可换行，避免标题与按钮「顶死」）。
  - 左：**`h2`**「数据采集」，样式 **`text-2xl font-bold tracking-tight`**（与 **`users`** 等页一级标题惯例一致）。
  - 右：**`Button`** 文案「**导出**」，**`variant="outline"`**、**小号**、`disabled`，MOCK 占位；不在 **`AppHeader`** 工具区内重复挂载，以免打断「页内信息与操作」的阅读动线。
- 可选一行 **`text-muted-foreground`** 说明「采集结果将显示在此处」类占位（短句）。

---

## 7. 测试与验收

- **窄屏 / 暗色**：底部条可读、边框与背景与主题一致。
- **滚动**：仅上方区域滚动；调整窗口高度或增多占位内容时，底部条始终在 **主栏内容区底部** 可见且不随上文滚动跑出视口。
- **采集页数**：初始无选中；**发送**在页数选中前 **`disabled`**；占位与选中态在亮/暗色下 **`SelectTrigger`** 可读（非「发灰失联」）。
- **导出**：处于 **`disabled`**，无破坏性副作用。
- **上传**：通过 **outline 图标按钮 + 程序化唤起** file picker；选文件后 **toast** 数量与先前行为一致。
- **`pnpm run build`** 通过。
- **设计系统自检**：仍为 **单壳**、`#main-content` **与 SkipToMain 不变**。

---

## 8. 实现顺序建议

1. 新增 **`DataCollectionComposer.vue`**。
2. 重写 **`index.vue`**（`AppMain` fixed + 双区结构 + composer）。
3. 更新 **`AppSidebar.vue`、`CommandMenu.vue`** 文案。
4. 若 **`docs/design-system.md`** 中「仪表盘页」仅存为举例，可改为「数据采集首页」等非强制叙述（仅文档，可选）。

---

## 9. 开放项（已实现前可改）

- **页数控件**：档位集合（现为离散选项）或可改为 **上限型数字输入**等产品决策；若以 **`Select`** 为准，可与「曾一度讨论的 max=100」等规则另文对齐。
- **文件 `accept`** 白名单。
- 侧栏 **图标** 是否由 `LayoutDashboard` 替换为更贴「采集」的图标。
- **导出**：解禁条件（有结果 / 勾选行 / 任务完成等）与真实导出格式，接上业务后再定。

---

## 10. 修订履历 — 数据采集交互细化（已采纳）

**日期**：2026-05-15（与用户确认后立即合入上文 §1 / §5 / §6 / §7，避免分叉描述）

| 项 | 决议 |
|---|------|
| 采集页数字样 | **`SelectTrigger`** 使用 **`text-foreground`**（必要时 **`font-medium`**），解决对比度不足。 |
| 采集页数默认 | **无选中**；占位「选择页数」。 |
| 未选页数 + 发送 | **方案 A**：**发送 `disabled`**，不向 MOCK 注入隐式默认页数。 |
| 首页标题区 | **`数据采集` 与「导出」同行** `justify-between`；**`outline` 小号 `disabled` MOCK**。 |
| 上传 | **`type="button"` outline 图标按钮** + **隐藏 `input[type=file]`**，点击 **`input.click()`**；焦点与 **`aria-label`** 落在按钮。 |
