"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { Eye, EyeOff } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { toastOptions } from '../components/toastOptions'

interface SignUpForm {
  name: string;
  email: string;
  password: string;
}

const SignUpPage = () => {
  const router = useRouter()
  const [form, setForm] = useState<SignUpForm>({ name: "", email: "", password: "" })
  const [verify, setVerify] = useState<boolean>(false)
  const [otp, setOtp] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  
  const result = useSession()
  const session = result.data

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
      toast.success("You are already logged in!", toastOptions)
    }
  }, [session, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSignup = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data: { error?: string } = await res.json()
    setLoading(false)
    if (!res.ok) {
      toast.error(data.error || "Try Again", toastOptions)
      return
    }
    setVerify(true)
  }

  const verifyOtp = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/verifyotp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, otp })
    })
    const data: { error?: string } = await res.json()
    setLoading(false)
    if (!res.ok) {
      toast.error(data.error || "Invalid OTP", toastOptions)
      return
    }
    toast.success("Account Registered Successfully", toastOptions)
    router.push('/login')
  }

  return (
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

          {!verify ? (
            <>
              <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900">Welcome!</h1>
              <p className="text-sm text-zinc-500 mt-1 mb-6 md:mb-8">Please enter your details below.</p>

              <form onSubmit={handleSignup} className="flex flex-col gap-4">
                <input 
                  className="bg-zinc-100 border border-zinc-200 p-3 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400" 
                  type="text" 
                  name="name" 
                  placeholder="Full Name" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                />
                
                <input 
                  className="bg-zinc-100 border border-zinc-200 p-3 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400" 
                  type="email" 
                  name="email" 
                  placeholder="Email" 
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                />

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

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="bg-zinc-900 hover:bg-zinc-800 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-60 cursor-pointer mt-2"
                >
                  {loading ? "Please wait..." : "Sign up"}
                </button>
              </form>

              <p className="text-sm text-zinc-500 text-center mt-4">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 font-medium hover:underline">
                  Sign In
                </Link>
              </p>
            </>
          ) : (
            <form onSubmit={verifyOtp} className="w-full">
              <Card className="p-0 bg-transparent border-none shadow-none">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl md:text-2xl font-bold text-zinc-900">Verify your login</CardTitle>
                  <CardDescription className="text-zinc-600">
                    Enter the verification code sent to:{" "}
                    <span className="font-medium break-all text-zinc-800">{form.email}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0 mb-6 overflow-x-auto">
                  <Field>
                    <div className="flex items-center justify-between text-zinc-900 mb-2">
                      <FieldLabel htmlFor="otp-verification">
                        Verification code
                      </FieldLabel>
                    </div>
                    <InputOTP maxLength={6} id="otp-verification" required value={otp} onChange={(value) => setOtp(value)}>
                      <InputOTPGroup className="bg-white *:data-[slot=input-otp-slot]:h-11 md:*:data-[slot=input-otp-slot]:h-13 *:data-[slot=input-otp-slot]:w-10 md:*:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:text-xl md:*:data-[slot=input-otp-slot]:text-2xl *:data-[slot=input-otp-slot]:font-bold *:data-[slot=input-otp-slot]:text-zinc-900 *:data-[slot=input-otp-slot]:border-zinc-300 *:data-[slot=input-otp-slot]:bg-white *:data-[slot=input-otp-slot]:rounded-lg *:data-[slot=input-otp-slot]:shadow-sm">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator className="mx-1 md:mx-2 text-zinc-400" />
                      <InputOTPGroup className="bg-white *:data-[slot=input-otp-slot]:h-11 md:*:data-[slot=input-otp-slot]:h-13 *:data-[slot=input-otp-slot]:w-10 md:*:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:text-xl md:*:data-[slot=input-otp-slot]:text-2xl *:data-[slot=input-otp-slot]:font-bold *:data-[slot=input-otp-slot]:text-zinc-900 *:data-[slot=input-otp-slot]:border-zinc-300 *:data-[slot=input-otp-slot]:bg-white *:data-[slot=input-otp-slot]:rounded-lg *:data-[slot=input-otp-slot]:shadow-sm">
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    <FieldDescription className="py-2 text-xs text-zinc-500">
                      <Link href="/signup" className="hover:underline">I no longer have access to this email address.</Link>
                    </FieldDescription>
                  </Field>
                </CardContent>

                <CardFooter className="p-0 flex flex-col gap-2 items-stretch">
                  <Field className="w-full flex flex-col gap-2">
                    <Button type="submit" disabled={loading} className="cursor-pointer bg-zinc-900 hover:bg-zinc-800">
                      {loading ? "Verifying..." : "Verify OTP"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setVerify(false)} className="cursor-pointer border-zinc-200">
                      Go back
                    </Button>
                  </Field>
                </CardFooter>
              </Card>
            </form>
          )}
        </div>

      
        <div className="relative hidden md:flex md:w-1/2 min-h-[31.25rem] flex-col justify-between overflow-hidden bg-zinc-900">
          <div className="w-full h-full max-h-[380px] flex items-center justify-center p-10">
            <DotLottieReact
              src="/assets/login.json"
              loop
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 flex flex-col justify-end p-12 text-center pointer-events-none">
            <h3 className="text-xl font-bold text-white mb-2">Manage your Learning Anywhere</h3>
            <p className="text-xs text-zinc-300 max-w-xs mx-auto">
              Access assignments, dynamic streams, and code sandboxes directly.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SignUpPage