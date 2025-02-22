import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  settings: jsonb("settings").$type<{
    theme: "dark" | "light";
    difficulty: "easy" | "medium" | "hard";
    language: string;
    aiModel: string;
  }>(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  question: text("question").notNull(),
  code: text("code").notNull(),
  result: boolean("result").notNull(),
  feedback: text("feedback").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  settings: true,
});

export const insertSubmissionSchema = createInsertSchema(submissions);

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
