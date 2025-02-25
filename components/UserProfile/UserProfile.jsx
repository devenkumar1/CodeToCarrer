"use client";
import { FiEdit2 } from "react-icons/fi";
import { useUserStore } from "@/store/userStore";

export const UserProfile = () => {
  const { userData } = useUserStore();

  return (
    <div className="md:max-w-[50vw] w-[90%] mx-auto min-h-[100px] flex flex-col dark:bg-gray-800 bg-slate-100 rounded-lg my-10 text-black dark:text-white shadow-lg p-6">
     
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-lg font-bold">Personal Info</h2>
        <div className="cursor-pointer hover:text-gray-500 transition">
          <FiEdit2 size={18} />
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
