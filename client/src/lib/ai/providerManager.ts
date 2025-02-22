import { AIProvider } from "./types";
import { OpenAIProvider } from "./openai";
import { GeminiProvider } from "./gemini";

class AIProviderManager {
  private providers: Map<string, AIProvider> = new Map();
  private activeProvider: AIProvider | null = null;

  constructor() {
    // Initialize OpenAI provider if API key is available
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (openaiKey) {
      const openai = new OpenAIProvider();
      this.providers.set(openai.name, openai);
      this.activeProvider = openai;
    }

    // Initialize Gemini provider if API key is available
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (geminiKey) {
      const gemini = new GeminiProvider(geminiKey);
      this.providers.set(gemini.name, gemini);
      if (!this.activeProvider) {
        this.activeProvider = gemini;
      }
    }
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  setActiveProvider(name: string) {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`AI provider '${name}' not found`);
    }
    this.activeProvider = provider;
  }

  getActiveProvider(): AIProvider {
    if (!this.activeProvider) {
      throw new Error("No AI provider available");
    }
    return this.activeProvider;
  }
}

export const aiProviderManager = new AIProviderManager();
