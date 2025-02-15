// app/protected/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  return (
    <div>
      <h1>Protected Page</h1>
      <p>Welcome, {session.user?.name}!</p>
    </div>
  );
}
