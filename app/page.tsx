"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import CircularGallery from '@/components/CircularGallery'
import GradientText from '@/components/GradientText'
import SiblingFocusNav from '@/components/animata/container/sibling-focus-nav'
import DashboardMockup from '@/components/DashboardMockup'

const NAV_ITEMS = [
  { label: 'Home', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Pricing', href: '#contact' },
]

const GALLERY_ITEMS = [
  { image: './students/student3.webp', text: 'Live Classes' },
  { image: './students/GroupProject.webp', text: 'Group Projects' },
  { image: './students/student1.webp', text: 'Smart Assignments' },
  { image: './students/AISummarize.webp', text: 'AI Summaries' },
  { image: './students/CloudStorage.webp', text: 'Cloud Storage' },
  { image: './students/Chat.webp', text: 'Instant Chat' },
  { image: './students/ProgressTracker.webp', text: 'Progress Tracking' },
  { image: './students/VideoMeet.webp', text: 'Video Meetings' },
]

const BULLET_POINTS = [
  { text: 'Curated assignments designed for a better learning experience.' },
  { text: 'Detailed video lectures and editorials to help you master every topic.' },
  { text: 'Stay consistent with streaks and classroom leaderboards.' },
  { text: 'AI-powered instant doubt support for faster learning.' },
]

export default function LandingPage() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <>
      <nav className="sticky top-0 z-50">
        <div className="flex justify-between items-center bg-black/40 backdrop-blur-md px-12 md:px-24 py-4 border-b border-white/10">
          <div className="text-xl text-white font-extrabold tracking-tight">
            Digital<span className="text-blue-400">Classroom</span>
          </div>

          <SiblingFocusNav className="gap-8 text-gray-300 text-sm font-medium">
            <SiblingFocusNav.Link href="#about">About</SiblingFocusNav.Link>
            <SiblingFocusNav.Link href="#features">Features</SiblingFocusNav.Link>
            <SiblingFocusNav.Link href="#contact">Contact</SiblingFocusNav.Link>
            <SiblingFocusNav.Link href="/dashboard">Dashboard</SiblingFocusNav.Link>
          </SiblingFocusNav>

          <div className="flex items-center gap-3 cursor-pointer">
            <button
              onClick={() => {
                if (session) {
                  const ans = confirm('Do you want to sign out?')
                  if (ans) signOut()
                } else {
                  router.push('/login')
                }
              }}
              className="border border-white/30 text-white text-sm font-medium px-5 py-2 rounded-lg cursor-pointer hover:bg-white/10 transition-all"
            >
              {session ? 'Sign Out' : 'Sign In'}
            </button>

            <button
              onClick={() => router.push(session ? '/dashboard' : '/signup')}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2 rounded-lg shadow-md shadow-blue-900/40 transition-all cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 min-h-screen text-white overflow-x-hidden">

        <section id="about" className="relative min-h-[90vh] px-8 md:px-16 flex items-center overflow-x-hidden">
          <div className="grid md:grid-cols-2 gap-12 items-center w-full py-20">

            <div className="flex flex-col">
              <div className="mb-6 w-fit">
                <span className="inline-flex items-center border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-medium px-4 py-1.5 rounded-full">
                  Next Generation Classroom Management
                </span>
              </div>

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
                  className="border border-white/30 text-white font-medium text-sm px-7 py-3 rounded-lg transition-all hover:bg-white/10"
                >
                  Start Learning for Free
                </button>
                <button
                  onClick={() => router.push(session ? '/dashboard' : '/signup')}
                  className="bg-blue-600 hover:bg-blue-500 transition-all text-white font-medium text-sm px-7 py-3 rounded-lg shadow-lg shadow-blue-900/40"
                >
                  Explore Dashboard
                </button>
              </div>

              <ul className="flex flex-col gap-3">
                {BULLET_POINTS.map(({ text }) => (
                  <li key={text} className="flex items-start gap-3 text-zinc-400 text-sm">
                    <span className="mt-0.5 text-blue-400">-</span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <DashboardMockup />

          </div>
        </section>

        <section id="features" className="relative mt-2 px-16 flex flex-col">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-white">Features</h1>
            <p className="mt-4 text-zinc-400 text-base max-w-xl">
              Everything a modern classroom needs, built into one platform.
            </p>
          </div>

          <div className="relative w-full h-[500px] mb-16">


            <CircularGallery
              items={GALLERY_ITEMS}
              bend={1}
              textColor="#ffffff"
              borderRadius={0.05}
              scrollEase={0.05}
              font="bold 30px sans-serif"
              scrollSpeed={2}

            />
          </div>
        </section>

        <footer id="contact" className="border-t border-white/10 px-8 md:px-16 mt-8 py-16 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">
            <div>
              <div className="text-2xl font-extrabold text-white mb-4">
                Digital<span className="text-blue-400">Classroom</span>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                A full-featured learning management platform built for modern education.
              </p>
              <div className="flex gap-3">
                {[
                  { href: 'https://github.com', src: '/github-sign.png' },
                  { href: 'https://linkedin.com', src: '/linkedin.png' },
                  { href: 'https://x.com', src: '/twitter.png' },
                ].map(({ href, src }) => (
                  <Link href={href} target="_blank" key={href}>
                    <button className="bg-white/[0.06] p-2.5 rounded-xl hover:-translate-y-1 hover:bg-white/[0.12] transition-all">
                      <img src={src} className="w-5 h-5" alt="" />
                    </button>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-zinc-300 font-semibold text-sm uppercase tracking-widest mb-5">Navigation</h3>
              <ul className="flex flex-col gap-3">
                {NAV_ITEMS.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="text-zinc-500 text-sm hover:text-white transition">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-zinc-300 font-semibold text-sm uppercase tracking-widest mb-5">Contact</h3>
              <ul className="flex flex-col gap-3 text-sm text-zinc-500">
                {[
                  'digitalclassroom.com',
                  'Durgapur, India',
                  '+91 8080808080',
                  'digitalclassroom@gmail.com',
                ].map((item) => (
                  <li key={item} className="hover:text-white hover:underline underline-offset-4 cursor-pointer transition">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}