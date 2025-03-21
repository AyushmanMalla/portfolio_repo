"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize2, Code, Cpu } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: "fpga" | "algorithm" | "ml";
  modelUrl?: string;
}

interface ProjectCarouselProps {
  projects?: Project[];
  autoRotate?: boolean;
  rotationInterval?: number;
}

const ProjectCarousel = ({
  projects = [
    {
      id: "1",
      title: "FPGA-Based Neural Network Accelerator",
      description:
        "Custom hardware implementation of a neural network inference engine optimized for edge devices.",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      category: "fpga",
    },
    {
      id: "2",
      title: "Probabilistic Graph Model Visualization",
      description:
        "Interactive visualization of Bayesian networks and Markov models for statistical inference.",
      image:
        "https://images.unsplash.com/photo-1545987796-200677ee1011?w=800&q=80",
      category: "algorithm",
    },
    {
      id: "3",
      title: "Quantum-Inspired Combinatorial Optimizer",
      description:
        "Algorithm for solving complex combinatorial optimization problems using quantum-inspired techniques.",
      image:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
      category: "ml",
    },
    {
      id: "4",
      title: "Real-time Signal Processing Pipeline",
      description:
        "FPGA implementation of a high-throughput signal processing system for radar applications.",
      image:
        "https://images.unsplash.com/photo-1517373116369-9bdb8cdc9f62?w=800&q=80",
      category: "fpga",
    },
    {
      id: "5",
      title: "Generative Adversarial Network for Circuit Design",
      description:
        "ML model that generates optimized circuit layouts based on performance requirements.",
      image:
        "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=800&q=80",
      category: "ml",
    },
  ],
  autoRotate = true,
  rotationInterval = 5000,
}: ProjectCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Handle automatic rotation
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (autoRotate && !isInteracting) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
      }, rotationInterval);
    }

    return () => clearInterval(interval);
  }, [autoRotate, isInteracting, projects.length, rotationInterval]);

  const handlePrev = () => {
    setIsInteracting(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? projects.length - 1 : prevIndex - 1,
    );
    setTimeout(() => setIsInteracting(false), 1000);
  };

  const handleNext = () => {
    setIsInteracting(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
    setTimeout(() => setIsInteracting(false), 1000);
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getCategoryIcon = (category: Project["category"]) => {
    switch (category) {
      case "fpga":
        return <Cpu className="h-5 w-5 text-purple-400" />;
      case "algorithm":
        return <Code className="h-5 w-5 text-red-400" />;
      case "ml":
        return <Maximize2 className="h-5 w-5 text-pink-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-black/90 p-6 rounded-xl">
      <div
        ref={carouselRef}
        className={cn(
          "relative overflow-hidden rounded-lg transition-all duration-500",
          isExpanded ? "h-[600px]" : "h-[400px]",
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-red-900/20 z-0" />

        {/* 3D Carousel */}
        <div className="relative h-full w-full">
          {projects.map((project, index) => {
            const isActive = index === currentIndex;

            return (
              <motion.div
                key={project.id}
                className="absolute inset-0 w-full h-full"
                initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                animate={{
                  opacity: isActive ? 1 : 0,
                  scale: isActive ? 1 : 0.8,
                  rotateY: isActive ? 0 : index < currentIndex ? -90 : 90,
                  zIndex: isActive ? 10 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  opacity: { duration: 0.5 },
                }}
              >
                <Card className="h-full w-full overflow-hidden border-0 bg-transparent">
                  <div className="relative h-full w-full">
                    <div
                      className="absolute inset-0 bg-cover bg-center z-0"
                      style={{ backgroundImage: `url(${project.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />

                    <CardContent className="relative h-full flex flex-col justify-end p-6 z-20">
                      <div className="flex items-center gap-2 mb-2">
                        {getCategoryIcon(project.category)}
                        <span className="text-xs font-medium uppercase tracking-wider text-purple-300">
                          {project.category}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-300 mb-4">
                        {project.description}
                      </p>

                      <motion.div
                        className="flex gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: isActive ? 1 : 0,
                          y: isActive ? 0 : 20,
                        }}
                        transition={{ delay: 0.2 }}
                      >
                        <Button
                          variant="outline"
                          className="bg-purple-950/50 border-purple-700 text-purple-300 hover:bg-purple-900/70"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          className="bg-red-950/50 border-red-700 text-red-300 hover:bg-red-900/70"
                        >
                          Interact with Model
                        </Button>
                      </motion.div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2 z-30">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/50 border-purple-700 text-purple-300 hover:bg-purple-900/50"
            onClick={handleExpand}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/50 border-purple-700 text-purple-300 hover:bg-purple-900/50"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/50 border-purple-700 text-purple-300 hover:bg-purple-900/50"
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Pagination Indicators */}
        <div className="absolute bottom-6 left-6 flex items-center gap-1.5 z-30">
          {projects.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex
                  ? "bg-purple-500 w-6"
                  : "bg-gray-600 hover:bg-gray-500",
              )}
              onClick={() => {
                setIsInteracting(true);
                setCurrentIndex(index);
                setTimeout(() => setIsInteracting(false), 1000);
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCarousel;
