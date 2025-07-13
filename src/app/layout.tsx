import { Outfit } from 'next/font/google';
import './globals.css';
import "react-datepicker/dist/react-datepicker.css";

import { Metadata } from "next";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import GlassToast from '@/components/toast/Toast';

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Offerpro",
  description:
    "Offerpro Admin Management Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        {/* <body className={`dark:bg-gray-900`}> */}
        <ThemeProvider>
          <GlassToast />
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
