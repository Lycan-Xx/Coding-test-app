import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  settings: jsonb("settings").$type(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  question: text("question").notNull(),
  code: text("code").notNull(),
  result: boolean("result").notNull(),
  feedback: text("feedback").notNull(),
});

export const insertSubmissionSchema = createInsertSchema(submissions);
