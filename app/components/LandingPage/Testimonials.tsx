"use client"
import { motion } from 'framer-motion'
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "Running my classroom got so much simpler. Assignments, grading, live sessions, it's all in one tab now instead of five different apps.",
    name: 'Sakshi Agarwal',
    role: 'High School Teacher',
    avatar: '/students/student1.webp',
  },
  {
    quote: "The AI summaries save me hours before exams. I can catch up on a missed lecture in ten minutes instead of rewatching the whole thing.",
    name: 'Aruna Agarwal',
    role: 'Class 11 Student',
    avatar: '/students/testimonial2.webp',
  },
  {
    quote: "I can actually see what my daughter is working on and how she's progressing, without having to ask her every evening.",
    name: 'Anushka Rai',
    role: 'Parent',
    avatar: '/students/testimonial6.webp',
  },
  {
    quote: "Grading used to eat my whole Sunday. Now assignments get auto-sorted and I just review flagged ones. I've got my weekends back.",
    name: 'Sandeep Sharma',
    role: 'Middle School Teacher',
    avatar: '/students/testimonial3.webp',
  },
  {
    quote: "Group projects were always messy over chat and email. Having shared docs and a live board in one place actually got my team organized.",
    name: 'Shardha Kapoor',
    role: 'Class 9 Student',
    avatar: '/students/testimonial4.webp',
  },
  {
    quote: "The progress tracker gives me a clear weekly view instead of vague updates. I know exactly where my son needs extra support now.",
    name: 'Umang Agarwal',
    role: 'Parent',
    avatar: '/students/testimonial5.webp',
  },
]

export default function Testimonials() {
  return (
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
                <Star key={i} className="w-5 h-5" fill="currentColor" strokeWidth={0} />
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
  )
}