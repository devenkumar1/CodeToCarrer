'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Link from 'next/link';


function Roadmaps() {
    const [roadmaps,setRoadmaps]=useState([]);
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
      <ul className="space-y-4">
        {roadmaps.map((roadmap) => (
          <li
            key={roadmap?._id}
            className="bg-white dark:bg-black dark:text-white text-black p-4 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-semibold mb-2">{roadmap?.title}</h2>
            <div>
              <h3 className="font-medium">Steps:</h3>
              <ul className="list-disc list-inside pl-5">
                {roadmap?.steps?.map((step, index) => (
                 
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
            <div className="mt-3">
              <h3 className="font-medium">Resources:</h3>
              <ul className="list-disc list-inside pl-5">
                {roadmap?.resources.map((resource, index) => (
                       <Link key={index }  href={resource}>{resource} <br /></Link>
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
