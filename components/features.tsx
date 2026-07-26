"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BouncyCardsFeatures = () => {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-12 text-slate-800 scroll-mt-16">
      <div className="mb-8 flex flex-col items-center justify-center text-center md:px-8">
        <h1 className="font-fredoka text-3xl font-bold leading-tight text-slate-900 md:text-4xl lg:text-5xl" style={{ color: "#535B74" }}>
          Fun learning with
          <span className="text-slate-400" style={{ color: "#62A9E6" }}> a purpose</span>
        </h1>
      </div>
      <div className="mb-4 grid grid-cols-12 gap-4">
        <BounceCard className="col-span-12 md:col-span-4 border-[#C084FC]">
          <CardTitle>Personalized settings</CardTitle>
          <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-8 rounded-t-2xl bg-gradient-to-br from-violet-400 to-indigo-400 p-4 transition-transform duration-[250ms] group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-indigo-50">
              FEATURE DEMO HERE
            </span>
          </div>
        </BounceCard>
        <BounceCard className="col-span-12 md:col-span-8 border-[#FDBA74]">
          <CardTitle>Adaptive activities</CardTitle>
          <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-8 rounded-t-2xl bg-gradient-to-br from-amber-400 to-orange-400 p-4 transition-transform duration-[250ms] group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-orange-50">
              FEATURE DEMO HERE
            </span>
          </div>
        </BounceCard>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <BounceCard className="col-span-12 md:col-span-8 border-[#86EFAC]">
          <CardTitle>Layered analytics</CardTitle>
          <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-8 rounded-t-2xl bg-gradient-to-br from-green-400 to-emerald-400 p-4 transition-transform duration-[250ms] group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-emerald-50">
              FEATURE DEMO HERE
            </span>
          </div>
        </BounceCard>
        <BounceCard className="col-span-12 md:col-span-4 border-[#FCA5A5]">
          <CardTitle>Real-time feedback</CardTitle>
          <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-8 rounded-t-2xl bg-gradient-to-br from-pink-400 to-red-400 p-4 transition-transform duration-[250ms] group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-red-50">
              FEATURE DEMO HERE
            </span>
          </div>
        </BounceCard>
      </div>
    </section>
  );
};

interface BounceCardProps {
  className?: string;
  children: ReactNode;
}

const BounceCard = ({ className = "", children }: BounceCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 0.95, rotate: "-1deg" }}
      className={cn(
        "group relative min-h-[300px] cursor-pointer overflow-hidden rounded-2xl bg-slate-100 p-8 border-[3px] border-solid border-[#D1D5DB]",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const CardTitle = ({ children, className = "", style }: CardTitleProps) => {
  return (
    <h3 className={`mx-auto text-center text-3xl font-semibold ${className}`} style={{ color: "#535B74", ...style }}>{children}</h3>
  );
};
