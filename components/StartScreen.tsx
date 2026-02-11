import React from 'react';
import { Button } from './Button';
import { Star, BookOpen, Brain } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="mb-8 relative">
        <div className="absolute -top-6 -right-6 text-accent animate-bounce delay-100">
          <Star size={48} fill="currentColor" />
        </div>
        <div className="absolute -bottom-4 -left-8 text-secondary animate-pulse">
          <Brain size={40} />
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-primary tracking-tight">
          Word<br/>Wizard
        </h1>
        {/* 移除小学英语挑战字样 */}
      </div>

      <p className="text-lg md:text-xl text-dark/70 mb-10 max-w-md leading-relaxed">
        Are you ready to test your English vocabulary? 
        <br/>
        <span className="text-sm text-dark/50">(准备好测试你的英语词汇量了吗？)</span>
      </p>

      <div className="grid gap-4 w-full max-w-xs">
        <Button onClick={onStart} size="lg" fullWidth>
          <BookOpen size={24} />
          Start Quiz / 开始挑战
        </Button>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-8 text-dark/40">
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl font-bold text-primary">10</span>
          <span className="text-xs font-bold uppercase tracking-wide">Questions</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl font-bold text-secondary">AI</span>
          <span className="text-xs font-bold uppercase tracking-wide">Powered</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl font-bold text-accent">100%</span>
          <span className="text-xs font-bold uppercase tracking-wide">Fun</span>
        </div>
      </div>
    </div>
  );
};