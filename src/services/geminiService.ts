import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface MarketAdvice {
  crop: string;
  suggestedPrice: string;
  bestDayToSell: string;
  reasoning: string;
  marketTrends: string;
  sources: { title: string; uri: string }[];
}

export async function getMarketAdvice(farmerInput: string): Promise<MarketAdvice | string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `A farmer says: "${farmerInput}". 
      Act as a professional agricultural market negotiator for JabaAi, specializing EXCLUSIVELY in Miraa and Muguka (khat) from Meru and surrounding regions.
      
      Analyze current market trends for Miraa and Muguka using Google Search, focusing on regional transparency (e.g., prices in Maua, Meru, Nairobi, and export markets).
      
      Provide a "One-Stop-Shop" response:
      1. Suggested fair price (range per bunch/bag).
      2. Best day to sell in the next 7 days.
      3. Region-specific guidance (localized trends in Meru/Embu/Nairobi).
      4. Crop health tip (brief advice on keeping Miraa/Muguka fresh).
      5. Market outlook (bullish/bearish).
      
      If the input is not related to Miraa or Muguka, politely inform the farmer that JabaAi currently only supports Miraa and Muguka negotiations.
      Respond in a structured JSON format.
      JSON structure: { 
        "crop": "Miraa or Muguka", 
        "suggestedPrice": "price range", 
        "bestDayToSell": "date/day", 
        "reasoning": "localized trend details", 
        "marketTrends": "general outlook",
        "healthTip": "freshness/health advice"
      }`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    try {
      const parsed = JSON.parse(text);
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.filter(chunk => chunk.web)
        .map(chunk => ({ title: chunk.web!.title, uri: chunk.web!.uri })) || [];
      
      return { ...parsed, sources };
    } catch (e) {
      return text;
    }
  } catch (error) {
    console.error("Error getting market advice:", error);
    return "I'm sorry, I'm having trouble connecting to the market data right now. Please try again in a moment.";
  }
}

export async function speakAdvice(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const binary = atob(base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'audio/pcm;rate=24000' });
      
      // For PCM 24000, we need to use AudioContext to play it properly or convert to WAV
      // Simpler for now: use a basic AudioContext playback
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await blob.arrayBuffer();
      
      // PCM 16-bit Little Endian
      const float32Data = new Float32Array(arrayBuffer.byteLength / 2);
      const view = new DataView(arrayBuffer);
      for (let i = 0; i < float32Data.length; i++) {
        float32Data[i] = view.getInt16(i * 2, true) / 32768;
      }
      
      const audioBuffer = audioCtx.createBuffer(1, float32Data.length, 24000);
      audioBuffer.getChannelData(0).set(float32Data);
      
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start();
    }
  } catch (error) {
    console.error("Error speaking advice:", error);
  }
}
