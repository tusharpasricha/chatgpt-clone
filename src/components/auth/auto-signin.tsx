'use client';

import { SignInButton } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';

export function AutoSignIn() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Auto-click the sign-in button to show modal immediately
    const timer = setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }, 500); // Small delay to ensure page is loaded

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">ChatGPT Clone</h1>
        <p className="text-gray-600 mb-8">Sign in to start chatting</p>
        <SignInButton mode="modal">
          <button 
            ref={buttonRef}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Sign In
          </button>
        </SignInButton>
      </div>
    </div>
  );
}
