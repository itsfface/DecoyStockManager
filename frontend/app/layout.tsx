import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Decoy Store Manager",
  description: "Premium inventory management system for Decoy retail locations.",
  icons: {
    icon: "/logo.png", // Pulls the Decoy logo for the browser tab
    apple: "/logo.png", // Ensures the logo looks right if saved to an iOS home screen
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fafafa] text-neutral-900 selection:bg-neutral-900 selection:text-white">
        
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            // Premium dark-mode toast styling
            style: {
              background: '#171717', // tailwind neutral-900
              color: '#ffffff',
              borderRadius: '16px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 16px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              letterSpacing: '-0.01em',
            },
            success: {
              iconTheme: {
                primary: '#4ade80', // tailwind green-400
                secondary: '#171717',
              },
            },
            error: {
              iconTheme: {
                primary: '#f87171', // tailwind red-400
                secondary: '#171717',
              },
            },
          }}
        />
        
        {children}
        
      </body>
    </html>
  );
}