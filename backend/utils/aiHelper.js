// utils/aiHelper.js
import { GoogleGenAI } from '@google/genai';
import dotenv from "dotenv"

dotenv.config({path: "../.env"})
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});
const model = process.env.MODEL_NAME;

async function generateContent(prompt) {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt
    })
    return response.text.trim()
}
/**
 * Generate user-facing response
 */
export async function generateUserResponse(rating, reviewText) {
  try {
    const prompt = `You are a customer service representative responding to a review.
    
    Rating: ${rating} stars
    Review: ${reviewText}

    Generate a professional, empathetic response (2-3 sentences max).
    - For 4-5 stars: Thank them warmly
    - For 3 stars: Acknowledge feedback
    - For 1-2 stars: Apologize and offer to help

    Return ONLY the response text.`;

    return await generateContent(prompt);
    } catch (error) {
        console.error('AI Response Error:', error);
        return `Thank you for your ${rating}-star review. We appreciate your feedback.`;
    }
}

/**
 * Generate admin summary
 */
export async function generateAdminSummary(rating, reviewText) {
  try {
    const prompt = `Summarize this review in 1-2 sentences.

    Rating: ${rating} stars
    Review: ${reviewText}

    Return ONLY the summary.`;

    return await generateContent(prompt);
    } catch (error) {
        console.error('AI Summary Error:', error);
        return `${rating}-star review: ${reviewText.substring(0, 100)}...`;
    }
}

/**
 * Generate recommended actions
 */
export async function generateRecommendedActions(rating, reviewText) {
  try {
    const prompt = `Suggest 2-3 actionable recommendations based on this review.

    Rating: ${rating} stars
    Review: ${reviewText}

    Return ONLY a JSON array of strings.
    Example: ["Follow up with customer", "Review procedures"]`;
    
    let text = await generateContent(prompt);
    
    // Clean markdown if present
    if (text.includes('```json')) {
    text = text.split('```json')[1].split('```')[0].trim();
    } else if (text.includes('```')) {
    text = text.split('```')[1].split('```')[0].trim();
    }
    
    const actions = JSON.parse(text);
    return Array.isArray(actions) ? actions : [actions];
    } catch (error) {
        console.error('AI Actions Error:', error);
        // Fallback based on rating
        if (rating <= 2) {
        return ['Contact customer immediately', 'Investigate issue', 'Offer resolution'];
        } else if (rating === 3) {
        return ['Review feedback with team', 'Identify improvements'];
        }
        return ['Maintain standards', 'Thank customer'];
    }
}