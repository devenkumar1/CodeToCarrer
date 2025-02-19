"use client"
import React, { useState } from 'react';

const LanguagePopup = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [customLanguage, setCustomLanguage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the next step with the selected language
        // console.log('Selected Language:', selectedLanguage);
        // if (selectedLanguage === 'Other') {
        //     console.log('Custom Language:', customLanguage);
        // }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-16 w-[100vh]  h-[85vh]">
                <h2 className="text-2xl font-semibold mb-4 text-center">Choose Your Path</h2>
                <blockquote className="text-gray-600 italic mb-6 text-center">
                    "The best way to predict the future is to invent it." - Alan Kay
                </blockquote>
                <h3 className="text-xl font-semibold mb-6 text-center">Which Programming Language Do You Want to Learn?</h3>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col space-y-4 mb-6">
                        {['JavaScript', 'Python', 'Java', 'Ruby', 'Go', 'Other'].map((language) => (
                            <label className="flex items-center" key={language}>
                                <input 
                                    type="radio" 
                                    name="language" 
                                    value={language} 
                                    onChange={(e) => {
                                        setSelectedLanguage(e.target.value);
                                        if (e.target.value !== 'Other') {
                                            setCustomLanguage(''); // Clear custom language if not "Other"
                                        }
                                    }} 
                                    className="mr-2 text-blue-600 focus:ring-blue-500"
                                />
                                <span>{language}</span>
                            </label>
                        ))}
                    </div>
                    {selectedLanguage === 'Other' && (
                        <input 
                            type="text" 
                            placeholder="Please specify..." 
                            value={customLanguage} 
                            onChange={(e) => setCustomLanguage(e.target.value)} 
                            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                        />
                    )}
                    <p className="text-gray-500 text-center mb-2">Select a programming language to start your journey!</p>
                    <button type="submit" className="flex items-center justify-center w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200">
                        Next Step
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5-5 5M6 12h12"></path>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LanguagePopup;