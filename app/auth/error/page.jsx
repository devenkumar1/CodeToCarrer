// pages/auth/error.tsx
"use client";
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ErrorPage = () => {
  const router = useRouter();

  useEffect(() => {
    const { error } = router.query;
    if (error) {
      alert(`Error: ${error}`);
    }
  }, [router.query]);

  return (
    <div>
      <h1>Error</h1>
      <p>There was an issue with the login attempt. Please try again.</p>
    </div>
  );
};

export default ErrorPage;
