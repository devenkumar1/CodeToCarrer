'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useEffect } from 'react';
import Link from 'next/link';
import { IoHome } from "react-icons/io5";
import Image from 'next/legacy/image';

interface NavbarProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

function Navbar({ isDarkMode, setIsDarkMode }: NavbarProps) {
  const { data: session } = useSession(); // Check if user is authenticated
  const router = useRouter();

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

    const {userData,setUserData,logoutUser}=useUserStore();
  useEffect(()=>{
  try {
    setUserData();
  } catch (error) {
    
  }
  },[])

  return (
    <div className="navbar  dark:text-white text-black">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>

          {/*Logged in   (mobile) */}
          {
            session?  <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
          >
            <li><Link href={"/home"}>Home</Link></li>
            <li>
              <Link href={"/dashboard"}>dashboard</Link>
              <ul className="p-2">
                <li><Link href={"/AiMentor"}>Ai Mentor</Link></li>
                <li><Link href={"/code-reviewer"}>code editor</Link></li>
              </ul>
            </li>
            <li><Link href={"/learning-path"}>Learning paths</Link></li> 
            <li><Link href={"/jobs"}>Jobs</Link></li>
            <br />
            <p>more...</p>
              <ul className="p-2">
              <li><Link href={"/technews"}>Tech News </Link></li>
              <li><Link href={"/learners-community"}>learners community</Link></li>
              </ul>
          </ul>: <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
          >
            <li><Link href={"/"}>Home</Link></li>
            <li><Link href={"/"}>Login</Link></li>
          </ul>
          
          }
          {/*Not logged In */}
         
        </div>
        {session ? (
          <div className="h-full">
            <Link href="/home" className='flex  items-center justify-center gap-2'><Image src="/icons/icon-152x152.png" alt="logo" width={35} height={35} className='rounded-lg'/> <h1 className='text-2xl  mt-1 font-bold '>  CodeToCareer</h1></Link>
          </div>
        ) : (
          <div className=" h-full">
            <Link href="/" className='flex  items-center justify-center gap-2'><Image src="/icons/icon-152x152.png" alt="logo" width={40} height={40} className='rounded-lg'/> <h1 className='text-2xl font-bold mt-1'> CodeToCareer</h1></Link>
          </div>
        )}
      </div>



{session ? (
   <div className="navbar-center hidden lg:flex">
   <ul className="menu menu-horizontal px-1 text-lg font-bold">
     <li><Link href={"/learning-path"}>Learning paths </Link></li>
     <li>
       <details>
         <summary>Learning</summary>
         <ul className="p-2 w-[12vw] z-20 dark:bg-black bg-slate-100">
           <li><Link href={"/AiMentor"}>AI Mentor </Link></li>
           <li><Link href={"/test"}>Test</Link></li>
         </ul>
       </details>
     </li>
     <li><Link href={"/jobs"}>Jobs</Link></li>
     <li><Link href={"/code-reviewer"}>Code Editor</Link></li>
     <li>
       <details>
         <summary>More</summary>
         <ul className="p-2 w-[12vw] z-20 dark:bg-black bg-slate-100">
           <li><Link href={"/technews"}>Tech News </Link></li>
           <li><Link href={"/learners-community"}>learners community</Link></li>
           <li><Link href={"/profile"}>profile</Link></li>
           <li><Link href={"/jobs"}>Jobs</Link></li>
         </ul>
       </details>
     </li>
   </ul>
 </div>
):(
  <div className="navbar-center hidden lg:flex">
  <ul className="menu menu-horizontal px-1">
    <li><a>Home</a></li>
    <li><a>About</a></li>
  </ul>
</div>
)

}
      <div className="navbar-end flex gap-2">
        {session ? (
          <button className="btn bg-red-500 text-white" onClick={() => signOut()}>Logout</button>
        ) : (
          <button className="btn bg-white dark:bg-slate-800" onClick={() => router.push("/auth/login")}>Login</button>
        )}
        <label className="swap swap-rotate">
          <input type="checkbox" checked={isDarkMode} onChange={handleThemeToggle} />
          {/* Sun icon */}
          <svg
            className="swap-on h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
            />
          </svg>
          {/* Moon icon */}
          <svg
            className="swap-off h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
            />
          </svg>
        </label>
      </div>
    </div>
  );
}

export default Navbar;
