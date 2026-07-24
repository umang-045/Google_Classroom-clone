"use client"
import React from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { toastOptions } from '../components/toastOptions'
import { Eye, EyeOff } from 'lucide-react'

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter()
  const [form, setform] = useState<LoginForm>({ email: "", password: "" });
  const [loading, setloading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const result = useSession();
  const session = result.data;

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
      toast.success("YOU ARE LOGGED IN", toastOptions)
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
      toast.error(res.error, toastOptions)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <>
      <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-800 flex items-center justify-center p-4">
        <Image
          src="/bg3.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 w-full max-w-md md:max-w-4xl rounded-3xl flex flex-col md:flex-row overflow-hidden justify-center bg-white/80 backdrop-blur-sm shadow-2xl">
          <div className="p-6 md:p-8 w-full md:w-1/2 flex flex-col justify-center">
            <div className="mb-6 flex items-center gap-2">
              <div className="text-sm font-black tracking-tight text-zinc-900">
                Digital<span className="text-blue-600">Classroom</span>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900">Welcome Back!</h1>
            <p className="text-sm text-zinc-500 mt-1 mb-6 md:mb-8">Please enter log in details below.</p>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input 
                className="bg-zinc-100 border border-zinc-200 p-3 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400" 
                type="email" 
                name="email" 
                placeholder="Email" 
                value={form.email} 
                onChange={handleChange} 
                required 
              />
              
              <div className="flex flex-col gap-1">
                <div className="relative flex items-center bg-zinc-100 border border-zinc-200 rounded-xl px-3 focus-within:ring-2 focus-within:ring-zinc-400">
                  <input 
                    className="bg-transparent flex-1 py-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none" 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    placeholder="Password" 
                    value={form.password} 
                    onChange={handleChange} 
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-blue-600 font-medium cursor-pointer text-right hover:underline mt-1" onClick={() => router.push('/forgetpassword')}>
                  Forgot password?
                </p>
              </div>

              <button type="submit" disabled={loading} className="bg-zinc-900 hover:bg-zinc-800 text-white py-3 rounded-xl font-medium disabled:opacity-60 cursor-pointer transition-colors">
                {loading ? "Please wait..." : "Sign in"}
              </button>
            </form>

            <div className="relative flex py-2 items-center my-2">
              <div className="grow border-t border-zinc-200"></div>
              <span className="shrink mx-4 text-xs text-zinc-400 font-medium">OR CONTINUE WITH</span>
              <div className="grow border-t border-zinc-200"></div>
            </div>

            <button className="bg-white border border-zinc-200 text-zinc-700 py-3 rounded-xl font-medium flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-95" onClick={() => { signIn("google", { callbackUrl: "/dashboard" }) }}>
              <img className="w-5 h-5" src="/google.png" alt="Google logo" />
              Log in with Google
            </button>

            <p className="text-sm text-zinc-500 text-center mt-4">
              Don't have an account? <span className="text-blue-600 font-medium cursor-pointer hover:underline"><Link href="/signup">Sign Up</Link></span>
            </p>
          </div>

          <div className="relative hidden md:flex md:w-1/2 min-h-[31.25rem] flex-col">
            <img
              className="w-full h-full object-cover"
              src="/poster.png"
              alt="Classroom Illustration"
            />
            <div className="absolute w-full h-full top-0 bottom-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 flex flex-col justify-end p-12 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Manage your Learning Anywhere</h3>
              <p className="text-xs text-zinc-300 max-w-xs mx-auto">Access assignments, dynamic streams, and code sandboxes directly.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage;