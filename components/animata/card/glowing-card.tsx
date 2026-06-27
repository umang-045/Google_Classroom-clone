import type React from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  fromColor?: string;
  viaColor?: string;
  toColor?: string;
}

export default function GlowingCard({
  fromColor = "#4158D0",
  viaColor = "#C850C0",
  toColor = "#FFCC70",
  className,
  children,  
  ...props
}: GlowCardProps) {
  const gradient = `linear-gradient(to right, ${fromColor}, ${viaColor}, ${toColor})`;

  return (
    <div
      className={cn(
        "rounded-3xl  transition-[box-shadow,filter] duration-500 ease-in-out hover:shadow-glow hover:brightness-150",
        className,
      )}
      {...props}
    >
      <div className="relative w-full overflow-hidden rounded-[calc(1.5rem-2px)]">  

        <div className="relative flex flex-col gap-2">  
          {children} 
        </div>
      </div>
    </div>
  );
}
