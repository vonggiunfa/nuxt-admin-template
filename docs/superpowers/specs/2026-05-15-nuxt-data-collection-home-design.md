# Nuxt「数据采集」首页与底部采集输入区 — 设计说明

**日期**: 2026-05-15  
**范围**: `nuxt-template/` 认证壳内原仪表盘路由 `/`，侧栏与命令面板文案一致改名；不接真实采集后端（MOCK 交互）。

---

## 1. 目标

1. **去掉** 当前首页仪表盘的所有 KPI/Tabs/Cards 等业务占位内容。
2. 将该页定位为 **数据采集**，并保持与 **`docs/design-system.md`**、`AppHeader` + **`AppMain`** 壳层及 **shadcn-vue（new-york + 语义 Token）** 一致。
3. 在 **主栏（SidebarInset）** 右侧内容区底部，提供 **类 AI 聊天** 的多行输入区；**固定在主内容可视区域底部**，不随上方正文滚动。
4. 输入区内：**左侧**上传资源；**中部**主要输入；**右侧**采集页数（数字输入 **`type="number"`**）与发送按钮。

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
| `app/pages/index.vue` | 标题 **`数据采集`**；删除仪表盘 blocks |
| `AppSidebar.vue` | 文案与 **`tooltip`**：仪表盘 → 数据采集（路由仍为 `/`） |
| `CommandMenu.vue` | 命令面板项：**数据采集**，目标 `/` |
| **图标** | 暂保留 **`LayoutDashboard`**，避免无讨论下的额外视觉变更；若产品希望区分语义，可在实现时改为 **`Database`** 等 Lucide 图标并单独评审 |

---

## 5. 底部输入条（组件与交互）

新建业务能力组件建议路径：**`app/features/data-collection/DataCollectionComposer.vue`**（或与项目既有 `features/` / `components/` 命名一致的唯一位置）。

### 5.1 视觉与结构

- 外层容器：**圆角边框**、**语义色**（例如 `rounded-md border border-input bg-card`），与现有输入/卡片体系一致；类名合并用 **`cn()`**。
- 内层 **`flex flex-wrap items-end gap-2`**（窄屏时可换行，避免挤出视口）。
- **左**：**`Button` `variant="outline"` `size="icon"`**，配合隐藏 **`input[type=file]`**（`accept` 可宽限如文档/图片按需再收敛）；图标 **Lucide**（如 **`Paperclip`** 或 **`Upload`**，`size-4`）。
- **中**：**`Textarea`**，占位如「描述要采集的内容或粘贴链接…」，**最小/最大高度**与多行溢出（内部滚动）对齐常见聊天输入。
- **右**：
  - **页数**：**`Input` `type="number"`**，`min="1"`，**默认 `max="100"`**（若产品上限制不同，仅以常量或可配置常量替换）。
  - **发送**：**`Button`** 默认主按钮 + Lucide 发送图标；与上传均为真实 **`<button>`**，禁止 div 冒充。

### 5.2 无障碍

- 页数 **`Input`** 提供 **`aria-label`**（例如「采集页数」）。
- 上传控件保持 **键盘可操作**（`label`/`Button as-child` 包覆 file input 的惯例与项目现有模式对齐）。

### 5.3 状态与 MOCK（本阶段）

- 使用 **`ref`** 绑定文案、页数、可选文件列表占位。
- **发送**：可无请求，**`toast` 简短提示** 或 **`console`**，与模板其他 MOCK 一致；选中文件后可 **`toast` 文件名数量**。
- 不做防抖/重试等非必要防御逻辑。

---

## 6. 首页正文区

去除仪表盘后在可滚动顶部保留：

- **`text-2xl font-bold tracking-tight`** 的 **`h1`**「数据采集」（若与 **`AppHeader`** 标题策略重复，以现有各页惯例为准：**保留与 `users` 等页一致的标题行模式**）。
- 可选一行 **`text-muted-foreground`** 说明「采集结果将显示在此处」类占位（短句）。

---

## 7. 测试与验收

- **窄屏 / 暗色**：底部条可读、边框与背景与主题一致。
- **滚动**：仅上方区域滚动；调整窗口高度或增多占位内容时，底部条始终在 **主栏内容区底部** 可见且不随上文滚动跑出视口。
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

- 页数 **上限**（默认 **100**）。
- **文件 `accept`** 白名单。
- 侧栏 **图标** 是否由 `LayoutDashboard` 替换为更贴「采集」的图标。
