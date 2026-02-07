
import React, { useState, useEffect, useCallback } from 'react';
import { Question } from '../types';
import { Timer, ArrowRight, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

interface QuizViewProps {
  questions: Question[];
  quizTitle: string;
  onFinish: (score: number) => void;
}

const TIMER_SECONDS = 30;

export const QuizView: React.FC<QuizViewProps> = ({ questions, quizTitle, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  
  const currentQuestion = questions[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(TIMER_SECONDS);
    } else {
      onFinish(score);
    }
  }, [currentIndex, questions.length, score, onFinish]);

  useEffect(() => {
    if (isAnswered) return;

    if (timeLeft <= 0) {
      setIsAnswered(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered]);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQuestion.correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;

  // Determine timer color and urgency
  const getTimerStyles = () => {
    if (timeLeft > 15) return "border-blue-100 bg-blue-50 text-blue-600";
    if (timeLeft > 5) return "border-amber-200 bg-amber-50 text-amber-600";
    return "border-red-200 bg-red-50 text-red-600 animate-pulse";
  };

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Question {currentIndex + 1} of {questions.length}</span>
            <h2 className="text-lg font-semibold text-gray-900 truncate max-w-[200px]">{quizTitle}</h2>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-colors duration-500 ${getTimerStyles()}`}>
            <Timer className={`w-4 h-4 ${timeLeft <= 5 ? 'animate-spin' : ''}`} style={{ animationDuration: timeLeft <= 5 ? '1s' : '3s' }} />
            <span key={timeLeft} className={`font-mono font-bold inline-block ${timeLeft <= 10 ? 'animate-tick' : ''}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 leading-snug mb-8">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = currentQuestion.correctAnswerIndex === idx;
            const showCorrect = isAnswered && isCorrect;
            const showWrong = isAnswered && isSelected && !isCorrect;

            let borderColor = "border-gray-200";
            let bgColor = "bg-white";
            let icon = null;

            if (showCorrect) {
              borderColor = "border-green-500";
              bgColor = "bg-green-50";
              icon = <CheckCircle2 className="w-5 h-5 text-green-500" />;
            } else if (showWrong) {
              borderColor = "border-red-500";
              bgColor = "bg-red-50";
              icon = <XCircle className="w-5 h-5 text-red-500" />;
            } else if (isSelected && !isAnswered) {
              borderColor = "border-blue-500";
              bgColor = "bg-blue-50";
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleOptionClick(idx)}
                className={`w-full p-4 flex items-center justify-between rounded-xl border-2 text-left transition-all ${borderColor} ${bgColor} ${!isAnswered ? 'hover:border-blue-300 hover:bg-blue-50/30' : ''}`}
              >
                <span className={`font-medium ${isAnswered ? (isCorrect ? 'text-green-700' : (isSelected ? 'text-red-700' : 'text-gray-400')) : 'text-gray-700'}`}>
                  {option}
                </span>
                {icon}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation & Next Section */}
      {isAnswered && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <h4 className="text-blue-800 font-bold text-sm mb-1 uppercase tracking-wider">Explanation</h4>
            <p className="text-blue-900 text-sm leading-relaxed">{currentQuestion.explanation}</p>
          </div>
          
          <button
            onClick={handleNext}
            className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
