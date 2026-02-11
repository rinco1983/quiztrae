import { QuizQuestion } from "../types";

// 使用环境变量获取 API 密钥
// @ts-ignore - Vite environment variable
const apiKey = import.meta.env?.VITE_ZHIPUAI_API_KEY;
console.log("API Key loaded:", apiKey ? "Yes" : "No");

if (!apiKey) {
  console.error("Error: VITE_ZHIPUAI_API_KEY is not set");
  throw new Error("API key is required");
}

interface ChatRequest {
  model: string;
  messages: {
    role: string;
    content: string;
  }[];
  temperature: number;
}

interface ChatResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export const generateQuizQuestions = async (): Promise<QuizQuestion[]> => {
  try {
    console.log("Generating quiz questions...");
    console.log("API Key configured:", !!apiKey);
    
    const requestBody: ChatRequest = {
      model: "glm-4-flash", // 尝试使用不同的模型
      messages: [
        {
          role: "user",
          content: "Generate 10 elementary school level English vocabulary quiz questions. The target audience is Chinese elementary students. Each question presents an English word, and the user must choose the correct Chinese meaning. Include an example sentence using the word. Return the result as a JSON array with the following structure for each question: {\"word\": string, \"pronunciation\": string (optional), \"options\": string[], \"correctAnswerIndex\": number, \"exampleSentence\": string}"
        }
      ],
      temperature: 0.7
    };
    console.log("Request body:", JSON.stringify(requestBody, null, 2));

    console.log("Sending API request...");
    // 使用正确的 API 端点
    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log("API response status:", response.status, response.statusText);
    
    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.error("API error details:", errorData);
        throw new Error(`API request failed: ${errorData.error?.message || response.statusText}`);
      } catch (jsonError) {
        console.error("Failed to parse error response:", jsonError);
        throw new Error(`API request failed: ${response.statusText}`);
      }
    }

    console.log("Parsing API response...");
    const data: ChatResponse = await response.json();
    console.log("API response received:", JSON.stringify(data, null, 2));

    if (data.choices && data.choices.length > 0) {
      const content = data.choices[0].message?.content;
      if (content) {
        console.log("AI response content:", content);
        
        // 提取 JSON 部分（处理 Markdown 代码块格式）
        console.log("Raw content:", content);
        let jsonContent = content;
        
        // 移除 Markdown 代码块标记
        if (content.includes('```json')) {
          jsonContent = content.replace(/```json\n|\n```/g, '');
        } else if (content.includes('```')) {
          jsonContent = content.replace(/```\n|\n```/g, '');
        }
        
        console.log("Extracted JSON content:", jsonContent);
        
        try {
          const quizData = JSON.parse(jsonContent);
          if (Array.isArray(quizData) && quizData.length > 0) {
            console.log("Generated quiz questions:", quizData.length);
            return quizData as QuizQuestion[];
          } else {
            throw new Error("Invalid quiz data format: not an array or empty");
          }
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
          throw new Error(`Failed to parse JSON: ${errorMessage}`);
        }
      } else {
        throw new Error("Invalid data structure: no message content");
      }
    } else {
      throw new Error("Invalid data structure: no choices");
    }
  } catch (error) {
    console.error("Failed to generate quiz:", error);
    throw error;
  }
};
