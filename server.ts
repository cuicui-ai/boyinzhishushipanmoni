import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables from .env if present
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Lazy-initialize Gemini client
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        throw new Error("GEMINI_API_KEY is not configured. Please add it in Settings > Secrets.");
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // --- API Routes ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Gemini Portfolio and Index Analysis Endpoint
  app.post("/api/gemini/analyze", async (req, res) => {
    try {
      const { indexName, holdings, question, marketState } = req.body;
      const ai = getGeminiClient();

      let prompt = "";
      if (question) {
        prompt = `用户问题: "${question}"\n\n`;
      }

      prompt += `【当前持仓信息】:\n${JSON.stringify(holdings || [], null, 2)}\n\n`;
      prompt += `【目标关注指数】: ${indexName || "整体渤银指数生态"}\n\n`;
      if (marketState) {
        prompt += `【当前模拟市场状态数据】:\n${JSON.stringify(marketState, null, 2)}\n\n`;
      }

      prompt += `请基于上述数据，扮演“渤银指数研究中心特邀首席分析师”，为用户深入分析该指数或持仓的表现、近期走势、未来预期，并提供具体的模拟实盘买卖操作配置建议。同时必须有专业的风险警示。请使用非常专业、排版优美、带小标题、加粗和列表的中文 Markdown 格式。`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "你是由渤海银行指数研究团队研发的‘渤银指数实盘模拟’AI专属智能投资助理。你精通股票指数、宏观大类资产配置、量化投资与固定收益。你说话风格专业、严谨、沉稳、温暖。你只能对渤银指数生态（大盘50、创新科技、红利低波、量化成长、绿色金融债）提供分析，解答模拟盘交易疑问。绝对不给出真实世界的个股买卖推荐，在回答末尾必须加上专业模拟盘免责声明。",
          temperature: 0.7,
        },
      });

      res.json({ analysis: response.text });
    } catch (error: any) {
      console.error("Gemini Analyze Error:", error);
      res.status(500).json({ error: error.message || "分析生成失败，请稍后重试。" });
    }
  });

  // Gemini Trend Forecast Endpoint (Generates Structured Prediction and commentary)
  app.post("/api/gemini/predict", async (req, res) => {
    try {
      const { indexId, name, lastValues } = req.body;
      const ai = getGeminiClient();

      const prompt = `分析渤银指数系列之【${name} (ID: ${indexId})】。\n最近10个交易日的模拟指数净值走势为: ${JSON.stringify(lastValues || [])}。\n请给出未来5个交易日的趋势预测（上涨趋势、震荡整理、还是回调蓄势），涨跌概率，核心逻辑支撑，以及量化交易策略（例如网格交易或动量策略）。请用精炼、数据导向的中文 Markdown 格式输出。`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "你是一个量化策略师。用精炼的数据语言分析指数预测，给出合理的趋势看法，核心观点要极具说服力。",
          temperature: 0.6,
        },
      });

      res.json({ forecast: response.text });
    } catch (error: any) {
      console.error("Gemini Predict Error:", error);
      res.status(500).json({ error: error.message || "趋势预测加载失败。" });
    }
  });

  // Vite middleware setup (must come AFTER API routes)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[渤银指数实盘模拟] Application is running on http://localhost:${PORT}`);
  });
}

startServer();
