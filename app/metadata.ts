import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Code To Career",
  description: "An AI based smart learning platform with features like AI Mentor, AI code reviewer, community, and more...",
  manifest: "/manifest.json",
  themeColor: "#111827",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Code To Career",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: "/icons/icon-152x152.png",
    shortcut: "/icons/icon-152x152.png",
    apple: "/icons/icon-152x152.png",
  },
}; 