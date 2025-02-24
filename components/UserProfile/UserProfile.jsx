"use client";
import { useState, useEffect } from "react";
import {
  FiEdit2,
  FiCamera,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { FaAward, FaMedal, FaTrophy } from "react-icons/fa";

const UserProfile = () => {
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    location: "New York, USA",
    bio: "Senior Software Engineer passionate about building scalable web applications",
    dateOfBirth: "1990-05-15",
    gender: "Male",
    phone: "+1 (555) 123-4567",
    bannerPhoto: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
    profilePhoto:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
  });

  const [editMode, setEditMode] = useState({});

  const badges = [
    {
      id: 1,
      name: "Master Coder",
      icon: <FaTrophy className="text-yellow-500" />,
      date: "2023-05-15",
      description: "Completed 100 coding challenges",
    },
    {
      id: 2,
      name: "Team Player",
      icon: <FaMedal className="text-blue-500" />,
      date: "2023-06-20",
      description: "Collaborated on 50 projects",
    },
    {
      id: 3,
      name: "Innovation Star",
      icon: <FaAward className="text-purple-500" />,
      date: "2023-07-10",
      description: "Created 10 innovative solutions",
    },
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <div className="relative h-[300px] overflow-hidden">
        <img
          src={userData.bannerPhoto}
          alt="Profile Banner"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1579546929518-9e396f3cc809";
          }}
        />
        <label className="absolute bottom-4 right-4 bg-white p-2 rounded-full cursor-pointer hover:bg-gray-100">
          <FiCamera className="text-gray-600 text-xl" />
        </label>
      </div>

      {/* Profile Photo */}
      <div className="relative w-[200px] h-[200px] mx-auto -mt-20 rounded-full border-4 border-white overflow-hidden">
        <img
          src={userData.profilePhoto}
          alt="Profile Photo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* User Info */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {userData.firstName} {userData.lastName}
          </h1>
          <p className="text-gray-600 mt-2">{userData.email}</p>
          <p className="text-gray-500 mt-1">{userData.location}</p>
          <p className="text-gray-700 mt-4 max-w-2xl mx-auto">{userData.bio}</p>
        </div>

        {/* Personal Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            Personal Details
            <button className=" text-gray-600 hover:text-gray-800 ml-1">
              <FiEdit2 />
            </button>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(userData).map(([key, value]) => {
              if (["bannerPhoto", "profilePhoto"].includes(key)) return null;
              return (
                <div key={key} className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  {editMode[key] ? (
                    <div className="flex items-center"></div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">{value}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>

          {/* Password Management */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Password Management</h3>
            <div className="space-y-4">
              <div>
                <p className="font-bold">Current Password</p>
                <p className="text-base">
                  Changed 2 months ago
                  <button className="p-1 text-gray-600 hover:text-gray-800 ml-2">
                    <FiEdit2 />
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Badges and Achievements */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Badges & Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-3 flex justify-center">
                  {badge.icon}
                </div>
                <h3 className="font-medium text-lg">{badge.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{badge.date}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {badge.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
