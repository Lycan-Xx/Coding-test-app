import express, { type Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { OpenAI } from 'openai';

// Load environment variables from .env file
config();

async function main() {
	const app = express();
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));

	// Retrieve your API key from a secure location
	const apiKey = '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';

	// Instantiate the OpenAI client with the API key
	const openai = new OpenAI(apiKey);

	app.use((req, res, next) => {
		const start = Date.now();
		const path = req.path;
		let capturedJsonResponse: Record<string, any> | undefined = undefined;

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

	app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
		const status = err.status || err.statusCode || 500;
		const message = err.message || "Internal Server Error";

		res.status(status).json({ message });
		throw err;
	});

	// importantly only setup vite in development and after
	// setting up all the other routes so the catch-all route
	// doesn't interfere with the other routes
	if (app.get("env") === "development") {
		await setupVite(app, server);
	} else {
		serveStatic(app);
	}

	// ALWAYS serve the app on port 5000
	// this serves both the API and the client
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
