import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertSubmissionSchema } from "@shared/schema";
import OpenAI from "openai";
import { config } from "dotenv";

// Load environment variables
config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY environment variable");
  process.exit(1);
}

console.log("OpenAI API Key:", process.env.OPENAI_API_KEY);

export async function registerRoutes(app: Express) {
	const httpServer = createServer(app);

	app.post("/api/submissions", async (req, res) => {
		try {
			const submission = insertSubmissionSchema.parse(req.body);

			const verificationResponse = await openai.chat.completions.create({
				model: "gpt-4o",
				messages: [
					{
						role: "system",
						content: "You are a code verification expert. Verify if the submitted code solves the given problem correctly.",
					},
					{
						role: "user",
						content: `Question: ${submission.question}\nCode:\n${submission.code}`,
					},
				],
				response_format: { type: "json_object" },
			});

			const content = verificationResponse.choices[0].message.content;
			if (!content) {
				throw new Error("Failed to get AI response");
			}

			const result = JSON.parse(content);
			const storedSubmission = await storage.createSubmission({
				...submission,
				result: result.correct,
				feedback: result.feedback,
				userId: null, // Since we don't have auth yet
			});

			res.json(storedSubmission);
		} catch (error) {
			const message = error instanceof Error ? error.message : "An unknown error occurred";
			res.status(400).json({ message });
		}
	});

	app.post("/api/settings", async (req, res) => {
		try {
			// In a real app, we'd get the user ID from the session
			const userId = 1;
			const settings = req.body;

			await storage.updateUserSettings(userId, settings);
			res.json({ success: true });
		} catch (error) {
			const message = error instanceof Error ? error.message : "An unknown error occurred";
			res.status(400).json({ message });
		}
	});

	return httpServer;
}