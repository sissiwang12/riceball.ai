
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatInterface from '@/components/ChatInterface';
import MoodTracker from '@/components/MoodTracker';
import JournalEntries, { JournalEntry } from '@/components/JournalEntries';
import Analytics from '@/components/Analytics';
import { MessageCircle, BookOpen, BarChart3, Heart } from 'lucide-react';

const Index = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentMood, setCurrentMood] = useState(3);

  const handleNewEntry = (content: string, mood: number) => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date(),
      content,
      mood,
    };
    setEntries(prev => [...prev, newEntry]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AI Therapy Journal
          </h1>
          <p className="text-gray-600 text-lg">Your personal space for growth, reflection, and healing</p>
        </div>

        {/* Mood Tracker */}
        <div className="mb-8">
          <MoodTracker selectedMood={currentMood} onMoodChange={setCurrentMood} />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/80 backdrop-blur-sm shadow-lg">
            <TabsTrigger value="chat" className="flex items-center gap-2 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">
              <MessageCircle className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex items-center gap-2 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700">
              <BookOpen className="w-4 h-4" />
              Journal
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <ChatInterface onNewEntry={(content) => handleNewEntry(content, currentMood)} />
          </TabsContent>

          <TabsContent value="journal" className="space-y-6">
            <JournalEntries entries={entries} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Analytics entries={entries} />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p className="flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            A safe space for your mental health journey
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
