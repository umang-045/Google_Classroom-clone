import { SessionWrapper } from "./components/SessionWrapper";
import "./globals.css";

export const metadata:{title:string,description:string} = {
  title: "DigitalClassroom",
  description: "Clone of Google-Classroom",
};

export default function RootLayout({ children}:{children:React.ReactNode} ) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
      <SessionWrapper>
        {children}
      </SessionWrapper>
      </body>
    </html>
  );
}