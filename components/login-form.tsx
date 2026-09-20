"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams()
  const resetSuccess = searchParams.get("reset") === "success"
  const urlError = searchParams.get("error")

  const [step, setStep] = useState<"email" | "password">("email")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [errorMsg, setErrorMsg] = useState<string | null>(
    urlError === "invalid_or_expired_token"
      ? "Your reset token was invalid or has expired. Please try again."
      : urlError === "unauthorized"
      ? "Access denied. Admin privileges required."
      : null
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    if (step === "email") {
      if (email.trim()) {
        setStep("password")
      }
    } else {
      // Perform actual sign in logic here
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Login error:", error)
        setErrorMsg(error.message)
      } else {
        const userRole = data.user?.user_metadata?.role
        if (userRole !== "admin") {
          await supabase.auth.signOut()
          setErrorMsg("Access denied.")
        } else {
          console.log("Login success:", data)
          // Update profile active status and timestamp
          try {
            await supabase
              .from("profiles")
              .update({
                last_active: new Date().toISOString(),
                last_sign_in_at: new Date().toISOString(),
                status: "active",
                updated_at: new Date().toISOString(),
              })
              .eq("id", data.user.id)
          } catch (err) {
            console.warn("Could not update last_active on login:", err)
          }

          // Redirect to dashboard
          window.location.href = "/dashboard"
        }
      }
    }
  }

  const forgotPasswordHref = email.trim()
    ? `/forgot-password?email=${encodeURIComponent(email.trim())}`
    : "/forgot-password"

  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:gap-8 rounded-2xl bg-white/90 px-6 py-8 md:px-10 md:py-12 shadow-xl backdrop-blur-sm border border-white/60 transition-all duration-300",
        className
      )}
      {...props}
    >
      <form onSubmit={handleSubmit}>
        <FieldGroup className="gap-6 md:gap-7">
          {/* Header: Logo + Title */}
          <div className="flex flex-col items-center gap-4 text-center">
            <Image
              src="/images/logo.svg"
              alt="Autivity logo"
              width={80}
              height={80}
              className="h-16 w-auto md:h-20 transition-all duration-300"
            />
            <h1 className="font-fredoka text-3xl md:text-4xl font-bold text-[#4B5161] transition-all duration-300">
              Welcome to{" "}
              <span style={{ color: "#62A9E6" }}>Autivity!</span>
            </h1>
            <FieldDescription className="text-base md:text-lg text-center w-full text-slate-500">
              Log in to your account to continue
            </FieldDescription>
          </div>

          {/* Reset password success notice */}
          {resetSuccess && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs md:text-sm">
              <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
              <span>Password successfully updated! You can now log in with your new password.</span>
            </div>
          )}

          {/* Conditional Field: Email vs Password */}
          {step === "email" ? (
            <Field className="gap-2">
              <FieldLabel htmlFor="email" className="text-base md:text-lg font-semibold text-[#4B5161]">
                Email
              </FieldLabel>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="h-11 md:h-13 px-4 text-base md:text-lg rounded-xl border-slate-300 focus:border-[#62A9E6] focus:ring-4 focus:ring-[#62A9E6]/20 transition-all duration-300"
              />
              <div className="flex justify-end mt-1">
                <Link
                  href={forgotPasswordHref}
                  className="text-xs md:text-sm font-medium text-[#62A9E6] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </Field>
          ) : (
            <Field className="gap-2">
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password" className="text-base md:text-lg font-semibold text-[#4B5161]">
                  Password
                </FieldLabel>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-xs md:text-sm font-medium text-[#62A9E6] hover:underline cursor-pointer"
                >
                  Change Email
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-11 md:h-13 pl-4 pr-12 text-base md:text-lg rounded-xl border-slate-300 focus:border-[#62A9E6] focus:ring-4 focus:ring-[#62A9E6]/20 transition-all duration-300 w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="size-5 md:size-6" />
                  ) : (
                    <Eye className="size-5 md:size-6" />
                  )}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <Link
                  href={forgotPasswordHref}
                  className="text-xs md:text-sm font-medium text-[#62A9E6] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </Field>
          )}

          {errorMsg && (
            <p className="text-sm font-medium text-red-500 text-center">
              {errorMsg}
            </p>
          )}

          {/* Submit */}
          <Field className="mt-2">
            <button
              type="submit"
              className="w-full rounded-full py-3 px-6 text-base font-semibold text-white transition-all active:translate-y-[2px] active:shadow-none bg-[#62A9E6] shadow-[0_4px_0_0_#5298D4] cursor-pointer hover:brightness-105 active:brightness-95"
            >
              {step === "email" ? "Next" : "Login"}
            </button>
          </Field>
        </FieldGroup>
      </form>

      {/* Footer */}
      <FieldDescription className="px-6 text-center text-xs md:text-sm">
        By clicking continue, you agree to our{" "}
        <a href="#" className="font-medium text-[#62A9E6] hover:underline">Terms of Service</a> and{" "}
        <a href="#" className="font-medium text-[#62A9E6] hover:underline">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
