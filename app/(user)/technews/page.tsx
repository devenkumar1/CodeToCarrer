'use client';
import React, { useEffect, useState } from 'react';
import { Clock, User, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { set } from 'mongoose';
import LoadingSkeleton from '@/components/Skeleton/LoadingSkeleton';

interface NewsArticle {
  _id:string;
  title: string;
  imageUrl: string;
  url: string;
  author: string;
  publishedAt:Date;
  description:string;
}



function TechNews() {
  const [news,setNews]=useState<NewsArticle[]>([]);
  const [loading,setLoading]=useState(false);
useEffect(()=>{
 
getAllNews();
},[])

const getAllNews=async()=>{
  try {
  setLoading(true);
  const response=await axios.get('/api/news');
  // console.log(response.data);
  const all=response.data.allNews;
  setNews(all);
  // console.log(news);
} catch (error) {
  console.log("error occured in fetching news",error);
}finally{

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Latest News</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {news.map((article) => (
            <article  key={article._id} 
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48 overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            
              
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {article.title}
                </h2>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <User size={16} className="mr-1" />
                  <span className="mr-4">{article.author}</span>
                  <Clock size={16} className="mr-1" />
                  <span>{new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {article.description}
                  </p>
                </div>
                
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                   Read More
                  <ExternalLink size={16} className="ml-1" />
                </a>
              </div>
            </article> ))}
        </div>
      </main>
    </div>
  );
}

export default TechNews;
