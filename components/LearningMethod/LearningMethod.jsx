
'use client'
import React from 'react'

export  function LearningMethod() {
  return (
    <div className='min-h-screen w-full flex flex-col justify-center items-center'> 
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-3/4 max-w-md h-auto">
        <h2 className="text-2xl font-semibold mb-4 pt-4 text-center">
          Learning Preference
        </h2>
        <h3 className="text-xl font-semibold mb-6 text-center">
          How do you prefer to learn?
        </h3>
        <form id="learning-preference-form">
          <div className="flex flex-col space-y-4 mb-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="learning"
                value="Hands-on Projects"
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span>Hands-on Projects</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="learning"
                value="Theoretical Knowledge"
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span>Theoretical Knowledge</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="learning"
                value="Interactive Challenges"
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span>Interactive Challenges</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="learning"
                value="Video Tutorials"
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span>Video Tutorials</span>
            </label>
          </div>
          <p className="text-gray-500 text-center mb-6">
            Please select your preferred learning method.
          </p>
          <button
            type="submit"
            className="flex items-center justify-center w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Submit Preference
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5-5 5M6 12h12"
              ></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  </div>
  )
}

export default LearningMethod
