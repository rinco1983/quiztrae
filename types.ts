export interface QuizQuestion {
  word: string;
  pronunciation?: string;
  options: string[];
  correctAnswerIndex: number;
  exampleSentence: string;
}

export type AppStatus = 'start' | 'loading' | 'quiz' | 'result' | 'error';

export interface QuizResult {
  score: number;
  total: number;
  history: {
    question: QuizQuestion;
    userAnswerIndex: number;
  }[];
}