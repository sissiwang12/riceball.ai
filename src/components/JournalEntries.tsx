
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, Heart, ChevronDown, ChevronRight, Plus, Tag } from 'lucide-react';

export interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  mood: number;
  title?: string;
  summary?: string;
  category?: string;
}

interface JournalEntriesProps {
  entries: JournalEntry[];
}

const defaultCategories = [
  'Deep Reflections',
  'Random Thoughts', 
  'Stress Dump / Rants',
  'Gratitude Moments',
  'Therapy Breakthroughs',
  'Daily Check-in'
];

const categoryColors = {
  'Deep Reflections': 'bg-purple-100 text-purple-800',
  'Random Thoughts': 'bg-blue-100 text-blue-800',
  'Stress Dump / Rants': 'bg-red-100 text-red-800',
  'Gratitude Moments': 'bg-green-100 text-green-800',
  'Therapy Breakthroughs': 'bg-yellow-100 text-yellow-800',
  'Daily Check-in': 'bg-gray-100 text-gray-800',
};

const JournalEntries = ({ entries }: JournalEntriesProps) => {
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const generateSummary = (content: string) => {
    // Simple summary generation - in real app, this would use AI
    const firstSentence = content.split('.')[0];
    return firstSentence.length > 100 ? firstSentence.substring(0, 100) + '...' : firstSentence + '.';
  };

  const generateTitle = (content: string) => {
    // Simple title generation - in real app, this would use AI
    const keywords = content.toLowerCase().match(/\b(worry|stress|happy|sad|grateful|breakthrough|anxious|excited|tired|hopeful)\w*/g);
    if (keywords && keywords.length > 0) {
      return `Thoughts on ${keywords[0]}`;
    }
    return 'Daily reflection';
  };

  const assignCategory = (content: string) => {
    // Simple category assignment - in real app, this would use AI
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('grateful') || lowerContent.includes('thankful')) return 'Gratitude Moments';
    if (lowerContent.includes('stress') || lowerContent.includes('angry') || lowerContent.includes('frustrated')) return 'Stress Dump / Rants';
    if (lowerContent.includes('breakthrough') || lowerContent.includes('realized') || lowerContent.includes('understand')) return 'Therapy Breakthroughs';
    if (lowerContent.includes('random') || lowerContent.includes('thinking')) return 'Random Thoughts';
    if (lowerContent.includes('deep') || lowerContent.includes('meaning') || lowerContent.includes('purpose')) return 'Deep Reflections';
    return 'Daily Check-in';
  };

  const processedEntries = entries.map(entry => ({
    ...entry,
    title: entry.title || generateTitle(entry.content),
    summary: entry.summary || generateSummary(entry.content),
    category: entry.category || assignCategory(entry.content)
  }));

  const filteredEntries = selectedCategory 
    ? processedEntries.filter(entry => entry.category === selectedCategory)
    : processedEntries;

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedEntries(newExpanded);
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="h-[600px] bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
      <div className="p-4 border-b bg-white/50 backdrop-blur-sm rounded-t-lg">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          Journal Entries
        </h3>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="text-xs"
          >
            All
          </Button>
          {defaultCategories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="text-xs"
            >
              <Tag className="w-3 h-3 mr-1" />
              {category}
            </Button>
          ))}
        </div>
        
        <p className="text-sm text-gray-600">{filteredEntries.length} entries</p>
      </div>
      
      <ScrollArea className="h-[520px] p-4">
        <div className="space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No journal entries yet.</p>
              <p className="text-sm text-gray-400">Start a conversation to create your first entry!</p>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <Card key={entry.id} className="p-4 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-1">{entry.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      {entry.date.toLocaleDateString()} at {entry.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(entry.category)} variant="secondary">
                      {entry.category}
                    </Badge>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getMoodColor(entry.mood)}`}>
                      <Heart className="w-3 h-3" />
                      {getMoodLabel(entry.mood)}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                  {entry.summary}
                </p>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(entry.id)}
                  className="text-xs text-gray-500 hover:text-gray-700 p-0 h-auto"
                >
                  {expandedEntries.has(entry.id) ? (
                    <>
                      <ChevronDown className="w-3 h-3 mr-1" />
                      Hide full transcript
                    </>
                  ) : (
                    <>
                      <ChevronRight className="w-3 h-3 mr-1" />
                      View full transcript
                    </>
                  )}
                </Button>
                
                {expandedEntries.has(entry.id) && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border-l-4 border-emerald-500">
                    <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                      {entry.content}
                    </p>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default JournalEntries;
