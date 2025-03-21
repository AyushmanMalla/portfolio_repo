"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSpring, animated } from "react-spring";
// import * as THREE from "three";
import { Button } from "./ui/button";
import { ArrowDown } from "lucide-react";
// Removed the import for ParticleSystem since it's not being used

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  scrollToNextSection?: () => void;
}

const HeroSection = ({
  title = "Exploring the Intersection of Mathematics & Technology",
  subtitle = "Specializing in Combinatorics, FPGA Design, Probability, Statistics, and Machine Learning",
  scrollToNextSection = () => {},
}: HeroSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Animated text props with react-spring
  const titleProps = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    delay: 300,
    config: { tension: 280, friction: 60 },
  });

  const subtitleProps = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    delay: 600,
    config: { tension: 280, friction: 60 },
  });

  const buttonProps = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    delay: 900,
    config: { tension: 280, friction: 60 },
  });

  // Handle mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Floating animation for the title container
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[700px] flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* Particle system background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-black">
          {/* Particle effect would be implemented here */}
          <div className="absolute inset-0 opacity-30">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-purple-500"
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.7 + 0.3,
                  animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-black/50 to-black"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(128, 0, 128, 0.3), rgba(0, 0, 0, 0.8) 70%)`,
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 z-10 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 0, 128, 0.1) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(255, 0, 128, 0.1) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Content container */}
      <motion.div
        className="relative z-20 text-center px-6 max-w-4xl"
        animate={floatingAnimation}
      >
        <animated.h1
          style={titleProps}
          className="text-4xl md:text-6xl font-bold mb-6 text-white"
        >
          {title}
        </animated.h1>

        <animated.p
          style={subtitleProps}
          className="text-lg md:text-xl mb-10 text-purple-200"
        >
          {subtitle}
        </animated.p>

        <animated.div style={buttonProps}>
          <Button
            onClick={scrollToNextSection}
            className="bg-gradient-to-r from-purple-600 to-red-500 hover:from-purple-700 hover:to-red-600 text-white px-8 py-6 rounded-full flex items-center gap-2 text-lg group transition-all duration-300"
          >
            Explore My Work
            <ArrowDown className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
          </Button>
        </animated.div>
      </motion.div>

      {/* Glowing accent elements */}
      <div className="absolute bottom-10 left-10 w-20 h-20 rounded-full bg-purple-500/20 blur-xl z-10"></div>
      <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-red-500/20 blur-xl z-10"></div>
      <div className="absolute top-1/3 left-1/4 w-16 h-16 rounded-full bg-pink-500/20 blur-xl z-10"></div>
    </div>
  );
};

export default HeroSection;
