"use client"
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import SiblingFocusNav from '@/components/animata/container/sibling-focus-nav'

// Clean Modular Component Imports
import About from './About'
import Features from './Features'
import Testimonials from './Testimonials'
import FAQs from './FAQS'
import Footer from './Footer'

export default function LandingPage() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <>
      {/* Sticky Navigation bar */}
      <nav className="sticky top-0 z-50">
        <div className="flex justify-between items-center bg-black/40 backdrop-blur-md px-12 md:px-24 py-4 border-b border-white/10">
          <div className="text-xl text-white font-extrabold tracking-tight">
            Digital<span className="text-blue-400">Classroom</span>
          </div>
          
          <SiblingFocusNav className="gap-20 text-gray-300 text-sm font-medium tracking-wider">
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
        <About />
        <Features />
        <Testimonials />
        <FAQs />
        <Footer />
      </div>
    </>
  )
}