// app/api/suggest-messages/route.ts

import { NextRequest } from "next/server";

const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function POST(_req: NextRequest) {
  try {
    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be seperated by '||'. These questions are for an anonymous social messaging platform, like Qoo.me, and should be suitable for diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

    const apiKey = process.env.GEMINI_API_KEY;

    // Making the POST request to the API using `fetch`
    const res = await fetch(`${API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    // Handling unsuccessful responses
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Gemini API Error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate content" }),
        {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parsing response from Gemini API
    const data = await res.json();
    const rawText: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Split the output string by '||' and clean it up
    const suggestions = rawText
      .split("||")
      .map((q) => q.trim())
      .filter(Boolean)
      .slice(0, 3); // Limit to 3 questions

    return new Response(JSON.stringify({ suggestions }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
