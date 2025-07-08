
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onNewEntry: (content: string, mood: number) => void;
}

const ChatInterface = ({ onNewEntry }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm here to listen and support you. How are you feeling today? What's on your mind?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    // Simple AI simulation - in production, this would connect to ChatGPT API
    const responses = [
      "I hear you. It sounds like you're dealing with a lot right now. Can you tell me more about what's making you feel this way?",
      "That's a very valid feeling. Many people experience similar emotions. What do you think might help you feel more balanced?",
      "I appreciate you sharing that with me. It takes courage to be vulnerable. How has this been affecting your daily life?",
      "It sounds like you're being really hard on yourself. What would you say to a friend who was going through the same thing?",
      "I can sense the strength in your words, even when you're struggling. What small step could you take today to care for yourself?",
      "Thank you for trusting me with this. Your feelings are completely valid. What has helped you cope with similar situations before?",
      "I notice you mentioned feeling overwhelmed. Let's break this down together. What feels most manageable to address first?",
      "You're showing real self-awareness by recognizing these patterns. How do you think you've grown since the last time you felt this way?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(input),
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      // Create journal entry from conversation
      const conversationContent = `${input}\n\nTherapist Response: ${aiResponse.text}`;
      onNewEntry(conversationContent, 5); // Default mood of 5, you can add mood selection
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
      <div className="p-4 border-b bg-white/50 backdrop-blur-sm rounded-t-lg">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-600" />
          Your AI Therapist
        </h3>
        <p className="text-sm text-gray-600">A safe space for your thoughts</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/80 text-gray-800 backdrop-blur-sm'
              }`}
            >
              <div className="flex items-start gap-2">
                {message.sender === 'ai' && <Bot className="w-4 h-4 mt-0.5 text-indigo-600" />}
                {message.sender === 'user' && <User className="w-4 h-4 mt-0.5" />}
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl max-w-[80%]">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-600" />
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t bg-white/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind..."
            className="resize-none bg-white/80 backdrop-blur-sm border-gray-200 focus:border-indigo-300"
            rows={2}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;
