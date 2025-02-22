import {
  type User,
  type InsertUser,
  type Submission,
  type InsertSubmission,
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserSettings(id: number, settings: User["settings"]): Promise<User>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmissions(userId: number): Promise<Submission[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private submissions: Map<number, Submission>;
  private currentUserId: number;
  private currentSubmissionId: number;

  constructor() {
    this.users = new Map();
    this.submissions = new Map();
    this.currentUserId = 1;
    this.currentSubmissionId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const defaultSettings = {
      theme: "dark" as const,
      difficulty: "easy" as const,
      language: "javascript",
      aiModel: "gpt-4o",
    };

    const user: User = {
      id,
      username: insertUser.username,
      settings: insertUser.settings || defaultSettings,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserSettings(id: number, settings: User["settings"]): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");

    const updatedUser = { ...user, settings };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const id = this.currentSubmissionId++;
    const newSubmission: Submission = {
      id,
      userId: submission.userId ?? null,
      question: submission.question,
      code: submission.code,
      result: submission.result,
      feedback: submission.feedback,
    };
    this.submissions.set(id, newSubmission);
    return newSubmission;
  }

  async getSubmissions(userId: number): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(
      (sub) => sub.userId === userId
    );
  }
}

export const storage = new MemStorage();