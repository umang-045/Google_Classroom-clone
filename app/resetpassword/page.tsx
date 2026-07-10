"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { toastOptions } from '../components/toastOptions'

const ResetPasswordPage = () => {
    const router = useRouter()
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirm, setShowConfirm] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const stored = sessionStorage.getItem("reset_email")
        if (!stored) {
            router.replace('/forgotpassword')
        } else {
            setEmail(stored)
        }
    }, [router])

    const handleReset = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.",toastOptions)
            return
        }
        setLoading(true)
        const res = await fetch("/api/resetpassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        })
        const data: { error?: string } = await res.json()
        setLoading(false)
        if (!res.ok) {
            toast.error(data.error || "Something went wrong. Try again.",toastOptions)
            return
        }
        toast.success("Password reset successfully!",toastOptions)
        sessionStorage.removeItem("reset_email")
        router.push('/login')
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

                    <h1 className="text-3xl font-extrabold text-zinc-900">Reset Password</h1>
                    <p className="text-sm text-gray-500 mt-1 mb-2">
                        Enter a new password for your account.
                    </p>

                    <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 w-fit mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        <span className="text-xs font-medium text-zinc-700">{email}</span>
                    </div>

                    <form onSubmit={handleReset} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-zinc-700">New password</label>
                            <div className="flex items-center bg-gray-100 border border-gray-200 rounded-xl px-3">
                                <input
                                    className="bg-transparent flex-1 py-3 text-zinc-900 placeholder-gray-400 focus:outline-none"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-400 hover:text-zinc-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-zinc-700">Confirm password</label>
                            <div className="flex items-center bg-gray-100 border border-gray-200 rounded-xl px-3">
                                <input
                                    className="bg-transparent flex-1 py-3 text-zinc-900 placeholder-gray-400 focus:outline-none"
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="text-gray-400 hover:text-zinc-600 transition-colors"
                                >
                                    {showConfirm ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-zinc-900 hover:bg-gray-800 text-white py-3 rounded-xl font-medium disabled:opacity-60 transition-colors"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
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

export default ResetPasswordPage