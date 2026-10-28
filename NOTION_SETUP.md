# Notion 作为内容后端接入指南

本项目已将新闻（News）与当前成员（Current Members）的数据来源切换为 **Notion 数据库**。你只需在 Notion 中维护数据库，网站的列表与详情页会自动同步。

两类数据共用同一个 Notion 集成（同一个 `NOTION_TOKEN`），并且放在**同一个数据库的两张表**里，因此只需要一个 `NOTION_DATABASE_ID`：

| 内容 | 所在表（data source） | 对应页面 |
| ---- | -------------------- | -------- |
| 新闻 | `News` | `/news`、`/posts/<slug>`、首页最新新闻 |
| 成员（Research Team） | `Members` | `/current-members` |

代码会自动读取该数据库下的所有表，按列名区分 News 与 Members，不需要再单独配置成员表 ID。

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

在项目根目录创建一个 **`.env.local`** 文件（参考 [`.env.example`](.env.example)），填入上面的值：

```bash
NOTION_TOKEN=ntn_你复制的集成密钥
NOTION_DATABASE_ID=你的数据库ID（News 与 Members 两张表所在的那个数据库）
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
2. 添加两个变量 `NOTION_TOKEN`、`NOTION_DATABASE_ID`，值同 `.env.local`。
3. Notion 图片外链可能带有过期签名，若封面图偶尔加载失败，建议在 Notion 的 `Picture` 字段使用 **External（外链）** 图片，或把图片存到项目的 `public/` 目录后在正文中引用本地路径。成员头像同样支持 Notion 上传的图片（自动走 `/api/notion-image` 实时代理，不会过期）。

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

---

## 九、成员（Current Members）接入 Notion

成员与新闻使用**同一个 Notion 集成**（同一个 `NOTION_TOKEN`）和**同一个数据库**：在 News 表旁边再加一张 `Members` 表即可（Notion 新版把它称为 database 里的第二个 data source）。

### 1. 在现有数据库中新建成员表

1. 打开现有的新闻数据库（如 `Rate@UM`），在左侧表名旁点击 **`+`** 新建表，命名为 `Members`。
2. 按下面的表格配置列（列名建议完全一致，代码已兼容中英文别名与不区分大小写）：

| 属性名（列名） | 类型（Type） | 说明 |
| -------------- | ------------ | ---- |
| `Name`         | Title（标题）| 姓名 |
| `Slug`         | Text（文本） | 唯一标识，如 `qiaoyutong`；写成 `/qiaoyutong`、`HO Man Hin` 也可以，会自动规范化为 `qiaoyutong`、`ho-man-hin`，旧写法访问时跳转到规范地址；留空则用姓名生成 |
| `Role`         | Select 或 Text | `Supervisor` / `PhD` / `Master` / `Undergraduate` / `RA`；Text 类型直接写文字即可（如 `PhD Student`），也兼容中文（导师、博士、硕士、本科生、研究助理） |
| `Year`         | Text 或 Number | 入学年份，同一角色内按年份排序 |
| `Photo`        | Files & media | 头像。成员自己上传；也支持页面 Cover 作为回退 |
| `Research Topic` | Multi-select 或 Text | 研究方向。Text 类型时**一行一个**即可（也兼容分号、逗号、顿号分隔） |
| `GitHub`       | URL | 可选 |
| `Homepage`     | URL | 个人主页。可填站内路径（如 `/members/sunyifeng`）或任意外链；留空则头像不可点击 |
| `Email`        | Email | 可选 |
| `Published`    | Checkbox | 勾选后才会显示；若没有该列则默认全部显示 |
| `Company`      | Text | 毕业去向 / 公司，显示在 Former Members 卡片上 |
| `Position`     | Text | 现任职位，显示在 Former Members 卡片上 |
| `Status`       | Select | `Current` / `Former`。选 `Former`（或勾选 `Former` 复选框）即归入 Former Members |

> `Role` 为 `Undergraduate` 的成员默认归入 **Former Members**（毕业成员），不再出现在 Current Members。若希望本科生留在当前成员页，把 [`src/lib/notion-members.ts`](src/lib/notion-members.ts) 里的 `UNDERGRADUATE_AS_FORMER` 改为 `false`。

3. 数据库页面右上角 **「...」→ Connections** 里连接与新闻相同的集成（同一个数据库只需连接一次）。
4. 不需要额外的成员表 ID：`.env.local` 里只保留 `NOTION_DATABASE_ID`，代码会自动读取该数据库下的所有表并按列名识别 Members。
5. 重启 `npm run dev`，访问 `http://localhost:3000/current-members` 验证。

