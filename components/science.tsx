"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Science-backed feature cards
const scienceCards = [
  {
    title: "Developmental Motor Milestones",
    description: "Activities follow a precise developmental sequence, moving naturally from foundational to complex, matching gold-standard occupational therapy milestones.",
    gradient: "purple" as const,
    activeWord: "Motor Learning",
    borderColor: "border-[#C084FC]",
    hoverColor: "#C084FC",
    colSpan: "col-span-12 md:col-span-4",
  },
  {
    title: "Errorless Learning & Anti-Frustration",
    description: "To prevent task burnout, our adaptive engine tracks struggle in real time. If a learner faces multiple setbacks, the system gently lowers the cognitive load to ensure a successful outcome and instantly rebuilds their confidence.",
    gradient: "orange" as const,
    activeWord: "Errorless Learning",
    borderColor: "border-[#FDBA74]",
    hoverColor: "#FB923C",
    colSpan: "col-span-12 md:col-span-8",
  },
  {
    title: "Evidence-Based Clinical Validation",
    description: "Automated tracking meets professional expertise. Educators evaluate completed sessions using a structured developmental rubric, ensuring qualitative notes and quantitative progress roll up seamlessly into clear reports for parents.",
    gradient: "green" as const,
    activeWord: "Clinical Validation",
    borderColor: "border-[#86EFAC]",
    hoverColor: "#10B981",
    colSpan: "col-span-12 md:col-span-8",
  },
  {
    title: "Personalized Sensory Regulation",
    description: "Every learner has unique sensory needs. Autivity allows customized audio and visual preferences to apply instantly, preventing auditory overstimulation and ensuring calm task transitions.",
    gradient: "blue" as const,
    activeWord: "Sensory Tuning",
    borderColor: "border-[#62A9E6]",
    hoverColor: "#62A9E6",
    colSpan: "col-span-12 md:col-span-4",
  },
];

export default function Science() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Determine active word and text color dynamically
  const activeWord = activeIndex !== null ? scienceCards[activeIndex].activeWord : "Autivity";
  const activeColor = activeIndex !== null ? scienceCards[activeIndex].hoverColor : "#62A9E6";

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 text-slate-800 border-t border-[#E5E7EB]/50">
      {/* Heading Block with 3D Text Rotation on Hover */}
      <div className="mb-16 flex flex-col items-center justify-center text-center px-4 md:px-8 mx-auto">
        <h2 className="max-w-3xl text-3xl font-fredoka font-bold leading-tight text-[#535B74] md:text-4xl lg:text-5xl" style={{ perspective: "1000px" }}>
          The Science behind
          <span className="block mt-2 relative transition-colors duration-300">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeWord}
                initial={{ opacity: 0, y: -20, rotateX: 40 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: 20, rotateX: -40 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="inline-block whitespace-nowrap"
                style={{ color: activeColor }}
              >
                {activeWord}
              </motion.span>
            </AnimatePresence>
          </span>
        </h2>
        <p className="mt-4 max-w-xl text-lg font-medium" style={{ color: "#6B7280" }}>
          Built on real accessibility standards. Every screen is designed for ASD learners.
        </p>
      </div>

      {/* Bento Grid layout with 4 cards */}
      <div
        className="grid grid-cols-12 gap-4"
        onMouseLeave={() => setActiveIndex(null)}
      >
        {scienceCards.map((card, index) => (
          <motion.div
            key={index}
            onMouseEnter={() => setActiveIndex(index)}
            whileHover={{ scale: 0.95, rotate: "-1deg" }}
            className={cn(
              "group relative min-h-[220px] cursor-pointer overflow-hidden rounded-2xl bg-transparent p-8 border-[3px] border-solid transition-colors duration-300 flex flex-col justify-center",
              card.borderColor,
              card.colSpan
            )}
          >
            <h3
              className="text-2xl font-bold mb-3 transition-colors duration-300"
              style={{ color: activeIndex === index ? card.hoverColor : "#535B74" }}
            >
              {card.title}
            </h3>
            <p className="text-base leading-relaxed transition-colors duration-300" style={{ color: "#6B7280" }}>
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
