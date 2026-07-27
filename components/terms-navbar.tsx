"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function TermsNavbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-center px-6"> {/* Changed: added justify-center */}
                <Link href="/" className="flex items-center gap-3">
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
        </header>
    );
}