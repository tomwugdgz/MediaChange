# BarterFlow - 广告易货与媒体库存智能管理系统

BarterFlow 是一款专为广告及公关代理商、媒体公司以及品牌主设计的 **广告易货（Barter）与库存智能管理系统**。它将传统的物理商品库存管理、广告媒体资源配置、销售渠道分销，与最新的 Google Gemini 2.5 大语言模型相结合，实现智能化的易货资产估值、风险评估、财务仿真和定价优化。

---

## 目录
- [一、 软件说明 (Software Overview)](#一-软件说明-software-overview)
  - [1.1 业务背景与痛点](#11-业务背景与痛点)
  - [1.2 系统核心模型](#12-系统核心模型)
  - [1.3 系统架构图（概念流程）](#13-系统架构图概念流程)
- [二、 用户说明与操作指南 (User Guide)](#二-用户说明与操作指南-user-guide)
  - [2.1 智能仪表盘 (Dashboard)](#21-智能仪表盘-dashboard)
  - [2.2 广告易货库存库 (Inventory Hub)](#22-广告易货库存库-inventory-hub)
  - [2.3 媒体资源矩阵 (Media Matrix)](#23-媒体资源矩阵-media-matrix)
  - [2.4 销售渠道目录 (Sales Channels)](#24-销售渠道目录-sales-channels)
  - [2.5 财务仿真与决策规划 (Financial Simulator)](#25-财务仿真与决策规划-financial-simulator)
- [三、 核心功能构建与开发指南 (Developer Guide)](#三-核心功能构建与开发指南-developer-guide)
  - [3.1 技术栈 (Tech Stack)](#31-技术栈-tech-stack)
  - [3.2 目录结构说明](#32-目录结构说明)
  - [3.3 环境变量与 API 配置](#33-环境变量与-api-配置)
  - [3.4 本地运行与打包构建](#34-本地运行与打包构建)
  - [3.5 核心业务逻辑实现原理解析](#35-核心业务逻辑实现原原理)
    - [3.5.1 数据模型设计 (types.ts)](#351-数据模型设计-typests)
    - [3.5.2 Gemini 2.5 API 智能服务整合 (geminiService.ts)](#352-gemini-25-api-智能服务整合-geminiservicets)

---

## 一、 软件说明 (Software Overview)

### 1.1 业务背景与痛点
在广告行业，**“易货贸易（Barter Deal）”** 是一种极为普遍的商业模式：
- 品牌方通过提供自身的**实物商品/库存**（如数码产品、消费品、健康补给品）来抵扣或支付**广告媒介资源**（如地铁广告、写字楼电梯广告、数字媒体 CPM 流量等）。
- 广告代理商在获取这些“易货商品”后，需要将其**快速变现（Liquidity）**以收回广告成本并实现盈利。
- **痛点**：易货商品的实际变现价格、分销渠道的选择、媒体曝光成本以及二次投放的 ROI 计算极其复杂，缺乏量化的、数据驱动的辅助决策系统。

**BarterFlow** 通过将实物资产、媒体资产、销售通路无缝打通，并引入 Gemini 2.5-Flash 引擎进行高级商业和财务计算，帮助管理层一站式监控并优化整条易货供应链。

### 1.2 系统核心模型
1. **Ad Inventory (广告易货实物库存)**：记录通过易货形式获取的商品。关键属性包含：市场指导价（Market Price）、折算入账成本价（Cost Price）、电商平台历史最低价（Lowest Price）等。
2. **Media Resources (媒体投放资源)**：代理商拥有的广告版位或合作采购的媒体包。包含：媒体类型（户外、数字、社区等）、合同周期、刊例报价、折扣率和评估估值。
3. **Sales Channels (分销去化渠道)**：负责清仓、变现这些实物库存的网络。包含：1688批发、淘宝/天猫零售、拼多多特卖、线下奥特莱斯等。每个渠道的佣金比例（Commission Rate）和适应品类不同。
4. **Pricing Plan (易货销售/财务方案)**：一个将“商品+媒体资源+分销渠道”有机结合的去化方案。通过系统，用户可以设定特定的售价、计划去化数量和固定媒体预算，由 AI 仿真模拟损益及匹配度。

---

## 二、 用户说明与操作指南 (User Guide)

### 2.1 智能仪表盘 (Dashboard)
进入 BarterFlow 主页，顶部提供全局核心数据的可视看板：
- **总资产库存估值 (Total Inventory Value)**：当前库房内所有易货商品的总面值与成本值。
- **媒体覆盖估值 (Total Media Exposure)**：当前签署的有效媒体合同所能提供的曝光总估值。
- **去化变现通道 (Active Channels)**：当前在线及待激活的分销渠道数量。
- **全局流动性风险评分 (Liquidity Risk Score)**：**通过 Gemini AI 动态计算**。输入当前库存总量、媒体配比及销售渠道密集度，AI 评估当前的变现难度，并输出直观的风险警示。
- **业务图表模块**：
  - *库存品类分布图 (Category Distribution)*：按电子产品、家用电器、食品饮料等品类分类统计库存量。
  - *各渠道佣金率与预期去化效果*：直观展示分销渠道财务开销。
  - *去化方案投资回报率 (ROI) 排行榜*：清晰展示各个 Pricing Plan 的收益对比。

### 2.2 广告易货库存库 (Inventory Hub)
用户可以在此处管理所有易货进来的实物商品：
- **基本操作**：支持对商品进行 **新增 (Create)、编辑 (Update)、删除 (Delete)** 操作。
- **筛选检索**：支持按品牌、分类过滤，以及通过商品名称、品牌进行模糊搜索，支持库存状态（现货、库存不足、断货）快捷检索。
- **AI 智能定价分析 (AI Pricing Analysis)**：
  - 点击任意商品的“AI 定价分析”按钮，系统将激活 Gemini 模型。
  - AI 结合该商品的市场零售价、易货入账成本和当前库存，提供详细的去化推荐方案、最优去化定价区间（Suggested Price Range）、去化风险分数（Risk Score）以及分步逻辑推演。

### 2.3 媒体资源矩阵 (Media Matrix)
在此管理广告代理商手中可用作易货或支持促销曝光的媒体资源：
- 记录各类媒体详情（如分众传媒、德高地铁、腾讯视频等）。
- 标明版位刊例价、代理商实际协议折扣（Discount Ratio）以及合同开始/结束周期。
- 支持快捷新增媒体资源，提供合同到期警示，防止媒体资源闲置造成浪费。

### 2.4 销售渠道目录 (Sales Channels)
管理与第三方清仓、分销商及电商平台的合作状态：
- 支持在线渠道（如 1688 批发、淘宝）与线下特卖渠道管理。
- 设定渠道佣金比例，直接影响后续财务变现仿真计算中的成本配比。

### 2.5 财务仿真与决策规划 (Financial Simulator)
这是系统的核心亮点功能，支持用户以“沙盒”形式测试商业方案：
1. **组装方案**：从下拉列表中选择一个【易货商品】、一个【支持曝光的媒体】和一个【分销去化渠道】。
2. **输入测试参数**：
   - *拟定单价 (Selling Price)*：准备在分销渠道上架的变现单价。
   - *拟售数量 (Sales Quantity)*：计划卖出的库存数量。
   - *固定媒体预算 (Media Cost)*：该活动要消耗/折旧的媒体投放成本（固定成本）。
3. **点击“运行 AI 仿真模拟 (Run Simulation)”**：
   - **财务精确计算**：自动算得预期总收入、物料成本、渠道佣金、媒体消耗，并得出净利润（Net Profit）和 **盈亏平衡去化数量 (Break-even Quantity)**。
   - **Gemini 2.5 战略契合度评估**：AI 将深度剖析“该商品在该分销渠道的匹配度”、“所选媒体对该商品目标客群的覆盖有效性”、“价格的竞争力等级”，并输出 **战略契合度评分 (Strategic Fit Score)**、定性建议和风险因素。
   - **保存定价方案**：满意的仿真结果可一键保存为方案草案或执行方案，录入至“去化方案列表”进行长期跟踪。

---

## 三、 核心功能构建与开发指南 (Developer Guide)

### 3.1 技术栈 (Tech Stack)
- **前端核心**：React 19.2.0 (采用现代 Functional Component + Hooks 规范)
- **构建工具**：Vite 6.2.0 (预设 3000 端口，完美适配 Cloud Run 和 Nginx 反向代理)
- **类型安全**：TypeScript 5.8.2
- **UI 样式**：Tailwind CSS (通过 Vite 的 PostCSS 插件及 HTML 的 `@import` 全局样式引入)
- **图表数据流**：Recharts 3.5.1
- **图标库**：Lucide React 0.555.0
- **AI 交互 SDK**：`@google/genai` (官方最新大模型集成 SDK)

### 3.2 目录结构说明
```text
/
├── App.tsx                   # 系统的核心控制台，包含主要业务逻辑、状态流转和 Tab 页渲染
├── types.ts                  # 全局 TypeScript 接口与枚举声明 (核心数据模型描述)
├── index.html                # 页面入口模板 (包含 React 19 ESM Import Map 配置)
├── index.tsx                 # 挂载 React 根节点的入口文件
├── vite.config.ts            # Vite 配置文件，注入 GEMINI_API_KEY 宏定义
├── package.json              # 依赖声明、工程描述文件和脚本入口
├── metadata.json             # 平台元数据，指定 APP 名称及权限
├── services/
│   └── geminiService.ts      # 统一的 Gemini AI 请求服务 (包含最新 SDK 构建方法)
└── components/
    ├── Layout.tsx            # 页面基础大骨架、导航栏以及侧边通知中心组件
    ├── StatCard.tsx          # 仪表盘指标卡片
    ├── InventoryModal.tsx    # 新增/修改易货实物库存模态窗
    ├── MediaModal.tsx        # 新增/修改媒体资源模态窗
    └── ChannelModal.tsx      # 新增/修改去化分销通路模态窗
```

### 3.3 环境变量与 API 配置
要激活真实的智能分析和仿真模拟功能，系统需要有效的 Gemini API Key。

1. **配置环境变量**：
   在系统运行的容器环境或 `.env` 配置文件中添加：
   ```env
   GEMINI_API_KEY=您的_GEMINI_API_KEY_内容
   ```
2. **API 的前端构建原理**：
   在 `vite.config.ts` 中，使用 `define` 宏将该变量传递给构建期：
   ```typescript
   define: {
     'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
     'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
   }
   ```
   在 `services/geminiService.ts` 中，通过以下机制在浏览器环境中安全地获取它，防止因为没有 process 导致崩溃：
   ```typescript
   const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) || '';
   ```

---

## 3.4 本地运行与打包构建

### 第一步：安装依赖
```bash
npm install
```
*(环境将自动拉取 package.json 中列出的 React 19, Recharts 及 Google GenAI 最新库)*

### 第二步：启动本地开发服务器
```bash
npm run dev
```
启动成功后，开发服务器将默认绑定到 `0.0.0.0:3000`。您可以通过浏览器访问 `http://localhost:3000` 实时查看 HMR（热模块替换）生效的页面。

### 第三步：生产打包构建
```bash
npm run build
```
打包输出物将统一生成在根目录下的 `/dist` 文件夹内，可直接用于高并发的静态文件托管。

---

## 3.5 核心业务逻辑实现原理

### 3.5.1 数据模型设计 (`types.ts`)
我们使用严格的 TypeScript Interface 定义实体结构。例如定价方案（`PricingPlan`）整合了三个独立的实体维度：
```typescript
export interface PricingPlan {
  id: string;
  inventoryId: string;
  inventoryName: string;
  inventoryCost: number;
  mediaId: string;
  mediaName: string;
  mediaCostStr: string;
  channelId: string;
  channelName: string;
  channelBid: number;     // 计划分销售价
  roi: number;            // 预期投资回报率
  status: 'executed' | 'pending' | 'draft';
  lastUpdated: string;
}
```

### 3.5.2 Gemini 2.5 API 智能服务整合 (`geminiService.ts`)
系统完全遵循 **Google Gemini 最新的 `@google/genai` SDK 规范**。为了在前端实现高内聚和极佳的稳定性，所有 AI 功能均采用 **结构化输出（Structured Outputs）** 的设计，即通过 `responseSchema` 强制模型返回规范的 JSON 数据：

#### 例：定价优化器优化函数解析：
```typescript
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey });

export const optimizePricingStrategy = async (item, media, channel) => {
    // 强制输出符合系统前端期望的 JSON Schema
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    suggestedPrice: { type: Type.NUMBER },
                    priceRange: {
                        type: Type.OBJECT,
                        properties: {
                            min: { type: Type.NUMBER },
                            max: { type: Type.NUMBER }
                        }
                    },
                    predictedROI: { type: Type.NUMBER },
                    reasoning: { type: Type.STRING }
                }
            }
        }
    });
    return JSON.parse(response.text);
}
```
*好处*：
- **零解析出错率**：相较于普通的文本输出，Gemini 的 `responseSchema` 强校验了 JSON 的数据格式和属性类型，彻底消除了常规 LLM 返回带 markdown 标记的代码块（如 ` ```json `）或多余字符导致的 `JSON.parse` 报错问题。
- **降级容错机制**：在未配置 API Key 或请求超时等意外情况下，我们在服务层内置了高保真的纯数学计算回退逻辑，保障前台 UI 顺畅运作，不发生白屏、崩溃或卡死。