排序规则固定为：角色（Supervisor → PhD → Master → Undergraduate → RA）→ `Year` → `Name`，无需手动维护排序列。

### 2. 头像与个人主页由成员本人维护

- 头像：在 `Photo` 列上传图片即可。Notion 图片会自动改走 `/api/notion-image?pageId=<页面ID>` 实时代理，签名不会过期。
- 个人主页：在 `Homepage` 列填入链接。站内路径（以 `/` 开头）直接跳转，`http(s)://` 外链在新标签页打开。主页内容由成员自己维护，无需改代码。
- 网站每 60 秒增量再生一次，Notion 中修改后最多 60 秒同步。

> 如果 `Published` 未勾选、姓名为空，或读取失败，页面会回退到本地 [`src/data/members.ts`](src/data/members.ts)，保证页面不会空白。成员数据的抓取逻辑位于 [`src/lib/notion-members.ts`](src/lib/notion-members.ts)。

## 十、正文排版与链接约定

新闻正文和成员主页正文都直接使用 Notion 页面里的内容，站点侧做了统一的排版与链接处理，写内容时按下面的约定即可：

1. **图片**：直接插入图片。图片会自动走 `/api/notion-image?blockId=<图片块ID>` 代理，链接不会过期；第一张图立即加载，其余图片懒加载。
2. **图注**：在 Notion 图片的 Caption 里写说明文字，页面上会显示为居中的图注，并按 `Figure 1.`、`Figure 2.` 自动编号。文件名不会被当作说明文字。
3. **标题**：H2 / H3 会自动生成章节标记和锚点，鼠标悬停在标题左侧可复制 `#` 链接。建议正文里从 H2 开始，不要再写 H1。
4. **站内链接**：在 Notion 里链接到另一条新闻或另一位成员的页面时，会自动改写为站内路由（`/posts/...`、`/members/...`），点击后无刷新跳转；链接到本站静态页面（如 `/news`）同理。
5. **站外链接**：统一在新标签页打开，并带有 `rel="noopener noreferrer"`，链接右上角会显示小小的 ↗ 标记。
6. **表格**：渲染为学术三线表（无竖线），窄屏下可横向滚动。
7. **安全性**：正文 HTML 在构建 / 增量再生阶段由服务端按白名单清洗，不再依赖浏览器端脚本，因此首屏即可看到完整正文。

相关实现：正文转换与链接处理在 [`src/lib/notion.ts`](src/lib/notion.ts)，排版样式在 [`src/styles/globals.css`](src/styles/globals.css)（`.article-body` 一节），前端正文容器为 [`src/components/ArticleContent.tsx`](src/components/ArticleContent.tsx)。

## 十一、设备（/equipment）接入 Notion

不需要改代码，也不需要额外的环境变量：在现有数据库里新建一张 **Equipment** 表，代码会自动识别并读取。没有这张表（或表里没有记录）时，页面继续显示 `src/data/devices.ts` 里的本地数据。

### 1. 新建 Equipment 表

打开数据库，在表名旁点 **`+`** 新建表，命名为 `Equipment`，然后连接与新闻/成员相同的集成。列名建议如下（代码兼容中英文别名）：

