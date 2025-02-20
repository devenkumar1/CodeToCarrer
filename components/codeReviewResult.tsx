"use client";
import { useState } from "react";
import React from "react";

function CodeReviewResult({ result }: { result: any }) {
  const [showOutput, setShowOutput] = useState(false);
  return (
    <div className="w-full max-w-3xl p-5  bg-white dark:bg-[#212121] text-black dark:text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Code Review Result</h2>

      <div className="mb-4">
        <strong className="text-lg">Output:</strong>
        <pre className="p-4 bg-gray-200 dark:bg-black rounded-md overflow-x-auto">
          {result.output || "No output"}
        </pre>
      </div>
      <div>
        <strong className="text-lg">Rating:</strong>
        <p className="text-xl font-semibold">
          {result.rating ? `${result.rating} / 10` : "No rating"}
        </p>
      </div>

      {showOutput && (
        <>
          <div className="mb-4">
            <strong className="text-lg">Error:</strong>
            <pre className="p-4 bg-red-100 dark:bg-red-500 rounded-md overflow-x-auto">
              {result.error || "No errors"}
            </pre>
          </div>

          <div className="mb-4">
            <strong className="text-lg">Corrected Code:</strong>
            <pre className="p-4 bg-gray-200 dark:bg-blue-400 rounded-md overflow-x-auto">
              {result.correctedCode || "No correction available"}
            </pre>
          </div>

          <div className="mb-4">
            <strong className="text-lg">Review:</strong>
            <div className="p-4 bg-gray-100 dark:bg-gray-400 rounded-md">
              {result.review || "No review available"}
            </div>
          </div>
        </>
      )}
      <button
        type="button"
        onClick={() => setShowOutput(!showOutput)}
        className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        {showOutput ? "Show less" : "Show review"}
      </button>
    </div>
  );
}

export default CodeReviewResult;
