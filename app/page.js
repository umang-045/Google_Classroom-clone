"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'


const LandingPage = () => {
  const router = useRouter()
  return (
    <>
      <div className='min-h-screen bg-zinc-950' >
        <div className='min-h-screen w-[90%] m-auto my-2 bg-linear-to-b from-zinc-800 to-zinc-950 border border-zinc-700/50 '>
          <div className='sticky top-0 z-100 flex justify-around bg-zinc-900 px-2 py-4 items-center border-b border-b-gray-400  '>
            <div className="text-xl  text-gray-300 font-extrabold">Digital<span className='text-blue-700'>Classroom</span></div>
            <div>
              <ul className='flex grow gap-20 text-gray-300'>
                <li className='transition-all hover:underline hover:text-zinc-200'><Link href='#about'>About</Link></li>
                <li className='transition-all hover:underline hover:text-zinc-200'><Link href='#features'>Features</Link></li>
                <li className='transition-all hover:underline hover:text-zinc-200'><Link href='#contact'>Contact</Link></li>
              </ul>
            </div>
            <div >
              <button className='bg-gray-400 px-10 py-3 mx-6 rounded-2xl cursor-pointer transition-all hover:-translate-y-1' onClick={() => {

                router.push('/login')
              }}>Sign In</button>
              <button className='bg-gray-400 px-10 py-3 mx-6 rounded-2xl cursor-pointerbg-gray-400 p-1.5 transition-all hover:-translate-y-1' onClick={() => {

                router.push('/login')
              }}>Get Started</button>
            </div>
          </div>
          <div className='flex justify-around items-center my-20'>
            <div id='about' >
              <p className='bg-neutral-800  text-zinc-200 font-bold p-4 w-fit rounded-2xl my-10 text-center'> 󠁯•󠁏 Built For modern classroom</p>
              <h1 className='text-5xl text-gray-300 '>Manage your learning,<br />anywhere</h1>
              <p className='text-gray-300  my-10'>Create classrooms, share assignments, run live <br /> sessions, and track student progress - all in one place. </p>

            </div>
            <img src='/ad.png'></img>
          </div>
          <div id ='features' className='flex flex-col justify-around px-12 my-30 ml-16'>
            <h1 className='text-5xl text-gray-300 px-10 mb-5'>Features</h1>
            <div className='grid grid-cols-3'>
              <div className='bg-neutral-800 rounded-2xl m-5 p-5'>
                <h1 className=' text-xl text-zinc-200 font-bold p-4 w-fit rounded-2xl my-5 text-center'>
                  🎓  Role-Based Classroom Management
                </h1>
                <ul className='text-zinc-400 my-1 list-disc pl-5 space-y-2 text-lg'>
                  <li>Teachers can seamlessly create and manage virtual classrooms.</li>
                  <li>Students can quickly join using invite links or unique class codes.</li>
                  <li>Separate dashboards provide specific features and permissions for each role.</li>
                </ul>
              </div>

              <div className='bg-neutral-800 rounded-2xl m-5 p-5 text-lg'>
                <h1 className='text-zinc-200 font-bold p-4 w-fit rounded-2xl my-5 text-center'>
                  📝Assignments, Quizzes & Grading System
                </h1>
                <ul className='text-zinc-400 my-1 list-disc pl-5 space-y-2'>
                  <li>Teachers can build out assignments, quizzes, deadlines, and grading rubrics.</li>
                  <li>Students can submit their completed coursework cleanly online.</li>
                  <li>Users can track ongoing submissions, grades, and feedback directly through the platform.</li>
                </ul>
              </div>

              <div className='bg-neutral-800 rounded-2xl m-5 p-5'>
                <h1 className='text-zinc-200 font-bold p-4 w-fit rounded-2xl my-5 text-center text-lg'>
                  🎥 Realtime Communication & Virtual Meetings
                </h1>
                <ul className='text-zinc-400 my-1 list-disc pl-5 space-y-2'>
                  <li>Integrated classroom chat infrastructure is handled instantly using Socket.io.</li>
                  <li>Live virtual sessions run reliably with real-time WebRTC support.</li>
                  <li>The setup enables instant messaging, video/audio meetings, and live screen sharing inside classrooms.</li>
                </ul>
              </div>

              <div className='bg-neutral-800 rounded-2xl m-5 p-5'>
                <h1 className='text-zinc-200 font-bold p-4 w-fit rounded-2xl my-5 text-lg'>
                  ☁ Cloud-Based File Upload & Study Material Sharing
                </h1>
                <ul className='text-zinc-400 my-1 list-disc pl-5 space-y-2'>
                  <li>Teachers can upload heavy files like notes, PDFs, and presentations effortlessly.</li>
                  <li>Assets are stored securely utilizing Cloudinary or AWS S3 cloud buckets.</li>
                  <li>Students get the flexibility to access critical learning resources anytime, anywhere.</li>
                </ul>
              </div>

              <div className='bg-neutral-800 rounded-2xl m-5 p-5'>
                <h1 className='text-zinc-200 font-bold p-4 w-fit rounded-2xl my-5 text-center text-lg'>
                  📢  Smart Notifications & Deadline Tracking
                </h1>
                <ul className='text-zinc-400 my-1 list-disc pl-5 space-y-2'>
                  <li>Automated notification alerts ping students about approaching assignment deadlines.</li>
                  <li>Real-time systems push out direct updates for general announcements and grading scores.</li>
                  <li>Users stay synchronized with all upcoming classroom activities instantly.</li>
                </ul>
              </div>

              <div className='bg-neutral-800 rounded-2xl m-5 p-5'>
                <h1 className='text-zinc-200 font-bold p-4 w-fit rounded-2xl my-5 text-center text-lg'>
                  💬 AI-Powered Chat & Meeting Summarization
                </h1>
                <ul className='text-zinc-400 my-1 list-disc pl-5 space-y-2'>
                  <li>Deep AI integration uses powerful models via Google AI Studio or Groq.</li>
                  <li>The system automatically compiles summaries of classroom discussions and active meeting chats.</li>
                  <li>Students can easily skim summaries to review core educational points quickly.</li>
                </ul>
              </div>
            </div>
          </div>
        <footer id='contact' className='border border-t-neutral-800'></footer>
        <div className='ml-24 p-10 '>
          <div className='grid grid-cols-3 mb-10 pl-4 gap-10'>
            <div >
              <div className="text-3xl  text-gray-300 font-extrabold">Digital<span className='text-blue-700'>Classroom</span></div>
              <p className='text-gray-300 text-xl my-10'>DigitalClassroom is a full-featured<br/> learning management platform <br/> built for modern education.</p>

              <div className='flex gap-4 items-center  w-fit'>

                <Link href='https://github.com' target='_blank'>
                  <button className='bg-neutral-800 p-2 cursor-pointer rounded-2xl transition-all hover:-translate-y-1  hover:bg-neutral-600' >
                    <img src='/github-sign.png' className='w-6 h-6 '></img>
                  </button>
                </Link>

                <Link href='https://linkedin.com' target='_blank'>
                  <button className='bg-neutral-800 p-2 cursor-pointer rounded-2xl transition-all hover:-translate-y-1  hover:bg-neutral-600' >
                    <img src='/linkedin.png' className='w-6 h-6 '></img>
                  </button>
                </Link>

                <Link href='https://x.com' target='_blank'>
                  <button className='bg-neutral-800 p-2 cursor-pointer rounded-2xl transition-all hover:-translate-y-1  hover:bg-neutral-600' >
                    <img src='/twitter.png' className='w-6 h-6'></img>
                  </button>
                </Link>
              </div>
            </div>
            <div>
              <h1 className='text-zinc-200 font-semibold mb-4'>Navigation</h1>
              <ul className='flex flex-col gap-3 text-gray-400'>
                <li className='transition-all hover:underline hover:text-zinc-200'><Link href='#about'>About</Link></li>
                <li className='transition-all hover:underline hover:text-zinc-200'><Link href='#features'>Features</Link></li>
                <li className='transition-all hover:underline hover:text-zinc-200'><Link href='#contact'>Contact</Link></li>
                <li className='transition-all hover:underline hover:text-zinc-200'><Link href='/login'>Sign in</Link></li>
                <li className='transition-all hover:underline hover:text-zinc-200'><Link href='/login'>Get started</Link></li>
              </ul>
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
        </div>
      </div>
    </>
  )
}

export default LandingPage