| 属性名（列名） | 类型（Type） | 说明 |
| -------------- | ------------ | ---- |
| `Name` | Title（标题） | 设备名称 |
| `Category` | Select（推荐）或 Text | 分类。内置顺序：`Construction robots`、`Extended reality devices`、`Reality capture and sensing devices`、`High-performance computers`；其他分类排在后面 |
| `Photo` | Files & media | 设备图片，自动走实时代理 |
| `Features` | Text 或 Multi-select | 特性/参数，一行一条（也支持以 `;` `；` `|` 分隔） |
| `Brand` | Text | 品牌（可选） |
| `Model` | Text | 型号（可选） |
| `Status` | Select | `Available` / `In use` / `Maintenance`，也兼容中文（可用、使用中、维修） |
| `Quantity` | Number | 数量大于 1 时显示 × N |
| `Location` | Text | 存放位置（可选） |
| `Link` | URL | 详情/官网链接（可选） |
| `Order` | Number | 排序值，越小越靠前 |
| `Slug` | Text | 可选，默认用名称生成 |
| `Published` | Checkbox | 勾选后显示；没有该列则默认显示 |

### 2. 页面表现

- 按 `Category` 分组，卡片显示图片、名称、品牌/型号、特性列表、状态标签、数量、位置与详情链接。
- 图片、状态、数量等为空时不显示对应元素，不会留下空位。
- 每 60 秒增量再生，Notion 修改后最多 1 分钟同步；开发模式约 20 秒。

### 3. 关于 /supervisor

导师页同样不需要单独建表：直接使用 **Members 表里 `Role = Supervisor` 的那一行**（姓名、头像、邮箱、研究方向等）以及该成员 Notion 页面正文作为个人简介。修改这一行或页面正文即可更新 `/supervisor`。
页面下方的「Selected latest research」可以迁到 Notion：新建一张 Research 表即可，详见下一节；没有建表或表为空时继续显示 [`src/data/personal.ts`](src/data/personal.ts) 里的本地数据。


## 十二、论文 / 项目 / Demo 三张表

Publications、Projects、Demo 三个页面分别读取三张独立的表，都在现有数据库里新建即可，不需要新增环境变量。代码按列名自动识别；表不存在或没有记录时，继续显示本地数据（`src/data/papers.ts`、`projects.ts`、`resources.ts`）。

### 1. Publications（论文）

同时驱动 `/publications` 和导师页的「Selected latest research」。

| 属性名（列名） | 类型 | 说明 |
| -------------- | ---- | ---- |
| `Title` | Title | 论文标题 |
| `Authors` | Text | 作者，逗号分隔 |
| `Journal` | Text | 期刊 / 会议名称（也兼容 Venue / Conference） |
| `Year` | Number 或 Text | 年份，自动按年份分组 |
| `Type` | Select | Journal / Conference 等（可选） |
| `Link` | URL | DOI 或论文链接（可选） |
| `GitHub` | URL | 代码仓库（可选） |
| `Cover` | Files & media | 论文配图（可选） |
| `Abstract` | Text | 摘要，卡片上最多显示 2 行 |
| `Featured` | Checkbox | 勾选后显示在导师页的「Selected latest research」 |
| `Order` | Number | 排序（同一年内） |
| `Published` | Checkbox | 勾选后显示；没有该列默认显示 |

导师页只显示 `Featured` 勾选的论文；一条都没勾选时，回退到 `src/data/personal.ts` 里的本地数据。

### 2. Projects（项目）

| 属性名（列名） | 类型 | 说明 |
| -------------- | ---- | ---- |
| `Name` | Title | 项目名称 |
| `Members` | Text 或 Multi-select | 参与成员，换行 / 分号 / 多选均可 |
| `Start Year` / `End Year` | Number 或 Text | 起止年份；也可以直接用 `Period` 写「2024 - 2026」 |
| `Funding` | Text | 资助机构 |
| `Project Type` | Select | Research / Consulting 等 |
| `Status` | Select | `Active` / `Past`（也兼容在研、结题；不填则按结束年份判断） |
| `Summary` | Text | 项目简介（可选） |
| `Link` | URL | 项目主页（可选） |
| `Photo` | Files & media | 项目配图（可选） |
| `Order` | Number | 排序 |
| `Published` | Checkbox | 勾选后显示 |

页面按 Active projects / Past projects 分组。

### 3. Demo（演示与资源）

