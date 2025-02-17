'use client'
import MentorChatContainer from '@/components/MentorChatContainer'
import React from 'react'

function AiMentor() {
  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white flex md:flex-row'>
      {/* Sidebar */}
      <div className='w-[20vw] md:w-[15vw] bg-indigo-600 dark:bg-indigo-800 min-h-screen text-center border-r border-gray-700 md:p-6 '>
        <h2 className='md:text-lg text-sm font-semibold text-white'>Chat History</h2>
        <div className='mt-6'>
          <ul className='space-y-2'>
            <li className='text-sm text-gray-200 dark:text-gray-300'>Previous Chats</li>
            <li className='text-sm text-gray-200 dark:text-gray-300'>Chat 1</li>
            <li className='text-sm text-gray-200 dark:text-gray-300'>Chat 2</li>
            <li className='text-sm text-gray-200 dark:text-gray-300'>Chat 3</li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className='w-full flex justify-center items-center flex-col md:p-6'>
        <h1 className='md:text-4xl text-2xl font-semibold text-indigo-700 dark:text-indigo-300 md:mt-10 mt-2'>Chat with AI Mentor</h1>
        <MentorChatContainer />
      </div>
    </div>
  )
}

export default AiMentor
