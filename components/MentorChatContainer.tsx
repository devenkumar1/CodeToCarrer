'use client'
import React, { useState, useRef, useEffect } from 'react'

function MentorChatContainer() {
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = () => {
    console.log("Sent message:", message)
    setMessage('');
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [message])

  return (
    <div className='bg-white dark:bg-gray-800 w-full max-w-4xl md:m-auto h-[60vh] md:h-[70vh] overflow-y-auto rounded-lg shadow-lg flex flex-col'>
      <div className='p-6 flex-1 overflow-y-auto'>
        <h2 className='text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4'>Chat Area</h2>
        <div className='space-y-4'>
          <div className='bg-indigo-50 dark:bg-indigo-700 p-4 rounded-lg shadow-md'>
            <p className='text-gray-800 dark:text-gray-200'>Hi, how can I help you today?</p>
          </div>
          <div className='bg-indigo-50 dark:bg-slate-400 p-4 rounded-lg shadow-md'>
            <p className='text-gray-800 dark:text-gray-200'>I need assistance with my project.</p>
          </div>
          <div ref={messagesEndRef}></div>
        </div>
      </div>

      <div className='bg-indigo-600 dark:bg-indigo-800 p-4 border-t border-indigo-500 flex items-center'>
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Type your message...'
          className='w-full p-3 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white'
        />
        <button
          onClick={handleSendMessage}
          className='ml-4 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 dark:bg-indigo-700 dark:hover:bg-indigo-600'
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default MentorChatContainer
