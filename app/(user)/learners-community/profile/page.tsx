'use client';

import { format } from 'date-fns';
import { FiEdit2, FiMail, FiCalendar, FiMessageSquare, FiThumbsUp } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

export default function ProfilePage() {
  const { userData, setUserData } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userData?.name || '');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!userData) {
        await setUserData();
      }
      setIsLoading(false);
    };
    fetchData();
  }, [userData, setUserData]);

  const handleUpdateProfile = async () => {
    if (!editedName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      await axios.put('/api/learners-community/profile', { name: editedName });
      toast.success('Profile updated successfully');
      setIsEditing(false);
      await setUserData(); // Refresh user data
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Profile Not Found</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Unable to load profile information. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-2xl text-blue-600 dark:text-blue-400 font-medium">
                {userData.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    aria-label="Edit name"
                    placeholder="Enter your name"
                  />
                  <button
                    onClick={handleUpdateProfile}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedName(userData.name);
                    }}
                    className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{userData.name}</h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    aria-label="Edit profile"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <FiMail className="w-4 h-4 mr-2" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <FiCalendar className="w-4 h-4 mr-2" />
                  <span>Joined {format(new Date(userData.createdAt), 'MMMM yyyy')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {typeof userData?.questionsAsked === 'number' ? userData.questionsAsked : 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Questions Asked</div>
          </div>
        </div>
      </div>

      {/* Recent Questions */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Questions</h2>
        {Array.isArray(userData?.recentQuestions) && userData.recentQuestions.length > 0 ? (
          <div className="space-y-4">
            {userData.recentQuestions.map((question: any) => (
              <article
                key={question._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {question.title || 'Untitled Question'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {question.description || 'No description provided'}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {Array.isArray(question.tags) && question.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <FiThumbsUp className="w-4 h-4 mr-1" />
                      <span>{question.likes || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <FiMessageSquare className="w-4 h-4 mr-1" />
                      <span>{question.answers || 0}</span>
                    </div>
                  </div>
                  <time>{format(new Date(question.createdAt), 'MMM dd, yyyy')}</time>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              You haven't asked any questions yet. Start by asking your first question!
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 