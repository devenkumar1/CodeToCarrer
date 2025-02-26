"use client";
import { FiEdit2 } from "react-icons/fi";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

export const UserProfile = () => {
  const { userData, logoutUser } = useUserStore();
const router=useRouter();
const handleEditProfile=async()=>{
router.push(`/profile/${userData._id}`)
console.log("redirected success");
}


  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-black dark:text-white p-6">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="w-full h-full bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl font-bold">
            {userData?.name?.charAt(0).toUpperCase()}
          </div>
          <button className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg">
            <FiCamera size={16} />
          </button>
        </div>
        <h2 className="text-xl font-semibold">Full Name: {userData?.name}</h2>
        <p className="text-gray-500 dark:text-gray-400">Email: {userData?.email}</p>
        <p>Roadmaps: {userData?.roadmaps?.length}</p>
        <span className="mt-2 inline-block bg-blue-500 text-white px-3 py-1 rounded-lg text-sm">
          {userData?.role}
        </span>
        <div className="mt-4 flex justify-center gap-4">
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2" onClick={handleEditProfile}>
            <FiEdit2 /> Edit Profile
          </button>
          <button 
            onClick={logoutUser} 
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
             <FiLogOut /> Logout
          </button>
        </div>
      </div>
      <div className="flex justify-between py-3 text-sm md:text-base">
        <p className="font-medium text-gray-600 dark:text-gray-300">Name</p>
        <p className="text-gray-800 dark:text-gray-100">{userData?.name}</p>
      </div>
      <hr className="w-full max-w-[50vw] mx-auto bg-gray-400 border-0 rounded-sm dark:bg-gray-700" />

      <div className="flex justify-between py-3 text-sm md:text-base">
        <p className="font-medium text-gray-600 dark:text-gray-300">Email</p>
        <p className="text-gray-800 dark:text-gray-100">{userData?.email}</p>
      </div>
      <hr className="w-full max-w-[50vw] mx-auto bg-gray-400 border-0 rounded-sm dark:bg-gray-700" />

      <div className="flex justify-between py-3 text-sm md:text-base">
        <p className="font-medium text-gray-600 dark:text-gray-300">Joined At</p>
        <p className="text-gray-800 dark:text-gray-100">Joined Date</p>
      </div>
      <hr className="w-full max-w-[50vw] mx-auto bg-gray-400 border-0 rounded-sm dark:bg-gray-700" />

      <div className="flex justify-between py-3 text-sm md:text-base">
        <p className="font-medium text-gray-600 dark:text-gray-300">Gender</p>
        <p className="text-gray-800 dark:text-gray-100">Gender</p>
      </div>
      <hr className="w-full max-w-[50vw] mx-auto bg-gray-400 border-0 rounded-sm dark:bg-gray-700" />

      <div className="flex justify-between py-3 text-sm md:text-base">
        <p className="font-medium text-gray-600 dark:text-gray-300">Address</p>
        <p className="text-gray-800 dark:text-gray-100">Address</p>
      </div>
    </div>
  );
};

export default UserProfile;
