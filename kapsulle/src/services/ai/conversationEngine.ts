import Groq from "groq-sdk";

// Ensure the API key is available
const apiKey = import.meta.env.VITE_GROQ_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GROQ_API_KEY is not defined in your .env.local file");
}

const groq = new Groq({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true, // This is required for client-side usage
});

// CORRECTED: Added 'system' to the possible roles for type safety
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// The system prompt defines the AI's personality, based on your Vision.md
const systemPrompt = `You are Kapsulle, a wise, empathetic, and curious companion. Your purpose is to help someone create a meaningful time capsule of who they are *right now*. 
- Your tone is warm, gentle, and encouraging, like a wise friend.
- Ask one thoughtful, open-ended question at a time. Never ask multiple questions in one response.
- Start with easy, warm-up questions and gradually go deeper.
- Your questions should explore the user's current life, their values, dreams, fears, and hopes for the future.
- Keep your responses concise. Your main job is to ask the next great question.
- Do not use emojis. Your personality is conveyed through your thoughtful words.
- Your first message should be a welcoming question to start the conversation.`;

export async function getInitialMessage(): Promise<Message> {
  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "system", content: systemPrompt }],
    model: "llama3-8b-8192", // Or "mixtral-8x7b-32768"
    temperature: 0.9,
    max_tokens: 100,
  });

  const content = chatCompletion.choices[0]?.message?.content || "Let's begin. What's bringing you joy this week?";
  return { role: 'assistant', content };
}

export async function getNextMessage(history: Message[]): Promise<Message> {
  // FIXED: The incorrect type annotation has been removed from this line.
  // TypeScript will now correctly infer the type.
  const messagesWithSystemPrompt = [
    { role: "system" as const, content: systemPrompt },
    ...history,
  ];

  const chatCompletion = await groq.chat.completions.create({
    messages: messagesWithSystemPrompt,
    model: "llama3-8b-8192",
    temperature: 0.9,
    max_tokens: 100,
  });

  const content = chatCompletion.choices[0]?.message?.content || "That's interesting. Tell me more about what's on your mind.";
  return { role: 'assistant', content };
}