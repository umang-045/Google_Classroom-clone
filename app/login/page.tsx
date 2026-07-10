"use client"
import React from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { toastOptions } from '../components/toastOptions'

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter()
  const [form, setform] = useState<LoginForm>({ email: "", password: "" });
  const [loading, setloading] = useState<boolean>(false);
  const result = useSession();
  const session = result.data;

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
      toast.success("YOU ARE LOGGED IN",toastOptions)
    }
  }, [session, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => setform({ ...form, [e.target.name]: e.target.value })

  const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setloading(true);
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    })
    setloading(false)
    if (res?.error) {
      toast.error(res.error,toastOptions)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <>
      <div className="relative overflow-hidden min-h-screen bg-linear-to-br from-zinc-950 to-zinc-800 flex items-center justify-center p-4">
              <Image
                src="/bg3.webp"
                alt=""
                fill
                className="object-cover"
                priority
              />
        <div className='absolute inset-0 bg-black/30' />

        {/* Desktop preserved: flex-row. Mobile handled via max-w limits and stacking fallback if needed, but keeping original classes intact */}
        <div className="relative z-10 w-full max-w-md md:max-w-4xl rounded-3xl flex flex-col md:flex-row overflow-hidden justify-center bg-white/80 backdrop-blur-sm shadow-2xl">
          
          {/* Changed w-1/2 to w-full md:w-1/2 and adjusted mobile padding */}
          <div className="p-6 md:p-8 w-full md:w-1/2 flex flex-col justify-center">
            <div className="mb-6 flex items-center gap-2">
              <div className="text-xs font-extrabold text-zinc-800">Digital<span className='text-blue-700'>Classroom</span></div>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900">Welcome Back!</h1>
            <p className="text-sm text-gray-500 mt-1 mb-6 md:mb-8">Please enter log in details below.</p>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input className="bg-gray-100 border border-gray-200 p-3 rounded-xl text-zinc-900" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
              <div className="flex flex-col gap-1">
                <input className="bg-gray-100 border border-gray-200 p-3 rounded-xl text-zinc-900" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                <p className="text-xs text-purple-600 font-medium cursor-pointer text-right hover:underline mt-1" onClick={()=>router.push('/forgetpassword')}>
                  Forgot password?
                </p>
              </div>
              <button type="submit" disabled={loading} className="bg-zinc-900 hover:bg-gray-800 text-white py-3 rounded-xl font-medium disabled:opacity-60 cursor-pointer">
                {loading ? "Please wait..." : "Sign in"}
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="grow border-t border-gray-200"></div>
              <span className="shrink mx-4 text-xs text-gray-400">OR CONTINUE WITH</span>
              <div className="grow border-t border-gray-200"></div>
            </div>

            <button className="bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all hover:-translate-y-1 hover:shadow-black/50 shadow-sm cursor-pointer" onClick={() => { signIn("google", { callbackUrl: "/dashboard" }) }}>
              <img className='w-5 h-5' src='/google.png' alt="Google logo" />
              Log in with Google
            </button>

            <p className="text-sm text-gray-500 text-center mt-4">
              Don't have an account? <span className="text-purple-600 font-medium cursor-pointer hover:underline"><Link href='/signup'>Sign Up</Link></span>
            </p>
          </div>

          {/* Preserved original classes exactly, added hidden on mobile screens */}
          <div className="relative hidden md:flex md:w-1/2 min-h-125 flex-col">
            <img
              className="w-full h-full object-cover"
              src="/poster.png"
              alt="Classroom Illustration"
            />
            <div className="absolute w-full h-full top-0 bottom-0 bg-linear-to-t from-black/90 via-black/20 to-black/30 flex flex-col justify-end p-12 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Manage your Learning Anywhere</h3>
              <p className="text-xs text-gray-300 max-w-xs mx-auto">Access assignments, dynamic streams, and code sandboxes directly.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage;