import { GoogleGenAI, Type } from "@google/genai";
import { InventoryItem, AIAnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize specific model instances based on task
const getAIClient = () => {
    if (!apiKey) {
        console.warn("API_KEY is not set. Mocking or failing gracefully.");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

export const analyzePricing = async (item: InventoryItem): Promise<AIAnalysisResult> => {
    const ai = getAIClient();
    if (!ai) {
        // Fallback mock for demo if no key
        return {
            recommendation: "API Key Missing",
            reasoning: ["Please provide a valid Gemini API Key to get real analysis."],
            suggestedPriceRange: { min: item.marketPrice * 0.8, max: item.marketPrice * 0.95 }
        };
    }

    const prompt = `
    Analyze the pricing strategy for the following inventory item obtained through an advertising barter deal:
    Product: ${item.name}
    Brand: ${item.brand}
    Category: ${item.category}
    Market Retail Price: $${item.marketPrice}
    Effective Cost (Ad Credits): $${item.costPrice}
    Current Quantity: ${item.quantity}

    Provide a pricing recommendation to maximize liquidity while maintaining brand value.
    Return JSON format.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recommendation: { type: Type.STRING },
                        reasoning: { 
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        suggestedPriceRange: {
                            type: Type.OBJECT,
                            properties: {
                                min: { type: Type.NUMBER },
                                max: { type: Type.NUMBER }
                            }
                        },
                        riskScore: { type: Type.NUMBER, description: "Risk score from 0 (safe) to 100 (risky)" }
                    }
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        return JSON.parse(text) as AIAnalysisResult;

    } catch (error) {
        console.error("Gemini Pricing Analysis Error:", error);
        return {
            recommendation: "Error in analysis",
            reasoning: ["Failed to connect to AI service."],
            riskScore: 0
        };
    }
};

export const assessRisk = async (inventoryTotalValue: number, mediaExposure: number, channelCount: number): Promise<AIAnalysisResult> => {
    const ai = getAIClient();
    if (!ai) return { recommendation: "No API Key", reasoning: [], riskScore: 0 };

    const prompt = `
    Perform a risk assessment for an advertising barter business with these metrics:
    Total Inventory Value: $${inventoryTotalValue}
    Media Exposure Value: $${mediaExposure}
    Active Sales Channels: ${channelCount}

    Identify potential liquidity risks and channel dependency risks.
    `;

    try {
         const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recommendation: { type: Type.STRING },
                        reasoning: { 
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        riskScore: { type: Type.NUMBER }
                    }
                }
            }
        });
        const text = response.text;
        if(!text) throw new Error("Empty response");
        return JSON.parse(text) as AIAnalysisResult;
    } catch (error) {
         console.error("Gemini Risk Assessment Error:", error);
         return { recommendation: "Error", reasoning: [], riskScore: 50 };
    }
};
