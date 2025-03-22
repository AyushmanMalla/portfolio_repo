"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProjectsSectionProps {
  className?: string;
  id?: string;
}

const ProjectsSection = ({
  className,
  id = "projects",
}: ProjectsSectionProps) => {
  // Featured projects data
  const featuredProjects = [
    {
      id: "1",
      title: "FPGA-Based Neural Network Accelerator",
      description:
        "Custom hardware implementation of a Deep Neural Network - Variational Auto Encoder(VAE) on a Field Programmable Gate Array(FPGA). Required extensive knowledge of Statistical Methods, VHDL Programming, Deep Learning and Computer Architecture. Please do refer to the paper below for more info!",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      category: "fpga",
      // color: "#4ade80" // neon green
      color: "#D84040"
    },
    {
      id: "2",
      title: "Simulator for Carbon Tax Pricing",
      description:
        "Collaborated with a team of 3 to develop a webApp simulator for policy makers to backtest economic policies to see how different carbon tax rates effect different industries. Implemented a Reinforcement Learning environment with PPO algorithms.",
      image:
        "https://plus.unsplash.com/premium_photo-1661898205432-d648667b9c76?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "algorithm",
      // color: "#f472b6" // pink
      color: "#D84040",
      repo: "https://github.com/AyushmanMalla/RL-based_economicPolicySimulator"
    },
    {
      id: "3",
      title: "End to End Trading Engine with LLM Functionality",
      description:
        "Working on creating a trading engine that looks for certain alphas and signals and gives trading conditions. Implementing the architecture in the figure above! Taken inspiration from NexxusTrade.io",
      image:
        "https://i.ibb.co/fGSNfkq3/download.jpg",
      category: "ml",
      // color: "#60a5fa" // blue
      color: "#D84040",
      repo: "https://github.com/AyushmanMalla/tradesage_AyushCopy"
    },
    {
      id: "4",
      title: "Machine Learning for X-Ray Image Analysis: An Embedded Approach",
      description:
        "Working on optimised Vision Transformers and other Novel Architectures to be deployed into resource constrained environments in Medical Applications. Currently exploring publicly available Chest X-Ray datasets. This project is part of my Final Year Project at NTU under the supervision of Prof. Wong Liang Jie",
      image:
        "https://plus.unsplash.com/premium_photo-1699387204388-120141c76d51?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWVkaWNhbCUyMGltYWdpbmd8ZW58MHx8MHx8fDA%3D",
      category: "fpga",
      // color: "#f97316" // orange
      color: "#D84040",
      repo: "https://github.com/AyushmanMalla/torchxrayvision"
    },
  ];

  // Group projects into pairs
  const projectPairs = [];
  for (let i = 0; i < featuredProjects.length; i += 2) {
    const pair = featuredProjects.slice(i, i + 2);
    projectPairs.push(pair);
  }

  return (
    <section
      id={id}
      className={cn(
        "relative bg-black w-screen bg-gradient-to-b from-[#D84040]/25 via-black to-[#1D1616] z-0",
        className,
      )}
    >
      {/* Section Header */}
      <div className="py-24 flex flex-col justify-center items-center text-center px-4 relative">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Featured <span className="text-[#D84040]">Projects</span>
        </h2>
        <p className="text-xl text-white/80 max-w-2xl mb-12">
          Explore my projects that showcase my skills in machine learning, 
          FPGA design, and algorithm development.
        </p>
      </div>
      
      {/* Projects in pairs */}
      {projectPairs.map((pair, pairIndex) => (
        <div key={pairIndex} className="py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {pair.map((project, index) => (
                <ProjectItem 
                  key={project.id} 
                  project={project} 
                  index={pairIndex * 2 + index} 
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

// Redesigned individual project component
const ProjectItem = ({ project, index }) => {
  const projectRef = useRef(null);
  const isInView = useInView(projectRef, { 
    once: false, 
    amount: 0.3,
    margin: "-50px 0px -50px 0px" 
  });
  
  return (
    <motion.div 
      ref={projectRef}
      initial={{ y: 50, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
      transition={{ duration: 0.6, delay: index % 2 * 0.2 }}
      className="rounded-xl overflow-hidden shadow-2xl bg-black/40 flex flex-col h-full"
    >
      {/* Project Image */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <motion.div
          initial={{ scale: 1.1 }}
          animate={isInView ? { scale: 1 } : { scale: 1.1 }}
          transition={{ duration: 0.8 }}
          className="h-full w-full"
        >
          <img 
            src={project.image} 
            alt={project.title}
            className="h-full w-full object-cover" 
          />
        </motion.div>
        
        {/* Project Number */}
        <div className="absolute top-4 right-4 z-20">
          <div 
            className="text-4xl font-bold opacity-100 text-color-[#EEEEEE]"
          >
            {(index + 1).toString().padStart(2, '0')}
          </div>
        </div>
      </div>
      
      {/* Project Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Project Title with color accent */}
        <h3 className="text-2xl font-bold mb-4 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#8E1616] to-[#D84040] ">
          {project.title}
        </h3>
        
        {/* Project Description */}
        <p className="text-white text-base mb-6 flex-grow">
          {project.description}
        </p>
        <a href={project.repo ? project.repo : "https://github.com/AyushmanMalla"} target="_blank">
        <Button 
          className="bg-gradient-to-r from-[#1D1616] to-[#D84040] hover:from-[#D84040] hover:to-[#1D1616] text-white px-2 py-1.5 rounded-full flex text-lg group transition-all duration-300"
          style={{ backgroundColor: project.color }}
        >
          View Project
        </Button></a>
      </div>
    </motion.div>
  );
};

export default ProjectsSection;