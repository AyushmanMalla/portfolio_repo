"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, BookOpen, Brain, Calculator, Sigma } from "lucide-react";
import MathVisualization from "@/components/math-visualization";

interface ResearchSectionProps {
  title?: string;
  description?: string;
  papers?: ResearchPaper[];
}

interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  field: string;
  year: number;
  link?: string;
}

const ResearchSection = ({
  title = "Research & Publications",
  description = "Exploring the intersections of mathematics, statistics, and machine learning",
  papers = [
    {
      id: "paper1",
      title: "Novel Approaches to Combinatorial Optimization in FPGA Design",
      abstract:
        "This paper explores efficient algorithms for solving combinatorial optimization problems in the context of FPGA design, with applications to routing and placement challenges.",
      field: "Combinatorics",
      year: 2023,
    },
    {
      id: "paper2",
      title:
        "Statistical Analysis of Machine Learning Model Performance on Resource-Constrained Hardware",
      abstract:
        "A comprehensive study on the performance characteristics of various machine learning models when deployed on resource-constrained FPGA hardware platforms.",
      field: "Statistics",
      year: 2022,
    },
    {
      id: "paper3",
      title: "Probabilistic Methods for Efficient Circuit Design",
      abstract:
        "This research introduces novel probabilistic approaches to circuit design that optimize for both performance and power consumption in modern FPGA architectures.",
      field: "Probability",
      year: 2023,
    },
    {
      id: "paper4",
      title:
        "Machine Learning Accelerators: A Comparative Study of Implementation Strategies",
      abstract:
        "An in-depth analysis of different implementation strategies for machine learning accelerators, with a focus on trade-offs between performance, power, and resource utilization.",
      field: "Machine Learning",
      year: 2021,
    },
  ],
}: ResearchSectionProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const filteredPapers =
    activeTab === "all"
      ? papers
      : papers.filter(
          (paper) => paper.field.toLowerCase() === activeTab.toLowerCase(),
        );

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for each paper card
  const paperVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
      },
    },
  };

  // Simulate a fluid-like animation effect when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const scrollPosition = window.scrollY;
      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;

      // Calculate how far into the section we've scrolled (0 to 1)
      const scrollProgress = Math.max(
        0,
        Math.min(
          1,
          (scrollPosition - sectionTop + window.innerHeight * 0.5) /
            (sectionHeight + window.innerHeight * 0.5),
        ),
      );

      // Apply a subtle transform to create a fluid effect
      if (sectionRef.current) {
        const cards = sectionRef.current.querySelectorAll(".research-card");
        cards.forEach((card, index) => {
          const delay = index * 0.05;
          const translateY = Math.max(
            0,
            30 * (1 - Math.min(1, scrollProgress * 1.5 - delay)),
          );
          (card as HTMLElement).style.transform = `translateY(${translateY}px)`;
          (card as HTMLElement).style.opacity = Math.min(
            1,
            Math.max(0, scrollProgress * 2 - delay),
          );
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTab]);

  // Get the icon for each research field
  const getFieldIcon = (field: string) => {
    switch (field.toLowerCase()) {
      case "combinatorics":
        return <Sigma className="h-5 w-5 text-purple-400" />;
      case "statistics":
        return <Calculator className="h-5 w-5 text-red-400" />;
      case "probability":
        return <Calculator className="h-5 w-5 text-pink-400" />;
      case "machine learning":
        return <Brain className="h-5 w-5 text-blue-400" />;
      default:
        return <BookOpen className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div
      ref={sectionRef}
      className="w-full min-h-screen bg-black py-16 px-4 md:px-8 flex flex-col items-center"
      style={{
        background: "linear-gradient(to bottom, #000000, #0a0010, #10001a)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 max-w-3xl"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-gray-400 text-lg">{description}</p>
      </motion.div>

      <div className="w-full max-w-7xl">
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mb-8"
        >
          <TabsList className="grid grid-cols-5 max-w-2xl mx-auto bg-gray-900/50">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="combinatorics"
              className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
            >
              Combinatorics
            </TabsTrigger>
            <TabsTrigger
              value="statistics"
              className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
            >
              Statistics
            </TabsTrigger>
            <TabsTrigger
              value="probability"
              className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
            >
              Probability
            </TabsTrigger>
            <TabsTrigger
              value="machine learning"
              className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
            >
              ML
            </TabsTrigger>
          </TabsList>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
          >
            {filteredPapers.map((paper) => (
              <motion.div
                key={paper.id}
                variants={paperVariants}
                className="research-card"
              >
                <Card className="bg-gray-900/40 border-purple-900/30 hover:border-purple-500/50 transition-all duration-300 h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        {getFieldIcon(paper.field)}
                        <span className="text-sm text-gray-400">
                          {paper.field} • {paper.year}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-xl text-white mt-2">
                      {paper.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400 mb-4">
                      {selectedPaper === paper.id
                        ? paper.abstract
                        : `${paper.abstract.substring(0, 120)}...`}
                    </CardDescription>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 p-0"
                      onClick={() =>
                        setSelectedPaper(
                          selectedPaper === paper.id ? null : paper.id,
                        )
                      }
                    >
                      {selectedPaper === paper.id ? "Show Less" : "Read More"}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Tabs>
      </div>

      <div className="w-full max-w-7xl mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Interactive Research Visualizations
          </h3>
          <MathVisualization
            title="Interactive Probability Distributions"
            description="Explore how parameters affect various probability distributions used in my research"
            defaultTab="normal"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ResearchSection;
