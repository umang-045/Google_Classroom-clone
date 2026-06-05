import { SessionWrapper } from "./components/SessionWrapper";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata:{title:string,description:string} = {
  title: "DigitalClassroom",
  description: "Clone of Google-Classroom",
};

export default function RootLayout({ children}:{children:React.ReactNode} ) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">
      <SessionWrapper>
        {children}
      </SessionWrapper>
      </body>
    </html>
  );
}