import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
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
      <body className={`${inter.variable} font-sans bg-slate-50 antialiased`} suppressHydrationWarning={true}>
        <AppProvider>
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </AppProvider>
      </body>
    </html>
  );
}
