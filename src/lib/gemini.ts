import { GoogleGenerativeAI } from "@google/generative-ai";
import { Reading } from "../context/HealthContext";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim() || '';
const genAI = new GoogleGenerativeAI(apiKey);

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export async function getHeartyResponse(message: string, history: ChatMessage[], readings: Reading[]) {
  const readingSummary = readings.length > 0 
    ? `Recent readings: ${readings.slice(0, 5).map(r => `${r.systolic}/${r.diastolic} mmHg at ${new Date(r.timestamp).toLocaleString()}`).join(', ')}.`
    : "No readings logged yet.";

  // The upgraded "Brain" - far more intelligent and conversational
  const sysInstruct = `You are Hearty, a highly intelligent, empathetic, and supportive heart health assistant. YOU ARE NOT A DOCTOR.
  Context: You are talking to "Mum". Her recent readings are: ${readingSummary}
  
  Goal: Provide insightful, conversational, and caring responses. Don't just give generic advice.
  - Acknowledge her specific numbers and feelings. 
  - If she reports an elevated diastolic (like 96), gently suggest she monitors it and rests, rather than giving generic fluff.
  - If she is exhausted, validate her feelings and suggest specific, gentle actions.
  - Ask engaging follow-up questions to keep the conversation natural.
  
  CRITICAL: Never provide medical diagnoses. If systolic >180 or diastolic >120, urge emergency care immediately.`;

  // We pass the system instruction NATIVELY here so it acts as the core persona
  const model = genAI.getGenerativeModel({ 
    model: "gemini-3-flash-preview",
    systemInstruction: sysInstruct
  });

  try {
    const firstUserIndex = history.findIndex(m => m.role === 'user');
    const validHistory = firstUserIndex !== -1 ? history.slice(firstUserIndex) : [];

    const chat = model.startChat({
      history: validHistory.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }],
      })),
      generationConfig: { 
        maxOutputTokens: 800, // This forces the AI to finish its sentences!
        temperature: 0.7 
      },
    });

    // Send only the user message, keeping the chat history clean
    const result = await chat.sendMessage(message);
   const response = await result.response;
    const fullText = response.text();
    console.log("HEARTY RAW RESPONSE:", fullText); // The X-Ray
    return fullText;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having a little trouble connecting right now, but I'm still cheering you on!";
  }
}