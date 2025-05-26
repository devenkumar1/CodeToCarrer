'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TestComponent from './TestComponent';
import toast from 'react-hot-toast';

interface Roadmap {
  _id?: string;
  title?: string;
  steps?: string[];
  resources: string[];
}

interface TestMeta {
  _id: string;
  createdAt: string;
  score?: number;
  // Add more fields as needed
}

export default function TestFlow() {
  const [step, setStep] = useState(0); // 0: roadmap, 1: generating, 2: test select, 3: test
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tests, setTests] = useState<TestMeta[]>([]);
  const [selectedTest, setSelectedTest] = useState<TestMeta | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  // Fetch user roadmaps on mount
  useEffect(() => {
    if (step === 0) {
      setIsLoading(true);
      axios.get('/api/roadmaps')
        .then(res => setRoadmaps(res.data.roadmaps || []))
        .catch(() => toast.error('Failed to load roadmaps'))
        .finally(() => setIsLoading(false));
    }
  }, [step]);

  // Fetch user tests after generation or on step 2
  const fetchTests = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/test');
      setTests(res.data.tests || []);
    } catch (e) {
      toast.error('Failed to fetch tests');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate tests for selected roadmap
  const handleGenerateTests = async () => {
    if (!selectedRoadmap) return;
    setIsLoading(true);
    setStep(1); // Show generating state
    try {
      const res = await axios.post('/api/test', { topicName: selectedRoadmap.title });
      if (res.status === 200) {
        await fetchTests();
        setStep(2);
      } else {
        throw new Error('Failed to generate test');
      }
    } catch (e) {
      toast.error('Failed to generate test. Please try again.');
      setStep(0); // Go back to roadmap selection
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch questions for selected test
  const handleSelectTest = async (test: TestMeta) => {
    setIsLoading(true);
    setSelectedTest(test);
    try {
      console.log('Fetching test:', test._id);
      const res = await axios.get(`/api/test/${test._id}`);
      console.log('Test data received:', res.data);
      
      const testData = res.data.test;
      if (!testData || !testData.questions || !Array.isArray(testData.questions)) {
        console.error('Invalid test data:', testData);
        throw new Error('Invalid test data received');
      }

      // Map questions to include required fields
      const mappedQuestions = testData.questions.map((q: any, idx: number) => ({
        id: idx + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        skillLevel: 'intermediate', // Default value since not provided by AI
        technology: test.testName.split(' - ')[1] || 'general', // Extract technology from test name
        explanation: `This question tests your understanding of ${test.testName.split(' - ')[1] || 'the topic'}.`, // Default explanation
        points: 10, // Default points
      }));

      console.log('Mapped questions:', mappedQuestions);

      if (mappedQuestions.length === 0) {
        throw new Error('No questions found in test');
      }

      setQuestions(mappedQuestions);
      setStep(3);
    } catch (e: any) {
      console.error('Error fetching test:', e);
      toast.error(e.response?.data?.message || e.message || 'Failed to fetch test questions');
      setStep(2); // Go back to test selection
    } finally {
      setIsLoading(false);
    }
  };

  // Step 0: Roadmap selection
  if (step === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Select a Roadmap to Generate Test</h2>
        {isLoading ? (
          <div className="text-gray-600 dark:text-gray-300">Loading roadmaps...</div>
        ) : (
          <div className="space-y-4 w-full max-w-md">
            {roadmaps.length === 0 && <div className="text-gray-600 dark:text-gray-300">No roadmaps found. Please add one first.</div>}
            {roadmaps.map((roadmap) => (
              <button
                key={roadmap._id}
                className={`w-full p-4 rounded-lg border text-left font-semibold transition-colors
                  ${selectedRoadmap?._id === roadmap._id 
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500 dark:text-white' 
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'}`}
                onClick={() => setSelectedRoadmap(roadmap)}
              >
                {roadmap.title}
              </button>
            ))}
            <button
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:opacity-50 transition-colors"
              disabled={!selectedRoadmap || isLoading}
              onClick={handleGenerateTests}
            >
              {isLoading ? 'Generating...' : 'Generate Test'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Step 1: Generating tests
  if (step === 1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl mb-4 text-gray-900 dark:text-white">Generating tests for <b>{selectedRoadmap?.title}</b>...</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">This may take a few moments</div>
        {isLoading && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        )}
      </div>
    );
  }

  // Step 2: Test selection
  if (step === 2) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Choose a Test to Attempt</h2>
        {isLoading ? (
          <div className="text-gray-600 dark:text-gray-300">Loading tests...</div>
        ) : (
          <div className="space-y-4 w-full max-w-md">
            {tests.map((test) => (
              <button
                key={test._id}
                className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-left transition-colors"
                onClick={() => handleSelectTest(test)}
              >
                <div className="font-semibold text-gray-900 dark:text-white">{test.testName || `Test ${test._id}`}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{test.questionCount} questions</div>
                <div className="text-xs text-gray-400 dark:text-gray-500">{new Date(test.createdAt).toLocaleString()}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Step 3: Render TestComponent
  if (step === 3 && questions.length > 0) {
    return <TestComponent questions={questions} testId={selectedTest?._id || ''} />;
  }

  return null;
} 