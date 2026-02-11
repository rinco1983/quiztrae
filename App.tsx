import React, { useState } from 'react';
import { AppStatus, QuizQuestion } from './types';
import { generateQuizQuestions } from './services/zhipuService';
import { StartScreen } from './components/StartScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from './components/Button';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>('start');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const startGame = async () => {
    setStatus('loading');
    setErrorMsg('');
    try {
      const data = await generateQuizQuestions();
      setQuestions(data);
      setStatus('quiz');
    } catch (error) {
      console.error(error);
      setErrorMsg('Failed to load questions. Please check your connection and try again.');
      setStatus('error');
    }
  };

  const handleFinishQuiz = (answers: number[]) => {
    setUserAnswers(answers);
    setStatus('result');
  };

  const handleRestart = () => {
    setQuestions([]);
    setUserAnswers([]);
    setStatus('start');
  };

  // Background decoration shapes
  const BackgroundShapes = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px]" />
    </div>
  );

  return (
    <div className="min-h-screen text-dark relative">
      <BackgroundShapes />
      
      <header className="p-4 md:p-6 flex justify-center">
        <div className="text-xl font-bold tracking-tight text-dark/30 select-none">
          Little Star English
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8 max-w-4xl">
        {status === 'start' && (
          <StartScreen onStart={startGame} />
        )}

        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/30 blur-xl rounded-full"></div>
              <Loader2 size={64} className="text-primary animate-spin relative z-10" />
            </div>
            <h2 className="mt-8 text-2xl font-bold text-dark/70">Generating Quiz...</h2>
            <p className="text-dark/40 mt-2">Asking AI for fun words!</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
            <div className="bg-red-100 p-4 rounded-full mb-4 text-red-500">
              <AlertCircle size={48} />
            </div>
            <h2 className="text-2xl font-bold text-dark mb-2">Oops! Something went wrong</h2>
            <p className="text-dark/60 mb-8 max-w-md">{errorMsg}</p>
            <Button onClick={handleRestart}>Try Again</Button>
          </div>
        )}

        {status === 'quiz' && questions.length > 0 && (
          <QuizScreen 
            questions={questions} 
            onFinish={handleFinishQuiz} 
          />
        )}

        {status === 'result' && (
          <ResultScreen 
            questions={questions} 
            userAnswers={userAnswers} 
            onRestart={handleRestart} 
          />
        )}
      </main>
    </div>
  );
};

export default App;