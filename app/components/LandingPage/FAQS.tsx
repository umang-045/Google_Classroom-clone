"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
    {
        question: "Is DigitalClassroom free to use?",
        answer: "Yes! We offer a robust free tier for individual teachers and students that includes basic classroom management tools, assignment sharing, and standard progress tracking."
    },
    {
        "question": "What should I do if I forget my password?",
        "answer": "Don't worry! You can easily reset your password by selecting the 'Forgot Password' option and completing a secure OTP (One-Time Password) verification sent to your registered email or phone number."
    },
    {
        question: "How does the AI Summarizer feature work?",
        answer: "Our built-in AI safely parses recorded video lectures and transcripts to generate concise, bulleted recaps, structural code blocks, or main topic takeaways within minutes of a class ending."
    },
    {
        "question": "Is there a quiz facility available?",
        "answer": "Yes, absolutely. The platform includes a comprehensive quiz facility featuring interactive assessments, timed challenges, and instant feedback to help reinforce learning and track progress."
    }
]

export default function FAQs() {
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index)
    }

    return (
        <section id="faqs" className="relative pt-32 pb-24 px-12 md:px-24">
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
                                            <ChevronDown className="w-5 h-5" strokeWidth={2.5} />
                                        </span>
                                    </button>
                                    <div
                                        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-48 border-t border-white/5' : 'max-h-0'}`}
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
    )
}