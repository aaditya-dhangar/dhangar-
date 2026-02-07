
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Uploader } from './components/Uploader';
import { QuizView } from './components/QuizView';
import { Dashboard } from './components/Dashboard';
import { AppState, Question, QuizResult } from './types';
import { generateQuizFromText } from './services/geminiService';
import { saveQuizResult, getQuizHistory } from './services/storageService';
import { Trophy, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [currentScore, setCurrentScore] = useState(0);
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setHistory(getQuizHistory());
  }, []);

  const handleProcessNotes = async (text: string, title: string) => {
    setIsLoading(true);
    try {
      setQuizTitle(title);
      const generatedQuestions = await generateQuizFromText(text, title);
      setQuestions(generatedQuestions);
      setState(AppState.QUIZ);
    } catch (error) {
      console.error(error);
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizFinish = (score: number) => {
    const result: QuizResult = {
      quizId: Date.now().toString(),
      quizTitle: quizTitle,
      score: score,
      total: questions.length,
      timestamp: Date.now()
    };
    saveQuizResult(result);
    setCurrentScore(score);
    setHistory(getQuizHistory());
    setState(AppState.RESULTS);
  };

  const renderContent = () => {
    switch (state) {
      case AppState.IDLE:
        return <Uploader onProcess={handleProcessNotes} isLoading={isLoading} />;
      
      case AppState.QUIZ:
        return (
          <QuizView 
            questions={questions} 
            quizTitle={quizTitle} 
            onFinish={handleQuizFinish} 
          />
        );

      case AppState.RESULTS:
        const percent = Math.round((currentScore / questions.length) * 100);
        return (
          <div className="text-center space-y-8 animate-in zoom-in duration-500">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-8 border-blue-50 flex items-center justify-center">
                  <span className="text-4xl font-bold text-blue-600">{percent}%</span>
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 p-2 rounded-full shadow-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Quiz Completed!</h2>
              <p className="text-gray-500">You scored {currentScore} out of {questions.length} questions correctly.</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
                <span className="text-sm font-medium text-gray-400">Quiz Topic</span>
                <span className="text-sm font-bold text-gray-800">{quizTitle}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">Total Score</span>
                <div className="flex items-center gap-1">
                   <span className="text-xl font-bold text-gray-900">{currentScore}</span>
                   <span className="text-gray-300">/</span>
                   <span className="text-gray-500">{questions.length}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setState(AppState.QUIZ)}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              <button 
                onClick={() => setState(AppState.DASHBOARD)}
                className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                View Analytics
              </button>
              <button 
                onClick={() => setState(AppState.IDLE)}
                className="w-full py-4 bg-transparent text-gray-400 hover:text-gray-600 text-sm font-medium transition-all"
              >
                Upload New Notes
              </button>
            </div>
          </div>
        );

      case AppState.DASHBOARD:
        return <Dashboard history={history} />;

      default:
        return <Uploader onProcess={handleProcessNotes} isLoading={isLoading} />;
    }
  };

  return (
    <Layout activeTab={state === AppState.DASHBOARD ? 'DASHBOARD' : 'IDLE'} onTabChange={(tab) => setState(tab as AppState)}>
      {renderContent()}
    </Layout>
  );
}
