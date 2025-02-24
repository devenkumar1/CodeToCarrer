'use client'
import React, { useEffect, useState } from 'react'
import { Code2, Send, Loader2 } from 'lucide-react';
import axios from 'axios'
import CodeReviewResult from '@/components/codeReviewResult'
import { BasicEditor } from '@/components/BasicEditor'
import LoadingSkeleton from '@/components/Skeleton/LoadingSkeleton'
import toast from 'react-hot-toast';

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
        if(!code || !language){
            toast.error("Please enter code and select a language");
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post('/api/code-reviewer', { language, code });
            console.log("API Response:", response.data);
            setResultData(response.data);
        } catch (error) {
            console.error("Error during code review:", error);
        } finally {
            setLoading(false);
        }
    }
   
    if(loading){
      return(
        <div className="min-h-screen w-full flex flex-col justify-center items-center ">
       <LoadingSkeleton/>
          </div>
      )
    }
  
    return (
        <main className='min-h-screen  dark:bg-black  dark:text-white bg-gray-100 text-black  '>
            <div className="flex items-center justify-center gap-3 text-center ">
                <Code2 className="h-10 w-10 text-blue-600 mt-7" />
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mt-7">
                    Code Reviewer
                </h1>
            </div>

            <p className="mt-3 text-center text-lg text-gray-600 dark:text-gray-400">
                Get instant feedback on your code quality and suggestions for improvement
            </p>
            <div className="w-full min-h-screen flex flex-col md:flex-row md:gap-5 justify-center items-center py-10 px-5 dark:bg-black  dark:text-white bg-gray-100 text-black">
                <form className="w-full max-w-3xl p-5 bg-white dark:bg-[#212121] rounded-lg shadow-md " onSubmit={handleReview}>
                <div className="mb-5 flex md:flex-row flex-col md:justify-between items-center gap-5">
       <div className="flex flex-col md:flex-row gap-2 md:gap-0 items-start md:items-center">
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
    <button type="submit" className="md:w-[20%] w-[35%] px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 md:self-center">
        Run
    </button>
</div>
                    <div className="mb-5">
                        <BasicEditor value={code} onChange={handleCodeChange} language={language} />
                    </div>
                </form>
                {resultData && <CodeReviewResult result={resultData} />}
            </div>
        </main>
    )
}

export default CodeReviewer;

