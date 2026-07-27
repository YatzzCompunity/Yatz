// --== CREDITS: KURAMAMODS ==-- \\
const express = require("express");
const crypto = require("crypto");
const multer = require("multer");
const axios = require("axios");

const app = express();
const upload = multer({ 
  storage: multer.memoryStorage(), 
  limits: { fileSize: 20 * 1024 * 1024 } 
});

// --== CONFIG ==-- \\
const cfg = {
  key: "Ka7Ya98107EdGXQa",
  iv: "yc0q2icx1oq4lijm",
  secret: "t6KeG6aKR5pm65oWn5aqS6LWE57O757ufS2V2aW4uWWFuZw",
  upstream: "https://api.chatgai.fun/common/sse/chat",
  createUser: "https://api.chatgai.fun/mb/createNewUser",
  bundle: "com.aichatmaster.chat.gp",
  version: "2.7.5",
  excludeSign: ["language", "type", "botPrompt", "needSearch"]
};

// --== DEVICE MAC ==-- \\
let mac = null;

function genMac() {
  return crypto.randomUUID();
}

function getMac() {
  if (!mac) mac = genMac();
  return mac;
}

// --== MODELS ==-- \\
const models = [
  { name: "Claude Haiku 4.5", ver: "BOLATU:claude-haiku-4-5-20251001" },
  { name: "Claude Sonnet 4", ver: "BOLATU:claude-sonnet-4-20250514" },
  { name: "Claude Sonnet 4.6", ver: "BOLATU:claude-sonnet-4-6" },
  { name: "Claude Sonnet 5", ver: "BOLATU:claude-sonnet-5" },
  { name: "Claude Fable 5", ver: "BOLATU:claude-fable-5" },
  { name: "Claude Opus 4.6", ver: "BOLATU:claude-opus-4-6" },
  { name: "Claude Opus 4.7", ver: "BOLATU:claude-opus-4-7" },
  { name: "Claude Opus 4.8", ver: "BOLATU:claude-opus-4.8" },
  { name: "Claude v4", ver: "CLAUDE:v4" },
  { name: "DeepSeek R1", ver: "DEEPSEEK:R1" },
  { name: "DeepSeek V3", ver: "DEEPSEEK:v3" },
  { name: "DeepSeek V3 0324", ver: "DEEPSEEK:v3-0324" },
  { name: "DeepSeek V3.1", ver: "DEEPSEEK:v3-1-250821" },
  { name: "DeepSeek V3 250324", ver: "BOLATU:deepseek-v3-250324" },
  { name: "DeepSeek V3.2", ver: "DEEPSEEK:v3.2-no-thinking" },
  { name: "DeepSeek V3.2 Online", ver: "DEEPSEEK:v3.2-no-thinking-online" },
  { name: "DeepSeek V3.2 Think", ver: "DEEPSEEK:v3.2-thinking" },
  { name: "DeepSeek V4 Flash", ver: "DEEPSEEK_OFFICIAL:deepseek-v4-flash" },
  { name: "DeepSeek V4 Pro", ver: "DEEPSEEK_OFFICIAL:deepseek-v4-pro" },
  { name: "Doubao 1.5 Pro", ver: "DOUBAO:doubao-1-5-pro-32k" },
  { name: "Doubao V3.5", ver: "DOUBAO:v3.5" },
  { name: "Doubao V3.5 16K", ver: "DOUBAO:v3.5-16" },
  { name: "Doubao V4.1", ver: "DOUBAO:v4.1" },
  { name: "Doubao V4.2", ver: "DOUBAO:v4.2" },
  { name: "Doubao V4.5", ver: "DOUBAO:v4.5" },
  { name: "Doubao Seed 1.8", ver: "DEEPSEEK:doubao-seed-1-8" },
  { name: "Gemini 1.0 Pro", ver: "GEMINI:v1.0-pro" },
  { name: "Gemini 1.5 Flash", ver: "GEMINI:v1.5-flash" },
  { name: "Gemini 1.5 Pro", ver: "GEMINI:v1.5-pro" },
  { name: "Gemini 1.5 Pro Latest", ver: "gemini-1.5-pro-latest" },
  { name: "Gemini 2.0 Flash", ver: "BOLATU:gemini-2.0-flash" },
  { name: "Gemini 2.0 Flash G", ver: "GEMINI:v2.0-flash" },
  { name: "Gemini 2.5 Flash", ver: "GEMINI:v2.5-flash" },
  { name: "Gemini 2.5 Flash 0417", ver: "BOLATU:gemini-2.5-flash-preview-04-17" },
  { name: "Gemini 2.5 Flash BAIDU", ver: "BAIDU:gemini-2.5-flash" },
  { name: "Gemini 2.5 Pro", ver: "GEMINI:v2.5-pro" },
  { name: "Gemini 2.5 Pro 0325", ver: "BOLATU:gemini-2.5-pro-preview-03-25" },
  { name: "Gemini 2.5 Pro BAIDU", ver: "BAIDU:gemini-2.5-pro" },
  { name: "Gemini 3 Flash", ver: "BOLATU:gemini-3-flash-preview" },
  { name: "Gemini 3 Flash G", ver: "GEMINI:gemini-3-flash-preview" },
  { name: "Gemini 3 Flash BAIDU", ver: "BAIDU:gemini-3-flash-preview" },
  { name: "Gemini 3 Pro", ver: "BOLATU:gemini-3-pro-preview" },
  { name: "Gemini 3.0 Pro", ver: "GEMINI:v3.0-pro" },
  { name: "Gemini 3.1 Flash", ver: "BOLATU:gemini-3.1-flash-lite-preview" },
  { name: "Gemini 3.1 Flash G", ver: "GEMINI:gemini-3.1-flash-lite-preview" },
  { name: "Gemini 3.1 Flash BAIDU", ver: "BAIDU:gemini-3.1-flash-lite-preview" },
  { name: "Gemini 3.1 Pro", ver: "BOLATU:gemini-3.1-pro-preview" },
  { name: "Gemini 3.1 Pro G", ver: "GEMINI:gemini-3.1-pro-preview" },
  { name: "Gemini 3.1 Pro BAIDU", ver: "BAIDU:gemini-3.1-pro-preview" },
  { name: "Gemini 3.5", ver: "GEMINI:v3.5" },
  { name: "Gemini 3.5 16K", ver: "GEMINI:v3.5-16" },
  { name: "Gemini 3.5 Flash", ver: "BOLATU:gemini-3.5-flash" },
  { name: "Gemini 3.5 Flash G", ver: "GEMINI:gemini-3.5-flash" },
  { name: "Gemini 3.5 Flash BAIDU", ver: "BAIDU:gemini-3.5-flash" },
  { name: "Gemini v4", ver: "GEMINI:v4" },
  { name: "GPT-3.5", ver: "GPT:v3.5" },
  { name: "GPT-3.5 Turbo", ver: "gpt-3.5-turbo-1106" },
  { name: "GPT-3.5 16K", ver: "GPT:v3.5-16" },
  { name: "GPT-4", ver: "GPT-4" },
  { name: "GPT-4 Vision", ver: "gpt-4-vision-preview" },
  { name: "GPT-4.0", ver: "GPT:v4.0" },
  { name: "GPT-4.1", ver: "BOLATU:gpt-4.1" },
  { name: "GPT-4.1 Mini", ver: "GPT:4.1-mini" },
  { name: "GPT-4o", ver: "GPT:4o" },
  { name: "GPT-4o Mini", ver: "GPT:4o-mini" },
  { name: "GPT-4o All", ver: "BOLATU:gpt-4o-all" },
  { name: "GPT-4o", ver: "gpt-4o" },
  { name: "GPT-5", ver: "BOLATU:gpt-5" },
  { name: "GPT-5 GPT", ver: "GPT:v5" },
  { name: "GPT-5 Mini", ver: "BOLATU:gpt-5-mini" },
  { name: "GPT-5 Mini GPT", ver: "GPT:v5-mini" },
  { name: "GPT-5 Nano", ver: "BOLATU:gpt-5-nano" },
  { name: "GPT-5 Nano GPT", ver: "GPT:gpt-5-nano" },
  { name: "GPT-5.1", ver: "BOLATU:gpt-5.1" },
  { name: "GPT-5.2", ver: "BOLATU:gpt-5.2" },
  { name: "GPT-5.4", ver: "BOLATU:gpt-5.4" },
  { name: "GPT-5.5", ver: "BOLATU:gpt-5.5" },
  { name: "GPT-5.6 Sol", ver: "BOLATU:gpt-5.6-sol" },
  { name: "GPT-5.6 Luna", ver: "BOLATU:gpt-5.6-luna" },
  { name: "GPT o1 Mini", ver: "GPT:o1-mini" },
  { name: "GPT o1 Mini V2", ver: "GPT_O1_MINI:o1-mini" },
  { name: "GPT o1", ver: "GPT_O1_MINI:o1" },
  { name: "Grok 2 Vision", ver: "XAI:grok-2-vision" },
  { name: "Grok 3", ver: "BOLATU:grok-3-copy" },
  { name: "Grok 3 V2", ver: "BOLATU:grok-3-copy2" },
  { name: "Grok 3 XAI", ver: "BOLATU:grok-3" },
  { name: "Grok 3 DeepSearch", ver: "BOLATU:grok-3-deepsearch" },
  { name: "Grok 3 Reasoner", ver: "BOLATU:grok-3-reasoner" },
  { name: "Grok 3 Reasoner Copy", ver: "BOLATU:grok-3-reasoner-copy" },
  { name: "Grok 4", ver: "BOLATU:grok-4" },
  { name: "Grok 4 XAI", ver: "XAI:grok-4" },
  { name: "Grok 4 Copy", ver: "XAI:grok-4-copy" },
  { name: "Grok 4 Copy2", ver: "XAI:grok-4-copy2" },
  { name: "Grok 4 Fast", ver: "BOLATU:grok-4-fast-non-reasoning" },
  { name: "Grok 4 Fast XAI", ver: "XAI:grok-4-fast-non-reasoning" },
  { name: "Grok 4 Reasoning", ver: "BOLATU:grok-4-fast-reasoning" },
  { name: "Grok 4 Reasoning XAI", ver: "XAI:grok-4-fast-reasoning" },
  { name: "Grok 4.1", ver: "BOLATU:grok-4.1" },
  { name: "Grok 4.1 Fast", ver: "BOLATU:grok-4-1-fast-non-reasoning" },
  { name: "Grok 4.1 Fast XAI", ver: "XAI:grok-4-1-fast-non-reasoning" },
  { name: "Grok 4.1 Reasoning", ver: "BOLATU:grok-4-1-fast-reasoning" },
  { name: "Grok 4.1 Reasoning XAI", ver: "XAI:grok-4-1-fast-reasoning" },
  { name: "Grok 4.1 Pro", ver: "BOLATU:grok-4.1-copy1" },
  { name: "Grok 4.2", ver: "BOLATU:grok-4.2" },
  { name: "Grok 4.2 Reasoning", ver: "BOLATU:grok-4.2-reasoning" },
  { name: "Grok 4.3 Pro", ver: "BOLATU:grok-4.20-beta-non-reasoning-copy" },
  { name: "Grok 4.3 Pro Beta", ver: "BOLATU:grok-4.20-beta-non-reasoning" },
  { name: "Grok 4.3 Pro XAI", ver: "XAI:grok-4.20-beta-non-reasoning" },
  { name: "Grok 4.3 Reasoning", ver: "BOLATU:grok-4.20-beta-reasoning-copy" },
  { name: "Grok 4.3 Reasoning Beta", ver: "BOLATU:grok-4.20-beta-reasoning" },
  { name: "Grok 4.3 Reasoning XAI", ver: "XAI:grok-4.20-beta-reasoning" },
  { name: "Grok 4.5", ver: "BOLATU:grok-4.5" },
  { name: "Grok 4.5 XAI", ver: "XAI:grok-4.5" },
  { name: "Llama 4", ver: "LLAMA3:v4" },
  { name: "Llama 4.1", ver: "DEEPINFRA_LLAMA3:v4.1" },
  { name: "Llama 4 DF", ver: "DEEPINFRA_LLAMA3:v4" },
  { name: "Mistral Small Creative", ver: "OPEN_ROUTER:mistral-small-creative" },
  { name: "Mistral Small 3.2", ver: "OPEN_ROUTER:mistral-small-3.2-24b-instruct" },
  { name: "Qwen Max", ver: "QIANWEN:max-latest" },
  { name: "Qwen Max Latest", ver: "QIANWEN:qwen-max-latest" },
  { name: "Qwen 3 235B", ver: "QIANWEN:qwen3-235b-a22b" },
  { name: "Qwen 3 Max", ver: "QIANWEN:qwen3-max-preview" },
  { name: "Qwen VL Max", ver: "QIANWEN:qwen-vl-max" },
  { name: "GLM 4 Air", ver: "GLM:4-air" },
  { name: "GLM 4 Plus", ver: "GLM:4-plus" },
  { name: "GLM 4 FlashX", ver: "GLM:4-FlashX" },
  { name: "GLM 4V Plus", ver: "GLM:4v-plus" },
  { name: "iFlytek V3", ver: "IFLY_V3" },
  { name: "iFlytek V3.5", ver: "IFLY_V3_5" },
  { name: "iFlytek V3.1", ver: "IFLYTEK:v3.1" },
  { name: "iFlytek V3.5 V2", ver: "IFLYTEK:v3.5" },
  { name: "iFlytek V3.5 16K", ver: "IFLYTEK:v3.5-16" },
  { name: "iFlytek V4", ver: "IFLYTEK:v4" },
  { name: "iFlytek Pro 128", ver: "IFLYTEK:pro-128" },
  { name: "BAIDU V3.5", ver: "BAIDU:v3.5" },
  { name: "BAIDU V4", ver: "BAIDU:v4" },
  { name: "ERNIE Speed 8K", ver: "ERNIE-Speed-8K" },
  { name: "ERNIE 3.5 8K", ver: "ERNIE-3.5-8K" },
  { name: "Skylark Pro", ver: "BYTEPLUS:skylark-pro" },
  { name: "Step 3.5 Flash", ver: "STEPFUN:step-3.5-flash" },
  { name: "Step 3.5 Flash OR", ver: "OPEN_ROUTER:step-3.5-flash" },
  { name: "Step 3.5 Flash Free", ver: "OPEN_ROUTER:step-3.5-flash-free" },
  { name: "Master V1", ver: "MASTER:v1" },
  { name: "XAI V4", ver: "XAI:v4" },
];

