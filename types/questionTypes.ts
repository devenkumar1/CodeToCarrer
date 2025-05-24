export interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer?: string; // Optional, only needed if we want to show correct answers
    skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'pro';
    technology: string;
    roadmapStep?: number; // Which step in the roadmap this question belongs to
  }
  
  export interface UserAnswer {
    questionId: number;
    selectedOption: string | null;
    isCorrect?: boolean;
    skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'pro';
    technology: string;
  }