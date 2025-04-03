import express from "express";
import { config } from "dotenv";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import { OpenAI } from 'openai';

// Load environment variables from .env file
config();

async function main() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  const apiKey = process.env.OPENAI_API_KEY;
  const openai = new OpenAI({ apiKey: apiKey });

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }

        log(logLine);
      }
    });

    next();
  });

  const server = await registerRoutes(app);

  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = process.env.PORT || 5000;
  server.listen(port, 'localhost')
    .on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    })
    .on('listening', () => {
      log(`serving on port ${port}`);
    });
}

main().catch((error) => {
  console.error('Server failed to start:', error);
  process.exit(1);
});
