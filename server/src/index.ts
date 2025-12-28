import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

// Load environment variables BEFORE importing modules that use them
dotenv.config();

import chatRoutes from "./routes/chat";
import { getLLMProvider } from "./services/llm";

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// Rate Limiting (Security & Cost Control)
// ============================================

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 30, // Max 30 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please slow down and try again in a minute.",
  },
  skip: (req) => req.path === "/health", // Don't rate limit health checks
});

// Stricter limiter for chat messages (LLM calls are expensive)
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 20, // Max 20 messages per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error:
      "Message limit reached. Please wait a moment before sending more messages.",
  },
});

// ============================================
// Middleware
// ============================================

// Build allowed origins from environment
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

// Add production frontend URL if configured
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" })); // Limit body size for security
app.use(apiLimiter); // Apply general rate limiting

// ============================================
// Routes
// ============================================

// Health check endpoint (not rate limited)
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    llmProvider: getLLMProvider(),
    message: `🤖 Running with ${getLLMProvider()}`,
  });
});

// Mount chat routes with stricter rate limiting
app.use("/chat", chatLimiter, chatRoutes);

// ============================================
// Error Handlers
// ============================================

// Global error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ============================================
// Server Startup
// ============================================

app.listen(PORT, () => {
  console.log(
    `🚀 Spur Store Support Server running on http://localhost:${PORT}`
  );
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`🛡️  Rate limiting: 20 messages/min, 30 API calls/min`);
});

export default app;
