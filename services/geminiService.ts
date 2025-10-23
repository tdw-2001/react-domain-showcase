import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
    console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const getAi = (): GoogleGenAI => {
    if (!ai) {
        throw new Error("Gemini API key not configured. This feature is disabled.");
    }
    return ai;
};

const callApi = async (prompt: string, model: string = "gemini-2.5-flash", config: any = {}) => {
    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          ...config,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "An error occurred while communicating with the AI. Please try again later.";
    }
};

export const generateDataInsights = async (chartData: any[]): Promise<string> => {
    const prompt = `You are a senior data analyst. Based on the following JSON data representing quarterly performance, provide a brief, insightful analysis with 2-3 key takeaways in bullet points. Data: ${JSON.stringify(chartData)}`;
    return callApi(prompt);
};

export const generateBlogPost = async (topic: string): Promise<{ title: string; content: string }> => {
    const prompt = `Generate a short blog post about "${topic}". The post should be engaging and informative for a general audience.`;
    const config = {
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    content: { type: Type.STRING },
                },
                required: ["title", "content"],
            },
        }
    };
    try {
        const responseText = await callApi(prompt, "gemini-2.5-flash", config);
        return JSON.parse(responseText);
    } catch (error) {
        console.error("Error generating or parsing blog post:", error);
        return { title: "Error", content: "Could not generate blog post content." };
    }
};


export const generateConfiguratorDescription = async (config: { color: string, shape: string }): Promise<string> => {
  const prompt = `Generate a short, punchy, and enticing marketing description for a futuristic product. The product is a ${config.shape} and its primary color is ${config.color}. Focus on innovation, luxury, and the feeling it evokes. Maximum 3 sentences.`;
  return callApi(prompt);
};