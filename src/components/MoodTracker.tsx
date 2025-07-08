
import React from 'react';
import { Card } from '@/components/ui/card';
import { Smile, Meh, Frown, Heart, Sun } from 'lucide-react';

interface MoodTrackerProps {
  selectedMood: number;
  onMoodChange: (mood: number) => void;
}

const MoodTracker = ({ selectedMood, onMoodChange }: MoodTrackerProps) => {
  const moods = [
    { value: 1, label: 'Very Sad', icon: Frown, color: 'text-red-500' },
    { value: 2, label: 'Sad', icon: Frown, color: 'text-orange-500' },
    { value: 3, label: 'Neutral', icon: Meh, color: 'text-yellow-500' },
    { value: 4, label: 'Happy', icon: Smile, color: 'text-green-500' },
    { value: 5, label: 'Very Happy', icon: Sun, color: 'text-emerald-500' },
  ];

  return (
    <Card className="p-6 bg-gradient-to-r from-rose-50 to-pink-50 border-0 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Heart className="w-5 h-5 text-rose-500" />
        How are you feeling today?
      </h3>
      <div className="flex justify-between gap-2">
        {moods.map((mood) => {
          const IconComponent = mood.icon;
          return (
            <button
              key={mood.value}
              onClick={() => onMoodChange(mood.value)}
              className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                selectedMood === mood.value
                  ? 'bg-white shadow-md ring-2 ring-rose-300'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            >
              <IconComponent className={`w-8 h-8 ${mood.color} mb-2`} />
              <span className="text-xs text-gray-600 text-center">{mood.label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default MoodTracker;
