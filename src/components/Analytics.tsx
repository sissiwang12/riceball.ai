import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, Calendar, Heart, Target, Brain, Trophy, Lightbulb, Star, Loader2 } from 'lucide-react';
import { JournalEntry } from './JournalEntries';
import { sendMessageToAI } from '@/lib/chat';

interface AnalyticsProps {
  entries: JournalEntry[];
}

const Analytics = ({ entries }: AnalyticsProps) => {
  const [currentChallenges, setCurrentChallenges] = useState<string[]>([]);
  const [recentGrowth, setRecentGrowth] = useState<string[]>([]);
  const [gratitudeMoments, setGratitudeMoments] = useState<string[]>([]);
  const [personalInsights, setPersonalInsights] = useState<string[]>([]);
  const [personalityData, setPersonalityData] = useState<Array<{trait: string, value: number}>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzingGrowth, setIsAnalyzingGrowth] = useState(false);
  const [isAnalyzingGratitude, setIsAnalyzingGratitude] = useState(false);
  const [isAnalyzingInsights, setIsAnalyzingInsights] = useState(false);
  const [isAnalyzingPersonality, setIsAnalyzingPersonality] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [growthAnalysisError, setGrowthAnalysisError] = useState<string | null>(null);
  const [gratitudeAnalysisError, setGratitudeAnalysisError] = useState<string | null>(null);
  const [insightsAnalysisError, setInsightsAnalysisError] = useState<string | null>(null);
  const [personalityAnalysisError, setPersonalityAnalysisError] = useState<string | null>(null);
  const lastAnalyzedUserMessage = useRef<string | null>(null);

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


  // Extract user message from journal entry content
  const extractUserMessage = (content: string): string | null => {
    if (!content) return null;
    // Journal entries contain: "user input\n\nTherapist Response: AI response"
    const userInput = content.split('\n\nTherapist Response:')[0].trim();
    return userInput || null;
  };

  // Analyze latest journal entry for current challenges
  const analyzeCurrentChallenges = async (userMessage: string) => {
    if (!userMessage) {
      setCurrentChallenges([]);
      return;
    }

    console.log('Analyzing new user message:', userMessage.substring(0, 50) + '...');
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const messages = [
        {
          role: 'system',
          content: `You are a mental health AI assistant analyzing user messages to identify current challenges. 

Your task is to analyze the user's message and identify 3-5 current challenges they might be facing based on their emotional state, concerns, or struggles mentioned.

Guidelines:
- Focus on emotional and mental health patterns
- Be empathetic and supportive in your analysis
- Keep each challenge description short (5-10 words max)
- Use gentle, non-judgmental language
- Look for themes like: anxiety, stress, relationships, work, self-doubt, loneliness, etc.
- Return ONLY a JSON array of challenge strings, no other text

Example output: ["Work-related stress", "Social anxiety", "Self-confidence issues", "Time management", "Sleep difficulties"]`
        },
        {
          role: 'user',
          content: `Analyze this user message and identify their current challenges: "${userMessage}"`
        }
      ];

      const response = await sendMessageToAI(messages);
      
      // Try to parse the JSON response
      let challenges;
      try {
        challenges = JSON.parse(response);
      } catch {
        // Fallback if JSON parsing fails
        challenges = [
          "Emotional processing",
          "Self-reflection",
          "Personal growth",
          "Mental wellness",
          "Life challenges"
        ];
      }

      // Ensure we have an array of strings
      if (!Array.isArray(challenges)) {
        challenges = [
          "Emotional processing",
          "Self-reflection", 
          "Personal growth",
          "Mental wellness",
          "Life challenges"
        ];
      }

      setCurrentChallenges(challenges);
      // Mark this user message as analyzed
      lastAnalyzedUserMessage.current = userMessage;
      console.log('Analysis complete for user message');
    } catch (error: any) {
      console.error('Error analyzing challenges:', error);
      setAnalysisError(error.message);
      // Set fallback challenges on error
      setCurrentChallenges([
        "Emotional processing",
        "Self-reflection",
        "Personal growth", 
        "Mental wellness",
        "Life challenges"
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Analyze latest journal entry for recent growth and milestones
  const analyzeRecentGrowth = async (userMessage: string) => {
    if (!userMessage) {
      setRecentGrowth([]);
      return;
    }

    console.log('Analyzing growth for user message:', userMessage.substring(0, 50) + '...');
    setIsAnalyzingGrowth(true);
    setGrowthAnalysisError(null);

    try {
      const messages = [
        {
          role: 'system',
          content: `You are a mental health AI assistant analyzing user messages to identify recent growth and milestones. 

Your task is to analyze the user's message and identify 3-5 positive growth areas, achievements, or milestones they've demonstrated based on their emotional state, insights, or progress mentioned.

Guidelines:
- Focus on positive developments and personal growth
- Be encouraging and celebratory in your analysis
- Keep each growth item short (5-10 words max)
- Use positive, empowering language
- Look for themes like: self-awareness, emotional regulation, coping skills, relationship improvements, goal progress, etc.
- Return ONLY a JSON array of growth strings, no other text

Example output: ["Improved self-awareness", "Better emotional regulation", "Increased gratitude practice", "Stronger coping skills", "Enhanced communication"]`
        },
        {
          role: 'user',
          content: `Analyze this user message and identify their recent growth and milestones: "${userMessage}"`
        }
      ];

      const response = await sendMessageToAI(messages);
      
      // Try to parse the JSON response
      let growth;
      try {
        growth = JSON.parse(response);
      } catch {
        // Fallback if JSON parsing fails
        growth = [
          "Improved self-awareness",
          "Better emotional regulation",
          "Increased gratitude practice",
          "Stronger coping skills",
          "Enhanced communication"
        ];
      }

      // Ensure we have an array of strings
      if (!Array.isArray(growth)) {
        growth = [
          "Improved self-awareness",
          "Better emotional regulation",
          "Increased gratitude practice",
          "Stronger coping skills",
          "Enhanced communication"
        ];
      }

      setRecentGrowth(growth);
      console.log('Growth analysis complete for user message');
    } catch (error: any) {
      console.error('Error analyzing growth:', error);
      setGrowthAnalysisError(error.message);
      // Set fallback growth on error
      setRecentGrowth([
        "Improved self-awareness",
        "Better emotional regulation",
        "Increased gratitude practice",
        "Stronger coping skills",
        "Enhanced communication"
      ]);
    } finally {
      setIsAnalyzingGrowth(false);
    }
  };

  // Analyze latest journal entry for gratitude moments
  const analyzeGratitudeMoments = async (userMessage: string) => {
    if (!userMessage) {
      setGratitudeMoments([]);
      return;
    }

    console.log('Analyzing gratitude for user message:', userMessage.substring(0, 50) + '...');
    setIsAnalyzingGratitude(true);
    setGratitudeAnalysisError(null);

    try {
      const messages = [
        {
          role: 'system',
          content: `You are a mental health AI assistant analyzing user messages to identify gratitude moments and positive aspects of their life. 

Your task is to analyze the user's message and identify 3-5 things they might be grateful for or positive aspects of their life based on their experiences, relationships, or circumstances mentioned.

Guidelines:
- Focus on positive aspects and things to be grateful for
- Be warm and appreciative in your analysis
- Keep each gratitude item short (2-6 words max)
- Use simple, heartfelt language
- Look for themes like: relationships, health, opportunities, experiences, support systems, personal qualities, etc.
- Return ONLY a JSON array of gratitude strings, no other text

Example output: ["Family support", "Good health", "Career opportunities", "Personal relationships", "Learning experiences"]`
        },
        {
          role: 'user',
          content: `Analyze this user message and identify gratitude moments and positive aspects: "${userMessage}"`
        }
      ];

      const response = await sendMessageToAI(messages);
      
      // Try to parse the JSON response
      let gratitude;
      try {
        gratitude = JSON.parse(response);
      } catch {
        // Fallback if JSON parsing fails
        gratitude = [
          "Family support",
          "Good health",
          "Career opportunities",
          "Personal relationships",
          "Learning experiences"
        ];
      }

      // Ensure we have an array of strings
      if (!Array.isArray(gratitude)) {
        gratitude = [
          "Family support",
          "Good health",
          "Career opportunities",
          "Personal relationships",
          "Learning experiences"
        ];
      }

      setGratitudeMoments(gratitude);
      console.log('Gratitude analysis complete for user message');
    } catch (error: any) {
      console.error('Error analyzing gratitude:', error);
      setGratitudeAnalysisError(error.message);
      // Set fallback gratitude on error
      setGratitudeMoments([
        "Family support",
        "Good health",
        "Career opportunities",
        "Personal relationships",
        "Learning experiences"
      ]);
    } finally {
      setIsAnalyzingGratitude(false);
    }
  };

  // Analyze latest journal entry for personal insights and affirmations
  const analyzePersonalInsights = async (userMessage: string) => {
    if (!userMessage) {
      setPersonalInsights([]);
      return;
    }

    console.log('Analyzing insights for user message:', userMessage.substring(0, 50) + '...');
    setIsAnalyzingInsights(true);
    setInsightsAnalysisError(null);

    try {
      const messages = [
        {
          role: 'system',
          content: `You are a mental health AI assistant analyzing user messages to provide personal insights and affirmations. 

Your task is to analyze the user's message and generate 3-5 personalized insights, affirmations, or encouraging observations about their mental health journey, patterns, or current state.

Guidelines:
- Focus on supportive and encouraging insights
- Be empathetic and understanding in your analysis
- Keep each insight short (8-15 words max)
- Use warm, supportive language
- Look for patterns like: emotional awareness, coping strategies, self-reflection, resilience, personal strengths, etc.
- Return ONLY a JSON array of insight strings, no other text

Example output: ["You're developing stronger emotional awareness", "Your self-reflection shows great courage", "You're building resilience through challenges", "Your honesty about feelings is admirable", "You're taking positive steps forward"]`
        },
        {
          role: 'user',
          content: `Analyze this user message and provide personal insights and affirmations: "${userMessage}"`
        }
      ];

      const response = await sendMessageToAI(messages);
      
      // Try to parse the JSON response
      let insights;
      try {
        insights = JSON.parse(response);
      } catch {
        // Fallback if JSON parsing fails
        insights = [
          "You're developing stronger emotional awareness",
          "Your self-reflection shows great courage",
          "You're building resilience through challenges",
          "Your honesty about feelings is admirable",
          "You're taking positive steps forward"
        ];
      }

      // Ensure we have an array of strings
      if (!Array.isArray(insights)) {
        insights = [
          "You're developing stronger emotional awareness",
          "Your self-reflection shows great courage",
          "You're building resilience through challenges",
          "Your honesty about feelings is admirable",
          "You're taking positive steps forward"
        ];
      }

      setPersonalInsights(insights);
      console.log('Insights analysis complete for user message');
    } catch (error: any) {
      console.error('Error analyzing insights:', error);
      setInsightsAnalysisError(error.message);
      // Set fallback insights on error
      setPersonalInsights([
        "You're developing stronger emotional awareness",
        "Your self-reflection shows great courage",
        "You're building resilience through challenges",
        "Your honesty about feelings is admirable",
        "You're taking positive steps forward"
      ]);
    } finally {
      setIsAnalyzingInsights(false);
    }
  };

  // Analyze latest journal entry for personality insights (Big Five)
  const analyzePersonalityInsights = async (userMessage: string) => {
    if (!userMessage) {
      setPersonalityData([]);
      return;
    }

    console.log('Analyzing personality for user message:', userMessage.substring(0, 50) + '...');
    setIsAnalyzingPersonality(true);
    setPersonalityAnalysisError(null);

    try {
      const messages = [
        {
          role: 'system',
          content: `You are a mental health AI assistant analyzing user messages to assess personality traits using the Big Five model. 

Your task is to analyze the user's message and provide personality trait scores (0-100) based on their communication style, emotional expression, and behavioral patterns.

Guidelines:
- Analyze the user's message for personality indicators
- Score each Big Five trait from 0-100 based on evidence in their message
- Be objective and evidence-based in your assessment
- Consider communication style, emotional expression, social patterns, etc.
- Return ONLY a JSON object with trait names as keys and scores as values
- Use these exact trait names: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism

Example output: {"Openness": 75, "Conscientiousness": 60, "Extraversion": 45, "Agreeableness": 80, "Neuroticism": 40}`
        },
        {
          role: 'user',
          content: `Analyze this user message and provide Big Five personality trait scores: "${userMessage}"`
        }
      ];

      const response = await sendMessageToAI(messages);
      
      // Try to parse the JSON response
      let personalityScores;
      try {
        personalityScores = JSON.parse(response);
      } catch {
        // Fallback if JSON parsing fails
        personalityScores = {
          "Openness": 75,
          "Conscientiousness": 60,
          "Extraversion": 45,
          "Agreeableness": 80,
          "Neuroticism": 40
        };
      }

      // Ensure we have valid scores and convert to array format
      const traits = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'];
      const personalityArray = traits.map(trait => ({
        trait,
        value: Math.max(0, Math.min(100, personalityScores[trait] || 50))
      }));

      setPersonalityData(personalityArray);
      console.log('Personality analysis complete for user message');
    } catch (error: any) {
      console.error('Error analyzing personality:', error);
      setPersonalityAnalysisError(error.message);
      // Set fallback personality data on error
      setPersonalityData([
        { trait: 'Openness', value: 75 },
        { trait: 'Conscientiousness', value: 60 },
        { trait: 'Extraversion', value: 45 },
        { trait: 'Agreeableness', value: 80 },
        { trait: 'Neuroticism', value: 40 }
      ]);
    } finally {
      setIsAnalyzingPersonality(false);
    }
  };

  // Only analyze when there's a new user message
  useEffect(() => {
    console.log('useEffect triggered');
    console.log('Entries length:', entries.length);
    console.log('Last analyzed user message:', lastAnalyzedUserMessage.current?.substring(0, 50) + '...');
    
    if (entries.length === 0) {
      console.log('No entries, clearing all analysis data');
      setCurrentChallenges([]);
      setRecentGrowth([]);
      setGratitudeMoments([]);
      setPersonalInsights([]);
      setPersonalityData([]);
      lastAnalyzedUserMessage.current = null;
      return;
    }

    const latestEntry = entries[entries.length - 1];
    const userMessage = extractUserMessage(latestEntry.content);
    
    console.log('Latest user message:', userMessage?.substring(0, 50) + '...');
    
    // Only analyze if:
    // 1. We have a valid user message, AND
    // 2. The user message is different from what we last analyzed
    console.log('Last analyzed user message:', lastAnalyzedUserMessage.current);
    console.log('User message:', userMessage);
    if (userMessage && lastAnalyzedUserMessage.current !== userMessage) {
      console.log('New user message detected, analyzing all sections...');
      // Run all five analyses in parallel
      Promise.all([
        analyzeCurrentChallenges(userMessage),
        analyzeRecentGrowth(userMessage),
        analyzeGratitudeMoments(userMessage),
        analyzePersonalInsights(userMessage),
        analyzePersonalityInsights(userMessage)
      ]);
    } else {
      console.log('Same user message or no user message, no analysis needed');
    }
  }, [entries.length]); // Only depend on entries.length



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
            {isAnalyzingPersonality && <Loader2 className="w-4 h-4 animate-spin text-purple-600" />}
          </h3>
          {isAnalyzingPersonality ? (
            <div className="h-[250px] flex items-center justify-center">
              <div className="flex items-center gap-3 p-4 bg-white/60 rounded-lg">
                <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                <span className="text-gray-700">Analyzing personality traits...</span>
              </div>
            </div>
          ) : personalityData.length > 0 ? (
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
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p>No recent conversations to analyze.</p>
                <p className="text-sm">Start chatting to see your personality insights!</p>
              </div>
            </div>
          )}
          {personalityAnalysisError && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded mt-2">
              Analysis error: {personalityAnalysisError}
            </div>
          )}
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
            {isAnalyzing && <Loader2 className="w-4 h-4 animate-spin text-red-600" />}
          </h3>
          <div className="space-y-3">
            {isAnalyzing ? (
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                <span className="text-gray-700">Analyzing your latest conversation...</span>
              </div>
            ) : currentChallenges.length > 0 ? (
              currentChallenges.map((challenge, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">{challenge}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No recent conversations to analyze.</p>
                <p className="text-sm">Start chatting to see your current challenges!</p>
              </div>
            )}
            {analysisError && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                Analysis error: {analysisError}
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-green-600" />
            Recent Growth & Milestones
            {isAnalyzingGrowth && <Loader2 className="w-4 h-4 animate-spin text-green-600" />}
          </h3>
          <div className="space-y-3">
            {isAnalyzingGrowth ? (
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin text-green-500" />
                <span className="text-gray-700">Analyzing your growth patterns...</span>
              </div>
            ) : recentGrowth.length > 0 ? (
              recentGrowth.map((growth, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-700">{growth}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No recent conversations to analyze.</p>
                <p className="text-sm">Start chatting to see your growth milestones!</p>
              </div>
            )}
            {growthAnalysisError && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                Analysis error: {growthAnalysisError}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Gratitude Tracker */}
      <Card className="p-6 bg-gradient-to-r from-yellow-50 to-amber-50 border-0 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-amber-600" />
          Gratitude Moments
          {isAnalyzingGratitude && <Loader2 className="w-4 h-4 animate-spin text-amber-600" />}
        </h3>
        <div className="flex flex-wrap gap-2">
          {isAnalyzingGratitude ? (
            <div className="flex items-center gap-2 p-3 bg-white/60 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              <span className="text-gray-700">Finding gratitude moments...</span>
            </div>
          ) : gratitudeMoments.length > 0 ? (
            gratitudeMoments.map((item, index) => (
              <Badge key={index} variant="secondary" className="bg-amber-100 text-amber-800 px-3 py-1">
                {item}
              </Badge>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>No recent conversations to analyze.</p>
              <p className="text-sm">Start chatting to see your gratitude moments!</p>
            </div>
          )}
        </div>
        {gratitudeAnalysisError && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded mt-2">
            Analysis error: {gratitudeAnalysisError}
          </div>
        )}
      </Card>

      {/* Personal Insights */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-0 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          Personal Insights & Affirmations
          {isAnalyzingInsights && <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />}
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          {isAnalyzingInsights ? (
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
              <span className="text-gray-700">Generating personalized insights...</span>
            </div>
          ) : personalInsights.length > 0 ? (
            <>
              <div className="p-4 bg-white/60 rounded-lg border-l-4 border-indigo-500">
                <p className="font-medium text-indigo-700 mb-2">Today's Affirmation:</p>
                <p className="italic">"You are capable of growth and change. Every conversation is a step forward in your healing journey."</p>
              </div>
              {personalInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{insight}</span>
                </div>
              ))}
            </>
          ) : entries.length === 0 ? (
            <p>Start journaling to see personalized insights about your mood patterns and growth!</p>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>No recent conversations to analyze.</p>
              <p className="text-sm">Start chatting to see your personalized insights!</p>
            </div>
          )}
        </div>
        {insightsAnalysisError && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded mt-2">
            Analysis error: {insightsAnalysisError}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Analytics;
