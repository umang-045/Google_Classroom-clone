"use client"
import { motion } from 'framer-motion'
import CircularGallery from '@/components/CircularGallery'

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

export default function Features() {
  return (
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
  )
}