'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiUser } from 'react-icons/fi';
import { useEffect, useState, createContext, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Define types for our context
interface CommunityData {
  stats: {
    totalQuestions: number;
    totalUsers: number;
  };
}

// Create context
const CommunityContext = createContext<{
  data: CommunityData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}>({
  data: null,
  isLoading: true,
  error: null,
  refetch: async () => {},
});

// Custom hook to use community data
export const useCommunityData = () => useContext(CommunityContext);

export default function LearnerCommunityLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [data, setData] = useState<CommunityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/learners-community/data');
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching community data:', error);
      toast.error('Failed to load community data');
      setError('Failed to load community data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
  return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  // Ensure we have data before rendering
  if (!data || !data.stats) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500 dark:text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  return (
    <CommunityContext.Provider value={{ data, isLoading, error, refetch: fetchData }}>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <div className="hidden lg:flex flex-col w-64 border-r border-gray-200 dark:border-gray-700">
          <div className="flex-1 overflow-y-auto">
            <nav className="p-4 space-y-1">
              <Link
                href="/learners-community"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                  pathname === '/learners-community'
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <FiHome className="w-5 h-5 mr-3" />
                Home
              </Link>
              <Link
                href="/learners-community/profile"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                  pathname === '/learners-community/profile'
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <FiUser className="w-5 h-5 mr-3" />
                Profile
              </Link>
            </nav>
          </div>

          {/* Community Stats - Fixed at bottom */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">Community Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Questions</span>
                  <span className="font-medium">{data.stats.totalQuestions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Users</span>
                  <span className="font-medium">{data.stats.totalUsers}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 min-h-screen">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {children}
        </div>
      </div>

      {/* Mobile bottom navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-around">
            <Link
              href="/learners-community"
              className={`flex flex-col items-center py-2 px-4 ${
                pathname === '/learners-community'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <FiHome className="w-6 h-6" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link
              href="/learners-community/profile"
              className={`flex flex-col items-center py-2 px-4 ${
                pathname === '/learners-community/profile'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <FiUser className="w-6 h-6" />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </CommunityContext.Provider>
  );
}