// --== HEADERS ==-- \\
function getHeaders() {
  const m = getMac();
  return {
    "Content-Type": "application/json",
    "User-Agent": "Dart/3.6 (dart:io)",
    "x-country": "ID",
    "accept-encoding": "gzip",
    "usertype": "app_user",
    "x-sys-type": "android",
    "content-language": "zh_CN",
    "x-sys-version": "16",
    "x-device-id": m,
    "x-device-type": "android",
    "x-bundle-id": cfg.bundle,
    "x-app-version": cfg.version,
    "x-language": "id",
  };
}

// --== SIGNATURE ==-- \\
function sign(payload) {
  return crypto.createHash("sha1").update(
    Object.entries(payload)
      .filter(([k]) => !cfg.excludeSign.includes(k))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("&") + cfg.secret
  ).digest("hex");
}

function encrypt(str) {
  const cipher = crypto.createCipheriv(
    "aes-128-cbc", 
    Buffer.from(cfg.key), 
    Buffer.from(cfg.iv)
  );
  return Buffer.concat([cipher.update(str, "utf-8"), cipher.final()])
    .toString("hex")
    .toUpperCase();
}

// --== BUILD PAYLOAD ==-- \\
function buildPayload(params) {
  const nonce = crypto.randomBytes(16)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 32);
  const ts = Math.floor(Date.now() / 1000);
  const m = getMac();
  
  const payload = {
    question: params.question,
    version: params.version || cfg.version,
    aiVersion: params.aiVersion || "DEEPSEEK_OFFICIAL:deepseek-v4-flash",
    language: params.language || "id",
    conversationId: params.conversationId || "",
    deviceMac: params.deviceMac || m,
    needSearch: params.webSearch ? 1 : 0,
    type: params.type || "1",
    bundle: cfg.bundle,
    nonce,
    timestamp: ts,
  };
  
  payload.signature = sign(payload);
  
  return {
    bundle: cfg.bundle,
    security: encrypt(JSON.stringify(payload)),
    bundleId: cfg.bundle,
  };
}

