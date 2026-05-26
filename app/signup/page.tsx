"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface SignUpForm{
    name:string;
    email:string;
    password:string;
}

const SignUpPage = () => {
    const router = useRouter()
    const [form, setForm] = useState<SignUpForm>({ name: "", email: "", password: "" })
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false) 

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSignup = async (e:React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        const res = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })
        const data : {error?:string} = await res.json()
        setLoading(false)
        if (!res.ok) {
            return setError(data.error)
        }
        router.push("/login")
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-zinc-950 to-zinc-800 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl rounded-3xl flex flex-col md:flex-row overflow-hidden justify-center bg-white shadow-2xl">

           
                <div className="p-8 w-1/2 flex flex-col justify-center">
                    <div className="mb-6 flex items-center gap-2">
                        <div className="text-xs font-extrabold text-zinc-800">
                            Digital<span className='text-blue-700'>Classroom</span>
                        </div>
                    </div>

                    <h1 className="text-3xl font-extrabold text-zinc-900">Welcome!</h1>
                    <p className="text-sm text-gray-500 mt-1 mb-8">Please enter your details below.</p>

                    {error && (
                        <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-xl">{error}</p>
                    )}

                    <form onSubmit={handleSignup} className="flex flex-col gap-4">
                        <input
                            className="bg-gray-100 border border-gray-200 p-3 rounded-xl"type="text"name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required
                        />
                        <input
                            className="bg-gray-100 border border-gray-200 p-3 rounded-xl" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required
                        />
                        <input
                            className="bg-gray-100 border border-gray-200 p-3 rounded-xl text-zinc-900" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required
                        />
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