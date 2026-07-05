"use client"
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import CircularGallery from '@/components/CircularGallery'
import GradientText from '@/components/GradientText'
import SiblingFocusNav from '@/components/animata/container/sibling-focus-nav'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { motion } from 'framer-motion'

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

const TESTIMONIALS = [
  {
    quote: "Running my classroom got so much simpler. Assignments, grading, live sessions, it's all in one tab now instead of five different apps.",
    name: 'Ritika Sharma',
    role: 'High School Teacher',
    avatar: '/students/student1.webp',
  },
  {
    quote: "The AI summaries save me hours before exams. I can catch up on a missed lecture in ten minutes instead of rewatching the whole thing.",
    name: 'Anjali Mehta',
    role: 'Class 11 Student',
    avatar: '/students/testimonial2.webp',
  },
  {
    quote: "I can actually see what my daughter is working on and how she's progressing, without having to ask her every evening.",
    name: 'Priya Nair',
    role: 'Parent',
    avatar: '/students/testimonial6.webp',
  },
  {
    quote: "Grading used to eat my whole Sunday. Now assignments get auto-sorted and I just review flagged ones. I've got my weekends back.",
    name: 'Sandeep Rao',
    role: 'Middle School Teacher',
    avatar: '/students/testimonial3.webp',
  },
  {
    quote: "Group projects were always messy over chat and email. Having shared docs and a live board in one place actually got my team organized.",
    name: 'Ananya Iyer',
    role: 'Class 9 Student',
    avatar: '/students/testimonial4.webp',
  },
  {
    quote: "The progress tracker gives me a clear weekly view instead of vague updates. I know exactly where my son needs extra support now.",
    name: 'Vikram Desai',
    role: 'Parent',
    avatar: '/students/testimonial5.webp',
  },
]

const FAQ_ITEMS = [
  {
    question: "Is DigitalClassroom free to use?",
    answer: "Yes! We offer a robust free tier for individual teachers and students that includes basic classroom management tools, assignment sharing, and standard progress tracking."
  },
  {
    question: "How does the AI Summarizer feature work?",
    answer: "Our built-in AI safely parses recorded video lectures and transcripts to generate concise, bulleted recaps, structural code blocks, or main topic takeaways within minutes of a class ending."
  },
  {
    question: "Can parents monitor their child's progress?",
    answer: "Absolutely. Parents get dedicated, read-only portals where they can inspect weekly streaks, leaderboard positions, pending deadlines, and overall performance grading metrics."
  },
  {
    question: "Is data stored on the cloud secure?",
    answer: "We treat data privacy with the highest priority. All your shared assignments, notes, and records are safely locked down using modern AES-256 cloud encryption protocols."
  }
]

export default function LandingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <>
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

       
        <section id="features" className="relative mt-2 px-12 md:px-24 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h1 className="text-5xl md:text-6xl font-black text-white">Features</h1>
            <p className="mt-4 text-zinc-400 text-base max-w-xl">
              Everything a modern classroom needs, built into one platform.
            </p>
          </motion.div>
          <motion.div
            className="relative w-full h-[500px] mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <CircularGallery
              items={GALLERY_ITEMS}
              bend={1}
              textColor="#ffffff"
              borderRadius={0.05}
              scrollEase={0.05}
              font="bold 30px sans-serif"
              scrollSpeed={2}
            />
          </motion.div>
        </section>

        
        <section id="testimonials" className="relative pt-32 pb-8 px-12 md:px-24 flex flex-col">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h1 className="text-5xl md:text-6xl font-black text-white">
              What our <span className="text-blue-400">Users</span> Say
            </h1>
            <p className="mt-4 text-zinc-400 text-base max-w-xl">
              Real feedback from teachers, students, and parents using DigitalClassroom every day.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {TESTIMONIALS.map(({ quote, name, role, avatar }, index) => (
              <motion.div
                key={name}
      
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                  delay: index * 0.1
                }}
              
                whileHover={{ y: -4, backgroundColor: "rgba(255, 255, 255, 0.06)" }}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-10 flex flex-col h-full min-h-[340px]"
              >
                <div className="flex gap-1 mb-6 text-blue-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
                    </svg>
                  ))}
                </div>

                <p className="text-zinc-300 text-base leading-relaxed">"{quote}"</p>

                <div className="flex items-center gap-4 mt-auto pt-10">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-12 h-12 rounded-full object-cover border border-blue-400/40 flex-shrink-0"
                  />
                  <div>
                    <div className="text-white font-semibold text-base">{name}</div>
                    <div className="text-zinc-500 text-sm">{role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

       
        <section id="faq" className="relative pt-32 pb-24 px-12 md:px-24">
          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] items-start gap-12 w-full">

            <div className="flex flex-col w-full">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <h1 className="text-5xl md:text-6xl font-black text-white">
                  Frequently Asked <span className="text-blue-400">Questions</span>
                </h1>
                <p className="mt-4 text-zinc-400 text-base max-w-xl">
                  Got questions? We've got answers. Explore how DigitalClassroom works.
                </p>
              </motion.div>

              <div className="flex flex-col gap-4 w-full mt-12">
                {FAQ_ITEMS.map(({ question, answer }, index) => {
                  const isOpen = openFaq === index
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{
                        duration: 0.6,
                        ease: 'easeOut',
                        delay: index * 0.08
                      }}
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
                      className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full text-left p-6 flex justify-between items-center gap-4 focus:outline-none"
                      >
                        <span className="text-white font-semibold text-base md:text-lg">{question}</span>
                        <span className={`text-blue-400 transition-transform duration-300 transform ${isOpen ? 'rotate-180' : ''}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </span>
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-48 border-t border-white/5' : 'max-h-0'
                          }`}
                      >
                        <p className="p-6 text-zinc-400 text-sm md:text-base leading-relaxed">
                          {answer}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-center items-center w-full aspect-square max-w-[500px] mx-auto md:sticky md:top-28">
              <DotLottieReact
                src="/assets/faqs.json"
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
                renderConfig={{ autoResize: true }}
              />
            </div>

          </div>
        </section>

       
        <footer id="contact" className="border-t border-white/10 px-12 md:px-24 mt-8 py-16 relative">
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
                    <motion.button
                      whileHover={{ y: -4, backgroundColor: "rgba(255, 255, 255, 0.12)" }}
                      className="bg-white/[0.06] p-2.5 rounded-xl"
                    >
                      <img src={src} className="w-5 h-5" alt="" />
                    </motion.button>
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