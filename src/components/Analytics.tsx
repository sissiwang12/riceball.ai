
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Heart, Target } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Mood Distribution</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              No mood data to display
            </div>
          )}
        </Card>
      </div>

      {/* Insights */}
      <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-0 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-600" />
          Personal Insights
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          {entries.length === 0 ? (
            <p>Start journaling to see personalized insights about your mood patterns and growth!</p>
          ) : (
            <>
              <p>• You've been consistently engaging with self-reflection through {entries.length} journal entries.</p>
              <p>• Your average mood score is {averageMood}/5, showing {averageMood >= '3' ? 'positive' : 'challenging'} overall wellbeing.</p>
              {moodTrend > 0 && <p>• Great news! Your mood has been trending upward recently.</p>}
              {moodTrend < 0 && <p>• Your mood has dipped recently - consider what support you might need.</p>}
              <p>• Regular journaling like this shows commitment to your mental health journey.</p>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
