"use client";

import React from "react";
import { GradientCard } from "@/components/ui/gradient-card";
import { UserRound, Sliders, TrendingUp } from "lucide-react";

// Data for the 3 steps demonstrating how the app adapts
const processSteps = [
  {
    badgeText: "Step 1: Profile & Setup",
    badgeColor: "#F59E0B", // Amber / Orange
    title: "Sensory & Student Profiles",
    description: "Educators set up student profiles and configure unique sensory audio and visualpreferences that instantly apply upon login.",
    icon: UserRound,
    gradient: "orange" as const,
  },
  {
    badgeText: "Step 2: Adaptive Play",
    badgeColor: "#8B5CF6", // Purple
    title: "Errorless Adaptive Engine",
    description: "As the learner plays, the app dynamically adjusts difficulty, pacing, and visual complexity to prevent sensory overload and ensure personalized learning.",
    icon: Sliders,
    gradient: "purple" as const,
  },
  {
    badgeText: "Step 3: Review & Sync",
    badgeColor: "#10B981", // Green
    title: "Progress Dashboard",
    description: "Teachers evaluate sessions using a 0–4 clinical rubric before validating data. Once validated, real-time analytics are sent for parent viewing.",
    icon: TrendingUp,
    gradient: "green" as const,
  },
];

export default function AdaptiveProcess() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 text-slate-800">
      {/* Centered Heading with matching styling */}
      <div className="mb-16 flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-fredoka text-3xl font-bold leading-tight md:text-4xl lg:text-5xl" style={{ color: "#535B74" }}>
          How our app <span className="text-[#FACC15]">adapts to every learner</span>
        </h2>
        <p className="mt-4 max-w-xl text-lg font-medium" style={{ color: "#6B7280" }}>
          Autivity uses a continuous 3-step loop to personalize the learning experience, ensuring challenges are perfectly balanced.
        </p>
      </div>

      {/* Grid containing the 3 cards in a single row */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-10">
        {processSteps.map((step, index) => (
          <GradientCard
            key={index}
            badgeText={step.badgeText}
            badgeColor={step.badgeColor}
            title={step.title}
            description={step.description}
            icon={step.icon}
            gradient={step.gradient}
          />
        ))}
      </div>
    </section>
  );
}
