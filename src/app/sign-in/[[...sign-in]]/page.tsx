import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ChatGPT Clone</h1>
          <p className="mt-2 text-gray-600">Sign in to start chatting</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 
                'bg-black hover:bg-gray-800 text-sm normal-case',
            },
          }}
        />
      </div>
    </div>
  );
}
