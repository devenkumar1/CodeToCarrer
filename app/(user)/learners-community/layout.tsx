'use client';

export default function LearnerCommunityLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (

     <div className="w-full flex flex-row  dark:bg-black bg-white text-black dark:text-white">
 
        <div className="w-1/6 bg-blue-600/10 min-h-screen ">
            {/*left navigation area */}
            <nav className="h-[80vh]">
                 <ul className="flex flex-col justify-evenly items-center h-full ">
                    <li className="cursor-pointer">Home</li>
                    <li className="cursor-pointer">Explore</li>
                    <li className="cursor-pointer">Trending</li>
                    <li className="cursor-pointer">Leaderboard</li>
                 </ul>
            </nav>
        </div>
        <div className="w-full min-h-screen ">
         {/* main container */}   
        {children} 
        </div>
        <div className="w-[20vw] min-h-screen bg-blue-600/10 ">
         {/*Right container */}   
         <h2>other info section</h2>
        </div>
     </div>


  );
}
