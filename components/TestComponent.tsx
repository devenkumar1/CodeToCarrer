'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Send, CheckCircle, XCircle } from 'lucide-react';
import { Question, UserAnswer } from '@/questiontypes';
import { useUserStore } from '@/store/userStore';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Update the Question interface to include explanation
interface QuestionWithExplanation extends Question {
  explanation: string;
  points: number;
}

// Professional questions for different technologies with explanations
const mockQuestionsByTechnology: Record<string, QuestionWithExplanation[]> = {
  ruby: [
    {
      id: 1,
      question: "What is the correct way to define a class method in Ruby?",
      options: [
        "def self.method_name",
        "def class.method_name",
        "def static.method_name",
        "def this.method_name"
      ],
      correctAnswer: "def self.method_name",
      explanation: "In Ruby, 'self' is used to define class methods. This is different from instance methods which are defined without 'self'.",
      skillLevel: "intermediate",
      technology: "ruby",
      roadmapStep: 2,
      points: 10
    },
    {
      id: 2,
      question: "Which of the following is NOT a valid Ruby data type?",
      options: ["Symbol", "Hash", "Tuple", "Array"],
      correctAnswer: "Tuple",
      explanation: "Tuple is not a valid data type in Ruby. Symbol, Hash, and Array are valid data types.",
      skillLevel: "beginner",
      technology: "ruby",
      roadmapStep: 1,
      points: 5
    },
    {
      id: 3,
      question: "What is the purpose of the 'yield' keyword in Ruby?",
      options: [
        "To pause execution and return control to the caller",
        "To create a new thread",
        "To handle exceptions",
        "To define a constant"
      ],
      correctAnswer: "To pause execution and return control to the caller",
      explanation: "The 'yield' keyword in Ruby is used to pause the execution of a method and return control to the caller. It's commonly used in blocks and iterators.",
      skillLevel: "advanced",
      technology: "ruby",
      roadmapStep: 3,
      points: 10
    },
    {
      id: 4,
      question: "Which of the following is the correct way to define a module in Ruby?",
      options: [
        "module ModuleName",
        "class ModuleName",
        "def ModuleName",
        "create module ModuleName"
      ],
      correctAnswer: "module ModuleName",
      explanation: "In Ruby, a module is defined using the 'module' keyword followed by the module name. This is the standard syntax for module definition.",
      skillLevel: "intermediate",
      technology: "ruby",
      roadmapStep: 2,
      points: 10
    },
    {
      id: 5,
      question: "What is the difference between 'puts' and 'print' in Ruby?",
      options: [
        "puts adds a newline, print doesn't",
        "print is faster than puts",
        "puts is for strings, print is for numbers",
        "There is no difference"
      ],
      correctAnswer: "puts adds a newline, print doesn't",
      explanation: "The 'puts' method adds a newline after printing the string, while 'print' does not. 'puts' is generally used for strings, and 'print' is used for numbers.",
      skillLevel: "beginner",
      technology: "ruby",
      roadmapStep: 1,
      points: 5
    },
    {
      id: 6,
      question: "Which of the following is a valid way to create a hash in Ruby?",
      options: [
        "{ key: 'value' }",
        "[ key: 'value' ]",
        "( key: 'value' )",
        "< key: 'value' >"
      ],
      correctAnswer: "{ key: 'value' }",
      explanation: "In Ruby, a hash is created using curly braces '{}'. The correct syntax is { key: 'value' }.",
      skillLevel: "beginner",
      technology: "ruby",
      roadmapStep: 1,
      points: 5
    },


  ]
};

interface TestResult {
  totalScore: number;
  correctAnswers: number;
  totalQuestions: number;
  skillLevelBreakdown: {
    beginner: { correct: number; total: number };
    intermediate: { correct: number; total: number };
    advanced: { correct: number; total: number };
    pro: { correct: number; total: number };
  };
  technology: string;
}

interface TestComponentProps {
  questions: QuestionWithExplanation[];
  testId: string;
  onComplete?: () => void;
}

function TestComponent({ questions, testId, onComplete }: TestComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Initialize answers array
  useEffect(() => {
    setAnswers(questions.map(q => ({
      questionId: q.id,
      selectedOption: null,
      isCorrect: false,
      skillLevel: q.skillLevel,
      technology: q.technology
    })));
  }, [questions]);

  const handleAnswer = (questionId: number, selectedOption: string) => {
    setAnswers(prev => prev.map(answer => 
      answer.questionId === questionId 
        ? { ...answer, selectedOption }
        : answer
    ));
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    let totalQuestions = questions.length;

    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question && answer.selectedOption === question.correctAnswer) {
        correctAnswers++;
      }
    });

    return {
      marksScored: correctAnswers * 10, // 10 points per question
      totalMarks: totalQuestions * 10
    };
  };

  const handleSubmit = async () => {
    if (answers.some(a => a.selectedOption === null)) {
      toast.error('Please answer all questions before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const { marksScored, totalMarks } = calculateScore();
      
      // Submit test completion with testId in the body
      await axios.post('/api/test/complete', {
        testId,
        marksScored,
        totalMarks
      });

      toast.success('Test submitted successfully!');
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete();
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error('Failed to submit test. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-8">
        <div 
          className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Question {currentQuestion + 1} of {questions.length}
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-200">{currentQ.question}</p>
        
        <div className="space-y-4">
          {currentQ.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors
                ${answers[currentQuestion]?.selectedOption === option
                  ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-600/50 dark:hover:border-blue-500/50'
                }`}
            >
              <input
                type="radio"
                name={`question-${currentQ.id}`}
                value={option}
                checked={answers[currentQuestion]?.selectedOption === option}
                onChange={() => handleAnswer(currentQ.id, option)}
                className="mr-3 accent-blue-600 dark:accent-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-200">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ChevronLeft className="w-5 h-5" />
            Previous
          </div>
        </button>

        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              Next
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg disabled:opacity-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Test
                  <Send className="w-5 h-5" />
                </>
              )}
            </div>
          </button>
        )}
      </div>
    </div>
  );
}

export default TestComponent;
  