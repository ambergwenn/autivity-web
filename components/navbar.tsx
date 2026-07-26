"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

export default function Navbar() {
    const pathname = usePathname();

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        if (pathname === "/") {
            e.preventDefault();
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 relative">

                {/* Left: Logo container */}
                <div className="flex items-center justify-start">
                    <Link
                        href="/"
                        className="flex items-center gap-3"
                        onClick={handleLogoClick}
                    >
                        <Image
                            src="/images/logo.svg"
                            alt="Autivity logo"
                            width={60}
                            height={60}
                        />
                        <Image
                            src="/images/text-logo.svg"
                            alt="Autivity"
                            width={118}
                            height={32}
                        />
                    </Link>
                </div>

                {/* Center: Absolute Centered Navigation (The Magic Fix) */}
                {/* This forces exact horizontal and vertical centering regardless of what is on the left or right */}
                <nav className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 whitespace-nowrap">
                    <Link
                        href="/#features"
                        className={navigationMenuTriggerStyle()}
                        onClick={(e) => handleScroll(e, "features")}
                    >
                        Features
                    </Link>
                    <Link
                        href="/#process"
                        className={navigationMenuTriggerStyle()}
                        onClick={(e) => handleScroll(e, "process")}
                    >
                        Process
                    </Link>
                    <Link
                        href="/#science"
                        className={navigationMenuTriggerStyle()}
                        onClick={(e) => handleScroll(e, "science")}
                    >
                        Science
                    </Link>
                </nav>

                {/* Right: Admin Link */}
                <div className="flex items-center justify-end">
                    <Link
                        href="/login"
                        className={navigationMenuTriggerStyle()}
                    >
                        Admin
                    </Link>
                </div>

            </div>
        </header>
    );
}