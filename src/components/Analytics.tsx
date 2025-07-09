
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, Calendar, Heart, Target, Brain, Trophy, Lightbulb, Star } from 'lucide-react';
import { JournalEntry } from './JournalEntries';

interface AnalyticsProps {
  entries: JournalEntry[];
}

const Analytics = ({ entries }: AnalyticsProps) => {
  // Process mood data for charts
  const moodData = entries.reduce((acc, entry) => {
    const date = entry.date.toLocaleDateString();
    acc[date] = entry.mood;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(moodData).map(([date, mood]) => ({
    date,
    mood,
  })).slice(-7); // Last 7 days

  const moodDistribution = entries.reduce((acc, entry) => {
    const moodLabel = {
      1: 'Very Sad',
      2: 'Sad', 
      3: 'Neutral',
      4: 'Happy',
      5: 'Very Happy'
    }[entry.mood] || 'Unknown';
    
    acc[moodLabel] = (acc[moodLabel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(moodDistribution).map(([mood, count]) => ({
    name: mood,
    value: count,
  }));

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];

  const averageMood = entries.length > 0 
    ? (entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length).toFixed(1)
    : 0;

  const moodTrend = entries.length >= 2 
    ? entries[entries.length - 1].mood - entries[entries.length - 2].mood
    : 0;

  // Personality insights (mock data - in real app would be analyzed from conversations)
  const personalityData = [
    { trait: 'Openness', value: 75 },
    { trait: 'Conscientiousness', value: 60 },
    { trait: 'Extraversion', value: 45 },
    { trait: 'Agreeableness', value: 80 },
    { trait: 'Neuroticism', value: 40 },
  ];

  const currentChallenges = [
    'Work-life balance',
    'Self-doubt',
    'Time management',
    'Social anxiety'
  ];

  const recentGrowth = [
    'Improved self-awareness',
    'Better emotional regulation',
    'Increased gratitude practice'
  ];

  const gratitudeItems = [
    'Family support',
    'Good health',
    'Career opportunities',
    'Personal relationships',
    'Learning experiences'
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Heart className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Mood</p>
              <p className="text-2xl font-bold text-indigo-600">{averageMood}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Calendar className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-emerald-600">{entries.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Mood Trend</p>
              <p className={`text-2xl font-bold ${moodTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {moodTrend > 0 ? '+' : ''}{moodTrend.toFixed(1)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Growth Points</p>
              <p className="text-2xl font-bold text-yellow-600">{recentGrowth.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Personality Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Personality Insights (Big Five)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={personalityData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="trait" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Personality"
                dataKey="value"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Mood Over Time</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[1, 5]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              Not enough data to display trends
            </div>
          )}
        </Card>
      </div>

      {/* Current Challenges & Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border-0 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-red-600" />
            Current Challenges
          </h3>
          <div className="space-y-3">
            {currentChallenges.map((challenge, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-700">{challenge}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-green-600" />
            Recent Growth & Milestones
          </h3>
          <div className="space-y-3">
            {recentGrowth.map((growth, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700">{growth}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Gratitude Tracker */}
      <Card className="p-6 bg-gradient-to-r from-yellow-50 to-amber-50 border-0 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-amber-600" />
          Gratitude Moments
        </h3>
        <div className="flex flex-wrap gap-2">
          {gratitudeItems.map((item, index) => (
            <Badge key={index} variant="secondary" className="bg-amber-100 text-amber-800 px-3 py-1">
              {item}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Personal Insights */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-0 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          Personal Insights & Affirmations
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          {entries.length === 0 ? (
            <p>Start journaling to see personalized insights about your mood patterns and growth!</p>
          ) : (
            <>
              <div className="p-4 bg-white/60 rounded-lg border-l-4 border-indigo-500">
                <p className="font-medium text-indigo-700 mb-2">Today's Affirmation:</p>
                <p className="italic">"You are capable of growth and change. Every conversation is a step forward in your healing journey."</p>
              </div>
              <p>• You've been consistently engaging with self-reflection through {entries.length} journal entries.</p>
              <p>• Your average mood score is {averageMood}/5, showing {Number(averageMood) >= 3 ? 'positive' : 'challenging'} overall wellbeing.</p>
              {moodTrend > 0 && <p>• Great news! Your mood has been trending upward recently.</p>}
              {moodTrend < 0 && <p>• Your mood has dipped recently - consider what support you might need.</p>}
              <p>• Regular journaling like this shows commitment to your mental health journey.</p>
              <p>• You're developing stronger emotional awareness and coping strategies.</p>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
