import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/providers/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Career Connect - Premium Job Portal",
  description: "Find your dream job or the perfect candidate with real-time tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans bg-slate-50 antialiased`}
        suppressHydrationWarning={true}
      >
        {/*
          Providers is a "use client" wrapper that owns SessionProvider,
          SocketProvider, AppProvider, and the Toaster. Keeping them in a
          dedicated client component lets this server layout stay a React
          Server Component while still providing client context to the tree.
        */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
