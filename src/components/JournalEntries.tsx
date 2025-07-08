
import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Calendar, Heart } from 'lucide-react';

export interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  mood: number;
}

interface JournalEntriesProps {
  entries: JournalEntry[];
}

const JournalEntries = ({ entries }: JournalEntriesProps) => {
  const getMoodColor = (mood: number) => {
    const colors = {
      1: 'text-red-500 bg-red-50',
      2: 'text-orange-500 bg-orange-50',
      3: 'text-yellow-500 bg-yellow-50',
      4: 'text-green-500 bg-green-50',
      5: 'text-emerald-500 bg-emerald-50',
    };
    return colors[mood as keyof typeof colors] || 'text-gray-500 bg-gray-50';
  };

  const getMoodLabel = (mood: number) => {
    const labels = {
      1: 'Very Sad',
      2: 'Sad',
      3: 'Neutral',
      4: 'Happy',
      5: 'Very Happy',
    };
    return labels[mood as keyof typeof labels] || 'Unknown';
  };

  return (
    <Card className="h-[600px] bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
      <div className="p-4 border-b bg-white/50 backdrop-blur-sm rounded-t-lg">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          Journal Entries
        </h3>
        <p className="text-sm text-gray-600">{entries.length} entries recorded</p>
      </div>
      
      <ScrollArea className="h-[520px] p-4">
        <div className="space-y-4">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No journal entries yet.</p>
              <p className="text-sm text-gray-400">Start a conversation to create your first entry!</p>
            </div>
          ) : (
            entries.map((entry) => (
              <Card key={entry.id} className="p-4 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {entry.date.toLocaleDateString()} at {entry.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getMoodColor(entry.mood)}`}>
                    <Heart className="w-3 h-3" />
                    {getMoodLabel(entry.mood)}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                  {entry.content.length > 200 ? `${entry.content.substring(0, 200)}...` : entry.content}
                </p>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default JournalEntries;
