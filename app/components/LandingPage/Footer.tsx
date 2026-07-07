"use client"
import Link from 'next/link'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { label: 'Home', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Pricing', href: '#contact' },
]

export default function Footer() {
  return (
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
  )
}