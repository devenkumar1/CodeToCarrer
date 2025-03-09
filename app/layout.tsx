'use client';

import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/provider";
import Navbar from "@/components/Navbar";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { useUserStore } from "@/store/userStore";
import { registerServiceWorker } from "./sw-register";
import dynamic from "next/dynamic";

// Dynamically import the PWA install prompt component to avoid SSR issues
const PwaInstallPrompt = dynamic(
  () => import("./components/PwaInstallPrompt"),
  { ssr: false }
);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Register service worker
    registerServiceWorker();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('PWA features are disabled in development mode. They will be available in production.');
    }
    
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      // Default to light mode if no preference is saved
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Update the theme in localStorage when isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Toaster />
          <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          {children}
          <Footer/>
          <PwaInstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
