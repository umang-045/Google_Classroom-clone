"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import PerCharRise from '@/components/animata/text/per-character-rise'
import SiblingFocusNav from '@/components/animata/container/sibling-focus-nav'
import TrailingImage from '@/components/animata/image/trailing-image'
import DoubleUnderline from '@/components/animata/text/double-underline'
import GlowingCard from '@/components/animata/card/glowing-card'
import { Button } from '@/components/ui/button'


const LandingPage = () => {
  const result = useSession()
  const session = result.data;
  const router = useRouter()
  const customImages = [
    "trailingphoto1.jpg",
    "/trailingphoto2.jpeg",
    "/tarilingphoto3.jpg",
    "/tarilingphoto.jpg","/trailingphoto4.jpeg",
  ];
  return (
    <>
      <div className='relative  min-h-screen bg-zinc-950 z-10'>
           <video
            src='/hero2.mp4'
            autoPlay
            muted
            loop
            playsInline
            className=' -z-10 fixed w-full h-full rounded-3xl   object-cover'
          />
                      <div className='absolute inset-0  bg-black/40 -z-10' />
        <div className='sticky top-0 z-50 flex justify-between items-center bg-zinc-950/80 backdrop-blur-md px-12 md:px-24 py-4 border-b border-white/10'>
          <div className="text-xl text-gray-300 font-extrabold">
            Digital<span className='text-blue-700'>Classroom</span>
          </div>

          <SiblingFocusNav className="gap-8 text-gray-300">
            <SiblingFocusNav.Link href="#about">About</SiblingFocusNav.Link>
            <SiblingFocusNav.Link href="#features">Features</SiblingFocusNav.Link>
            <SiblingFocusNav.Link href="#contact">Contact</SiblingFocusNav.Link>
            <SiblingFocusNav.Link href="/dashboard">Dashboard</SiblingFocusNav.Link>
          </SiblingFocusNav>

          <div className='flex items-center gap-3'>
            <Button variant='navbar'
              onClick={() => {
                if (session) {
                  const ans = confirm("⚠️DO YOU WANT TO SignOUT ?")
                  if (ans) signOut()
                } else {
                  router.push('/login')
                }
              }}
            >
              {session ? '🔓Sign Out' : 'Sign In'}
            </Button>
            <Button variant='navbar'
              onClick={() => router.push(session ? '/dashboard' : '/signup')}
            >Get Started </Button>
          </div>
        </div>

        <div id='about' className='relative  mx-auto px-24  my-0 min-h-[85vh] flex justify-between items-center'>
          <div className='flex flex-col gap-2 '>
            <button onClick={() => router.push('/dashboard')} className='bg-zinc-800 text-zinc-200 font-bold py-3 px-6 rounded-full w-fit transition hover:bg-zinc-700'>
               View Dashboard →
            </button>

            <h1 className='my-2 font-bold text-gray-200 text-7xl leading-tight'>
              Manage your<br />
              <span className='bg-linear-to-r from-gray-400 to-blue-200 bg-clip-text text-transparent'>
                learning,
              </span>
              <br />anywhere.
            </h1>

            <div className='h-8 my-10 p-2 overflow-hidden'>
              <PerCharRise
                text={["AI that takes notes", "Live classes at home", "Assignment submission online"]}
                className='text-2xl text-white'
              />
            </div>
            <DoubleUnderline className='text-gray-400 leading-relaxed text-2xl'>
              Create classrooms, share assignments, run live sessions,<br />
              and track student progress, all in one place.
            </DoubleUnderline>
          </div>
            <div className='relative w-[750px] h-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-[0_0_60px_rgba(255,255,255,0.08)] object-cover flex-shrink-0 '>
          <TrailingImage images={customImages} className='wfull h-[500px] rounded-4xl'/>
          <h1 className='text-gray-500  absolute top-1/2 left-1/2  '>Hover me </h1>
          </div>
        </div>
        

     
<div id='features' className='flex flex-col px-12 my-30 ml-16'>
 <DoubleUnderline className='my-2 font-bold text-gray-200 text-6xl w-fit '>Features</DoubleUnderline>
  <div className='grid grid-cols-3 m-2 p-4'>

    <GlowingCard className='m-10  p-10'>
      <h1 className='text-xl text-zinc-200 font-bold my-5'>🎓 Role-Based Classroom Management</h1>
      <ul className='text-zinc-400 list-disc pl-5 space-y-2'>
        <li>Teachers can seamlessly create and manage virtual classrooms.</li>
        <li>Students can quickly join using invite links or unique class codes.</li>
        <li>Separate dashboards provide specific features and permissions for each role.</li>
      </ul>
    </GlowingCard>

    <GlowingCard  className='m-10   p-10 '>
      <h1 className='text-xl text-zinc-200 font-bold my-5'>📝 Assignments, Quizzes & Grading System</h1>
      <ul className='text-zinc-400 list-disc pl-5 space-y-2'>
        <li>Teachers can build out assignments, quizzes, deadlines, and grading rubrics.</li>
        <li>Students can submit their completed coursework cleanly online.</li>
        <li>Users can track ongoing submissions, grades, and feedback directly through the platform.</li>
      </ul>
    </GlowingCard>

    <GlowingCard className='m-10   p-10 '>
      <h1 className='text-xl text-zinc-200 font-bold my-5'>🎥 Realtime Communication & Virtual Meetings</h1>
      <ul className='text-zinc-400 list-disc pl-5 space-y-2'>
        <li>Integrated classroom chat infrastructure is handled instantly using Socket.io.</li>
        <li>Live virtual sessions run reliably with real-time WebRTC support.</li>
        <li>The setup enables instant messaging, video/audio meetings, and live screen sharing.</li>
      </ul>
    </GlowingCard>

    <GlowingCard className='m-10   p-10 '>
      <h1 className='text-xl text-zinc-200 font-bold my-5'>☁ Cloud-Based File Upload & Study Material Sharing</h1>
      <ul className='text-zinc-400 list-disc pl-5 space-y-2'>
        <li>Teachers can upload heavy files like notes, PDFs, and presentations effortlessly.</li>
        <li>Assets are stored securely utilizing Cloudinary or AWS S3 cloud buckets.</li>
        <li>Students get the flexibility to access critical learning resources anytime, anywhere.</li>
      </ul>
    </GlowingCard>

    <GlowingCard className='m-10   p-10 '>
      <h1 className='text-xl text-zinc-200 font-bold my-5'>📢 Smart Notifications & Deadline Tracking</h1>
      <ul className='text-zinc-400 list-disc pl-5 space-y-2'>
        <li>Automated notification alerts ping students about approaching assignment deadlines.</li>
        <li>Real-time systems push out direct updates for general announcements and grading scores.</li>
        <li>Users stay synchronized with all upcoming classroom activities instantly.</li>
      </ul>
    </GlowingCard>

    <GlowingCard className='m-10   p-10 '>
      <h1 className='text-xl text-zinc-200 font-bold my-5'>💬 AI-Powered Chat & Meeting Summarization</h1>
      <ul className='text-zinc-400 list-disc pl-5 space-y-2'>
        <li>Deep AI integration uses powerful models via Google AI Studio or Groq.</li>
        <li>The system automatically compiles summaries of classroom discussions and active meeting chats.</li>
        <li>Students can easily skim summaries to review core educational points quickly.</li>
      </ul>
    </GlowingCard>

  </div>
</div>
        <footer id='contact' className='relative overflow-hidden border border-t-neutral-800'>
          <div className='relative z-10 ml-24 p-10'>
            <div className='grid grid-cols-3 mb-10 pl-4 gap-10'>
              <div>
                <div className="text-3xl text-gray-300 font-extrabold">Digital<span className='text-blue-700'>Classroom</span></div>
                <p className='text-gray-300 text-xl my-10'>DigitalClassroom is a full-featured<br /> learning management platform <br /> built for modern education.</p>
                <div className='flex gap-4 items-center w-fit'>
                  <Link href='https://github.com' target='_blank'>
                    <button className='bg-neutral-800 p-2 cursor-pointer rounded-2xl transition-all hover:-translate-y-1 hover:bg-neutral-600'>
                      <img src='/github-sign.png' className='w-6 h-6' />
                    </button>
                  </Link>
                  <Link href='https://linkedin.com' target='_blank'>
                    <button className='bg-neutral-800 p-2 cursor-pointer rounded-2xl transition-all hover:-translate-y-1 hover:bg-neutral-600'>
                      <img src='/linkedin.png' className='w-6 h-6' />
                    </button>
                  </Link>
                  <Link href='https://x.com' target='_blank'>
                    <button className='bg-neutral-800 p-2 cursor-pointer rounded-2xl transition-all hover:-translate-y-1 hover:bg-neutral-600'>
                      <img src='/twitter.png' className='w-6 h-6' />
                    </button>
                  </Link>
                </div>
    
              </div>
              <div className='flex justify-center items-center flex-col'>
                <h1 className='text-zinc-200 font-semibold mb-4'>Navigation</h1>
                <SiblingFocusNav className="flex flex-col gap-3 text-gray-400">
                  <SiblingFocusNav.Link href="#about">About</SiblingFocusNav.Link>
                  <SiblingFocusNav.Link href="#features">Features</SiblingFocusNav.Link>
                  <SiblingFocusNav.Link href="#contact">Contact</SiblingFocusNav.Link>
                  <SiblingFocusNav.Link href="/dashboard">Dashboard</SiblingFocusNav.Link>
                </SiblingFocusNav>
              </div>
              <div>
                <h3 className='text-zinc-200 font-semibold mb-4'>Contact</h3>
                <ul className='flex flex-col gap-3 text-gray-400'>
                  <li className='transition-all hover:underline hover:text-zinc-200'>🌐digitalclassroom.com</li>
                  <li className='transition-all hover:underline hover:text-zinc-200'>📍Durgapur, India</li>
                  <li className='transition-all hover:underline hover:text-zinc-200'>📞+91 8080808080</li>
                  <li className='transition-all hover:underline hover:text-zinc-200'>✉️digitalclassroom@gmail.com</li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default LandingPage