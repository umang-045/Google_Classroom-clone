"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X } from 'lucide-react'
import SiblingFocusNav from '@/components/animata/container/sibling-focus-nav'

import About from './About'
import Features from './Features'
import Testimonials from './Testimonials'
import FAQs from './FAQS'
import Footer from './Footer'

export default function LandingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="flex justify-between items-center px-6 md:px-24 py-4">

          <div className="text-xl text-white font-extrabold tracking-tight">
            Digital<span className="text-blue-400">Classroom</span>
          </div>


          <div className="hidden md:block">
            <SiblingFocusNav className="gap-8 lg:gap-20 text-gray-300 text-sm font-medium tracking-wider">
              <SiblingFocusNav.Link href="#about">About</SiblingFocusNav.Link>
              <SiblingFocusNav.Link href="#features">Features</SiblingFocusNav.Link>
              <SiblingFocusNav.Link href="#contact">Contact</SiblingFocusNav.Link>
              <SiblingFocusNav.Link href="/dashboard">Dashboard</SiblingFocusNav.Link>
            </SiblingFocusNav>
          </div>


          <div className="hidden md:flex items-center gap-3">
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


          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none hover:text-gray-300 transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>


        {isOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-lg px-6 pt-2 pb-6 border-b border-white/10 space-y-4">
            <div className="flex flex-col space-y-3 text-gray-300 text-sm font-medium tracking-wider">
              <a href="#about" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors py-2">About</a>
              <a href="#features" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors py-2">Features</a>
              <a href="#contact" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors py-2">Contact</a>
              <a href="/dashboard" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors py-2">Dashboard</a>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsOpen(false)
                  if (session) {
                    const ans = confirm('Do you want to sign out?')
                    if (ans) signOut()
                  } else {
                    router.push('/login')
                  }
                }}
                className="w-full text-center border border-white/30 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-white/10 transition-all"
              >
                {session ? 'Sign Out' : 'Sign In'}
              </button>
              <button
                onClick={() => {
                  setIsOpen(false)
                  router.push(session ? '/dashboard' : '/signup')
                }}
                className="w-full text-center bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2 rounded-lg shadow-md transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
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