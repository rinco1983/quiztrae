import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { Button } from './Button';
import { Volume2, ArrowRight, CheckCircle2 } from 'lucide-react';

interface QuizScreenProps {
  questions: QuizQuestion[];
  onFinish: (userAnswers: number[]) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      onFinish(newAnswers);
    }
  };

  const speakWord = () => {
    const utterance = new SpeechSynthesisUtterance(currentQuestion.word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header / Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2 px-1">
          <span className="text-2xl font-bold text-dark/30">
            Question {currentIndex + 1}
            <span className="text-lg font-normal text-dark/20">/{questions.length}</span>
          </span>
          <div className="flex gap-1">
            {questions.map((_, idx) => (
               <div 
                 key={idx}
                 className={`h-2 w-2 rounded-full transition-colors ${
                    idx < currentIndex ? 'bg-secondary' : 
                    idx === currentIndex ? 'bg-primary' : 'bg-dark/10'
                 }`}
               />
            ))}
          </div>
        </div>
        <div className="h-4 bg-dark/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-8 border-b-8 border-dark/5 relative overflow-hidden">
        
        {/* Decorative Circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 text-center">
          <button 
            onClick={speakWord}
            className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
            aria-label="Listen to pronunciation"
          >
            <Volume2 size={24} />
          </button>
          
          <h2 className="text-5xl md:text-6xl font-bold text-dark mb-2 tracking-tight">
            {currentQuestion.word}
          </h2>
          
          {currentQuestion.pronunciation && (
            <p className="text-dark/40 font-mono text-lg mb-6">
              /{currentQuestion.pronunciation}/
            </p>
          )}

          <div className="bg-indigo-50 rounded-xl p-4 text-indigo-800/70 text-lg font-medium italic">
            "{currentQuestion.exampleSentence}"
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {currentQuestion.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionSelect(idx)}
            className={`
              p-4 rounded-2xl text-xl font-bold transition-all duration-200 border-b-4 text-left relative overflow-hidden group
              ${selectedOption === idx 
                ? 'bg-secondary text-white border-teal-600 shadow-inner scale-[0.98]' 
                : 'bg-white text-dark/80 border-dark/10 hover:border-secondary hover:text-secondary hover:-translate-y-1 shadow-sm'
              }
            `}
          >
            <div className="flex items-center justify-between relative z-10">
              <span>{option}</span>
              {selectedOption === idx && <CheckCircle2 size={24} className="animate-in zoom-in spin-in-180 duration-300" />}
            </div>
            {/* Hover effect background */}
            <div className={`absolute inset-0 bg-secondary/10 translate-y-full transition-transform duration-300 group-hover:translate-y-0 ${selectedOption === idx ? 'hidden' : ''}`} />
          </button>
        ))}
      </div>

      {/* Footer Action */}
      <div className="flex justify-end">
        <Button 
          onClick={handleNext} 
          disabled={selectedOption === null}
          size="lg"
          className="w-full md:w-auto"
        >
          {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  );
};