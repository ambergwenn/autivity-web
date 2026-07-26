"use client"
import { notFound } from "next/navigation";

import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function SignupPage() {
  if (process.env.NEXT_PUBLIC_ENABLE_SIGNUP !== "true") {
    notFound()
  }

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setErrorMsg(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: "admin",
          },
        },
      })

      if (error) {
        setErrorMsg(error.message)
      } else {
        setMessage("Admin signup successful! Please check your email for confirmation link (if enabled) or try logging in.")
        setEmail("")
        setPassword("")
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 bg-slate-50 text-slate-800">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md border border-slate-200">
        <h1 className="text-2xl font-bold text-center mb-6">Create Admin Account (Temporary)</h1>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-semibold text-slate-600">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="h-11 px-4 rounded-lg border border-slate-350 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-semibold text-slate-600">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="h-11 px-4 rounded-lg border border-slate-350 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {errorMsg && (
            <div className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-lg border border-red-200">
              {errorMsg}
            </div>
          )}

          {message && (
            <div className="text-sm text-green-700 font-medium bg-green-50 p-3 rounded-lg border border-green-200">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating..." : "Sign Up Admin"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          <Link href="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
