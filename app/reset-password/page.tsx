"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle } from "lucide-react"
import Navbar from "@/components/navbar"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { supabase } from "@/lib/supabase"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [hasValidSession, setHasValidSession] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setHasValidSession(false)
        }
      } catch (err) {
        setHasValidSession(false)
      } finally {
        setCheckingSession(false)
      }
    }
    checkAuth()
  }, [])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify and try again.")
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        setErrorMessage(error.message)
      } else {
        // Sign out temporary recovery session so user explicitly logs in with new credentials
        await supabase.auth.signOut()
        setSuccess(true)
        setTimeout(() => {
          router.push("/login?reset=success")
        }, 2000)
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <div
        className="relative flex flex-1 items-center justify-center gap-6 bg-cover bg-center bg-no-repeat p-6 md:p-10 overflow-hidden"
        style={{
          backgroundImage: "url('/images/login/login-bg.svg')",
        }}
      >
        {/* Decorative scattered elements */}
        <Image
          src="/images/hero/elements/flower-2.svg"
          alt=""
          width={50}
          height={50}
          className="absolute left-[10%] top-[10%] z-10 animate-float pointer-events-none hidden md:block"
        />
        <Image
          src="/images/hero/elements/ellipse-2.svg"
          alt=""
          width={30}
          height={30}
          className="absolute right-[12%] top-[15%] z-10 animate-pulse-soft pointer-events-none"
        />
        <Image
          src="/images/hero/elements/star-1.svg"
          alt=""
          width={40}
          height={40}
          className="absolute left-[5%] top-[50%] -translate-y-1/2 z-10 animate-float-delayed pointer-events-none hidden sm:block"
        />
        <Image
          src="/images/hero/elements/flower-3.svg"
          alt=""
          width={35}
          height={35}
          className="absolute right-[8%] top-[45%] z-10 animate-float pointer-events-none hidden sm:block"
        />
        <Image
          src="/images/hero/elements/ellipse-3.svg"
          alt=""
          width={45}
          height={45}
          className="absolute left-[15%] bottom-[12%] z-10 animate-pulse-soft pointer-events-none"
        />
        <Image
          src="/images/hero/elements/star-2.svg"
          alt=""
          width={55}
          height={55}
          className="absolute right-[10%] bottom-[10%] z-10 animate-float-delayed pointer-events-none hidden md:block"
        />

        <div className="w-full max-w-sm md:max-w-md transition-all duration-300 z-20">
          <div className="flex flex-col gap-6 md:gap-8 rounded-2xl bg-white/90 px-6 py-8 md:px-10 md:py-12 shadow-xl backdrop-blur-sm border border-white/60 transition-all duration-300">
            {/* Header */}
            <div className="flex flex-col items-center gap-4 text-center">
              <Image
                src="/images/logo.svg"
                alt="Autivity logo"
                width={80}
                height={80}
                className="h-16 w-auto md:h-20 transition-all duration-300"
              />
              <h1 className="font-fredoka text-3xl md:text-4xl font-bold text-[#4B5161]">
                Set New <span style={{ color: "#62A9E6" }}>Password</span>
              </h1>
              <FieldDescription className="text-base md:text-lg text-center w-full text-slate-500">
                Choose a strong password for your admin account
              </FieldDescription>
            </div>

            {checkingSession ? (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <div className="size-8 rounded-full border-3 border-[#62A9E6] border-t-transparent animate-spin" />
                <p className="text-sm text-slate-500">Verifying security token...</p>
              </div>
            ) : !hasValidSession ? (
              <div className="flex flex-col gap-4 text-center">
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                  <AlertCircle className="size-6 text-amber-600" />
                  <p className="font-semibold text-sm">Link Expired or Invalid</p>
                  <p className="text-xs text-amber-700">
                    Your password reset link is invalid or has expired. Please request a new link.
                  </p>
                </div>
                <Link
                  href="/forgot-password"
                  className="w-full rounded-full py-3 px-6 text-base font-semibold text-white bg-[#62A9E6] shadow-[0_4px_0_0_#5298D4] hover:brightness-105 active:brightness-95 transition-all text-center"
                >
                  Request New Link
                </Link>
              </div>
            ) : success ? (
              <div className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center">
                <CheckCircle2 className="size-8 text-emerald-600" />
                <p className="font-semibold text-base">Password Updated!</p>
                <p className="text-xs md:text-sm text-emerald-700">
                  Your password has been changed successfully. Redirecting to login...
                </p>
              </div>
            ) : (
              <form onSubmit={handleUpdatePassword}>
                <FieldGroup className="gap-5 md:gap-6">
                  {/* New Password */}
                  <Field className="gap-2">
                    <FieldLabel
                      htmlFor="password"
                      className="text-base font-semibold text-[#4B5161]"
                    >
                      New Password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="h-11 md:h-13 pl-4 pr-12 text-base rounded-xl border-slate-300 focus:border-[#62A9E6] focus:ring-4 focus:ring-[#62A9E6]/20 transition-all duration-300 w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="size-5" />
                        ) : (
                          <Eye className="size-5" />
                        )}
                      </button>
                    </div>
                  </Field>

                  {/* Confirm Password */}
                  <Field className="gap-2">
                    <FieldLabel
                      htmlFor="confirmPassword"
                      className="text-base font-semibold text-[#4B5161]"
                    >
                      Confirm Password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="h-11 md:h-13 pl-4 pr-12 text-base rounded-xl border-slate-300 focus:border-[#62A9E6] focus:ring-4 focus:ring-[#62A9E6]/20 transition-all duration-300 w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="size-5" />
                        ) : (
                          <Eye className="size-5" />
                        )}
                      </button>
                    </div>
                  </Field>

                  {errorMessage && (
                    <p className="text-sm font-medium text-red-500 text-center">
                      {errorMessage}
                    </p>
                  )}

                  <Field className="mt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-full py-3 px-6 text-base font-semibold text-white bg-[#62A9E6] shadow-[0_4px_0_0_#5298D4] hover:brightness-105 active:brightness-95 disabled:opacity-60 transition-all cursor-pointer"
                    >
                      {loading ? "Updating password..." : "Update Password"}
                    </button>
                  </Field>
                </FieldGroup>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
