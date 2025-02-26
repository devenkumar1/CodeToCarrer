'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';

interface Roadmap {
  _id?: string;
  title?: string;
  steps?: string[];
  resources: string[];
}

function Roadmaps() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const { userData } = useUserStore();
  const totalRoadmaps = userData?.roadmaps?.length;
  const router = useRouter();

  useEffect(() => {
    getAllRoadmaps();
  }, []);

  const getAllRoadmaps = async () => {
    const response = await axios.get("api/roadmaps");
    console.log("Your Roadmaps: ", response.data);
    const data = response.data.roadmaps;
    setRoadmaps(data);
  };

  const handleStepCompletion = (roadmapId: string, stepIndex: number) => {
    setRoadmaps(prevRoadmaps =>
      prevRoadmaps.map(roadmap =>
        roadmap._id === roadmapId
          ? {
            ...roadmap,
            steps: roadmap.steps?.map((step, index) =>
              index === stepIndex ? `${step} (Completed)` : step
            )
          }
          : roadmap
      )
    );
  };

  const calculateCompletionPercentage = (steps: string[]) => {
    const completedSteps = steps.filter(step => step.includes('(Completed)')).length;
    return (completedSteps / steps.length) * 100;
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center">Roadmaps</h1>
      {totalRoadmaps < 3 && (
        <button className='bg-green-700 p-2' onClick={() => router.push("/learning-path")}>Add Roadmap</button>
      )}

      <ul className="space-y-4">
        {roadmaps.map((roadmap) => (
          <li key={roadmap?._id} className="bg-white dark:bg-black dark:text-white text-black p-4 rounded-lg shadow-md">
            <h2 className="text-2xl md:text-4xl text-center font-bold mb-2">{roadmap?.title} Roadmap</h2>
            <div>
              <h3 className="text-lg mb-2">Steps:</h3>
              <div className="space-y-2 pl-5">
                {roadmap?.steps?.map((step, index) => {
                  const isCompleted = step.includes('(Completed)');
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        aria-label={`Step ${index + 1}: ${step}`}
                        checked={isCompleted}
                        onChange={() => handleStepCompletion(roadmap._id!, index)}
                        disabled={isCompleted}
                      />
                      <span className={isCompleted ? 'line-through text-gray-500' : ''}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Completion Progress */}
            <div className="mt-3">
              <h3 className="text-lg mb-2">Completion Progress:</h3>
              <div className="h-2 bg-gray-300 rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${calculateCompletionPercentage(roadmap?.steps || [])}%`
                  }}
                ></div>
              </div>
              <div className="mt-2 text-center text-gray-500">
                {Math.round(calculateCompletionPercentage(roadmap?.steps || []))}% Complete
              </div>
            </div>

            <div className="mt-3">
              <h3 className="text-lg mb-2">Resources:</h3>
              <ul className="list-disc list-inside pl-5">
                {roadmap?.resources.map((resource: string, index: number) => (
                  <li key={index} className='text-blue-500'>
                    <Link href={resource}>
                      <span className='text-blue-500'>{resource}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Roadmaps;
