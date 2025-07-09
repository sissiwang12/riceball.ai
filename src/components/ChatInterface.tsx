
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Bot, User } from 'lucide-react';
import { sendMessageToAI } from '@/lib/chat';

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
      text: "Hi there! I'm Riceball, your personal therapist. I'm here to listen, support you, and help you reflect on your thoughts and feelings. How are you doing today? What's on your mind?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    setError(null);

    try {
      const chatHistory = [
        ...messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
        { role: 'user', content: input }
      ];
      const aiText = await sendMessageToAI(chatHistory);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      const conversationContent = `${input}\n\nTherapist Response: ${aiResponse.text}`;
      onNewEntry(conversationContent, 5);
    } catch (err: any) {
      setIsTyping(false);
      setError(err.message || 'Something went wrong.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Cute girl avatar component
  const RiceballAvatar = () => (
    <div className="w-8 h-8 bg-gradient-to-br from-pink-200 to-purple-300 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
      <span className="text-xs">🌸</span>
    </div>
  );

  return (
    <Card className="h-[600px] flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
      <div className="p-4 border-b bg-white/50 backdrop-blur-sm rounded-t-lg">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <RiceballAvatar />
          Riceball - Your AI Therapist
        </h3>
        <p className="text-sm text-gray-600">A safe, judgment-free space for your thoughts</p>
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
                {message.sender === 'ai' && <RiceballAvatar />}
                {message.sender === 'user' && (
                  <div className="w-6 h-6 bg-indigo-800 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl max-w-[80%]">
              <div className="flex items-center gap-2">
                <RiceballAvatar />
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="px-4 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded mb-2">
            {error}
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
            placeholder="Share what's on your mind... I'm here to listen 💭"
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
