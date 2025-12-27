import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { QueryProvider } from "@/components/providers/queryProvider";
import { ReactNode } from 'react'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // customize weights you need
  display: "swap",
});


export const metadata: Metadata = {
  title: "Fresh Gain",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={poppins.className}>
        <QueryProvider>
          <main className="max-w-[500px] bg-gray-100 pb-20 m-auto h-screen overflow-y-auto">
            {children}
          </main>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
