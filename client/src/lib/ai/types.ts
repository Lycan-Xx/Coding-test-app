export interface AIProvider {
  name: string;
  generateQuestion: (difficulty: string) => Promise<Question>;
  verifySubmission: (code: string, question: Question) => Promise<VerificationResult>;
  getCodeHint: (code: string, question: Question) => Promise<string>;
  explainCode: (code: string) => Promise<string>;
}

export interface Question {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  examples: Array<{
    input: string;
    output: string;
  }>;
  testCases: Array<{
    input: string;
    output: string;
  }>;
}

export interface VerificationResult {
  correct: boolean;
  feedback: string;
}
