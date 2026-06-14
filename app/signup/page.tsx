"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import './signup.css'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Field, FieldDescription, FieldLabel, } from "@/components/ui/field"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, } from "@/components/ui/input-otp"

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
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const result = useSession();
    const session = result.data;

    useEffect(() => {
        if (session) {
            router.push('/dashboard')
            alert("YOU ARE ALREADY LOGGED IN ✅")
        }
    }, [session])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSignup = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        const res = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })
        const data: { error?: string } = await res.json()
        setLoading(false)
        if (!res.ok) {
            return setError(data.error || "Try Again")
        }
        setVerify(true)
    }

    const verifyOtp = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        const res = await fetch("/api/forgotverify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: form.email, otp })
        })
        const data: { error?: string } = await res.json()
        setLoading(false)
        if (!res.ok) {
            return setError(data.error || "Invalid Otp")
        }
        router.push('/resetpassword')
    }

    return (
        <div className="relative overflow-hidden min-h-screen bg-linear-to-br from-zinc-950 to-zinc-800 flex items-center justify-center p-4">
             <Image
                            src="/bg3.jpg"
                            alt=""
                            fill
                            className="object-cover"
                            priority
                          />
                    <div className='absolute inset-0 bg-black/30' />

            <div className="relative z-10 w-full max-w-4xl rounded-3xl flex flex-col md:flex-row overflow-hidden justify-center bg-white/80 shadow-2xl">
                <div className="p-8 w-1/2 flex flex-col justify-center">
                    <div className="mb-6 flex items-center gap-2">
                        <div className="text-xs font-extrabold text-zinc-800">
                            Digital<span className='text-blue-700'>Classroom</span>
                        </div>
                    </div>


                    {!verify && (
                        <>
                            <h1 className="text-3xl font-extrabold text-zinc-900">Welcome!</h1>
                            <p className="text-sm text-gray-500 mt-1 mb-8">Please enter your details below.</p>

                            {error && (
                                <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-xl">{error}</p>
                            )}
                            <form onSubmit={handleSignup} className="flex flex-col gap-4">
                                <input className="bg-gray-100 border border-gray-200 p-3 rounded-xl" type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
                                <input className="bg-gray-100 border border-gray-200 p-3 rounded-xl" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                                <input className="bg-gray-100 border border-gray-200 p-3 rounded-xl text-zinc-900" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                                <button type="submit" disabled={loading} className="bg-zinc-900 hover:bg-gray-800 text-white py-3 rounded-xl font-medium disabled:opacity-60">
                                    {loading ? "Please wait..." : "Sign up"}
                                </button>
                            </form>

                            <p className="text-sm text-gray-500 text-center mt-4">
                                Already have an account?{" "}
                                <Link href="/login" className="text-purple-600 font-medium hover:underline">
                                    Sign In
                                </Link>
                            </p>
                        </>
                    )}

                    {verify && (
                        <form onSubmit={verifyOtp}>
                            <Card className="p-10  bg-white/7 ">
                                <CardHeader>
                                    <CardTitle className='text-2xl font-bold p'>Verify your login</CardTitle>
                                    <CardDescription >
                                        Enter the verification code we sent to your email address:{" "}
                                        <span className="font-medium">{form.email}</span>.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Field>
                                        <div className="flex items-center justify-between  text-black">
                                            <FieldLabel htmlFor="otp-verification">
                                                Verification code
                                            </FieldLabel>
                                        </div>
                                        <InputOTP maxLength={6} id="otp-verification" required value={otp} onChange={(value) => setOtp(value)}>
                                            <InputOTPGroup className="bg-white *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator className="mx-2" />
                                            <InputOTPGroup className="bg-white *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                        <FieldDescription className="py-2">
                                            <a href="/dashboard/signup">I no longer have access to this email address.</a>
                                        </FieldDescription>
                                    </Field>
                                </CardContent>
                                <CardFooter>
                                    <Field>
                                        <Button type="submit" disabled={loading} >
                                            {loading ? "Verifying..." : "Verify OTP  "}
                                        </Button>
                                        <Button type="button" onClick={() => { setVerify(false); setError("") }} >
                                            Go back
                                        </Button>
                                    </Field>
                                </CardFooter>
                            </Card>
                        </form>
                    )}
                </div>

                <div className="md:flex relative md:w-1/2 min-h-125 flex-col">
                    <img
                        className="w-full h-full object-cover"
                        src="/poster.png"
                        alt="Classroom Illustration"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-black/30 flex flex-col justify-end p-12 text-center">
                        <h3 className="text-xl font-bold text-white mb-2">Manage your Learning Anywhere</h3>
                        <p className="text-xs text-gray-300 max-w-xs mx-auto">
                            Access assignments, dynamic streams, and code sandboxes directly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage