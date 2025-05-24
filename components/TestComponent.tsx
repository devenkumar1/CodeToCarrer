'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Send, CheckCircle, XCircle } from 'lucide-react';
import { Question, UserAnswer } from '@/questiontypes';
import { useUserStore } from '@/store/userStore';
import axios from 'axios';
import toast from 'react-hot-toast';

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

  function TestComponent() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [questions, setQuestions] = useState<QuestionWithExplanation[]>([]);
  const { userData } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTechnology, setSelectedTechnology] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

// useEffect(()=>{
//   getallQuestions("Java");
// })

async function getallQuestions(topic:string){
  const ress=await axios.post('/api/test',{topicName:topic});
  console.log("backend sent this to frontend",ress.data);
}




  useEffect(() => {
    const fetchUserRoadmap = async () => {
      try {
        if (userData?.roadmaps?.length > 0) {
          // In production, replace this with actual API call
          // const response = await axios.get(`/api/roadmap/${userData.roadmaps[0]}`);
          // const roadmap = response.data;
          // setSelectedTechnology(roadmap.title.toLowerCase());
          
          // For now, using mock data
          setSelectedTechnology("Java"); // This would come from the roadmap
          setQuestions(mockQuestionsByTechnology["ruby"] || []);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching roadmap:', error);
        toast.error('Failed to load roadmap');
        setIsLoading(false);
      }
    };

    fetchUserRoadmap();
  }, [userData]);
  
    const handleOptionSelect = (selectedOption: string) => {
      setUserAnswers(prev => {
      const currentQuestion = questions[currentQuestionIndex];
        const existingAnswerIndex = prev.findIndex(a => a.questionId === currentQuestion.id);
      
      const isCorrect = selectedOption === currentQuestion.correctAnswer;
        
        if (existingAnswerIndex !== -1) {
          const newAnswers = [...prev];
          newAnswers[existingAnswerIndex] = {
            questionId: currentQuestion.id,
          selectedOption,
          isCorrect,
          skillLevel: currentQuestion.skillLevel,
          technology: currentQuestion.technology
          };
          return newAnswers;
        }
        return [...prev, {
            questionId: currentQuestion.id,
        selectedOption,
        isCorrect,
        skillLevel: currentQuestion.skillLevel,
        technology: currentQuestion.technology
          }];
        });
      };

      const handlePrevious = () => {
        setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
      };

      const handleNext = () => {
    setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1));
  };

  const calculateScore = (): TestResult => {
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
    const totalQuestions = questions.length;
    const totalScore = (correctAnswers / totalQuestions) * 100;

    const skillLevelBreakdown = {
      beginner: { correct: 0, total: 0 },
      intermediate: { correct: 0, total: 0 },
      advanced: { correct: 0, total: 0 },
      pro: { correct: 0, total: 0 }
    };

    questions.forEach((question, index) => {
      const answer = userAnswers.find(a => a.questionId === question.id);
      skillLevelBreakdown[question.skillLevel as keyof typeof skillLevelBreakdown].total++;
      if (answer?.isCorrect) {
        skillLevelBreakdown[question.skillLevel as keyof typeof skillLevelBreakdown].correct++;
      }
    });

    return {
      totalScore,
      correctAnswers,
      totalQuestions,
      skillLevelBreakdown,
      technology: selectedTechnology
    };
  };

  const handleSubmit = async () => {
    try {
      const result = calculateScore();
      setTestResult(result);
      setShowResults(true);

      // Update roadmap progress
      // In production, replace with actual API call
      // await axios.post('/api/roadmap/progress', {
      //   roadmapId: userData?.roadmaps[0],
      //   score: result.totalScore,
      //   answers: userAnswers,
      //   skillLevelBreakdown: result.skillLevelBreakdown
      // });

      console.log('Test submitted:', { result, userAnswers });
      toast.success('Test submitted successfully!');
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error('Failed to submit test');
    }
  };

  const renderResults = () => {
    if (!testResult) return null;

    const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-green-600';
      if (score >= 60) return 'text-yellow-600';
      return 'text-red-600';
    };

    const getScoreEmoji = (score: number) => {
      if (score >= 80) return '🎉';
      if (score >= 60) return '👍';
      return '💪';
    };

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Test Results</h2>
          <p className="text-gray-600">Here's how you performed in the {testResult.technology.toUpperCase()} assessment</p>
        </div>
        
        {/* Overall Score Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 mb-8 text-white shadow-lg transform hover:scale-105 transition-transform">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Overall Score</h3>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-5xl font-bold">{testResult.totalScore.toFixed(1)}%</span>
              <span className="text-2xl">{getScoreEmoji(testResult.totalScore)}</span>
            </div>
            <p className="mt-2 text-blue-100">
              {testResult.correctAnswers} out of {testResult.totalQuestions} questions correct
            </p>
          </div>
        </div>

        {/* Skill Level Breakdown */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-6 text-center">Skill Level Breakdown</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(testResult.skillLevelBreakdown).map(([level, stats]) => {
              const score = (stats.correct / stats.total) * 100;
              return (
                <div key={level} className="bg-white rounded-lg p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold capitalize mb-3 text-lg">{level}</h4>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">{stats.correct}/{stats.total}</span>
                    <span className={`font-bold ${getScoreColor(score)}`}>
                      {score.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Review */}
        <div>
          <h3 className="text-2xl font-semibold mb-6 text-center">Question Review</h3>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const answer = userAnswers.find(a => a.questionId === question.id);
              const isCorrect = answer?.isCorrect;
              return (
                <div 
                  key={question.id} 
                  className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-lg">Question {index + 1}</span>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      <p className="text-gray-800 text-lg">{question.question}</p>
                    </div>
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="font-semibold text-gray-700">Your answer:</p>
                      <p className={`mt-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {answer?.selectedOption}
                      </p>
                    </div>

                    {!isCorrect && (
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="font-semibold text-green-700">Correct answer:</p>
                        <p className="mt-1 text-green-600">{question.correctAnswer}</p>
                      </div>
                    )}

                    <div className="mt-4">
                      <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <span>{showExplanation ? 'Hide' : 'Show'} Explanation</span>
                        <svg
                          className={`w-4 h-4 transform transition-transform ${
                            showExplanation ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {showExplanation && (
                        <div className="mt-3 bg-blue-50 rounded-lg p-4">
                          <p className="text-blue-800">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retake Test
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading questions...</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">No questions available</h2>
          <p className="text-gray-600">
            {selectedTechnology 
              ? `No questions available for ${selectedTechnology.toUpperCase()} yet.`
              : "Please select a learning path first."}
          </p>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {renderResults()}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
      const currentAnswer = userAnswers.find(a => a.questionId === currentQuestion.id);

      return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              {/* Progress bar */}
              <div className="mb-8">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            <p className="text-sm text-gray-600">
              Skill Level: {currentQuestion.skillLevel} | Technology: {currentQuestion.technology}
            </p>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuestion.question}
            </h2>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    currentAnswer?.selectedOption === option
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center px-4 py-2 rounded-md ${
                currentQuestionIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </button>

            {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Send className="w-5 h-5 mr-2" />
              Submit Test
            </button>
             ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              )}
              <button onClick={()=>getallQuestions("react")}>generate a test</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default TestComponent;
  