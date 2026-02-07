
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  createdAt: number;
}

export interface QuizResult {
  quizId: string;
  quizTitle: string;
  score: number;
  total: number;
  timestamp: number;
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  QUIZ = 'QUIZ',
  RESULTS = 'RESULTS',
  DASHBOARD = 'DASHBOARD'
}
