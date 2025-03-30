"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, BookOpen, Brain, Calculator, Sigma, ExternalLink, Calendar, Tag } from "lucide-react";
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
  description = "Expanding my experience as a researcher in the field of Math for Machine Learning, Data Processing Methods, Embedded Low Latency Systems",
  papers = [
    {
      id: "paper1",
      title: "Out-of-Distribution Detection(OOD) using Variational Autoencoder(VAE) on Resource Constrained FPGA: A literature review and framework",
      abstract:
        ` With the increased deployment of AI models for different fields ranging from manufacturing to creatives, it is imperative to improve the detection of outliers (Out-of-Distribution(OOD)) in the input data to mitigate the risk associated with incorrect inference. Moreover, with the increase in the speed of inference and data pipelining, it is important to increase the throughput of these detection systems while keeping the power efficiency in mind. This paper focuses on creating a framework for deploying a Variational Autoencoder (VAE) on a resource constrained Field Programmable Gate Array (FPGA): A Variational Autoencoder is a statistical model that uses a reconstruction probability for OOD; Running this on an FPGA can help in decreasing the power consumption for ML inference while also increasing the throughput while keeping the accuracy of the model within acceptable thresholds. The applications of this are mainly in time-sensitive environments such as Cyber Physical Systems (CPS)[1], and statistical arbitrage for High Frequency Trading (HFT). For example, it is important to process the enormous amount of market data from the stock exchange and perform feature extraction on it within milliseconds. While extensive scholarly attention has been devoted to exploring various machine learning inference methods on FPGAs, it is essential to explore the specific application of VAEs on FPGAs due to its specialized nature. `,
      field: "Paper",
      year: 2023,
    },
    {
      id: "paper2",
      title:
        "Learning Differences between STEM and NON-STEM Students in an Interdisciplinary Classroom Setting: A Qualitative and Quantitative Analysis using Natural Language Processing and Statistical Tests",
      abstract:
        `This paper explores the differences in the learning outcomes and performances of students from different backgrounds(analysed based on STEM or NON-STEM and further categorisation where required.)
        We use a two-pronged approach - Quantitative(basic statistical tests to measure differences in assessment scores) and Qualitative Analysis(Natural Language Processing Methods like Topic Modelling using Latent Dirichlet Allocation
        and Sentiment Analysis using different BERT architectures to discover insights in reflection essays and Focus Group Discussions)`,
      field: "Paper",
      year: 2025,
    },
    {
      id: "RA1",
      title: "Research Assistant - Freshmen Year",
      abstract:
        `Collected data and gathered insights on AI Capable SoCs (System on Chip) and Smartphones. 
         Conducted literature review on different Machine Learning Frameworks (e.g., TensorFlow Lite, Android NNAPI) and benchmarking tools used to quantify performance of 198+ Android SoCs.  
         Found key metrics that defined performance of SoC and conducted hypothesis-testing on 776 smartphones. 
        Built a Web Scraper that intelligently avoided rate-limits and scraped GSM Arena (largest global smartphone database); successfully collated data of 12,000+ devices.`,
      field: "Research",
      year: 2022,
    },
    {
      id: "RA2",
      title:
        "Research Assistant - Sophomore Summer",
      abstract:
        ` Developed data pipeline that enabled API calls to Twitter and Botometer API to check bot score of users. 
          Conducted data analysis on 420,000+ accounts based on bot scores.
          Achieved theoretical limit of data collection speed due to API Rate limits; successfully collected 125,000 users scores within 175 hours [Limit = 720 requests/hour, Achieved = 714 requests/hour].`,
      field: "Research",
      year: 2023,
    },
  ],
}: ResearchSectionProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [expandedPaper, setExpandedPaper] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Format abstract text to display in a more organized way
  const formatAbstract = (text: string) => {
    // Split the text into paragraphs
    return text.split('\n').filter(line => line.trim().length > 0);
  };

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
      case "paper":
        return <Sigma className="h-5 w-5 text-[#EEEEEE]" />;
      case "research":
        return <Calculator className="h-5 w-5 text-[#EEEEEE]" />;
      default:
        return <BookOpen className="h-5 w-5 text-gray-400" />;
    }
  };
  
  // Get a color for the paper category badge
  const getFieldColor = (field: string) => {
    switch (field.toLowerCase()) {
      case "paper":
        return "bg-gradient-to-r from-[#8E1616]/25 to-[#D84040]/25 text-[#EEEEEE] border-blue-500/30";
      case "research":
        return "bg-gradient-to-r from-[#8E1616]/25 to-[#D84040]/25 text-[#EEEEEE] border-purple-500/30";
      default:
        return "bg-gradient-to-r from-[#8E1616]/25 to-[#D84040]/25 text-[#EEEEEE] border-gray-500/30";
    }
  };

  return (
    <div
      ref={sectionRef}
      className="w-screen min-h-screen bg-gradient-to-b from-[#1D1616] via-black to-[#D84040]/25 z-0 py-16 px-4 md:px-8 flex flex-col items-center"
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
          <TabsList className="grid grid-cols-3 max-w-2xl mx-auto bg-gray-900/50">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-[#8E1616] data-[state=active]:text-white"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="paper"
              className="data-[state=active]:bg-[#8E1616] data-[state=active]:text-white"
            >
              Papers
            </TabsTrigger>
            <TabsTrigger
              value="research"
              className="data-[state=active]:bg-[#8E1616] data-[state=active]:text-white"
            >
              Research Assistant
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
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-gray-900/40 border-[#D84040]/30 hover:border-[#D84040]/50 transition-all duration-300 h-full flex flex-col">
                  <CardHeader className="pb-2 relative">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className={`text-xs px-3 py-1 rounded-full border ${getFieldColor(paper.field)} flex items-center gap-1`}>
                        {getFieldIcon(paper.field)}
                        {paper.field}
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-gray-600/20 to-gray-400/20 text-gray-200 border border-gray-500/30 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {paper.year}
                      </span>
                    </div>
                    
                    <CardTitle className="text-xl text-white text-transparent bg-clip-text bg-gradient-to-r from-[#8E1616] to-[#D84040]">
                      {paper.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="flex-grow">
                    <div className="prose prose-invert prose-sm max-w-none">
                      {expandedPaper === paper.id ? (
                        // Expanded view with formatted abstract
                        <div className="space-y-3">
                          {formatAbstract(paper.abstract).map((paragraph, idx) => (
                            <p key={idx} className="text-[#EEEEEE] leading-relaxed">
                              {paragraph.trim()}
                            </p>
                          ))}
                        </div>
                      ) : (
                        // Collapsed view with preview
                        <div>
                          <p className="text-[#EEEEEE] line-clamp-3">
                            {paper.abstract.substring(0, 200)}...
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-2 flex justify-between items-center border-t border-gray-800/40 mt-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#D84040] hover:text-[#D84040] hover:bg-[#D84040]/10 flex items-center gap-1"
                      onClick={() => setExpandedPaper(expandedPaper === paper.id ? null : paper.id)}
                    >
                      {expandedPaper === paper.id ? "Show Less" : "Read More"}
                      <ChevronRight className={`h-4 w-4 transform transition-transform ${expandedPaper === paper.id ? 'rotate-90' : ''}`} />
                    </Button>
                    
                    {paper.link && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white border-[#D84040]/50 hover:bg-[#D84040]/10"
                        onClick={() => window.open(paper.link, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Paper
                      </Button>
                    )}
                  </CardFooter>
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