// --== REGISTER ==-- \\
async function register() {
  try {
    const m = getMac();
    await axios.post(cfg.createUser, {
      deviceMac: m,
      bundleId: cfg.bundle,
      bundleVersion: cfg.version,
    }, { headers: getHeaders(), timeout: 10000 });
  } catch (e) {}
}

// --== MIDDLEWARE ==-- \\
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('json spaces', 2);

// --== ROUTES ==-- \\

app.get("/", (_req, res) => {
  const names = models.map(m => m.name);
  res.json({
    name: "example-AI",
    status: "online",
    credits: "example",
    deviceMac: getMac(),
    timestamp: new Date().toISOString(),
    endpoints: {
      chat: {
        method: "POST",
        path: "/api/chat",
        description: "Chat with AI models",
        usage: {
          body: [
            { name: "question", type: "string", required: true },
            { name: "model", type: "string", required: false, default: "DeepSeek V4 Flash" },
            { name: "conversationId", type: "string", required: false },
            { name: "webSearch", type: "boolean", required: false },
            { name: "systemPrompt", type: "string", required: false },
          ],
          formData: [
            { name: "files", type: "file", required: false, max: 9 }
          ]
        },
        example: "curl -X POST https://example.vercel.app/api/chat \\\n  -F \"question=Hello\" \\\n  -F \"model=DeepSeek V4 Flash\"",
        models: names
      }
    }
  });
});

