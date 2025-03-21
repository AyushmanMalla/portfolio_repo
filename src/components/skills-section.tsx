"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Code,
  Cpu,
  Database,
  FileCode,
  GitBranch,
  LineChart,
  Network,
  Server,
  Terminal,
  Wand2,
} from "lucide-react";

interface Skill {
  name: string;
  icon: React.ReactNode;
  description: string;
  level: number;
  category: "mathematics" | "programming" | "hardware" | "machine learning";
}

interface SkillsSectionProps {
  skills?: Skill[];
  title?: string;
  description?: string;
}

const SkillsSection = ({
  skills = [
    {
      name: "Combinatorics",
      icon: <GitBranch className="h-8 w-8 text-purple-400" />,
      description:
        "Advanced knowledge of combinatorial mathematics, including permutations, combinations, and graph theory applications.",
      level: 90,
      category: "mathematics",
    },
    {
      name: "Probability & Statistics",
      icon: <LineChart className="h-8 w-8 text-purple-400" />,
      description:
        "Strong foundation in probability theory, statistical analysis, and stochastic processes.",
      level: 85,
      category: "mathematics",
    },
    {
      name: "FPGA Design",
      icon: <Cpu className="h-8 w-8 text-red-400" />,
      description:
        "Experience with VHDL/Verilog for designing and implementing digital circuits on FPGAs.",
      level: 80,
      category: "hardware",
    },
    {
      name: "Machine Learning",
      icon: <Network className="h-8 w-8 text-red-400" />,
      description:
        "Proficient in developing and training machine learning models for various applications.",
      level: 75,
      category: "machine learning",
    },
    {
      name: "Algorithm Design",
      icon: <Code className="h-8 w-8 text-purple-400" />,
      description:
        "Expertise in designing efficient algorithms for complex computational problems.",
      level: 85,
      category: "programming",
    },
    {
      name: "Low-Level Programming",
      icon: <Terminal className="h-8 w-8 text-red-400" />,
      description:
        "Proficient in C/C++ and assembly language programming for embedded systems.",
      level: 80,
      category: "programming",
    },
    {
      name: "Data Structures",
      icon: <Database className="h-8 w-8 text-purple-400" />,
      description:
        "Deep understanding of advanced data structures and their applications.",
      level: 90,
      category: "programming",
    },
    {
      name: "Computer Architecture",
      icon: <Server className="h-8 w-8 text-red-400" />,
      description:
        "Knowledge of computer architecture principles and hardware-software interfaces.",
      level: 75,
      category: "hardware",
    },
    {
      name: "Neural Networks",
      icon: <Wand2 className="h-8 w-8 text-purple-400" />,
      description:
        "Experience with designing and training various neural network architectures.",
      level: 70,
      category: "machine learning",
    },
    {
      name: "Systems Programming",
      icon: <FileCode className="h-8 w-8 text-red-400" />,
      description:
        "Skilled in developing system-level software and optimizing performance.",
      level: 75,
      category: "programming",
    },
  ],
  title = "Technical Skills",
  description = "Expertise in mathematics, hardware design, and computational methods",
}: SkillsSectionProps) => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: null, name: "All" },
    { id: "mathematics", name: "Mathematics" },
    { id: "programming", name: "Programming" },
    { id: "hardware", name: "Hardware" },
    { id: "machine learning", name: "Machine Learning" },
  ];

  const filteredSkills = selectedCategory
    ? skills.filter((skill) => skill.category === selectedCategory)
    : skills;

  return (
    <section className="w-full py-20 bg-black min-h-[700px]" id="skills">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">{title}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">{description}</p>
        </motion.div>

        <div className="flex justify-center mb-10">
          <div className="flex space-x-2 bg-gray-900/50 p-1 rounded-lg">
            {categories.map((category) => (
              <button
                key={category.id || "all"}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "px-4 py-2 rounded-md transition-all duration-300",
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-red-500 to-purple-600 text-white"
                    : "text-gray-400 hover:text-white",
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          whileInView="show"
        >
          {filteredSkills.map((skill) => (
            <TooltipProvider key={skill.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 },
                    }}
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2 },
                    }}
                    onMouseEnter={() => setHoveredSkill(skill.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <Card
                      className={cn(
                        "overflow-hidden border-0 bg-gradient-to-br from-gray-900 to-gray-950 h-full",
                        hoveredSkill === skill.name &&
                          "shadow-lg shadow-purple-500/20",
                      )}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="mr-4 p-3 rounded-lg bg-gray-800">
                            {skill.icon}
                          </div>
                          <h3 className="text-xl font-semibold text-white">
                            {skill.name}
                          </h3>
                        </div>

                        <p className="text-gray-400 mb-4 text-sm">
                          {skill.description}
                        </p>

                        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-red-500 to-purple-600"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            Proficiency
                          </span>
                          <span className="text-xs text-gray-400">
                            {skill.level}%
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-gray-900 border-gray-800 text-white p-2"
                >
                  <p>Click to see projects using {skill.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 italic">
            Continuously expanding my knowledge in these areas through research
            and practical applications.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
