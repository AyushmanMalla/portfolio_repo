"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TransitionContainerProps {
  children: ReactNode;
  className?: string;
  transitionKey?: string | number;
  duration?: number;
  delay?: number;
  ease?: string;
  direction?: "horizontal" | "vertical";
}

const TransitionContainer = ({
  children,
  className = "",
  transitionKey = "default",
  duration = 0.8,
  delay = 0,
  ease = "easeInOut",
  direction = "horizontal",
}: TransitionContainerProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Define the liquid-like transition variants
  const variants = {
    initial: {
      opacity: 0,
      scale: 0.95,
      filter: "blur(8px)",
      x: direction === "horizontal" ? -30 : 0,
      y: direction === "vertical" ? -30 : 0,
      borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      x: 0,
      y: 0,
      borderRadius: "0% 0% 0% 0% / 0% 0% 0% 0%",
      transition: {
        duration,
        delay,
        ease,
        borderRadius: {
          duration: duration * 1.2,
          ease: "easeInOut",
        },
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      filter: "blur(8px)",
      x: direction === "horizontal" ? 30 : 0,
      y: direction === "vertical" ? 30 : 0,
      borderRadius: "40% 60% 30% 70% / 60% 40% 70% 30%",
      transition: {
        duration: duration * 0.8,
        ease,
      },
    },
  };

  // Render a div with no animation on the server to prevent hydration issues
  if (!isClient) {
    return (
      <div className={cn("relative overflow-hidden bg-background", className)}>
        {children}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        className={cn(
          "relative overflow-hidden bg-black",
          "before:absolute before:inset-0 before:z-[-1] before:bg-gradient-to-br before:from-purple-900/20 before:to-red-900/20 before:opacity-30",
          className,
        )}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default TransitionContainer;
