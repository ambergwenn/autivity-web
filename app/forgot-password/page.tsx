"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Mail, CheckCircle2, ArrowLeft, ShieldCheck } from "lucide-react"
import Navbar from "@/components/navbar"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { supabase } from "@/lib/supabase"

function ForgotPasswordContent() {
  const searchParams = useSearchParams()
  const initialEmail = searchParams.get("email") || ""

  const [email, setEmail] = useState(initialEmail)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email.trim()) {
      return
    }

    setLoading(true)

    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      })

      if (error) {
        // Only show rate limit errors; suppress user-not-found to prevent account enumeration
        if (error.status === 429 || error.message.toLowerCase().includes("rate limit")) {
          setErrorMessage("Too many requests. Please wait a few minutes before trying again.")
          setLoading(false)
          return
        }
        console.warn("Reset password request notice:", error.message)
      }

      // Always show ambiguous confirmation for security
      setSubmitted(true)
    } catch (err) {
      console.error("Unexpected error during password reset:", err)
      // Still show the generic confirmation to maintain ambiguity
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
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
            Reset <span style={{ color: "#62A9E6" }}>Password</span>
          </h1>
          <FieldDescription className="text-base md:text-lg text-center w-full text-slate-500">
            {submitted
              ? "Check your email for recovery instructions"
              : "Enter your email to receive a password reset link"}
          </FieldDescription>
        </div>

        {submitted ? (
          <div className="flex flex-col gap-6 text-center">
            {/* Ambiguous Security Alert Box */}
            <div className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-blue-50/80 border border-blue-100 text-slate-700 text-left">
              <div className="flex items-center gap-2 text-[#62A9E6] font-semibold text-sm md:text-base w-full">
                <ShieldCheck className="size-5 shrink-0" />
                <span>Request Received</span>
              </div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                If an account with this email address exists, you will receive a password reset link shortly.
              </p>
              <p className="text-xs text-slate-500">
                Please check your inbox as well as your spam folder.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full py-3 px-6 text-base font-semibold text-white bg-[#62A9E6] shadow-[0_4px_0_0_#5298D4] hover:brightness-105 active:brightness-95 transition-all cursor-pointer"
              >
                <ArrowLeft className="size-4" /> Back to Login
              </Link>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false)
                  setEmail("")
                }}
                className="text-xs md:text-sm font-medium text-slate-500 hover:text-[#62A9E6] transition-colors cursor-pointer"
              >
                Try another email
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-6 md:gap-7">
              <Field className="gap-2">
                <FieldLabel
                  htmlFor="email"
                  className="text-base md:text-lg font-semibold text-[#4B5161]"
                >
                  Email Address
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="h-11 md:h-13 pl-4 pr-11 text-base md:text-lg rounded-xl border-slate-300 focus:border-[#62A9E6] focus:ring-4 focus:ring-[#62A9E6]/20 transition-all duration-300 w-full"
                  />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 pointer-events-none" />
                </div>
              </Field>
              
              {errorMessage && (
                <p className="text-sm font-medium text-red-500 text-center">
                  {errorMessage}
                </p>
              )}

              <Field className="mt-2 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full py-3 px-6 text-base font-semibold text-white bg-[#62A9E6] shadow-[0_4px_0_0_#5298D4] hover:brightness-105 active:brightness-95 disabled:opacity-60 transition-all cursor-pointer"
                >
                  {loading ? "Sending link..." : "Send Reset Link"}
                </button>

                <div className="text-center mt-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-xs md:text-sm font-medium text-[#62A9E6] hover:underline"
                  >
                    <ArrowLeft className="size-3.5" /> Return to Login
                  </Link>
                </div>
              </Field>
            </FieldGroup>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <div
        className="relative flex flex-1 items-center justify-center gap-6 bg-cover bg-center bg-no-repeat p-6 md:p-10 overflow-hidden"
        style={{
          backgroundImage: "url('/images/login/login-bg.svg')",
        }}
      >
        {/* Decorative scattered elements across screen matching login aesthetic */}
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
        <Image
          src="/images/hero/elements/ellipse-1.svg"
          alt=""
          width={24}
          height={24}
          className="absolute left-[20%] top-[30%] z-10 animate-pulse-soft pointer-events-none hidden sm:block"
        />
        <Image
          src="/images/hero/elements/flower-1.svg"
          alt=""
          width={32}
          height={32}
          className="absolute right-[22%] bottom-[30%] z-10 animate-float pointer-events-none hidden sm:block"
        />

        <Suspense fallback={<div className="w-full max-w-sm md:max-w-md h-96 animate-pulse bg-white/50 rounded-2xl" />}>
          <ForgotPasswordContent />
        </Suspense>
      </div>
    </div>
  )
}
