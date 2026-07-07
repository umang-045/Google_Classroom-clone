"use client"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import GradientText from '@/components/GradientText'

const BULLET_POINTS = [
  { text: 'Curated assignments designed for a better learning experience.' },
  { text: 'Detailed video lectures and editorials to help you master every topic.' },
  { text: 'Stay consistent with streaks and classroom leaderboards.' },
  { text: 'AI-powered instant doubt support for faster learning.' },
]

export default function About() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <section id="about" className="relative min-h-[90vh] px-12 md:px-24 flex items-center overflow-x-hidden">
      <div className="grid md:grid-cols-[1fr_1.4fr] items-center w-full py-12 md:gap-16">
        <div className="flex flex-col">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            <span className="text-white block mb-2">Modern Digital</span>
            <GradientText
              colors={['#818cf8', '#60a5fa', '#93c5fd', '#818cf8']}
              animationSpeed={4}
              className="block text-5xl md:text-7xl font-black"
            >
              Learning Platform
            </GradientText>
            <span className="text-white block mt-2">For Your Classroom</span>
          </h1>
          <p className="text-zinc-300 text-base md:text-lg max-w-md mb-10">
            Manage classrooms, share assignments, run live sessions, and track student progress, all in one place.
          </p>
          <div className="flex gap-3 flex-wrap mb-12">
            <button
              onClick={() => router.push(session ? '/dashboard' : '/signup')}
              className="border border-white/30 text-white font-medium text-sm px-7 py-3 rounded-lg cursor-pointer transition-all hover:bg-white/10"
            >
              Start Learning for Free
            </button>
            <button
              onClick={() => router.push(session ? '/dashboard' : '/signup')}
              className="bg-blue-600 hover:bg-blue-500 transition-all text-white font-medium text-sm px-7 py-3 rounded-lg shadow-lg cursor-pointer shadow-blue-900/40"
            >
              Explore Dashboard
            </button>
          </div>
          <ul className="flex flex-col gap-3">
            {BULLET_POINTS.map(({ text }) => (
              <li key={text} className="flex items-start gap-3 text-zinc-400 text-m">
                <span className="mt-0.5 text-blue-400">-</span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end items-center w-full aspect-video mx-auto overflow-visible min-w-0">
          <DotLottieReact
            src="/assets/online.json"
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
            renderConfig={{ autoResize: true }}
          />
        </div>
      </div>
    </section>
  )
}