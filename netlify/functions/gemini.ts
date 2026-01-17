
import { GoogleGenAI } from "@google/genai";

// This is a server-side file. `process.env` is secure here.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// This is the main Netlify function handler
export default async (request: Request) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    
    // We expect the frontend to send the model, contents, and config
    const { model, contents, config } = body;
    
    if (!model || !contents) {
        return new Response('Missing model or contents in request body', { status: 400 });
    }

    const response = await ai.models.generateContent({
        model,
        contents,
        config
    });

    // Send the response from Gemini back to our frontend
    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
