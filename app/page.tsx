'use client'
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function Home() {
  const router=useRouter();
  const handleLogout = async () => {
    await signOut({ redirect: false }); 
    router.push("/auth/login"); 
  };
  return (
 
 <div>
  <h1 className="text-blue-500">Hello
  <button className="btn btn-outline">Default</button>
  <button className="btn btn-outline" onClick={handleLogout}>Logout</button>

  </h1>
 </div>
  );
}
