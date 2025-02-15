'use client'
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ShuffleHero from '@/components/Hero/AnimatedHero'
import { TextParallaxContents } from "@/components/FeatureSection/TextParallaxContent";
import { BentoGridThird } from "@/components/BentoGrid/BentoGridThird";
export default function Home() {
  const router=useRouter();
  const handleLogout = async () => {
    await signOut({ redirect: false }); 
    router.push("/auth/login"); 
  };
  return (
 
 <div className="min-h-screen w-full flex flex-col justify-center items-center ">
<ShuffleHero/>
<BentoGridThird/>
<TextParallaxContents/>
 </div>
  );
}
