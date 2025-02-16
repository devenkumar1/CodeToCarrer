import React from 'react';

function CodeReviewResult({ result }: { result: any }) {
  return (
    <div className="w-full max-w-3xl p-5 mt-10 bg-white dark:bg-[#212121] text-black dark:text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Code Review Result</h2>

      <div className="mb-4">
        <strong className="text-lg">Output:</strong>
        <pre className="p-4 bg-gray-200 dark:bg-black rounded-md overflow-x-auto">{result.output || 'No output'}</pre>
      </div>

      <div className="mb-4">
        <strong className="text-lg">Error:</strong>
        <pre className="p-4 bg-red-100 dark:bg-red-500 rounded-md overflow-x-auto">{result.error || 'No errors'}</pre>
      </div>

      <div className="mb-4">
        <strong className="text-lg">Corrected Code:</strong>
        <pre className="p-4 bg-gray-200 dark:bg-blue-400 rounded-md overflow-x-auto">{result.correctedCode || 'No correction available'}</pre>
      </div>

      <div className="mb-4">
        <strong className="text-lg">Review:</strong>
        <div className="p-4 bg-gray-100 dark:bg-gray-400 rounded-md">{result.review || 'No review available'}</div>
      </div>

      <div>
        <strong className="text-lg">Rating:</strong>
        <p className="text-xl font-semibold">{result.rating ? `${result.rating} / 10` : 'No rating'}</p>
      </div>
    </div>
  );
}

export default CodeReviewResult;
