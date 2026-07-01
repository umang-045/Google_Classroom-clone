"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import Image from 'next/image'
import toast from 'react-hot-toast'

const ForgotPasswordPage = () => {
    const router = useRouter()
    const [email, setEmail] = useState<string>("")
    const [otp, setOtp] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [sent, setSent] = useState<boolean>(false)

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const res = await fetch("/api/forgotpassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        })
        const data: { error?: string } = await res.json()
        setLoading(false)
        if (!res.ok) {
            toast.error(data.error || "Something went wrong. Try again.")
            return
        }
        toast.success("OTP sent! Check your email.")
        setSent(true)
    }

    const verifyOtp = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const res = await fetch("/api/forgotverify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
        })
        const data: { error?: string } = await res.json()
        setLoading(false)
        if (!res.ok) {
            toast.error(data.error || "Invalid OTP")
            return
        }
        sessionStorage.setItem("reset_email", email)
        router.push('/resetpassword')
    }

    return (
        <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-800 flex items-center justify-center p-4">
            <Image
                src="/bg3.jpg"
                alt=""
                fill
                className="object-cover"
                priority
            />
            <div className='absolute inset-0 bg-black/30' />

            <div className="relative z-10 w-full max-w-4xl rounded-3xl flex flex-row overflow-hidden justify-center bg-white/80 backdrop-blur-sm shadow-2xl">

                <div className="p-8 w-1/2 flex flex-col justify-center">
                    <div className="mb-6">
                        <div className="text-xs font-extrabold text-zinc-800">
                            Digital<span className="text-blue-700">Classroom</span>
                        </div>
                    </div>

                    {!sent ? (
                        <>
                            <h1 className="text-3xl font-extrabold text-zinc-900">Forgot Password?</h1>
                            <p className="text-sm text-gray-500 mt-1 mb-8">
                                Enter your email and we will send you an OTP to reset your password.
                            </p>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-zinc-700">Email address</label>
                                    <input
                                        className="bg-gray-100 border border-gray-200 p-3 rounded-xl text-zinc-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-zinc-900 hover:bg-gray-800 text-white py-3 rounded-xl font-medium disabled:opacity-60 transition-colors"
                                >
                                    {loading ? "Sending OTP..." : "Send OTP"}
                                </button>
                            </form>

                            <p className="text-sm text-gray-500 text-center mt-6">
                                <Link href="/login" className="text-purple-600 font-medium hover:underline flex items-center justify-center gap-1">
                                    <span>←</span> Back to login
                                </Link>
                            </p>
                        </>
                    ) : (
                        <form onSubmit={verifyOtp}>
                            <Card className="p-10 bg-white/70">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
                                    <CardDescription>
                                        Enter the verification code we sent to{" "}
                                        <span className="font-medium text-zinc-800">{email}</span>.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <Field>
                                        <FieldLabel htmlFor="otp-verification" className="text-xs font-medium text-zinc-700 mb-2 block">
                                            Verification code
                                        </FieldLabel>
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
                                        <FieldDescription className="py-2 text-xs text-gray-400">
                                            Check your spam folder if you did not receive it.
                                        </FieldDescription>
                                    </Field>
                                </CardContent>

                                <CardFooter className="flex gap-3">
                                    <Button type="submit" disabled={loading || otp.length < 6}>
                                        {loading ? "Verifying..." : "Verify OTP"}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => { setSent(false); setOtp("") }}>
                                        Go back
                                    </Button>
                                </CardFooter>
                            </Card>
                        </form>
                    )}
                </div>

                <div className="relative md:w-1/2 min-h-[500px] flex-col">
                    <img
                        className="w-full h-full object-cover"
                        src="/poster.png"
                        alt="Classroom Illustration"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 flex flex-col justify-end p-12 text-center">
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

export default ForgotPasswordPage