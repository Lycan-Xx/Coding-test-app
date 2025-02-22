import { AIProvider, Question, VerificationResult } from "./types";

export class GeminiProvider implements AIProvider {
  name = "Google Gemini";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(prompt: string) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  async generateQuestion(difficulty: string): Promise<Question> {
    try {
      const prompt = `Generate a ${difficulty} coding problem with the following JSON structure:
{
  "title": "Problem title",
  "difficulty": "${difficulty}",
  "description": "Detailed problem description",
  "examples": [{"input": "example input", "output": "example output"}],
  "testCases": [{"input": "test input", "output": "expected output"}]
}`;

      const response = await this.makeRequest(prompt);
      return JSON.parse(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to generate question: ${message}`);
    }
  }

  async verifySubmission(code: string, question: Question): Promise<VerificationResult> {
    try {
      const prompt = `Verify if this code solves the following problem correctly:

Problem: ${question.title}
${question.description}

Test Cases:
${question.testCases.map(test => `Input: ${test.input}\nExpected Output: ${test.output}`).join('\n\n')}

Code:
${code}

Respond with a JSON object:
{
  "correct": boolean,
  "feedback": "detailed feedback"
}`;

      const response = await this.makeRequest(prompt);
      return JSON.parse(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to verify submission: ${message}`);
    }
  }

  async getCodeHint(code: string, question: Question): Promise<string> {
    try {
      const prompt = `The student is trying to solve this problem:
${question.title}
${question.description}

Their current code:
${code}

Provide a helpful hint that guides them toward the solution without giving it away.`;

      return await this.makeRequest(prompt);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to get hint: ${message}`);
    }
  }

  async explainCode(code: string): Promise<string> {
    try {
      const prompt = `Explain this code in detail:\n${code}`;
      return await this.makeRequest(prompt);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to explain code: ${message}`);
    }
  }
}
