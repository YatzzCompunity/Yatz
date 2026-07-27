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
}      flex-direction: column;
      position: relative;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    body.lock-scroll { overflow: hidden; height: 100vh; }

    /* ===== Animated Dark Background ===== */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background:
        radial-gradient(ellipse at 20% 20%, rgba(255, 107, 53, 0.12), transparent 50%),
        radial-gradient(ellipse at 80% 80%, rgba(78, 205, 196, 0.1), transparent 50%),
        radial-gradient(ellipse at 50% 50%, rgba(255, 210, 63, 0.05), transparent 70%),
        linear-gradient(180deg, var(--bg-dark) 0%, var(--bg-mid) 100%);
      z-index: -2;
    }

    .bg-shape {
      position: fixed;
      border-radius: 30%;
      filter: blur(80px);
      opacity: 0.25;
      z-index: -1;
      animation: float 22s ease-in-out infinite;
      pointer-events: none;
    }
    .bg-shape:nth-child(1) { width: 320px; height: 320px; background: #ff6b35; top: 5%; left: -8%; }
    .bg-shape:nth-child(2) { width: 280px; height: 280px; background: #4ecdc4; bottom: 10%; right: -8%; animation-delay: -7s; }
    .bg-shape:nth-child(3) { width: 200px; height: 200px; background: #6366f1; top: 45%; left: 55%; animation-delay: -14s; }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
      33% { transform: translate(40px, -50px) rotate(120deg) scale(1.1); }
      66% { transform: translate(-30px, 40px) rotate(240deg) scale(0.9); }
    }

    /* ===== Header ===== */
    header {
      padding: 20px 16px 8px;
      text-align: center;
      position: relative;
      z-index: 10;
    }

    .logo {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(1.8rem, 6vw, 3rem);
      font-weight: 700;
      letter-spacing: -0.03em;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: linear-gradient(135deg, #ff6b35 0%, #ffd23f 50%, #4ecdc4 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 2px 20px rgba(255, 107, 53, 0.3));
    }

    .logo-cube {
      width: 0.85em;
      height: 0.85em;
      position: relative;
      display: inline-block;
      -webkit-text-fill-color: initial;
      animation: spin 6s linear infinite;
      transform-style: preserve-3d;
    }
    .logo-cube::before, .logo-cube::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 18%;
    }
    .logo-cube::before {
      background: linear-gradient(135deg, #ff6b35, #ffd23f);
      box-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
    }
    .logo-cube::after {
      background: linear-gradient(135deg, #4ecdc4, #6366f1);
      clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
      opacity: 0.6;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .subtitle {
      font-size: clamp(0.8rem, 2vw, 0.95rem);
      color: var(--text-muted);
      margin-top: 6px;
      font-weight: 400;
      letter-spacing: 0.02em;
    }

    /* ===== Main ===== */
    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 16px 24px;
      gap: 14px;
      position: relative;
      z-index: 5;
    }

    /* ===== Cube Canvas (Large for Desktop) ===== */
    .cube-wrapper {
      width: 100%;
      /* Maksimal 800px atau 80% lebar layar agar sangat mudah diseret di desktop */
      max-width: min(800px, 80vw, 75vh);
      aspect-ratio: 1;
      position: relative;
      border-radius: 24px;
      background: radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, transparent 70%);
    }

    .cube-wrapper::before {
      content: '';
      position: absolute;
      inset: -10px;
      border-radius: 28px;
      background: radial-gradient(circle at center, rgba(255, 107, 53, 0.08), transparent 60%);
      pointer-events: none;
      animation: pulse 4s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.5; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
    }

    #canvas-container {
      width: 100%;
      height: 100%;
      cursor: grab;
      touch-action: none;
      border-radius: 24px;
      overflow: hidden;
    }

    #canvas-container:active { cursor: grabbing; }

    /* ===== Stats Bar ===== */
    .stats {
      display: flex;
      gap: 12px;
      width: 100%;
      max-width: 800px;
    }

    .stat-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 10px 16px;
      background: var(--panel);
      border: 1px solid var(--panel-border);
      border-radius: 14px;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }

    .stat-label {
      font-size: 0.65rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 500;
    }

    .stat-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--accent);
      font-variant-numeric: tabular-nums;
    }

    .stat-card:nth-child(2) .stat-value { color: var(--accent-2); }

    /* ===== Controls ===== */
    .controls {
      width: 100%;
      max-width: 800px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .control-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .btn {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.88rem;
      font-weight: 600;
      padding: 11px 22px;
      border: 1px solid var(--panel-border);
      background: var(--panel);
      color: var(--text);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }

    .btn:hover {
      background: var(--panel-hover);
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }

    .btn:active { transform: translateY(0); }

    .btn-primary {
      background: linear-gradient(135deg, var(--accent), #ff8c42);
      border: 1px solid rgba(255, 107, 53, 0.3);
      color: #fff;
      font-weight: 700;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #ff8c42, var(--accent));
      box-shadow: 0 4px 24px rgba(255, 107, 53, 0.4);
    }

    .btn-toggle.active {
      background: linear-gradient(135deg, var(--accent-2), #45b7af);
      border: 1px solid rgba(78, 205, 196, 0.3);
      color: #fff;
      font-weight: 700;
    }

    /* ===== Face Buttons Grid ===== */
    .face-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 6px;
    }

    .face-btn {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      padding: 12px 0;
      border: 1px solid var(--panel-border);
      background: var(--panel);
      color: var(--text);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.15s ease;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      text-align: center;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      position: relative;
      overflow: hidden;
    }

    .face-btn::before {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 3px;
      border-radius: 3px 0 0 3px;
    }

    .face-btn[data-move^="U"]::before { background: #f8f8f8; }
    .face-btn[data-move^="D"]::before { background: #ffd500; }
    .face-btn[data-move^="L"]::before { background: #ff8c00; }
    .face-btn[data-move^="R"]::before { background: #d32f2f; }
    .face-btn[data-move^="F"]::before { background: #43a047; }
    .face-btn[data-move^="B"]::before { background: #1e88e5; }

    .face-btn:hover {
      background: var(--panel-hover);
      border-color: rgba(255, 107, 53, 0.3);
      transform: translateY(-1px);
    }

    .face-btn:active {
      transform: scale(0.93);
      background: var(--accent);
      color: #fff;
    }

    /* ===== Hint & Info ===== */
    .hint {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-align: center;
      padding: 2px 12px;
      line-height: 1.5;
    }

    .hint kbd {
      display: inline-block;
      padding: 1px 6px;
      background: var(--panel);
      border: 1px solid var(--panel-border);
      border-radius: 4px;
      font-family: 'Space Grotesk', monospace;
      font-size: 0.7rem;
      color: var(--text);
    }

    .info {
      max-width: 800px;
      text-align: center;
      padding: 14px 18px;
      background: var(--panel);
      border: 1px solid var(--panel-border);
      border-radius: var(--radius);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      font-size: 0.82rem;
      color: var(--text-muted);
      line-height: 1.65;
    }

    .info strong {
      color: var(--accent);
      font-weight: 700;
    }

    /* ===== Toast ===== */
    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(120px);
      background: rgba(18, 18, 42, 0.95);
      border: 1px solid rgba(255, 107, 53, 0.3);
      color: var(--text);
      padding: 12px 28px;
      border-radius: 100px;
      font-size: 0.85rem;
      font-weight: 600;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      z-index: 1000;
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      pointer-events: none;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      white-space: nowrap;
    }

    .toast.show { transform: translateX(-50%) translateY(0); }
    .toast.success { border-color: rgba(78, 205, 196, 0.4); }
    .toast.success::before {
      content: '✓ ';
      color: var(--accent-2);
      font-weight: 700;
    }

    /* ===== Footer ===== */
    footer {
      text-align: center;
      padding: 12px 16px 20px;
      font-size: 0.72rem;
      color: var(--text-muted);
      position: relative;
      z-index: 5;
    }

    footer strong { color: var(--accent); }

    /* ===== Responsive ===== */
    @media (max-width: 768px) {
      .cube-wrapper { max-width: min(450px, 90vw, 60vh); }
      .stats, .controls, .info { max-width: 450px; }
    }

    @media (max-width: 600px) {
      .face-grid { grid-template-columns: repeat(4, 1fr); gap: 6px; }
      .face-btn { padding: 14px 0; font-size: 0.9rem; }
      .btn { padding: 12px 18px; font-size: 0.82rem; }
      .stat-value { font-size: 1.1rem; }
      main { padding: 8px 12px 20px; gap: 12px; }
    }

    @media (max-width: 380px) {
      .face-grid { grid-template-columns: repeat(3, 1fr); }
      .control-row { gap: 6px; }
      .btn { padding: 11px 14px; font-size: 0.78rem; }
    }

    @media (orientation: landscape) and (max-height: 500px) {
      .cube-wrapper { max-width: min(280px, 50vh); }
      header { padding: 8px 16px 4px; }
      main { gap: 8px; padding: 4px 16px 12px; }
      .info { display: none; }
    }

    /* Focus styles */
    .btn:focus-visible, .face-btn:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
  </style>
</head>
<body>
  <div class="bg-shape"></div>
  <div class="bg-shape"></div>
  <div class="bg-shape"></div>

  <header>
    <div class="logo">
      <span class="logo-cube"></span>
      DyatRubix
    </div>
    <p class="subtitle">Simulator Kubus Rubik Online 3D</p>
  </header>

  <main>
    <div class="cube-wrapper">
      <div id="canvas-container"></div>
    </div>

    <div class="stats">
      <div class="stat-card">
        <span class="stat-label">Waktu</span>
        <span class="stat-value" id="timer">00:00</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Gerakan</span>
        <span class="stat-value" id="moveCount">0</span>
      </div>
    </div>

    <div class="controls">
      <div class="control-row">
        <button class="btn btn-primary" id="scrambleBtn">Acak</button>
        <button class="btn" id="resetBtn">Reset</button>
        <button class="btn btn-toggle" id="lockScrollBtn">Kunci Gulir</button>
      </div>

      <div class="face-grid">
        <button class="face-btn" data-move="U">U</button>
        <button class="face-btn" data-move="U'">U'</button>
        <button class="face-btn" data-move="D">D</button>
        <button class="face-btn" data-move="D'">D'</button>
        <button class="face-btn" data-move="L">L</button>
        <button class="face-btn" data-move="L'">L'</button>
        <button class="face-btn" data-move="R">R</button>
        <button class="face-btn" data-move="R'">R'</button>
        <button class="face-btn" data-move="F">F</button>
        <button class="face-btn" data-move="F'">F'</button>
        <button class="face-btn" data-move="B">B</button>
        <button class="face-btn" data-move="B'">B'</button>
      </div>
    </div>

    <p class="hint">
      Seret pada sisi kubus untuk memutar • Seret latar untuk memutar kamera • Keyboard: <kbd>U D L R F B</kbd> + <kbd>Shift</kbd>
    </p>

    <div class="info">
      <strong>DyatRubix</strong> — Mainkan simulator kubus Rubik 3D secara online. Latih kemampuan
      menyelesaikan kubus dengan berbagai putaran. Cocok untuk pemula maupun yang sudah mahir.
      Gunakan tombol di atas atau seret langsung pada kubus untuk memutar sisi.
    </div>
  </main>

  <footer>
    <strong>DyatRubix</strong> — Dibuat dengan Three.js • Berjalan di HP & Desktop
  </footer>

  <div class="toast" id="toast"></div>

  <script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
      "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
    }
  }
  </script>

  <script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

    // ===== Polyfill roundRect =====
    if (!CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        const radius = typeof r === 'number' ? r : (r[0] || 0);
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + w - radius, y);
        this.quadraticCurveTo(x + w, y, x + w, y + radius);
        this.lineTo(x + w, y + h - radius);
        this.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        this.lineTo(x + radius, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
      };
    }

    // ===== Scene Setup =====
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(5, 4.5, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 14;
    controls.rotateSpeed = 0.8;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // ===== Lighting (Diperkuat agar kubus terang) =====
    scene.add(new THREE.AmbientLight(0xffffff, 1.0));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    fillLight.position.set(-5, -3, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
    rimLight.position.set(0, 2, -8);
    scene.add(rimLight);

    // ===== Colors (Dibuat sangat cerah dan tidak kusam) =====
    const COLORS = {
      white:  '#ffffff',
      yellow: '#ffeb3b',
      red:    '#f44336',
      orange: '#ff9800',
      blue:   '#2196f3',
      green:  '#4caf50',
      black:  '#000000'
    };

    // ===== Texture Creation =====
    const textureCache = {};

    function createStickerTexture(color) {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      // Background gelap (plastik kubus) - dibuat sangat hitam agar stiker menonjol
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 256, 256);

      // Stiker berwarna
      const p = 12;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(p, p, 256 - 2 * p, 256 - 2 * p, 22);
      ctx.fill();

      // Highlight halus agar terlihat mengkilap tapi tidak mengurangi kecerahan
      const grad = ctx.createLinearGradient(0, p, 0, 256 - p);
      grad.addColorStop(0, 'rgba(255,255,255,0.2)');
      grad.addColorStop(0.5, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(p, p, 256 - 2 * p, 256 - 2 * p, 22);
      ctx.fill();

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return texture;
    }

    function createLogoTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 256, 256);

      const p = 12;
      ctx.fillStyle = COLORS.white;
      ctx.beginPath();
      ctx.roundRect(p, p, 256 - 2 * p, 256 - 2 * p, 22);
      ctx.fill();

      // Gradient highlight
      const grad = ctx.createLinearGradient(0, p, 0, 256 - p);
      grad.addColorStop(0, 'rgba(255,255,255,0.2)');
      grad.addColorStop(0.5, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(p, p, 256 - 2 * p, 256 - 2 * p, 22);
      ctx.fill();

      // Teks "DyatRubix" — dua baris
      ctx.fillStyle = '#1a1a2e';
      ctx.font = 'bold 38px "Space Grotesk", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Shadow
      ctx.fillStyle = 'rgba(255, 107, 53, 0.15)';
      ctx.fillText('Dyat', 129, 97);
      ctx.fillText('Rubix', 129, 161);

      // Main text
      ctx.fillStyle = '#1a1a2e';
      ctx.fillText('Dyat', 128, 96);
      ctx.fillText('Rubix', 128, 160);

      // Accent dot
      ctx.fillStyle = '#ff6b35';
      ctx.beginPath();
      ctx.arc(128, 200, 6, 0, Math.PI * 2);
      ctx.fill();

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return texture;
    }

    function getStickerTexture(color) {
      if (!textureCache[color]) {
        textureCache[color] = createStickerTexture(color);
      }
      return textureCache[color];
    }

    const logoTexture = createLogoTexture();

    // ===== Materials =====
    function createStickerMaterial(color) {
      const mat = new THREE.MeshStandardMaterial({
        map: getStickerTexture(color),
        roughness: 0.3, // Lebih licin agar mengkilap dan reflektif terhadap cahaya
        metalness: 0.0
      });
      mat.userData.color = color;
      return mat;
    }

    function createLogoMaterial() {
      const mat = new THREE.MeshStandardMaterial({
        map: logoTexture,
        roughness: 0.3,
        metalness: 0.0
      });
      mat.userData.color = COLORS.white;
      return mat;
    }

    function createBlackMaterial() {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.6,
        metalness: 0.1
      });
      mat.userData.color = 'black';
      return mat;
    }

    // ===== Build Cube =====
    const cubies = [];
    const initialStates = [];
    const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);
    let firstInteraction = false;

    function buildCube() {
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            if (x === 0 && y === 0 && z === 0) continue;

            const isTopCenter = (x === 0 && y === 1 && z === 0);

            const materials = [
              x === 1  ? createStickerMaterial(COLORS.red)    : createBlackMaterial(),
              x === -1 ? createStickerMaterial(COLORS.orange) : createBlackMaterial(),
              y === 1  ? (isTopCenter ? createLogoMaterial() : createStickerMaterial(COLORS.white)) : createBlackMaterial(),
              y === -1 ? createStickerMaterial(COLORS.yellow) : createBlackMaterial(),
              z === 1  ? createStickerMaterial(COLORS.green)  : createBlackMaterial(),
              z === -1 ? createStickerMaterial(COLORS.blue)   : createBlackMaterial(),
            ];

            const cubie = new THREE.Mesh(geometry, materials);
            cubie.position.set(x, y, z);
            scene.add(cubie);
            cubies.push(cubie);

            initialStates.push({
              position: cubie.position.clone(),
              quaternion: cubie.quaternion.clone()
            });
          }
        }
      }
    }

    buildCube();

    // ===== Rotation Logic =====
    let isRotating = false;
    let moveCount = 0;
    let timerStarted = false;
    let timerInterval = null;
    let timerStart = 0;

    const moveMap = {
      'U':  { axis: 'y', layer:  1, dir: -1 },
      "U'": { axis: 'y', layer:  1, dir:  1 },
      'D':  { axis: 'y', layer: -1, dir:  1 },
      "D'": { axis: 'y', layer: -1, dir: -1 },
      'R':  { axis: 'x', layer:  1, dir: -1 },
      "R'": { axis: 'x', layer:  1, dir:  1 },
      'L':  { axis: 'x', layer: -1, dir:  1 },
      "L'": { axis: 'x', layer: -1, dir: -1 },
      'F':  { axis: 'z', layer:  1, dir: -1 },
      "F'": { axis: 'z', layer:  1, dir:  1 },
      'B':  { axis: 'z', layer: -1, dir:  1 },
      "B'": { axis: 'z', layer: -1, dir: -1 },
    };

    function rotateFace(axis, layer, direction, duration = 250) {
      return new Promise((resolve) => {
        if (isRotating) { resolve(); return; }
        isRotating = true;

        const pivot = new THREE.Group();
        scene.add(pivot);

        const layerCubies = cubies.filter(c =>
          Math.abs(c.position[axis] - layer) < 0.1
        );

        layerCubies.forEach(c => pivot.attach(c));

        const targetAngle = direction * Math.PI / 2;
        const startTime = performance.now();

        function animate() {
          const elapsed = performance.now() - startTime;
          const t = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);

          pivot.rotation[axis] = targetAngle * eased;

          if (t < 1) {
            requestAnimationFrame(animate);
          } else {
            pivot.rotation[axis] = targetAngle;
            layerCubies.forEach(c => scene.attach(c));
            layerCubies.forEach(c => {
              c.position.x = Math.round(c.position.x);
              c.position.y = Math.round(c.position.y);
              c.position.z = Math.round(c.position.z);
            });
            scene.remove(pivot);
            isRotating = false;
            resolve();
          }
        }

        if (duration <= 0) {
          pivot.rotation[axis] = targetAngle;
          layerCubies.forEach(c => scene.attach(c));
          layerCubies.forEach(c => {
            c.position.x = Math.round(c.position.x);
            c.position.y = Math.round(c.position.y);
            c.position.z = Math.round(c.position.z);
          });
          scene.remove(pivot);
          isRotating = false;
          resolve();
        } else {
          animate();
        }
      });
    }

    async function doMove(move, count = true) {
      const m = moveMap[move];
      if (!m || isRotating) return;

      if (count) {
        moveCount++;
        document.getElementById('moveCount').textContent = moveCount;
        startTimer();
        stopAutoRotate();
      }

      await rotateFace(m.axis, m.layer, m.dir);

      if (count) {
        checkSolved();
      }
    }

    // ===== Timer =====
    function startTimer() {
      if (timerStarted) return;
      timerStarted = true;
      timerStart = Date.now();
      timerInterval = setInterval(updateTimer, 100);
    }

    function stopTimer() {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      timerStarted = false;
    }

    function resetTimer() {
      stopTimer();
      document.getElementById('timer').textContent = '00:00';
    }

    function updateTimer() {
      const elapsed = Math.floor((Date.now() - timerStart) / 1000);
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      document.getElementById('timer').textContent =
        `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function stopAutoRotate() {
      if (!firstInteraction) {
        firstInteraction = true;
        controls.autoRotate = false;
      }
    }

    // ===== Solved Check =====
    function checkSolved() {
      if (moveCount === 0) return;
      if (isSolved()) {
        stopTimer();
        showToast('Selamat! Kubus berhasil diselesaikan!', 'success');
      }
    }

    function isSolved() {
      const directions = [
        { axis: 'x', sign: 1, normal: new THREE.Vector3(1, 0, 0) },
        { axis: 'x', sign: -1, normal: new THREE.Vector3(-1, 0, 0) },
        { axis: 'y', sign: 1, normal: new THREE.Vector3(0, 1, 0) },
        { axis: 'y', sign: -1, normal: new THREE.Vector3(0, -1, 0) },
        { axis: 'z', sign: 1, normal: new THREE.Vector3(0, 0, 1) },
        { axis: 'z', sign: -1, normal: new THREE.Vector3(0, 0, -1) },
      ];

      const localNormals = [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1),
      ];

      for (const dir of directions) {
        const colors = new Set();

        for (const cubie of cubies) {
          if (Math.round(cubie.position[dir.axis]) !== dir.sign) continue;

          for (let i = 0; i < 6; i++) {
            const worldNormal = localNormals[i].clone().applyQuaternion(cubie.quaternion);
            if (worldNormal.distanceTo(dir.normal) < 0.1) {
              const c = cubie.material[i].userData.color;
              if (c && c !== 'black') {
                colors.add(c);
              }
              break;
            }
          }
        }

        if (colors.size > 1) return false;
      }

      return true;
    }

    // ===== Scramble =====
    let scrambling = false;

    async function scramble() {
      if (isRotating || scrambling) return;
      scrambling = true;
      showToast('Mengacak kubus...');

      cubies.forEach((c, i) => {
        c.position.copy(initialStates[i].position);
        c.quaternion.copy(initialStates[i].quaternion);
      });

      const moves = Object.keys(moveMap);
      const length = 25;
      let lastFace = '';

      for (let i = 0; i < length; i++) {
        let move;
        do {
          move = moves[Math.floor(Math.random() * moves.length)];
        } while (move[0] === lastFace);
        lastFace = move[0];

        const m = moveMap[move];
        await rotateFace(m.axis, m.layer, m.dir, 100);
      }

      moveCount = 0;
      document.getElementById('moveCount').textContent = '0';
      resetTimer();
      scrambling = false;
      stopAutoRotate();
      showToast('Kubus diacak! Selamat mencoba!');
    }

    // ===== Reset =====
    function resetCube() {
      if (isRotating || scrambling) return;
      cubies.forEach((c, i) => {
        c.position.copy(initialStates[i].position);
        c.quaternion.copy(initialStates[i].quaternion);
      });
      moveCount = 0;
      document.getElementById('moveCount').textContent = '0';
      resetTimer();
      showToast('Kubus direset!');
    }

    // ===== Drag to Rotate Face =====
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let dragData = null;

    function getNDC(e) {
      const rect = renderer.domElement.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((e.clientY - rect.top) / rect.height) * 2 + 1
      };
    }

    function onPointerDown(e) {
      if (isRotating || scrambling) return;

      const coords = getNDC(e);
      pointer.set(coords.x, coords.y);
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(cubies);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const cubie = hit.object;
        const faceNormal = hit.face.normal.clone();
        faceNormal.transformDirection(cubie.matrixWorld);
        faceNormal.round();

        dragData = {
          cubie,
          faceNormal,
          startX: coords.x,
          startY: coords.y
        };

        controls.enabled = false;
        stopAutoRotate();
      }
    }

    function onPointerUp(e) {
      if (!dragData) {
        controls.enabled = true;
        return;
      }

      const coords = getNDC(e);
      const dx = coords.x - dragData.startX;
      const dy = coords.y - dragData.startY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 0.04) {
        dragData = null;
        controls.enabled = true;
        return;
      }

      const camRight = new THREE.Vector3();
      const camUp = new THREE.Vector3();
      camera.matrixWorld.extractBasis(camRight, camUp, new THREE.Vector3());

      const dragDir = new THREE.Vector3();
      dragDir.addScaledVector(camRight, dx);
      dragDir.addScaledVector(camUp, dy);
      dragDir.normalize();

      const rotAxis = new THREE.Vector3().crossVectors(dragData.faceNormal, dragDir);

      const ax = Math.abs(rotAxis.x);
      const ay = Math.abs(rotAxis.y);
      const az = Math.abs(rotAxis.z);

      let axis, layer, direction;

      if (ax > ay && ax > az) {
        axis = 'x';
        layer = Math.round(dragData.cubie.position.x);
        direction = rotAxis.x > 0 ? 1 : -1;
      } else if (ay > az) {
        axis = 'y';
        layer = Math.round(dragData.cubie.position.y);
        direction = rotAxis.y > 0 ? 1 : -1;
      } else {
        axis = 'z';
        layer = Math.round(dragData.cubie.position.z);
        direction = rotAxis.z > 0 ? 1 : -1;
      }

      dragData = null;
      controls.enabled = true;

      moveCount++;
      document.getElementById('moveCount').textContent = moveCount;
      startTimer();

      rotateFace(axis, layer, direction).then(() => checkSolved());
    }

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointercancel', () => {
      dragData = null;
      controls.enabled = true;
    });

    // ===== Button Events =====
    document.querySelectorAll('.face-btn').forEach(btn => {
      btn.addEventListener('click', () => doMove(btn.dataset.move));
    });

    document.getElementById('scrambleBtn').addEventListener('click', scramble);
    document.getElementById('resetBtn').addEventListener('click', resetCube);

    const lockBtn = document.getElementById('lockScrollBtn');
    lockBtn.addEventListener('click', () => {
      document.body.classList.toggle('lock-scroll');
      lockBtn.classList.toggle('active');
      const locked = document.body.classList.contains('lock-scroll');
      showToast(locked ? 'Gulir dikunci' : 'Gulir dibuka');
    });

    // ===== Keyboard =====
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const key = e.key.toUpperCase();
      if (['U', 'D', 'L', 'R', 'F', 'B'].includes(key)) {
        e.preventDefault();
        const move = e.shiftKey ? key + "'" : key;
        doMove(move);
      } else if (key === 'S' && e.shiftKey) {
        e.preventDefault();
        scramble();
      }
    });

    // ===== Toast =====
    const toastEl = document.getElementById('toast');
    let toastTimer = null;

    function showToast(msg, type = '') {
      toastEl.textContent = msg;
      toastEl.className = 'toast show ' + type;
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toastEl.classList.remove('show');
      }, 2800);
    }

    // ===== Resize =====
    function resize() {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    window.addEventListener('resize', resize);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    // ===== Animation Loop =====
    function tick() {
      requestAnimationFrame(tick);
      controls.update();
      renderer.render(scene, camera);
    }
    tick();

    // ===== Welcome =====
    setTimeout(() => showToast('Selamat datang di DyatRubix!'), 600);
  </script>
</body>
</html>      flex-direction: column;
      position: relative;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    body.lock-scroll { overflow: hidden; height: 100vh; }

    /* ===== Animated Background ===== */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background:
        radial-gradient(ellipse at 20% 20%, rgba(255, 107, 53, 0.12), transparent 50%),
        radial-gradient(ellipse at 80% 80%, rgba(78, 205, 196, 0.1), transparent 50%),
        radial-gradient(ellipse at 50% 50%, rgba(255, 210, 63, 0.05), transparent 70%),
        linear-gradient(180deg, var(--bg-dark) 0%, var(--bg-mid) 100%);
      z-index: -2;
    }

    .bg-shape {
      position: fixed;
      border-radius: 30%;
      filter: blur(80px);
      opacity: 0.25;
      z-index: -1;
      animation: float 22s ease-in-out infinite;
      pointer-events: none;
    }
    .bg-shape:nth-child(1) { width: 320px; height: 320px; background: #ff6b35; top: 5%; left: -8%; }
    .bg-shape:nth-child(2) { width: 280px; height: 280px; background: #4ecdc4; bottom: 10%; right: -8%; animation-delay: -7s; }
    .bg-shape:nth-child(3) { width: 200px; height: 200px; background: #6366f1; top: 45%; left: 55%; animation-delay: -14s; }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
      33% { transform: translate(40px, -50px) rotate(120deg) scale(1.1); }
      66% { transform: translate(-30px, 40px) rotate(240deg) scale(0.9); }
    }

    /* ===== Header ===== */
    header {
      padding: 20px 16px 8px;
      text-align: center;
      position: relative;
      z-index: 10;
    }

    .logo {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(1.8rem, 6vw, 3rem);
      font-weight: 700;
      letter-spacing: -0.03em;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: linear-gradient(135deg, #ff6b35 0%, #ffd23f 50%, #4ecdc4 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 2px 20px rgba(255, 107, 53, 0.3));
    }

    .logo-cube {
      width: 0.85em;
      height: 0.85em;
      position: relative;
      display: inline-block;
      -webkit-text-fill-color: initial;
      animation: spin 6s linear infinite;
      transform-style: preserve-3d;
    }
    .logo-cube::before, .logo-cube::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 18%;
    }
    .logo-cube::before {
      background: linear-gradient(135deg, #ff6b35, #ffd23f);
      box-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
    }
    .logo-cube::after {
      background: linear-gradient(135deg, #4ecdc4, #6366f1);
      clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
      opacity: 0.6;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .subtitle {
      font-size: clamp(0.8rem, 2vw, 0.95rem);
      color: var(--text-muted);
      margin-top: 6px;
      font-weight: 400;
      letter-spacing: 0.02em;
    }

    /* ===== Main ===== */
    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 16px 24px;
      gap: 14px;
      position: relative;
      z-index: 5;
    }

    /* ===== Cube Canvas ===== */
    .cube-wrapper {
      width: 100%;
      max-width: min(500px, 65vh, 90vw);
      aspect-ratio: 1;
      position: relative;
      border-radius: 24px;
      background: radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, transparent 70%);
    }

    .cube-wrapper::before {
      content: '';
      position: absolute;
      inset: -10px;
      border-radius: 28px;
      background: radial-gradient(circle at center, rgba(255, 107, 53, 0.08), transparent 60%);
      pointer-events: none;
      animation: pulse 4s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.5; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
    }

    #canvas-container {
      width: 100%;
      height: 100%;
      cursor: grab;
      touch-action: none;
      border-radius: 24px;
      overflow: hidden;
    }

    #canvas-container:active { cursor: grabbing; }

    /* ===== Stats Bar ===== */
    .stats {
      display: flex;
      gap: 12px;
      width: 100%;
      max-width: 500px;
    }

    .stat-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 10px 16px;
      background: var(--panel);
      border: 1px solid var(--panel-border);
      border-radius: 14px;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }

    .stat-label {
      font-size: 0.65rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 500;
    }

    .stat-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--accent);
      font-variant-numeric: tabular-nums;
    }

    .stat-card:nth-child(2) .stat-value { color: var(--accent-2); }

    /* ===== Controls ===== */
    .controls {
      width: 100%;
      max-width: 500px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .control-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .btn {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.88rem;
      font-weight: 600;
      padding: 11px 22px;
      border: 1px solid var(--panel-border);
      background: var(--panel);
      color: var(--text);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }

    .btn:hover {
      background: var(--panel-hover);
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }

    .btn:active { transform: translateY(0); }

    .btn-primary {
      background: linear-gradient(135deg, var(--accent), #ff8c42);
      border: 1px solid rgba(255, 107, 53, 0.3);
      color: #fff;
      font-weight: 700;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #ff8c42, var(--accent));
      box-shadow: 0 4px 24px rgba(255, 107, 53, 0.4);
    }

    .btn-toggle.active {
      background: linear-gradient(135deg, var(--accent-2), #45b7af);
      border: 1px solid rgba(78, 205, 196, 0.3);
      color: #fff;
      font-weight: 700;
    }

    /* ===== Face Buttons Grid ===== */
    .face-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 6px;
    }

    .face-btn {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      padding: 12px 0;
      border: 1px solid var(--panel-border);
      background: var(--panel);
      color: var(--text);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.15s ease;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      text-align: center;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      position: relative;
      overflow: hidden;
    }

    .face-btn::before {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 3px;
      border-radius: 3px 0 0 3px;
    }

    .face-btn[data-move^="U"]::before { background: #f8f8f8; }
    .face-btn[data-move^="D"]::before { background: #ffd500; }
    .face-btn[data-move^="L"]::before { background: #ff8c00; }
    .face-btn[data-move^="R"]::before { background: #d32f2f; }
    .face-btn[data-move^="F"]::before { background: #43a047; }
    .face-btn[data-move^="B"]::before { background: #1e88e5; }

    .face-btn:hover {
      background: var(--panel-hover);
      border-color: rgba(255, 107, 53, 0.3);
      transform: translateY(-1px);
    }

    .face-btn:active {
      transform: scale(0.93);
      background: var(--accent);
      color: #fff;
    }

    /* ===== Hint & Info ===== */
    .hint {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-align: center;
      padding: 2px 12px;
      line-height: 1.5;
    }

    .hint kbd {
      display: inline-block;
      padding: 1px 6px;
      background: var(--panel);
      border: 1px solid var(--panel-border);
      border-radius: 4px;
      font-family: 'Space Grotesk', monospace;
      font-size: 0.7rem;
      color: var(--text);
    }

    .info {
      max-width: 500px;
      text-align: center;
      padding: 14px 18px;
      background: var(--panel);
      border: 1px solid var(--panel-border);
      border-radius: var(--radius);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      font-size: 0.82rem;
      color: var(--text-muted);
      line-height: 1.65;
    }

    .info strong {
      color: var(--accent);
      font-weight: 700;
    }

    /* ===== Toast ===== */
    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(120px);
      background: rgba(18, 18, 42, 0.95);
      border: 1px solid rgba(255, 107, 53, 0.3);
      color: var(--text);
      padding: 12px 28px;
      border-radius: 100px;
      font-size: 0.85rem;
      font-weight: 600;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      z-index: 1000;
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      pointer-events: none;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      white-space: nowrap;
    }

    .toast.show { transform: translateX(-50%) translateY(0); }

    .toast.success { border-color: rgba(78, 205, 196, 0.4); }
    .toast.success::before {
      content: '✓ ';
      color: var(--accent-2);
      font-weight: 700;
    }

    /* ===== Footer ===== */
    footer {
      text-align: center;
      padding: 12px 16px 20px;
      font-size: 0.72rem;
      color: var(--text-muted);
      position: relative;
      z-index: 5;
    }

    footer strong { color: var(--accent); }

    /* ===== Responsive ===== */
    @media (max-width: 600px) {
      .face-grid { grid-template-columns: repeat(4, 1fr); gap: 6px; }
      .face-btn { padding: 14px 0; font-size: 0.9rem; }
      .btn { padding: 12px 18px; font-size: 0.82rem; }
      .stat-value { font-size: 1.1rem; }
      main { padding: 8px 12px 20px; gap: 12px; }
    }

    @media (max-width: 380px) {
      .face-grid { grid-template-columns: repeat(3, 1fr); }
      .control-row { gap: 6px; }
      .btn { padding: 11px 14px; font-size: 0.78rem; }
    }

    @media (orientation: landscape) and (max-height: 500px) {
      .cube-wrapper { max-width: min(280px, 50vh); }
      header { padding: 8px 16px 4px; }
      main { gap: 8px; padding: 4px 16px 12px; }
      .info { display: none; }
    }

    /* Focus styles */
    .btn:focus-visible, .face-btn:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
  </style>
</head>
<body>
  <div class="bg-shape"></div>
  <div class="bg-shape"></div>
  <div class="bg-shape"></div>

  <header>
    <div class="logo">
      <span class="logo-cube"></span>
      DyatRubix
    </div>
    <p class="subtitle">Simulator Kubus Rubik Online 3D</p>
  </header>

  <main>
    <div class="cube-wrapper">
      <div id="canvas-container"></div>
    </div>

    <div class="stats">
      <div class="stat-card">
        <span class="stat-label">Waktu</span>
        <span class="stat-value" id="timer">00:00</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Gerakan</span>
        <span class="stat-value" id="moveCount">0</span>
      </div>
    </div>

    <div class="controls">
      <div class="control-row">
        <button class="btn btn-primary" id="scrambleBtn">Acak</button>
        <button class="btn" id="resetBtn">Reset</button>
        <button class="btn btn-toggle" id="lockScrollBtn">Kunci Gulir</button>
      </div>

      <div class="face-grid">
        <button class="face-btn" data-move="U">U</button>
        <button class="face-btn" data-move="U'">U'</button>
        <button class="face-btn" data-move="D">D</button>
        <button class="face-btn" data-move="D'">D'</button>
        <button class="face-btn" data-move="L">L</button>
        <button class="face-btn" data-move="L'">L'</button>
        <button class="face-btn" data-move="R">R</button>
        <button class="face-btn" data-move="R'">R'</button>
        <button class="face-btn" data-move="F">F</button>
        <button class="face-btn" data-move="F'">F'</button>
        <button class="face-btn" data-move="B">B</button>
        <button class="face-btn" data-move="B'">B'</button>
      </div>
    </div>

    <p class="hint">
      Seret pada sisi kubus untuk memutar • Seret latar untuk memutar kamera • Keyboard: <kbd>U D L R F B</kbd> + <kbd>Shift</kbd>
    </p>

    <div class="info">
      <strong>DyatRubix</strong> — Mainkan simulator kubus Rubik 3D secara online. Latih kemampuan
      menyelesaikan kubus dengan berbagai putaran. Cocok untuk pemula maupun yang sudah mahir.
      Gunakan tombol di atas atau seret langsung pada kubus untuk memutar sisi.
    </div>
  </main>

  <footer>
    <strong>DyatRubix</strong> — Dibuat dengan Three.js • Berjalan di HP & Desktop
  </footer>

  <div class="toast" id="toast"></div>

  <script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
      "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
    }
  }
  </script>

  <script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

    // ===== Polyfill roundRect =====
    if (!CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        const radius = typeof r === 'number' ? r : (r[0] || 0);
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + w - radius, y);
        this.quadraticCurveTo(x + w, y, x + w, y + radius);
        this.lineTo(x + w, y + h - radius);
        this.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        this.lineTo(x + radius, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
      };
    }

    // ===== Scene Setup =====
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(5, 4.5, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 14;
    controls.rotateSpeed = 0.8;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // ===== Lighting =====
    scene.add(new THREE.AmbientLight(0xffffff, 0.65));

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.7);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x4ecdc4, 0.2);
    fillLight.position.set(-5, -3, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xff6b35, 0.15);
    rimLight.position.set(0, 2, -8);
    scene.add(rimLight);

    // ===== Colors =====
    const COLORS = {
      white:  '#f5f5f5',
      yellow: '#ffd500',
      red:    '#c62828',
      orange: '#ff8800',
      blue:   '#1565c0',
      green:  '#2e7d32',
      black:  '#0a0a0a'
    };

    // ===== Texture Creation =====
    const textureCache = {};

    function createStickerTexture(color) {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      // Background gelap (plastik)
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, 256, 256);

      // Sticker berwarna
      const p = 12;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(p, p, 256 - 2 * p, 256 - 2 * p, 22);
      ctx.fill();

      // Highlight halus
      const grad = ctx.createLinearGradient(0, p, 0, 256 - p);
      grad.addColorStop(0, 'rgba(255,255,255,0.2)');
      grad.addColorStop(0.5, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(p, p, 256 - 2 * p, 256 - 2 * p, 22);
      ctx.fill();

      // Border tipis
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(p + 2, p + 2, 256 - 2 * p - 4, 256 - 2 * p - 4, 20);
      ctx.stroke();

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return texture;
    }

    function createLogoTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, 256, 256);

      const p = 12;
      ctx.fillStyle = COLORS.white;
      ctx.beginPath();
      ctx.roundRect(p, p, 256 - 2 * p, 256 - 2 * p, 22);
      ctx.fill();

      // Gradient highlight
      const grad = ctx.createLinearGradient(0, p, 0, 256 - p);
      grad.addColorStop(0, 'rgba(255,255,255,0.2)');
      grad.addColorStop(0.5, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(p, p, 256 - 2 * p, 256 - 2 * p, 22);
      ctx.fill();

      // Teks "DyatRubix" — dua baris
      ctx.fillStyle = '#1a1a2e';
      ctx.font = 'bold 38px "Space Grotesk", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Shadow
      ctx.fillStyle = 'rgba(255, 107, 53, 0.15)';
      ctx.fillText('Dyat', 129, 97);
      ctx.fillText('Rubix', 129, 161);

      // Main text
      ctx.fillStyle = '#1a1a2e';
      ctx.fillText('Dyat', 128, 96);
      ctx.fillText('Rubix', 128, 160);

      // Accent dot
      ctx.fillStyle = '#ff6b35';
      ctx.beginPath();
      ctx.arc(128, 200, 6, 0, Math.PI * 2);
      ctx.fill();

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return texture;
    }

    function getStickerTexture(color) {
      if (!textureCache[color]) {
        textureCache[color] = createStickerTexture(color);
      }
      return textureCache[color];
    }

    const logoTexture = createLogoTexture();

    // ===== Materials =====
    function createStickerMaterial(color) {
      const mat = new THREE.MeshStandardMaterial({
        map: getStickerTexture(color),
        roughness: 0.35,
        metalness: 0.05
      });
      mat.userData.color = color;
      return mat;
    }

    function createLogoMaterial() {
      const mat = new THREE.MeshStandardMaterial({
        map: logoTexture,
        roughness: 0.35,
        metalness: 0.05
      });
      mat.userData.color = COLORS.white;
      return mat;
    }

    function createBlackMaterial() {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 0.6,
        metalness: 0.1
      });
      mat.userData.color = 'black';
      return mat;
    }

    // ===== Build Cube =====
    const cubies = [];
    const initialStates = [];
    const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);
    let firstInteraction = false;

    function buildCube() {
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            if (x === 0 && y === 0 && z === 0) continue;

            const isTopCenter = (x === 0 && y === 1 && z === 0);

            // Urutan material: +x, -x, +y, -y, +z, -z
            const materials = [
              x === 1  ? createStickerMaterial(COLORS.red)    : createBlackMaterial(),
              x === -1 ? createStickerMaterial(COLORS.orange) : createBlackMaterial(),
              y === 1  ? (isTopCenter ? createLogoMaterial() : createStickerMaterial(COLORS.white)) : createBlackMaterial(),
              y === -1 ? createStickerMaterial(COLORS.yellow) : createBlackMaterial(),
              z === 1  ? createStickerMaterial(COLORS.green)  : createBlackMaterial(),
              z === -1 ? createStickerMaterial(COLORS.blue)   : createBlackMaterial(),
            ];

            const cubie = new THREE.Mesh(geometry, materials);
            cubie.position.set(x, y, z);
            scene.add(cubie);
            cubies.push(cubie);

            initialStates.push({
              position: cubie.position.clone(),
              quaternion: cubie.quaternion.clone()
            });
          }
        }
      }
    }

    buildCube();

    // ===== Rotation Logic =====
    let isRotating = false;
    let moveCount = 0;
    let timerStarted = false;
    let timerInterval = null;
    let timerStart = 0;

    const moveMap = {
      'U':  { axis: 'y', layer:  1, dir: -1 },
      "U'": { axis: 'y', layer:  1, dir:  1 },
      'D':  { axis: 'y', layer: -1, dir:  1 },
      "D'": { axis: 'y', layer: -1, dir: -1 },
      'R':  { axis: 'x', layer:  1, dir: -1 },
      "R'": { axis: 'x', layer:  1, dir:  1 },
      'L':  { axis: 'x', layer: -1, dir:  1 },
      "L'": { axis: 'x', layer: -1, dir: -1 },
      'F':  { axis: 'z', layer:  1, dir: -1 },
      "F'": { axis: 'z', layer:  1, dir:  1 },
      'B':  { axis: 'z', layer: -1, dir:  1 },
      "B'": { axis: 'z', layer: -1, dir: -1 },
    };

    function rotateFace(axis, layer, direction, duration = 250) {
      return new Promise((resolve) => {
        if (isRotating) { resolve(); return; }
        isRotating = true;

        const pivot = new THREE.Group();
        scene.add(pivot);

        const layerCubies = cubies.filter(c =>
          Math.abs(c.position[axis] - layer) < 0.1
        );

        layerCubies.forEach(c => pivot.attach(c));

        const targetAngle = direction * Math.PI / 2;
        const startTime = performance.now();

        function animate() {
          const elapsed = performance.now() - startTime;
          const t = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);

          pivot.rotation[axis] = targetAngle * eased;

          if (t < 1) {
            requestAnimationFrame(animate);
          } else {
            pivot.rotation[axis] = targetAngle;
            layerCubies.forEach(c => scene.attach(c));
            layerCubies.forEach(c => {
              c.position.x = Math.round(c.position.x);
              c.position.y = Math.round(c.position.y);
              c.position.z = Math.round(c.position.z);
            });
            scene.remove(pivot);
            isRotating = false;
            resolve();
          }
        }

        if (duration <= 0) {
          pivot.rotation[axis] = targetAngle;
          layerCubies.forEach(c => scene.attach(c));
          layerCubies.forEach(c => {
            c.position.x = Math.round(c.position.x);
            c.position.y = Math.round(c.position.y);
            c.position.z = Math.round(c.position.z);
          });
          scene.remove(pivot);
          isRotating = false;
          resolve();
        } else {
          animate();
        }
      });
    }

    async function doMove(move, count = true) {
      const m = moveMap[move];
      if (!m || isRotating) return;

      if (count) {
        moveCount++;
        document.getElementById('moveCount').textContent = moveCount;
        startTimer();
        stopAutoRotate();
      }

      await rotateFace(m.axis, m.layer, m.dir);

      if (count) {
        checkSolved();
      }
    }

    // ===== Timer =====
    function startTimer() {
      if (timerStarted) return;
      timerStarted = true;
      timerStart = Date.now();
      timerInterval = setInterval(updateTimer, 100);
    }

    function stopTimer() {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      timerStarted = false;
    }

    function resetTimer() {
      stopTimer();
      document.getElementById('timer').textContent = '00:00';
    }

    function updateTimer() {
      const elapsed = Math.floor((Date.now() - timerStart) / 1000);
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      document.getElementById('timer').textContent =
        `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function stopAutoRotate() {
      if (!firstInteraction) {
        firstInteraction = true;
        controls.autoRotate = false;
      }
    }

    // ===== Solved Check =====
    function checkSolved() {
      if (moveCount === 0) return;
      if (isSolved()) {
        stopTimer();
        showToast('Selamat! Kubus berhasil diselesaikan!', 'success');
      }
    }

    function isSolved() {
      const directions = [
        { axis: 'x', sign: 1, normal: new THREE.Vector3(1, 0, 0) },
        { axis: 'x', sign: -1, normal: new THREE.Vector3(-1, 0, 0) },
        { axis: 'y', sign: 1, normal: new THREE.Vector3(0, 1, 0) },
        { axis: 'y', sign: -1, normal: new THREE.Vector3(0, -1, 0) },
        { axis: 'z', sign: 1, normal: new THREE.Vector3(0, 0, 1) },
        { axis: 'z', sign: -1, normal: new THREE.Vector3(0, 0, -1) },
      ];

      const localNormals = [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1),
      ];

      for (const dir of directions) {
        const colors = new Set();

        for (const cubie of cubies) {
          if (Math.round(cubie.position[dir.axis]) !== dir.sign) continue;

          for (let i = 0; i < 6; i++) {
            const worldNormal = localNormals[i].clone().applyQuaternion(cubie.quaternion);
            if (worldNormal.distanceTo(dir.normal) < 0.1) {
              const c = cubie.material[i].userData.color;
              if (c && c !== 'black') {
                colors.add(c);
              }
              break;
            }
          }
        }

        if (colors.size > 1) return false;
      }

      return true;
    }

    // ===== Scramble =====
    let scrambling = false;

    async function scramble() {
      if (isRotating || scrambling) return;
      scrambling = true;
      showToast('Mengacak kubus...');

      // Reset ke posisi awal
      cubies.forEach((c, i) => {
        c.position.copy(initialStates[i].position);
        c.quaternion.copy(initialStates[i].quaternion);
      });

      const moves = Object.keys(moveMap);
      const length = 25;
      let lastFace = '';

      for (let i = 0; i < length; i++) {
        let move;
        do {
          move = moves[Math.floor(Math.random() * moves.length)];
        } while (move[0] === lastFace);
        lastFace = move[0];

        const m = moveMap[move];
        await rotateFace(m.axis, m.layer, m.dir, 100);
      }

      moveCount = 0;
      document.getElementById('moveCount').textContent = '0';
      resetTimer();
      scrambling = false;
      stopAutoRotate();
      showToast('Kubus diacak! Selamat mencoba!');
    }

    // ===== Reset =====
    function resetCube() {
      if (isRotating || scrambling) return;
      cubies.forEach((c, i) => {
        c.position.copy(initialStates[i].position);
        c.quaternion.copy(initialStates[i].quaternion);
      });
      moveCount = 0;
      document.getElementById('moveCount').textContent = '0';
      resetTimer();
      showToast('Kubus direset!');
    }

    // ===== Drag to Rotate Face =====
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let dragData = null;

    function getNDC(e) {
      const rect = renderer.domElement.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((e.clientY - rect.top) / rect.height) * 2 + 1
      };
    }

    function onPointerDown(e) {
      if (isRotating || scrambling) return;

      const coords = getNDC(e);
      pointer.set(coords.x, coords.y);
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(cubies);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const cubie = hit.object;
        const faceNormal = hit.face.normal.clone();
        faceNormal.transformDirection(cubie.matrixWorld);
        faceNormal.round();

        dragData = {
          cubie,
          faceNormal,
          startX: coords.x,
          startY: coords.y
        };

        controls.enabled = false;
        stopAutoRotate();
      }
    }

    function onPointerUp(e) {
      if (!dragData) {
        controls.enabled = true;
        return;
      }

      const coords = getNDC(e);
      const dx = coords.x - dragData.startX;
      const dy = coords.y - dragData.startY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 0.04) {
        dragData = null;
        controls.enabled = true;
        return;
      }

      // Vektor kamera
      const camRight = new THREE.Vector3();
      const camUp = new THREE.Vector3();
      camera.matrixWorld.extractBasis(camRight, camUp, new THREE.Vector3());

      // Arah drag di world space
      const dragDir = new THREE.Vector3();
      dragDir.addScaledVector(camRight, dx);
      dragDir.addScaledVector(camUp, dy);
      dragDir.normalize();

      // Sumbu rotasi = cross product normal × dragDir
      const rotAxis = new THREE.Vector3().crossVectors(dragData.faceNormal, dragDir);

      const ax = Math.abs(rotAxis.x);
      const ay = Math.abs(rotAxis.y);
      const az = Math.abs(rotAxis.z);

      let axis, layer, direction;

      if (ax > ay && ax > az) {
        axis = 'x';
        layer = Math.round(dragData.cubie.position.x);
        direction = rotAxis.x > 0 ? 1 : -1;
      } else if (ay > az) {
        axis = 'y';
        layer = Math.round(dragData.cubie.position.y);
        direction = rotAxis.y > 0 ? 1 : -1;
      } else {
        axis = 'z';
        layer = Math.round(dragData.cubie.position.z);
        direction = rotAxis.z > 0 ? 1 : -1;
      }

      dragData = null;
      controls.enabled = true;

      moveCount++;
      document.getElementById('moveCount').textContent = moveCount;
      startTimer();

      rotateFace(axis, layer, direction).then(() => checkSolved());
    }

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointercancel', () => {
      dragData = null;
      controls.enabled = true;
    });

    // ===== Button Events =====
    document.querySelectorAll('.face-btn').forEach(btn => {
      btn.addEventListener('click', () => doMove(btn.dataset.move));
    });

    document.getElementById('scrambleBtn').addEventListener('click', scramble);
    document.getElementById('resetBtn').addEventListener('click', resetCube);

    const lockBtn = document.getElementById('lockScrollBtn');
    lockBtn.addEventListener('click', () => {
      document.body.classList.toggle('lock-scroll');
      lockBtn.classList.toggle('active');
      const locked = document.body.classList.contains('lock-scroll');
      showToast(locked ? 'Gulir dikunci' : 'Gulir dibuka');
    });

    // ===== Keyboard =====
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const key = e.key.toUpperCase();
      if (['U', 'D', 'L', 'R', 'F', 'B'].includes(key)) {
        e.preventDefault();
        const move = e.shiftKey ? key + "'" : key;
        doMove(move);
      } else if (key === 'S' && e.shiftKey) {
        e.preventDefault();
        scramble();
      }
    });

    // ===== Toast =====
    const toastEl = document.getElementById('toast');
    let toastTimer = null;

    function showToast(msg, type = '') {
      toastEl.textContent = msg;
      toastEl.className = 'toast show ' + type;
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toastEl.classList.remove('show');
      }, 2800);
    }

    // ===== Resize =====
    function resize() {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    window.addEventListener('resize', resize);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    // ===== Animation Loop =====
    function tick() {
      requestAnimationFrame(tick);
      controls.update();
      renderer.render(scene, camera);
    }
    tick();

    // ===== Welcome =====
    setTimeout(() => showToast('Selamat datang di DyatRubix!'), 600);
  </script>
</body>
  </html>