| 属性名（列名） | 类型 | 说明 |
| -------------- | ---- | ---- |
| `Title` | Title | 名称 |
| `Description` | Text | 卡片上的短简介（最多 3 行） |
| `Full Description` | Text | 弹窗里的完整介绍 |
| `Cover` | Files & media | 卡片封面图（可选） |
| `Video` | URL 或 Files & media | 演示视频；填了就会在弹窗里播放 |
| `Head Image` | Files & media | 弹窗主图（可选，没有视频时显示） |
| `Tag` | Select | `Demo videos` / `Resources`（也兼容中文） |
| `Link` | URL | 外部资源链接（可选） |
| `Order` | Number | 排序 |
| `Published` | Checkbox | 勾选后显示 |

点击卡片会打开详情弹窗，支持 Esc 关闭；视频地址可以是外部链接，也可以是 Notion 上传的文件。

封面规则：优先用 `Cover`；没有填 `Cover`（或图片加载失败）时，**自动取视频的第一帧作为封面**，所以视频类 Demo 可以不填封面图。

> 三张表都支持中英文列名别名；新增记录后 60 秒内（开发模式约 20 秒）自动同步，无需重启或改代码。


## 十三、Join Us 页面接入 Notion

在现有数据库里新建一张 **Join Us** 表（只需要一行记录），招聘正文写在这一行的**页面正文**里，地址、联系方式、地图放在属性里。

| 属性名（列名） | 类型 | 说明 |
| -------------- | ---- | ---- |
| `Title` | Title | 页面标题，一般填 `Join Us` |
| `Welcome` | Text | 标题下方的一句话，如 `Welcome to join us.` |
| `Address` | Text | 实验室地址 |
| `Map Image` | Files & media | 地图图片（可选，留空用本地地图） |
| `Map Link` | URL | 点击地图跳转的链接（可选） |
| `Contact Text` | Text | 联系方式上方说明文字 |
| `Contact Email` | Email | 联系邮箱 |
| `Order` | Number | 有多行时取 `Order` 最小的一条 |
| `Published` | Checkbox | 勾选后生效 |

### 招聘正文怎么写

直接在该行记录的页面正文里写（支持加粗、链接、列表、书签卡片等）。站点会把正文按学术排版渲染；页面上三个区块分别对应：

1. **招聘信息**：页面正文
2. **地址**：`Address` + `Map Image` + `Map Link`
3. **联系方式**：`Contact Text` + `Contact Email`

字段留空时会用 `src/data/joinus.ts` 里的本地内容补齐，不会出现空白区块。修改后 60 秒内（开发模式约 20 秒）自动同步。


## 十四、图片加载加速

所有 Notion 图片都通过 `/api/notion-image` 代理输出，目前做了这几层优化：

1. **自动缩略图**：代理接受 `?w=` 参数，用 sharp 生成 WebP（质量 78），不再把原图直接丢给浏览器。常用尺寸：头像 480、新闻/设备/项目卡片 900、论文封面 640、正文大图 1600。
2. **URL 带版本号**：页面生成图片地址时会带上 `v=<最后编辑时间>`。图片内容不变时 URL 不变，因此代理返回 `Cache-Control: ... immutable`，浏览器和 CDN 可以缓存一年。
3. **签名地址缓存**：Notion 的 S3 签名地址在进程内缓存 40 分钟，避免每张图片都请求一次 Notion API；签名过期时会自动刷新重试。
4. **图片内容缓存**：代理会把 4MB 以内的图片结果在内存里缓存 15 分钟（最多 32MB），重复请求直接返回，不再回源。
5. **懒加载**：列表/正文图片默认 `loading="lazy"`、`decoding="async"`；文章第一张图使用 `eager` + `fetchpriority="high"`。

修改 Notion 图片后，页面最后编辑时间变化，URL 的 `v` 也会变化，浏览器会自动获取新图，不需要手动清缓存。


## 十五、搜索引擎优化（SEO）

站点已内置以下 SEO 基础设施，部署后建议按步骤提交给搜索引擎。

### 1. 环境变量

在 Vercel（或本地 `.env.local`）里配置：

```bash
NEXT_PUBLIC_SITE_URL=https://你的域名
# 可选：Google Search Console 的验证码
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=xxxxxxxx
```

- Vercel 上如果没填，会自动使用部署域名；**绑定自定义域名后请填成正式域名**，否则 canonical / sitemap 里会是对应部署域名。
- 本地开发不填会使用 `http://localhost:3000`。

