
import React from 'react';
import { QuizResult } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Target, History, Calendar } from 'lucide-react';

interface DashboardProps {
  history: QuizResult[];
}

export const Dashboard: React.FC<DashboardProps> = ({ history }) => {
  const chartData = history.slice().reverse().map((item, index) => ({
    name: `Quiz ${index + 1}`,
    score: Math.round((item.score / item.total) * 100),
    title: item.quizTitle
  })).slice(-10); // Last 10 quizzes

  const averageScore = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + (curr.score / curr.total) * 100, 0) / history.length)
    : 0;

  return (
    <div className="space-y-8 pb-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Your Progress</h1>
        <p className="text-gray-500">Track your learning journey over time.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-100">
          <div className="flex items-center gap-2 opacity-80 mb-1">
            <Target className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Avg Score</span>
          </div>
          <div className="text-3xl font-bold">{averageScore}%</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <History className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Total Quizzes</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{history.length}</div>
        </div>
      </div>

      {/* Trend Chart */}
      {history.length > 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-800">Performance Trend</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`${value}%`, 'Accuracy']}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#2563eb" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl p-12 text-center">
          <p className="text-gray-400">Complete your first quiz to see analytics!</p>
        </div>
      )}

      {/* Recent History */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Recent Quizzes
        </h3>
        <div className="space-y-3">
          {history.length > 0 ? history.map((quiz, i) => (
            <div key={i} className="bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between shadow-sm">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{quiz.quizTitle}</h4>
                <p className="text-xs text-gray-400">{new Date(quiz.timestamp).toLocaleDateString()} • {new Date(quiz.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <div className="text-right">
                  <div className="font-bold text-gray-900">{quiz.score}/{quiz.total}</div>
                  <div className="text-[10px] font-bold text-blue-600 uppercase">{Math.round((quiz.score / quiz.total) * 100)}%</div>
                </div>
                <div className="h-10 w-1 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`w-full bg-blue-600 rounded-full`} 
                    style={{ height: `${(quiz.score/quiz.total)*100}%` }}
                  />
                </div>
              </div>
            </div>
          )) : (
            <p className="text-sm text-gray-400 text-center py-4 italic">No history yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
