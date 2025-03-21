"use client";

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, Code, Cpu, Brain } from "lucide-react";
import ProjectCarousel from "./project-carousel";

interface ProjectsSectionProps {
  className?: string;
  id?: string;
}

const ProjectsSection = ({
  className,
  id = "projects",
}: ProjectsSectionProps) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Project categories
  const categories = [
    { id: "all", label: "All Projects" },
    { id: "fpga", label: "FPGA Design", icon: <Cpu className="h-4 w-4" /> },
    {
      id: "algorithm",
      label: "Algorithms",
      icon: <Code className="h-4 w-4" />,
    },
    {
      id: "ml",
      label: "Machine Learning",
      icon: <Brain className="h-4 w-4" />,
    },
  ];

  // Featured projects data
  const featuredProjects = [
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
  ];

  // Filter projects based on active category
  const filteredProjects =
    activeCategory === "all"
      ? featuredProjects
      : featuredProjects.filter(
          (project) => project.category === activeCategory,
        );

  return (
    <section
      id={id}
      ref={sectionRef}
      className={cn(
        "relative min-h-screen w-full py-20 px-4 md:px-8 lg:px-12 bg-black",
        className,
      )}
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/10 via-black to-black z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,0,120,0.15),transparent_40%)] z-0" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMzMzMiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBzdHJva2U9IiM0NDQiIHN0cm9rZS13aWR0aD0iLjUiLz48cGF0aCBkPSJNMCAzMGgzMHYzMEgweiIgc3Ryb2tlPSIjNDQ0IiBzdHJva2Utd2lkdGg9Ii41Ii8+PC9nPjwvc3ZnPg==')] opacity-5 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-12"
        >
          {/* Section header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              Featured Projects
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore my portfolio of technical projects spanning FPGA design,
              algorithmic implementations, and machine learning applications
              with interactive 3D visualizations.
            </p>
            <div className="flex justify-center">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowDown className="h-6 w-6 text-purple-500 mt-4" />
              </motion.div>
            </div>
          </motion.div>

          {/* Project categories tabs */}
          <motion.div variants={itemVariants}>
            <Tabs
              defaultValue="all"
              className="w-full"
              onValueChange={setActiveCategory}
            >
              <div className="flex justify-center mb-8">
                <TabsList className="bg-black/50 border border-purple-900/50 p-1">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="flex items-center gap-2 data-[state=active]:bg-purple-950/50 data-[state=active]:text-purple-300"
                    >
                      {category.icon}
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Project carousel */}
              <TabsContent value="all" className="mt-0">
                <ProjectCarousel projects={featuredProjects} />
              </TabsContent>

              {categories.slice(1).map((category) => (
                <TabsContent
                  key={category.id}
                  value={category.id}
                  className="mt-0"
                >
                  <ProjectCarousel
                    projects={filteredProjects}
                    autoRotate={true}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>

          {/* Call to action */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mt-12"
          >
            <Button className="bg-gradient-to-r from-purple-700 to-red-700 hover:from-purple-800 hover:to-red-800 text-white border-none">
              View All Projects
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
