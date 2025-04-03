export class MemStorage {
  constructor() {
    this.users = new Map();
    this.submissions = new Map();
    this.currentUserId = 1;
    this.currentSubmissionId = 1;
  }

  async getUser(id) {
    return this.users.get(id);
  }

  async createUser(insertUser) {
    const id = this.currentUserId++;
    const defaultSettings = {
      theme: "dark",
      difficulty: "easy",
      language: "javascript",
      aiModel: "gpt-4o",
    };

    const user = {
      id,
      username: insertUser.username,
      settings: insertUser.settings || defaultSettings,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserSettings(id, settings) {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");

    const updatedUser = { ...user, settings };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createSubmission(submission) {
    const id = this.currentSubmissionId++;
    const newSubmission = {
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

  async getSubmissions(userId) {
    return Array.from(this.submissions.values()).filter(
      (sub) => sub.userId === userId
    );
  }
}

export const storage = new MemStorage();
