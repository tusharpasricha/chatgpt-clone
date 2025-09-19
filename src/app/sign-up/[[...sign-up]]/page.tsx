import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ChatGPT Clone</h1>
          <p className="mt-2 text-gray-600">Create your account to get started</p>
        </div>
        <SignUp 
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
