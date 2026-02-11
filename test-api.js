// 简单的 API 测试脚本
const apiKey = "a8ef99fcac3247de8537ef6d79fa0efb.ufFpuwNjW2L6iBya";

async function testApi() {
  console.log("Testing Zhipu AI API...");
  console.log("API Key:", apiKey);
  
  const requestBody = {
    model: "glm-4-flash",
    messages: [
      {
        role: "user",
        content: "Generate 2 elementary school level English vocabulary quiz questions. The target audience is Chinese elementary students. Each question presents an English word, and the user must choose the correct Chinese meaning. Include an example sentence using the word. Return the result as a JSON array with the following structure for each question: {\"word\": string, \"pronunciation\": string (optional), \"options\": string[], \"correctAnswerIndex\": number, \"exampleSentence\": string}"
      }
    ],
    temperature: 0.7
  };

  try {
    console.log("Sending request...");
    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log("Response status:", response.status, response.statusText);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      return;
    }

    const data = await response.json();
    console.log("API Response:", JSON.stringify(data, null, 2));
    
    if (data.choices && data.choices.length > 0) {
      const content = data.choices[0].message?.content;
      console.log("AI Content:", content);
      
      // 提取 JSON
      const jsonMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        const quizData = JSON.parse(jsonMatch[0]);
        console.log("Parsed Quiz Data:", quizData);
      } else {
        console.error("No JSON found in response");
      }
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
}

testApi();
