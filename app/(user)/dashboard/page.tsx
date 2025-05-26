'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { toast } from 'react-hot-toast';
import { Trophy, Target, Clock, Award } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface TestStats {
  totalTests: number;
  completedTests: number;
  averageScore: number;
  totalMarksScored: number;
  totalPossibleMarks: number;
  recentTests: {
    testName: string;
    marksScored: number;
    totalMarks: number;
    completedAt: string;
    skillLevel: string;
    technology: string;
  }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<TestStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('Fetching dashboard stats...');
        const response = await axios.get('/api/test/stats');
        // console.log('Dashboard stats response:', response.data);
        if (!response.data.stats) {
          console.error('No stats data in response:', response.data);
          toast.error('Invalid dashboard data received');
          return;
        }
        setStats(response.data.stats);
        console.log('Stats set to state:', response.data.stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        if (axios.isAxiosError(error)) {
          console.error('Axios error details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          });
        }
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">No Test Data Available</h2>
          <p className="text-gray-600 mb-6">Start taking tests to see your progress here!</p>
          <a 
            href="/your-tests" 
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            View Available Tests
          </a>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const scoreData = {
    labels: stats.recentTests.map(test => test.testName),
    datasets: [
      {
        label: 'Score (%)',
        data: stats.recentTests.map(test => (test.marksScored / test.totalMarks) * 100),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const completionData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [stats.completedTests, stats.totalTests - stats.completedTests],
        backgroundColor: ['rgb(99, 102, 241)', 'rgb(209, 213, 219)'],
        borderWidth: 0,
      },
    ],
  };

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Learning Dashboard</h1>
        <a 
          href="/your-tests" 
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Take a Test
        </a>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTests}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.completedTests} completed
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>
              {stats.averageScore.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {getScoreEmoji(stats.averageScore)} Keep going!
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Score</CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalMarksScored}/{stats.totalPossibleMarks}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {((stats.totalMarksScored / stats.totalPossibleMarks) * 100).toFixed(1)}% overall
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((stats.completedTests / stats.totalTests) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.completedTests} of {stats.totalTests} tests completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Line
                data={scoreData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    title: {
                      display: true,
                      text: 'Recent Test Performance',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: 'Score (%)'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Test Name'
                      }
                    }
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Test Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <Doughnut
                data={completionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    title: {
                      display: true,
                      text: 'Test Completion Status',
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tests Table */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Recent Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Test Name</th>
                  <th className="text-left py-3 px-4">Technology</th>
                  <th className="text-left py-3 px-4">Skill Level</th>
                  <th className="text-left py-3 px-4">Score</th>
                  <th className="text-left py-3 px-4">Completed On</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTests.map((test, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{test.testName}</td>
                    <td className="py-3 px-4 capitalize">{test.technology}</td>
                    <td className="py-3 px-4 capitalize">{test.skillLevel}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${getScoreColor((test.marksScored / test.totalMarks) * 100)}`}>
                        {test.marksScored}/{test.totalMarks} ({((test.marksScored / test.totalMarks) * 100).toFixed(1)}%)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(test.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 