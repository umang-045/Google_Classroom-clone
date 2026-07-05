import { SessionWrapper } from "./components/SessionWrapper";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from 'react-hot-toast'


const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: { title: string, description: string } = {
  title: "DigitalClassroom",
  description: "Clone of Google-Classroom",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="preload" as="image" href="/bg3.webp" />
      </head>
      <body className="min-h-full flex flex-col">
        <div
          className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/bg3.webp')` }}
        />
        <div className="fixed inset-0 -z-10 bg-black/50 pointer-events-none" />
        <SessionWrapper>
            <Toaster position="top-center" />
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}