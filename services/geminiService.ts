import { GoogleGenAI, Type } from "@google/genai";
import { InventoryItem, AIAnalysisResult, MediaResource, SalesChannel } from "../types";

// Safely access process.env to prevent crashes in browser environments where process is undefined
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) || '';

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

export interface FinancialSimulationResult extends AIAnalysisResult {
    breakEvenPoint: number; // Quantity
    projectedProfit: number;
    strategicFitScore: number; // 0-100
}

export const runFinancialSimulation = async (
    inventory: InventoryItem,
    media: MediaResource,
    channel: SalesChannel,
    inputs: { sellPrice: number; quantity: number; mediaCost: number }
): Promise<FinancialSimulationResult> => {
    const ai = getAIClient();
    if (!ai) return { recommendation: "No API Key", reasoning: [], riskScore: 0, breakEvenPoint: 0, projectedProfit: 0, strategicFitScore: 0 };

    const prompt = `
    Perform a financial simulation and strategic analysis for a sales campaign.
    
    Item: ${inventory.name} (Category: ${inventory.category}, Cost: ${inventory.costPrice})
    Media Resource: ${media.name} (Type: ${media.type}, Format: ${media.format})
    Sales Channel: ${channel.name} (Type: ${channel.type}, Commission: ${channel.commissionRate * 100}%)
    
    Simulation Parameters:
    - Selling Price: ${inputs.sellPrice}
    - Target Sales Quantity: ${inputs.quantity}
    - Media Budget (Fixed Cost): ${inputs.mediaCost}
    
    Calculate:
    1. Total Revenue = Price * Quantity
    2. Total Cost = (Item Cost * Quantity) + Media Budget + (Revenue * Channel Commission)
    3. Projected Profit = Revenue - Cost
    4. Break-even Quantity = Media Budget / (Price - Item Cost - (Price * Channel Commission))
    
    Analyze:
    1. Is this channel appropriate for this product category?
    2. Is the media type effective for this target audience?
    3. Is the price point competitive?
    
    Return JSON.
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
                        recommendation: { type: Type.STRING, description: "Strategic advice" },
                        reasoning: { type: Type.ARRAY, items: { type: Type.STRING } },
                        riskScore: { type: Type.NUMBER, description: "Financial risk 0-100" },
                        breakEvenPoint: { type: Type.NUMBER, description: "Calculated units to break even" },
                        projectedProfit: { type: Type.NUMBER },
                        strategicFitScore: { type: Type.NUMBER, description: "0-100 score of how well product/media/channel fit together" }
                    }
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("Empty response");
        return JSON.parse(text) as FinancialSimulationResult;
    } catch (error) {
        console.error("Gemini Simulation Error:", error);
        // Fallback calculation if AI fails
        const revenue = inputs.sellPrice * inputs.quantity;
        const varCostPerUnit = inventory.costPrice + (inputs.sellPrice * channel.commissionRate);
        const contributionMargin = inputs.sellPrice - varCostPerUnit;
        const breakEven = contributionMargin > 0 ? inputs.mediaCost / contributionMargin : 99999;
        const totalCost = (inventory.costPrice * inputs.quantity) + inputs.mediaCost + (revenue * channel.commissionRate);
        
        return {
            recommendation: "AI Unavailable - Basic Calculation Only",
            reasoning: ["Network error or API key missing"],
            riskScore: 50,
            breakEvenPoint: Math.ceil(breakEven),
            projectedProfit: revenue - totalCost,
            strategicFitScore: 50
        };
    }
};

export interface PricingStrategyResult {
    suggestedPrice: number;
    priceRange: { min: number; max: number };
    predictedROI: number;
    reasoning: string;
}

export const optimizePricingStrategy = async (
    item: InventoryItem,
    media: MediaResource,
    channel: SalesChannel
): Promise<PricingStrategyResult> => {
    const ai = getAIClient();
    // Simple fallback if no AI available
    if (!ai) {
        const fallbackPrice = item.marketPrice * 0.6;
        const cost = item.costPrice + (fallbackPrice * channel.commissionRate);
        const roi = ((fallbackPrice - cost) / cost) * 100;
        return {
            suggestedPrice: Math.floor(fallbackPrice),
            priceRange: { min: Math.floor(fallbackPrice * 0.9), max: Math.ceil(fallbackPrice * 1.1) },
            predictedROI: parseFloat(roi.toFixed(1)),
            reasoning: "AI Key missing. Calculated based on 60% of market price minus estimated costs."
        };
    }

    const prompt = `
    You are a pricing expert for an Advertising Barter business.
    Goal: Determine the optimal "Channel Bid" (Selling Price) to clear inventory quickly while maximizing ROI.

    Context:
    - Product: ${item.name} (${item.category}, Brand: ${item.brand})
    - Quantity: ${item.quantity}
    - Market Retail Price: ¥${item.marketPrice}
    - Our Sunk Cost (Ad Credits): ¥${item.costPrice}
    - Sales Channel: ${channel.name} (Type: ${channel.type}, Commission: ${(channel.commissionRate * 100).toFixed(0)}%)
    - Supporting Media Exposure: ${media.name} (${media.type}, Rate: ${media.rate})

    Task:
    1. Suggest a specific optimal selling price.
    2. Suggest a reasonable price range.
    3. Calculate estimated ROI = (Selling Price - Cost Price - (Selling Price * Commission)) / Cost Price.
    4. Provide a 1-sentence strategic reasoning suitable for a dashboard display.

    Return JSON.
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
                        suggestedPrice: { type: Type.NUMBER },
                        priceRange: {
                            type: Type.OBJECT,
                            properties: {
                                min: { type: Type.NUMBER },
                                max: { type: Type.NUMBER }
                            }
                        },
                        predictedROI: { type: Type.NUMBER, description: "ROI percentage, e.g. 25.5" },
                        reasoning: { type: Type.STRING }
                    }
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("Empty AI response");
        return JSON.parse(text) as PricingStrategyResult;
    } catch (error) {
        console.error("Pricing Strategy Error:", error);
         const fallbackPrice = item.marketPrice * 0.6;
        return {
            suggestedPrice: fallbackPrice,
            priceRange: { min: fallbackPrice * 0.9, max: fallbackPrice * 1.1 },
            predictedROI: 0,
            reasoning: "Analysis failed due to network error."
        };
    }
}
