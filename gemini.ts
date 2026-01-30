
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTestReport = async (
  testTitle: string,
  score: number,
  maxScore: number,
  lang: Language
) => {
  const prompt = `Generate a psychological/lifestyle report for a test titled "${testTitle}". 
  The user scored ${score} out of ${maxScore}.
  Language: ${lang === Language.RU ? 'Russian' : 'English'}.
  Provide a professional, encouraging, and detailed summary.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            details: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "summary", "details", "recommendations"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      title: testTitle,
      summary: "An error occurred generating the report, but your results are saved.",
      details: ["High energy potential detected.", "Consistency is key."],
      recommendations: ["Maintain current routine.", "Join our Telegram for more tips."]
    };
  }
};

export const analyzeFoodImage = async (base64Image: string, lang: Language) => {
  const prompt = `Analyze this food image and estimate its caloric and nutritional content. 
  Provide a realistic estimation based on standard portion sizes visible.
  Language: ${lang === Language.RU ? 'Russian' : 'English'}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image.split(',')[1] || base64Image
          }
        },
        { text: prompt }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING, description: "Common name of the meal" },
            calories: { type: Type.NUMBER, description: "Estimated total calories" },
            protein: { type: Type.STRING, description: "Protein in grams (e.g. '25g')" },
            carbs: { type: Type.STRING, description: "Carbohydrates in grams" },
            fat: { type: Type.STRING, description: "Fats in grams" },
            healthTip: { type: Type.STRING, description: "A quick advice related to this specific food" }
          },
          required: ["foodName", "calories", "protein", "carbs", "fat", "healthTip"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Food Analysis Error:", error);
    throw error;
  }
};
