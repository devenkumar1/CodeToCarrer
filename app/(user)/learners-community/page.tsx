'use client'
import React, { FormEvent, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import CommunityPost from '@/components/CommunityPost';
import toast from 'react-hot-toast';
import axios from 'axios';

function LearnersCommunity() {
  const { userData } = useUserStore();
  const [isVisible, setIsVisible] = useState(false); // State to control popup visibility
  const [formData, setFormData] = useState({ title: '', description: '', tags: [] as string[] });

  const handlePopup = () => {
    setIsVisible(!isVisible);
  };

  // Function to handle form data change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to handle form submission
  const handlePostSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Add the userId to the formData
      const postData = { ...formData, userId: userData?._id };
      
      setIsVisible(false); // Close the form

      // Make the POST request to the backend
      const response = await axios.post("/api/community/post", postData);

      // Handle successful response
      console.log(response.data);
      toast.success("Post created successfully!");
    } catch (error) {
      // Handle error response
      console.error(error);
      toast.error("Error: Post not created.");
      setIsVisible(false); // Close the form on error
    }
  };

  // Function to handle tags input change
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  return (
    <div className='w-full min-h-screen dark:bg-black bg-white flex flex-col pt-3 items-center '>
      <h1 className='md:text-3xl text-2xl'>Hi {userData?.name}, welcome to</h1>
      <span>Learners community - discuss, ask your doubts, and solve others.</span>

      {/* Ask button triggers popup visibility */}
      <button 
        className='bg-blue-600 py-2 px-4 text-center rounded-md mt-3' 
        onClick={handlePopup}
      >
        Ask?
      </button>

      {/* Popup form */}
      <form 
        className={`flex-col w-full justify-center items-center mt-2 ${isVisible ? 'flex' : 'hidden'}`} 
        onSubmit={handlePostSubmit}
      >
        <input 
          type="text" 
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          className="mt-2 p-3 rounded-md w-1/2 h-14"
        />
        <textarea 
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          className="mt-2 p-3 rounded-md w-1/2 h-32"
        />
        <input 
          type="text" 
          name="tags" 
          placeholder="Tags (comma-separated)"
          value={formData.tags.join(',')}
          onChange={handleTagsChange}
          className="mt-2 p-3 rounded-md w-1/2 h-14"
        />
        <button 
          type="submit" 
          className="bg-blue-600 px-5 py-2 mt-2 rounded-md max-w-[10vw]"
        >
          Post
        </button>
      </form>
     <br />
      <CommunityPost />
    </div>
  );
}

export default LearnersCommunity;
