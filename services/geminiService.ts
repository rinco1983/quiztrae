import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuizQuestions = async (): Promise<QuizQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 10 elementary school level English vocabulary quiz questions. The target audience is Chinese elementary students. Each question presents an English word, and the user must choose the correct Chinese meaning. Include an example sentence using the word.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: {
                type: Type.STRING,
                description: "The English vocabulary word (e.g., Apple, Run, Beautiful).",
              },
              pronunciation: {
                type: Type.STRING,
                description: "IPA pronunciation or phonetic spelling (optional).",
              },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of 4 Chinese meanings. One correct, three distractors.",
              },
              correctAnswerIndex: {
                type: Type.INTEGER,
                description: "The index (0-3) of the correct option.",
              },
              exampleSentence: {
                type: Type.STRING,
                description: "A simple English sentence using the word.",
              },
            },
            required: ["word", "options", "correctAnswerIndex", "exampleSentence"],
          },
        },
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      // Validate array length and content basics
      if (Array.isArray(data) && data.length > 0) {
        return data as QuizQuestion[];
      }
    }
    throw new Error("Invalid data structure received from AI");
  } catch (error) {
    console.error("Failed to generate quiz:", error);
    throw error;
  }
};