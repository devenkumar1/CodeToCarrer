'use client';

import React, { useState } from 'react';
import { FiMessageSquare, FiPlus, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Chat {
  _id: string;
  title: string;
  createdAt: string;
}

interface SidebarProps {
  chats: Chat[];
  onChatSelect: (chatId: string) => void;
  selectedChatId: string | null;
  onNewChat: () => void;
}

export default function Sidebar({ chats, onChatSelect, selectedChatId, onNewChat }: SidebarProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete all chats? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await axios.delete('/api/chat/delete-all');
      toast.success(`Successfully deleted ${response.data.deletedCount} chats`);
      router.refresh(); // Refresh the page to update the chat list
      setShowDeleteModal(false);
    } catch (error: any) {
      console.error('Error deleting chats:', error);
      toast.error(error.response?.data?.error || 'Failed to delete chats');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* New Chat Button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chats.map((chat) => (
          <button
            key={chat._id}
            onClick={() => onChatSelect(chat._id)}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-left
              ${selectedChatId === chat._id
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
              }`}
          >
            <FiMessageSquare className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">{chat.title || 'New Chat'}</span>
          </button>
        ))}
      </div>

      {/* Delete All Button - Fixed at bottom */}
      {chats.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <FiTrash2 className="w-5 h-5" />
            Delete All Chats
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <FiAlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete All Chats</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete all your chats? This action cannot be undone.
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
    </div>
  );
} 