app.post("/api/chat", upload.array("files", 9), async (req, res) => {
  try {
    const { question, model, conversationId, webSearch, deviceMac } = req.body || req.fields || {};
    
    if (!question) {
      return res.status(400).json({ error: '"question" is required' });
    }

    const m = models.find(x => x.name.toLowerCase() === (model || "").toLowerCase())
      || models.find(x => x.ver.includes(model));
    const ver = m ? m.ver : `BOLATU:${model || "deepseek-v4-flash"}`;

    const body = buildPayload({
      question,
      aiVersion: ver,
      conversationId,
      webSearch: webSearch === true || webSearch === "true",
      deviceMac
    });

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const response = await axios({
      method: "POST",
      url: cfg.upstream,
      headers: getHeaders(),
      data: body,
      responseType: "arraybuffer",
      timeout: 60000,
      decompress: true
    });

    const raw = Buffer.from(response.data).toString("utf-8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed === "[DONE]") {
        res.write("data: [DONE]\n\n");
      } else if (trimmed.startsWith("data: ")) {
        res.write(trimmed + "\n\n");
      } else {
        res.write("data: " + trimmed + "\n\n");
      }
    }
    
    if (!res.writableEnded) res.end();
  } catch (e) {
    if (!res.headersSent) {
      res.status(500).json({ error: e.message });
    } else {
      res.write("data: [DONE]\n\n");
      res.end();
    }
  }
});

// --== START ==-- \\
if (process.env.VERCEL) {
  getMac();
  module.exports = app;
} else {
  const PORT = process.env.PORT || 3000;
  getMac();
  register().then(() => {
    app.listen(PORT, () => {
      console.log(`example-AI running on port ${PORT}`);
      console.log(`Chat: http://localhost:${PORT}/api/chat`);
      console.log(`Device MAC: ${mac}`);
    });
  });
}
