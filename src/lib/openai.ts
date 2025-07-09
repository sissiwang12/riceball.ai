// Utility for interacting with OpenAI's API securely with rate limiting and error handling

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Simple in-memory rate limiter
let lastRequestTime = 0;
const RATE_LIMIT_MS = 1000; // 1 request per second

export async function sendMessageToOpenAI(messages: {role: string, content: string}[]) {
  const now = Date.now();
  if (now - lastRequestTime < RATE_LIMIT_MS) {
    throw new Error('You are sending messages too quickly. Please wait a moment.');
  }
  lastRequestTime = now;

  if (!API_KEY) {
    throw new Error('OpenAI API key is not set.');
  }

  // Add a system prompt to instruct the model to reply in no more than 3 sentences
  const systemPrompt = {
    role: 'system',
    content: 'You are a helpful AI therapist. Please reply in no more than 3 sentences.'
  };
  const fullMessages = [systemPrompt, ...messages];

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-nano',
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 150 // Should be enough for 3 sentences
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (error: any) {
    throw new Error(error.message || 'Failed to connect to OpenAI API');
  }
} 