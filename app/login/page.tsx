import Navbar from "@/components/navbar"
import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <div
        className="relative flex flex-1 items-center justify-center gap-6 bg-cover bg-center bg-no-repeat p-6 md:p-10 overflow-hidden"
        style={{
          backgroundImage: "url('/images/login/login-bg.svg')",
        }}
      >
      {/* Decorative scattered elements across screen */}
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

      <div className="w-full max-w-sm md:max-w-md transition-all duration-300 z-20">
        <LoginForm />
      </div>
    </div>
    </div>
  )
}
