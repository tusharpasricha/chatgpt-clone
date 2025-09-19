import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs';
import "./globals.css";
import { APP_CONFIG } from "@/constants";
import { AutoSignIn } from "@/components/auth/auto-signin";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: APP_CONFIG.name,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  keywords: ["ChatGPT", "AI", "Chat", "Assistant", "Next.js", "React"],
  authors: [{ name: APP_CONFIG.author }],
  creator: APP_CONFIG.author,
  metadataBase: new URL(APP_CONFIG.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_CONFIG.url,
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
    siteName: APP_CONFIG.name,
  },
  twitter: {
    card: "summary_large_image",
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
          suppressHydrationWarning
        >
          <SignedOut>
            <AutoSignIn />
          </SignedOut>
          <SignedIn>
            <div className="relative flex min-h-screen overflow-hidden">
              {children}
            </div>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
