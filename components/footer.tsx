"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface FooterLink {
  name: string;
  href: string;
  badge?: string;
  badgeStyle?: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const footerNavigation: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "/#features" },
      { name: "Clinical Architecture", href: "/#science" },
      { name: "FAQ", href: "/#faq" },
    ],
  },
];

export default function Footer() {
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
    <footer
      className="w-full border-t border-slate-200 bg-no-repeat text-slate-600 dark:border-slate-800 dark:text-slate-400"
      style={{
        backgroundImage: "url('/images/footer/footer-bg.svg')",
        backgroundSize: "100% auto",
        backgroundPosition: "top center",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 pt-36 pb-12 lg:pt-40 lg:pb-16">

        {/* Main Content: Logo+Description left, Nav columns right */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">

          {/* Left: Logo + Description */}
          <div className="flex flex-col gap-5 lg:max-w-sm">
            <Link
              href="/"
              className="flex items-center gap-3"
              onClick={handleLogoClick}
            >
              <Image
                src="/images/logo.svg"
                alt="Autivity logo"
                width={52}
                height={52}
                className="h-13 w-auto"
              />
              <Image
                src="/images/text-logo.svg"
                alt="Autivity"
                width={300}
                height={80}
                className="h-20 w-auto"
              />
            </Link>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Autivity provides evidence-based, highly adaptive activities that bridge the gap between therapy, school, and home — empowering ASD learners to build confidence and mastery every step of the way.
            </p>
          </div>

          {/* Right: Navigation Columns */}
          <div className="grid grid-cols-2 gap-8">
            {footerNavigation.map((col) => (
              <div key={col.title} className="flex flex-col gap-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {col.title}
                </h4>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                        onClick={(e) => {
                          if (link.href.startsWith("/#")) {
                            handleScroll(e, link.href.split("#")[1]);
                          }
                        }}
                      >
                        <span>{link.name}</span>
                        {link.badge && (
                          <span
                            className={`ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${link.badgeStyle || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              }`}
                          >
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Mobile App Column */}
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Mobile App
              </h4>
              <div className="flex flex-col gap-3">
                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105 inline-block"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                    alt="Download on the App Store"
                    className="h-[42px] w-auto"
                  />
                </Link>
                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105 inline-block"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Get it on Google Play"
                    className="h-[44px] w-auto"
                  />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <hr className="mt-16 border-slate-400 dark:border-slate-600" />

        {/* Bottom Bar */}
        <div className="pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/* Copyright */}
            <p className="text-sm text-slate-500 dark:text-slate-400">
              &copy; {new Date().getFullYear()} Autivity, Inc. All rights reserved.
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
