'use client'
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ShuffleHero from '@/components/Hero/AnimatedHero'
import { useSession } from "next-auth/react";
import { TextParallaxContents } from "@/components/FeatureSection/TextParallaxContent";
import { BentoGridThird } from "@/components/BentoGrid/BentoGridThird";
import { useEffect, useState } from "react";
export default function Home() {
  const { data: session } = useSession();
  const router=useRouter();  
  const [isLoading, setIsLoading] =useState(true);
// useEffect(()=>{
//   if(session){
//     router.push("/home");
//   }
//   setIsLoading(false);
// },[])

useEffect(() => {
  if (session) {
    router.push("/home");
  }
  setIsLoading(false);
}, [session, router]);

if(isLoading){
  return(
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-white">
      <div className="flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    </div>
  )
}

  return (
 
 <div className="min-h-screen w-full flex flex-col justify-center items-center ">
<ShuffleHero/>
<BentoGridThird/>
<TextParallaxContents/>
 </div>
  );
}