### 2. 已实现的内容

- **canonical**：每个页面都输出规范地址；`/qiaoyutong` 这类根路径别名会 canonical 到 `/members/qiaoyutong`，避免重复内容。
- **结构化数据（JSON-LD）**：站点 Organization / WebSite、新闻 `NewsArticle`、成员与导师 `Person`、列表页 `ItemList`、面包屑 `BreadcrumbList`。
- **Open Graph / Twitter Card**：标题、描述、封面图（相对地址会自动转成绝对地址）。
- **sitemap**：`/sitemap.xml`，自动包含静态页面、全部新闻和成员主页（含旧版成员页），缓存 1 小时。
- **robots**：`/robots.txt`，允许抓取页面、屏蔽 `/api/`，并声明 sitemap。
- **RSS**：`/feed.xml`，包含最新新闻，方便聚合与被发现。
- **语义结构**：每个页面有唯一 H1，图片带 alt，文章正文服务端直出。

### 3. 提交搜索引擎

1. 打开 [Google Search Console](https://search.google.com/search-console)，添加资源并验证（可用上面的 meta 验证码）。
2. 提交 sitemap：`https://你的域名/sitemap.xml`。
3. 用「网址检查」对首页、`/news`、`/publications`、导师与成员页请求编入索引。
4. 同样在 [Bing Webmaster Tools](https://www.bing.com/webmasters) 提交 sitemap。
5. 新内容发布后，可在 Search Console 手动请求编入索引；sitemap 每小时更新一次。

### 4. 持续提升收录的建议

- 保持新闻/论文标题即页面标题，摘要写清时间、地点、成果。
- 每篇新闻至少 300 字左右，避免只有一张图。
- 在院系、会议、GitHub、ORCID 等外部页面链接回本站，增加外链。
- 避免同一内容多个地址：新增别名时同步更新 canonical（代码里 `Seo` 的 `path`）。


### 4. 把 Multi-select / Select 改成 Text

可以把 `Research Topic` 和 `Role` 直接改成 Text 类型（Notion 属性菜单 → Edit property → Type → Text），不需要改代码：

- `Research Topic` 填纯文本，**一行一个方向**；站点会自动拆分成列表，行首的 `•`、`-`、`*` 会自动去掉。
- `Role` 填纯文本，例如 `Supervisor`、`PhD`、`Master`、`Undergraduate`、`RA`；写成 `PhD Student`、`博士生` 也能识别。
- 如果 Notion 不允许直接转换类型，可以新建一个同名的 Text 属性，把旧值复制过去后删除旧属性，代码按列名读取，不受影响。


## 十六、首页 Logo 与研究方向（Home / Research Directions）

把首页的 Logo、自我介绍和研究方向卡片接到 Notion；Banner 和站点名称仍然在代码里。

### 1. Home 表（只放 Logo）

新建一张 `Home` 表，一行即可：

| 属性名（列名） | 类型 | 说明 |
| -------------- | ---- | ---- |
| `Logo` | Files & media | 首页「关于」卡片里的 Logo；没有配置时用 `/img/logo.png` |
| `About Title` | Text | 自我介绍卡片标题，默认 `Here is RATE@UM` |
| `About Text` | Text | 自我介绍正文（首页那段介绍研究组的文字） |
| `Order` | Number | 有多行时取最小的一条 |
| `Published` | Checkbox | 勾选后生效 |

### 2. Research Directions 表（研究方向卡片）

表名建议用 `Research Directions`：

| 属性名（列名） | 类型 | 说明 |
| -------------- | ---- | ---- |
| `Name` | Title | 研究方向标题（卡片文字） |
| `Image` | Files & media | 卡片配图 |
| `Description` | Text | 简介（可选，当前卡片未展示） |
| `Link` | URL | 点击卡片跳转的链接（可选） |
| `Order` | Number | 排序 |
| `Published` | Checkbox | 勾选后显示 |

没有建表或没有记录时，继续使用 `src/data/researchDirections.ts` 和 `/img/logo.png`。修改后约 60 秒（ISR 再生）生效。
