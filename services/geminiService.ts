import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SummaryResult, MindMapNode, TimelineItem } from "../types";

// Define the response schema for structured JSON output
const timelineItemSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    timestamp: { type: Type.STRING, description: "Time format MM:SS" },
    title: { type: Type.STRING },
    description: { type: Type.STRING },
  },
  required: ["timestamp", "title", "description"],
};

const mindMapNodeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    children: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT, // Recursive definition workaround roughly
        properties: {
            name: { type: Type.STRING },
            children: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING }
                    }
                }
            }
        }
      },
    },
  },
  required: ["name"],
};

const summaryResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    overview: { type: Type.STRING, description: "A high-level executive summary" },
    structuredSummary: { type: Type.STRING, description: "A markdown formatted detailed summary with headers" },
    keyPoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    timeline: {
      type: Type.ARRAY,
      items: timelineItemSchema,
    },
    mindMap: mindMapNodeSchema,
  },
  required: ["title", "overview", "structuredSummary", "keyPoints", "timeline", "mindMap"],
};

export const generateSummary = async (
  transcript: string,
  conciseness: number
): Promise<SummaryResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Map conciseness (0-100) to prompt instructions
  let concisenessInstruction = "";
  if (conciseness < 30) {
    concisenessInstruction = "Create a highly detailed, comprehensive summary covering almost all aspects of the transcript. Do not miss small details.";
  } else if (conciseness < 70) {
    concisenessInstruction = "Create a balanced summary. Focus on the main concepts and supporting arguments, omitting minor fluff.";
  } else {
    concisenessInstruction = "Create an extremely concise, bullet-point focused summary. Only the absolute most critical takeaways.";
  }

  const prompt = `
    You are an expert content synthesizer. 
    Analyze the following video transcript and generate a structured summary document.
    
    Transcript:
    ${transcript}

    Configuration:
    Conciseness Level: ${conciseness}/100.
    Instruction: ${concisenessInstruction}

    Output Requirements:
    1. Title: A catchy title for the content.
    2. Overview: A 2-3 sentence hook/summary.
    3. Structured Summary: Use Markdown headers (##) and bullet points.
    4. Key Points: A list of 5-7 actionable takeaways.
    5. Timeline: Key moments with timestamps.
    6. Mind Map: A hierarchical JSON structure (root -> main topics -> subtopics) representing the knowledge graph of the video. Depth should correspond to conciseness (deeper for low conciseness).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: summaryResponseSchema,
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster standard tasks, enable if reasoning needed
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response from Gemini");
    }

    const data = JSON.parse(jsonText) as SummaryResult;
    return data;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
