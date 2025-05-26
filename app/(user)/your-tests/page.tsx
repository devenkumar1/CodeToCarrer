'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import TestComponent from '@/components/TestComponent';
import { FiTrash2, FiAlertTriangle } from 'react-icons/fi';

interface Test {
  _id: string;
  testName: string;
  createdAt: string;
  questionCount: number;
}

export default function YourTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/test');
      setTests(res.data.tests || []);
    } catch (error) {
      console.error('Error fetching tests:', error);
      toast.error('Failed to load tests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTest = async (test: Test) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/test/${test._id}`);
      const testData = res.data.test;
      
      if (!testData || !testData.questions || !Array.isArray(testData.questions)) {
        throw new Error('Invalid test data received');
      }

      setQuestions(testData.questions);
      setSelectedTest(test);
    } catch (error: any) {
      console.error('Error fetching test:', error);
      toast.error(error.response?.data?.message || 'Failed to load test questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete all tests? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await axios.delete('/api/test/delete-all');
      toast.success(`Successfully deleted ${response.data.deletedCount} tests`);
      setTests([]); // Clear the tests array
      setShowDeleteModal(false);
    } catch (error: any) {
      console.error('Error deleting tests:', error);
      toast.error(error.response?.data?.error || 'Failed to delete tests');
    } finally {
      setIsDeleting(false);
    }
  };

  if (selectedTest && questions.length > 0) {
    return <TestComponent questions={questions} testId={selectedTest._id} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Tests</h1>
          <div className="flex gap-4">
            {tests.length > 0 && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <FiTrash2 className="w-5 h-5" />
                Delete All
              </button>
            )}
            <button
              onClick={() => router.push('/test')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Generate New Test
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <FiAlertTriangle className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete All Tests</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete all your tests? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAll}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete All'}
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        ) : tests.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">No Tests Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't generated any tests yet.</p>
            <button
              onClick={() => router.push('/test')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Generate Your First Test
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tests.map((test) => (
              <div
                key={test._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleSelectTest(test)}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {test.testName}
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <p>{test.questionCount} questions</p>
                  <p>Created: {new Date(test.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  className="mt-4 w-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTest(test);
                  }}
                >
                  Start Test
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 