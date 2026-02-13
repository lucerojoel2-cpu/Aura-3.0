
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MODELS } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Always use the process.env.API_KEY directly as per SDK guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateText(prompt: string, options: { model?: string, systemInstruction?: string, search?: boolean } = {}) {
    const response = await this.ai.models.generateContent({
      model: options.model || MODELS.FLASH,
      contents: prompt,
      config: {
        systemInstruction: options.systemInstruction,
        // Only use googleSearch tool if search is explicitly enabled
        tools: options.search ? [{ googleSearch: {} }] : undefined
      }
    });
    return response;
  }

  async analyzeImage(prompt: string, base64Image: string, mimeType: string) {
    const response = await this.ai.models.generateContent({
      model: MODELS.FLASH,
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType } },
          { text: prompt }
        ]
      }
    });
    // Correctly accessing .text property instead of method
    return response.text;
  }

  getLiveConnection(callbacks: any, config: any) {
    return this.ai.live.connect({
      model: MODELS.LIVE,
      callbacks,
      config
    });
  }
}

export const gemini = new GeminiService();
