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
    const [roadmaps,setRoadmaps]=useState<Roadmap[]>([]);
    const {userData}=useUserStore();
    const totalRoadmaps=userData?.roadmaps?.length;
    const router=useRouter();
    useEffect(()=>{
     getAllRoadmaps();
    },[])
    const getAllRoadmaps=async()=>{
     const response= await axios.get("api/roadmaps");
     console.log("your Roadmaps: ",response.data);
     const data=response.data.roadmaps;
     setRoadmaps(data);
    }
  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center">Roadmaps</h1>
      {totalRoadmaps<3&&(
        <button className='bg-green-700 p-2 ' onClick={()=>router.push("/learning-path")}>add roadmap</button>
      )
      }
      
      <ul className="space-y-4">
        {roadmaps.map((roadmap) => (
          <li
            key={roadmap?._id}
            className="bg-white dark:bg-black dark:text-white text-black p-4 rounded-lg shadow-md"
          >
            <h2 className="text-2xl md:text-4xl text-center font-bold mb-2">{roadmap?.title} Roadmap</h2>
            <div>
              <h3 className="text-lg mb-2 ">Steps:</h3>
              <ul className="list-disc list-inside pl-5">
                {roadmap?.steps?.map((step, index) => (
                 
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
            <div className="mt-3">
              <h3 className="text-lg mb-2">Resources:</h3>
              <ul className="list-disc list-inside pl-5">
                {roadmap?.resources.map((resource:string, index:number) => (
                  <li key={index} className='text-blue-500'><Link href={resource} className='text-blue-500'> <span className='text-blue-500'>{resource}</span></Link></li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Roadmaps
