
import { supabase } from "@/integrations/supabase/client";

export async function sendMessageToAI(messages: {role: string, content: string}[]) {
  try {
    const { data, error } = await supabase.functions.invoke('chat-with-ai', {
      body: { messages }
    });

    if (error) {
      throw new Error(error.message || 'Failed to get AI response');
    }

    return data.response;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to connect to AI service');
  }
}
