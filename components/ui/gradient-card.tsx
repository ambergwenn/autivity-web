"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils"; // Your shadcn/ui utility for merging classes

// Define variants for the card's overall style using cva
const cardVariants = cva(
  "relative flex flex-col justify-between h-full w-full overflow-hidden rounded-2xl p-8 border-[3px] border-solid shadow-sm transition-all duration-300 hover:shadow-md",
  {
    variants: {
      gradient: {
        orange: "bg-gradient-to-br from-[#FFF7ED] to-[#FDBA74]/15 border-[#FDBA74]",
        gray: "bg-gradient-to-br from-[#F5F7FA] to-[#E5E7EB]/30 border-[#D1D5DB]",
        purple: "bg-gradient-to-br from-[#FAF5FF] to-[#C084FC]/15 border-[#C084FC]",
        green: "bg-gradient-to-br from-[#F0FDF4] to-[#86EFAC]/15 border-[#86EFAC]",
        blue: "bg-gradient-to-br from-[#EBF5FF] to-[#62A9E6]/15 border-[#62A9E6]",
      },
    },
    defaultVariants: {
      gradient: "gray",
    },
  }
);

const iconColorMap = {
  orange: "text-[#FB923C]/15",
  purple: "text-[#C084FC]/15",
  green: "text-[#10B981]/15",
  gray: "text-[#535B74]/15",
  blue: "text-[#62A9E6]/15",
};

// Define the props interface for type safety and reusability
export interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  badgeText: string;
  badgeColor: string; // Expecting a hex color string, e.g., "#FF5733"
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  ({ className, gradient, badgeText, badgeColor, title, description, icon: Icon, ...props }, ref) => {
    
    // Animation variants for framer-motion
    const cardAnimation = {
      rest: { scale: 1, y: 0 },
      hover: { scale: 1.03, y: -4 },
    };

    const iconAnimation = {
      rest: { scale: 1, rotate: 0 },
      hover: { scale: 1.1, rotate: 12 },
    };

    return (
      <motion.div
        variants={cardAnimation}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="h-full"
        ref={ref}
      >
        <div
          className={cn(cardVariants({ gradient }), className)}
          {...props}
        >
          {/* Decorative background icon with animation */}
          {Icon && (
            <motion.div
              variants={iconAnimation}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className={cn("absolute -right-6 -bottom-6 pointer-events-none", iconColorMap[gradient || "gray"])}
            >
              <Icon className="h-32 w-32" />
            </motion.div>
          )}

          {/* Card Content */}
          <div className="z-10 flex flex-col h-full">
            {/* Badge */}
            <div 
              className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium backdrop-blur-sm w-fit"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.7)", borderColor: "#E5E7EB", color: "#535B74" }}
            >
              <span 
                className="h-2 w-2 rounded-full" 
                style={{ backgroundColor: badgeColor }}
              />
              {badgeText}
            </div>

            {/* Title and Description */}
            <div className="flex-grow">
              <h3 className="text-2xl font-bold mb-2" style={{ color: "#535B74" }}>{title}</h3>
              <p className="max-w-xs" style={{ color: "#6B7280" }}>{description}</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);
GradientCard.displayName = "GradientCard";

export { GradientCard, cardVariants };
