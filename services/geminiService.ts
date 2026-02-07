
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuizFromText = async (text: string, title: string): Promise<Question[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a 5-question multiple choice mock test based on the following lecture notes. 
    Notes: ${text.slice(0, 10000)}`, // Limit text to avoid token overflow
    config: {
      systemInstruction: "You are an expert educator. Create challenging but fair multiple-choice questions. Each question must have exactly 4 options. Provide a clear explanation for the correct answer.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Array of exactly 4 choices"
            },
            correctAnswerIndex: { 
              type: Type.INTEGER,
              description: "Zero-based index of the correct answer"
            },
            explanation: { type: Type.STRING }
          },
          required: ["id", "question", "options", "correctAnswerIndex", "explanation"]
        }
      }
    }
  });

  const jsonStr = response.text;
  if (!jsonStr) throw new Error("Failed to generate quiz content");
  
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("JSON Parse Error:", jsonStr);
    throw new Error("Invalid response format from AI");
  }
};
