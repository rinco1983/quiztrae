import React from 'react';
import { QuizQuestion } from '../types';
import { Button } from './Button';
import { RefreshCw, Trophy, XCircle, CheckCircle } from 'lucide-react';

interface ResultScreenProps {
  questions: QuizQuestion[];
  userAnswers: number[];
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ questions, userAnswers, onRestart }) => {
  const score = userAnswers.reduce((acc, answer, idx) => {
    return answer === questions[idx].correctAnswerIndex ? acc + 1 : acc;
  }, 0);

  const percentage = Math.round((score / questions.length) * 100);

  let feedback = "Good Effort!";
  let feedbackColor = "text-accent";
  if (percentage === 100) {
    feedback = "Perfect Score! 🌟";
    feedbackColor = "text-yellow-500";
  } else if (percentage >= 80) {
    feedback = "Excellent! 🎉";
    feedbackColor = "text-green-500";
  } else if (percentage >= 60) {
    feedback = "Well Done! 👍";
    feedbackColor = "text-secondary";
  }

  return (
    <div className="w-full max-w-3xl mx-auto pb-12">
      {/* Score Header */}
      <div className="bg-white rounded-[2rem] shadow-xl p-8 mb-8 text-center border-b-8 border-dark/5">
        <div className="inline-flex items-center justify-center p-4 bg-yellow-100 rounded-full mb-4 animate-bounce">
          <Trophy size={48} className="text-yellow-500" />
        </div>
        <h2 className={`text-4xl font-extrabold mb-2 ${feedbackColor}`}>{feedback}</h2>
        <p className="text-dark/60 text-lg mb-6">You got {score} out of {questions.length} correct</p>
        
        <div className="w-full bg-dark/5 h-6 rounded-full overflow-hidden max-w-md mx-auto">
          <div 
            className={`h-full transition-all duration-1000 ease-out rounded-full ${
                percentage >= 80 ? 'bg-green-400' : percentage >= 60 ? 'bg-secondary' : 'bg-primary'
            }`}
            style={{ width: `${percentage}%` }} 
          />
        </div>
      </div>

      <div className="flex justify-center mb-10">
        <Button onClick={onRestart} size="lg">
          <RefreshCw size={20} />
          Play Again / 再玩一次
        </Button>
      </div>

      {/* Review List */}
      <h3 className="text-2xl font-bold text-dark/80 mb-6 px-2">Review Answers</h3>
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const isCorrect = userAnswers[idx] === q.correctAnswerIndex;
          return (
            <div key={idx} className={`bg-white rounded-2xl p-5 shadow-sm border-2 ${isCorrect ? 'border-transparent' : 'border-primary/20'}`}>
              <div className="flex items-start gap-4">
                <div className={`mt-1 p-2 rounded-full flex-shrink-0 ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                   {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                    <span className="text-xl font-bold text-dark">{q.word}</span>
                    <span className="text-sm text-dark/50 italic">"{q.exampleSentence}"</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {q.options.map((opt, optIdx) => {
                      let styles = "bg-dark/5 text-dark/60";
                      let icon = null;

                      if (optIdx === q.correctAnswerIndex) {
                        styles = "bg-green-100 text-green-800 font-bold ring-2 ring-green-500/20";
                        icon = <CheckCircle size={14} className="ml-1 inline" />;
                      } else if (optIdx === userAnswers[idx] && !isCorrect) {
                        styles = "bg-red-100 text-red-800 font-bold ring-2 ring-red-500/20";
                        icon = <XCircle size={14} className="ml-1 inline" />;
                      }

                      return (
                        <div key={optIdx} className={`px-3 py-2 rounded-lg ${styles}`}>
                          {opt} {icon}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};