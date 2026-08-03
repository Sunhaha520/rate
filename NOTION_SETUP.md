# Notion 作为新闻后端接入指南

本项目已将新闻（News）系统的数据来源从本地 Markdown 文件切换为 **Notion 数据库**。你只需在 Notion 中维护一个数据库，网站的新闻列表与详情页会自动同步。

技术方案：官方 `@notionhq/client` 拉取数据库记录 + `notion-to-md` 将页面正文转成 Markdown + 现有 `remark` 渲染成 HTML。

---

## 一、创建 Notion 数据库模板

### 1. 新建一个数据库页面

1. 打开 [Notion](https://www.notion.so)，登录账号。
2. 在左侧栏点击 **「+ Add a page」** 新建一个页面，命名为 `RATE News`（名字随意）。
3. 在页面中输入 `/database`，选择 **「Table - Full page」（表格全页）**，创建一个数据库。

### 2. 配置数据库字段（Properties）

把数据库的列（属性）配置成下表。**列名必须与下表完全一致（区分大小写）**，因为代码里是按这些名字读取的：

| 属性名（列名） | 类型（Type） | 说明 |
| ------------- | ------------ | ---- |
| `Title`       | Title（标题）| 新闻标题。数据库默认第一列即为 Title，把它改名为 `Title` 即可 |
| `Date`        | Date（日期） | 发布日期，用于排序 |
| `Summary`     | Text（文本 / Rich text）| 新闻摘要，显示在列表卡片上 |
| `Picture`     | Files & media（文件与媒体）| 封面图。上传图片或粘贴外链均可 |
| `Slug`        | Text（文本） | 用于生成 URL，如填 `open-day-2025`，访问地址即 `/posts/open-day-2025`。**留空则自动使用 Notion 页面 ID** |
| `Published`   | Checkbox（复选框）| 勾选后才会显示在网站上。未勾选的相当于草稿 |

> 操作方式：点击表格右侧的 `+` 添加列 → 点击列标题 → 选择 `Edit property` → 修改 `Name`（名称）和 `Type`（类型）。

### 3. 写入一条新闻测试

在表格中新增一行：

- **Title**：`RATE group participates in the UM Open Day event`
- **Date**：选择 `2025-01-12`
- **Summary**：填写一句摘要
- **Picture**：上传或粘贴一张图片链接
- **Slug**：`open-day-2025`
- **Published**：勾选 ✅

然后点击该行左侧的 **「Open」（打开）**，进入这条记录的页面，在正文里书写新闻内容——支持标题、段落、图片、列表、引用、代码块等，这些正文会自动转换成网页内容。

---

## 二、创建 Notion 集成（获取 API Key）

1. 打开 [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)。
2. 点击 **「+ New integration」（新建集成）**。
3. 填写：
   - **Name**：`RATE Website`
   - **Associated workspace**：选择你放数据库的工作区
   - **Type**：选择 `Internal`（内部集成）
4. 点击 **Submit** 创建。
5. 在集成详情页找到 **「Internal Integration Secret」**，点击 **Show** 并复制。
   - 这个值以 `ntn_` 或 `secret_` 开头，就是你的 **API Key**（`NOTION_TOKEN`）。

---

## 三、把数据库共享给集成（关键步骤，容易漏）

创建了集成还不够，必须把它「连接」到数据库，否则会报 401 无权限：

1. 回到你的 `RATE News` 数据库页面。
2. 点击页面右上角的 **「...」（更多）** 菜单。
3. 选择 **「Connections」（连接）** → **「Connect to」** → 搜索并选择刚创建的集成 `RATE Website`。
4. 确认连接。

---

## 四、获取数据库 ID（NOTION_DATABASE_ID）

1. 在浏览器中打开你的数据库页面（不是某一条记录，是整个表格）。
2. 查看地址栏 URL，形如：

   ```
   https://www.notion.so/yourname/1a2b3c4d5e6f7890abcdef1234567890?v=xxxxxxxx
   ```

3. 其中 **`?v=` 之前的那一串 32 位字符** 就是数据库 ID：

   ```
   1a2b3c4d5e6f7890abcdef1234567890
   ```

   （如果里面带连字符 `-` 也没关系，代码里会处理。）

---

## 五、配置环境变量

在项目根目录创建一个 **`.env.local`** 文件（参考 [`.env.example`](.env.example)），填入上面获取的两个值：

```bash
NOTION_TOKEN=ntn_你复制的集成密钥
NOTION_DATABASE_ID=你的数据库ID
```

> `.env.local` 已被 [`.gitignore`](.gitignore) 忽略，不会被提交到 Git，密钥安全。

---

## 六、运行与验证

```bash
npm run dev
```

- 访问 `http://localhost:3000/news` 查看新闻列表。
- 点击任一条新闻进入详情页 `http://localhost:3000/posts/<slug>`。
- 首页最新新闻区块也会自动读取 Notion 的最新 3 条。

只要在 Notion 里新增记录并勾选 `Published`，网站即可同步（本地开发实时生效；生产环境由于开启了 ISR，默认最多 60 秒后自动更新）。

---

## 七、部署到 Vercel 时的注意事项

如果你把网站部署在 Vercel：

1. 进入 Vercel 项目 → **Settings** → **Environment Variables**。
2. 添加两个变量 `NOTION_TOKEN` 和 `NOTION_DATABASE_ID`，值同 `.env.local`。
3. Notion 图片外链可能带有过期签名，若封面图偶尔加载失败，建议在 Notion 的 `Picture` 字段使用 **External（外链）** 图片，或把图片存到项目的 `public/` 目录后在正文中引用本地路径。

---

## 八、字段与代码对应关系（供开发者参考）

数据抓取逻辑位于 [`src/lib/notion.ts`](src/lib/notion.ts)，对外接口保持在 [`src/lib/posts.ts`](src/lib/posts.ts) 中不变（`PostData` 接口、`getSortedPostsData`、`getPostData`），因此页面组件无需改动。

| 网站字段 | Notion 属性 |
| -------- | ----------- |
| `title`   | `Title` |
| `date`    | `Date` |
| `summary` | `Summary` |
| `picture` | `Picture`（或页面 Cover 封面） |
| `id`（URL）| `Slug`（留空则用页面 ID） |
| 正文 `contentHtml` | 记录页面的正文内容 |

如需修改属性名，请同步修改 [`src/lib/notion.ts`](src/lib/notion.ts) 中对应的 `page.properties['...']` 键名。
