'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CodeReviewResult from '@/components/codeReviewResult'
import { BasicEditor } from '@/components/BasicEditor'

function CodeReviewer() {
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("");
    const [resultData, setResultData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
    }

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value);
    }

    const handleReview = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post('/api/code-reviewer', { language, code });
            console.log("API Response:", response.data);
            setResultData(response.data);
        } catch (error) {
            console.error("Error during code review:", error);
        }finally{
            setLoading(false);
        }
    }
    if(loading){
        return(
            <div className="min-h-screen w-full flex flex-col justify-center items-center bg-white">
                <div className="flex flex-col justify-center items-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            </div>
        )
    }
    return (
        <main className='min-h-screen  dark:bg-black  dark:text-white bg-gray-100 text-black  '>
            <h1 className="text-4xl font-semibold pt-6 mb-3 text-blue-700 text-center">Code Reviewer</h1>
            <div className="w-full min-h-screen flex flex-col md:flex-row md:gap-5 justify-center items-center py-10 px-5 dark:bg-black  dark:text-white bg-gray-100 text-black">
                <form className="w-full max-w-3xl p-5 bg-white dark:bg-[#212121] rounded-lg shadow-md " onSubmit={handleReview}>
                    <div className="mb-5">
                        <label htmlFor="language" className="block text-lg font-medium text-gray-700">Select Language</label>
                        <select
                            id="language"
                            value={language}
                            onChange={handleLanguageChange}
                            className=" px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-black dark:text-white"
                        >
                            <option value="" disabled>Select a language</option>
                            <option value="java">Java</option>
                            <option value="python">Python</option>
                            <option value="cpp">C++</option>
                            <option value="javascript">JavaScript</option>
                            <option value="go">Go</option>
                            <option value="sql">SQL</option>
                        </select>
                    </div>

                    <div className="mb-5">
                        <BasicEditor value={code} onChange={handleCodeChange} language={language} />
                    </div>

                    <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">
                        Submit for Review
                    </button>
                </form>
                {resultData && <CodeReviewResult result={resultData} />}
            </div>
        </main>
    )
}

export default CodeReviewer;

