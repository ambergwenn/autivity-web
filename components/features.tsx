"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

interface Feature {
  id: string;
  title: string;
  description: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    id: "settings",
    title: "Personalized settings",
    description:
      "Customize the learning experience with toggles for music, sound effects, and visual cues that are tailored to every child's sensory needs.",
    image: "/images/features/settings.PNG",
    imageWidth: 1640,
    imageHeight: 541,
    accentColor: "#C084FC",
    bgColor: "#FAF5FF",
    borderColor: "#E9D5FF",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: "activities",
    title: "Adaptive activities",
    description:
      "Engaging activities automatically adapt difficulty to each learner's progress and pace.",
    image: "/images/features/activities.png",
    imageWidth: 1640,
    imageHeight: 1726,
    accentColor: "#FDBA74",
    bgColor: "#FFFBEB",
    borderColor: "#FED7AA",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
  },
  {
    id: "analytics",
    title: "Layered analytics",
    description:
      "Track skill development across motor, cognitive, and social domains with detailed subskills and session breakdowns.",
    image: "/images/features/skills.PNG",
    imageWidth: 1463,
    imageHeight: 500,
    accentColor: "#86EFAC",
    bgColor: "#F0FDF4",
    borderColor: "#BBF7D0",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: "feedback",
    title: "Real-time feedback",
    description:
      "Rubric-based session evaluations give teachers ability to give feedback on the student's progress, received by parents instantly.",
    image: "/images/features/feedback.PNG",
    imageWidth: 1374,
    imageHeight: 1239,
    accentColor: "#FCA5A5",
    bgColor: "#FFF5F5",
    borderColor: "#FECACA",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

export const BouncyCardsFeatures = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = features[activeIndex];

  return (
    <section
      id="features"
      className="mx-auto max-w-7xl px-4 py-20 scroll-mt-16"
    >
      {/* Heading */}
      <div className="mb-14 flex flex-col items-center justify-center text-center">
        <h1
          className="font-fredoka text-3xl font-bold leading-tight md:text-4xl lg:text-5xl"
          style={{ color: "#535B74" }}
        >
          Fun learning with
          <span style={{ color: "#62A9E6" }}> a purpose</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg font-medium" style={{ color: "#6B7280" }}>
          Everything a learner needs to deliver personalized, evidence-based
          sessions in one beautiful platform.
        </p>
      </div>

      {/* Tab Showcase */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-10">

        {/* Left: Feature Tab List */}
        <div className="flex flex-col gap-3 lg:w-[38%]">
          {features.map((feature, i) => {
            const isActive = i === activeIndex;
            return (
              <motion.button
                key={feature.id}
                onClick={() => setActiveIndex(i)}
                onHoverStart={() => setActiveIndex(i)}
                className="group relative w-full cursor-pointer rounded-2xl border-2 p-5 text-left transition-all duration-300"
                style={{
                  backgroundColor: isActive ? feature.bgColor : "#F8FAFC",
                  borderColor: isActive ? feature.accentColor : "#E2E8F0",
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {/* Left accent bar */}
                <motion.div
                  className="absolute left-0 top-4 bottom-4 w-1 rounded-full"
                  style={{ backgroundColor: feature.accentColor }}
                  initial={{ scaleY: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                  animate={{ scaleY: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                />

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: isActive ? feature.accentColor + "30" : "#F1F5F9",
                      color: isActive ? feature.accentColor : "#94A3B8",
                    }}
                  >
                    {feature.icon}
                  </div>

                  <div>
                    <p
                      className="font-fredoka text-lg font-semibold leading-snug"
                      style={{ color: isActive ? "#535B74" : "#64748B" }}
                    >
                      {feature.title}
                    </p>
                    <motion.p
                      className="mt-1 text-sm leading-relaxed text-slate-500 overflow-hidden"
                      initial={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
                      animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      {feature.description}
                    </motion.p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Right: Screenshot Preview */}
        <div className="relative flex-1 lg:min-h-[460px]">
          <div
            className="sticky top-24 h-full min-h-[320px] overflow-hidden rounded-3xl border-2 shadow-xl"
            style={{
              borderColor: active.borderColor,
              backgroundColor: active.bgColor,
            }}
          >
            {/* Decorative top bar (like a browser chrome) */}
            <div
              className="flex items-center gap-2 px-4 py-3 border-b"
              style={{ borderColor: active.borderColor }}
            >
              <div className="h-3 w-3 rounded-full bg-red-300" />
              <div className="h-3 w-3 rounded-full bg-yellow-300" />
              <div className="h-3 w-3 rounded-full bg-green-300" />
              <div
                className="ml-3 flex-1 rounded-full px-3 py-1 text-xs text-slate-400"
                style={{ backgroundColor: active.borderColor }}
              >
                autivity.app
              </div>
            </div>

            {/* Image area */}
            <div className="relative flex items-center justify-center p-4 min-h-[260px] lg:min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="w-full"
                >
                  <Image
                    src={active.image}
                    alt={active.title}
                    width={active.imageWidth}
                    height={active.imageHeight}
                    className="w-full h-auto rounded-xl object-contain shadow-md"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
