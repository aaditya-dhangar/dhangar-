
import { QuizResult } from '../types';

const STORAGE_KEY = 'smart_study_results';

export const saveQuizResult = (result: QuizResult): void => {
  const history = getQuizHistory();
  const updatedHistory = [result, ...history].slice(0, 50); // Keep last 50
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
};

export const getQuizHistory = (): QuizResult[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};
