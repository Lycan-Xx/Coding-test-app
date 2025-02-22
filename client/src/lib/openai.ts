import OpenAI from "openai";
import { z } from "zod";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.VITE_OPENAI_API_KEY });

const questionSchema = z.object({
  title: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  description: z.string(),
  examples: z.array(z.object({
    input: z.string(),
    output: z.string()
  })),
  testCases: z.array(z.object({
    input: z.string(),
    output: z.string()
  }))
});

type Question = z.infer<typeof questionSchema>;

export async function generateQuestion(difficulty: string): Promise<Question> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert coding problem generator. Create a programming question with test cases."
        },
        {
          role: "user",
          content: `Generate a ${difficulty} coding problem with a title, description, examples, and hidden test cases. Include input/output examples that help explain the problem.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Failed to generate question");
    }

    const parsedQuestion = questionSchema.parse(JSON.parse(content));
    return parsedQuestion;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to generate question: ${message}`);
  }
}

export async function verifySubmission(code: string, question: Question): Promise<{
  correct: boolean;
  feedback: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a code reviewer. Verify if the submitted code solves the given problem correctly and provide detailed feedback."
        },
        {
          role: "user",
          content: `
Question:
${question.title}
${question.description}

Test Cases:
${question.testCases.map(test => `Input: ${test.input}\nExpected Output: ${test.output}`).join('\n\n')}

Submitted Code:
${code}

Evaluate the code and respond with a JSON object containing:
- correct: boolean indicating if the solution passes all test cases
- feedback: detailed explanation of what works and what needs improvement
`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Failed to verify submission");
    }

    const result = JSON.parse(content);
    return {
      correct: result.correct,
      feedback: result.feedback
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to verify submission: ${message}`);
  }
}

export async function getCodeHint(code: string, question: Question): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful coding mentor. Provide a gentle hint without giving away the full solution."
        },
        {
          role: "user",
          content: `
The student is trying to solve this problem:
${question.title}
${question.description}

Their current code:
${code}

Provide a helpful hint that guides them toward the solution without giving it away.`
        }
      ]
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Failed to generate hint");
    }

    return content;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to get hint: ${message}`);
  }
}

export async function explainCode(code: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a code explanation expert. Explain the given code in a clear and concise way."
        },
        {
          role: "user",
          content: `Explain this code in detail:\n${code}`
        }
      ]
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Failed to explain code");
    }

    return content;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to explain code: ${message}`);
  }
}