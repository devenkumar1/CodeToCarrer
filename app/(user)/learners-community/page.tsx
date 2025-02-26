'use client'
import React from 'react'
import { useUserStore } from '@/store/userStore'
function LearnersCommunity() {
    const {userData}=useUserStore();
  return (
    <div className='w-full min-h-screen dark:bg-black bg-white flex flex-col pt-3 items-center '>
        <h1 className='md:text-3xl text-2xl'>Hi {userData?.name}, welcome to</h1>
        <span>Learners community - discuss, ask your doubts and solve others.</span>
        <form  className='flex flex-col w-full justify-center items-center mt-2'>
        <input type="text" placeholder='ask anything?' className='p-2 rounded-md w-1/4'/>
        <button className='bg-blue-600 px-5 py-2 mt-2 rounded-md max-w-[10vw]'>Post</button>
        
        </form>
         </div>
  )
}

export default LearnersCommunity