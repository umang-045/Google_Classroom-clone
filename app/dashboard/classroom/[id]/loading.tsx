import { Loader2 } from 'lucide-react'

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[70vh] gap-4 select-none">
            
            <div className="relative flex items-center justify-center">
                <div className="absolute size-12 bg-blue-500/10 rounded-full animate-ping opacity-60" />
                
                <div className="flex items-center justify-center size-14 rounded-2xl bg-zinc-800 border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_12px_24px_-8px_rgba(0,0,0,0.5)]">
                    <Loader2 className="size-6 animate-spin text-blue-400" />
                </div>
            </div>
            
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest animate-pulse mt-1">
                Loading...
            </p>
        </div>
    )
}