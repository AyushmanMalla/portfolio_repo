"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "@/components/hero-section";
import Navigation from "@/components/navigation";
import ProjectsSection from "@/components/projects-section";
import ResearchSection from "@/components/research-section";
import SkillsSection from "@/components/skills-section";
import Footer from "@/components/footer";
import TransitionContainer from "@/components/transition-container";
import ResearchMontage from "@/components/research-montage";

export default function Home() {
  const projectsRef = useRef<HTMLDivElement>(null);
  const researchRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const [showMontage, setShowMontage] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);

  // Set content loaded after a short delay to ensure smooth transitions
  useEffect(() => {
    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMontageComplete = () => {
    setShowMontage(false);
  };

  return (
    <>
      {/* Research Montage (shown first) */}
      <AnimatePresence>
        {showMontage && contentLoaded && (
          <ResearchMontage onComplete={handleMontageComplete} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex min-h-screen flex-col items-center justify-between bg-black">
        {/* Navigation */}
        <Navigation />

        {/* Hero Section with Particle Animation */}
        <TransitionContainer transitionKey="hero" duration={1.2}>
          <HeroSection
            scrollToNextSection={() => scrollToSection(projectsRef)}
          />
        </TransitionContainer>

        {/* Projects Section */}
        <div ref={projectsRef}>
          <TransitionContainer
            transitionKey="projects"
            duration={0.8}
            delay={0.1}
            direction="vertical"
          >
            <ProjectsSection />
          </TransitionContainer>
        </div>

        {/* Research Section */}
        <div ref={researchRef}>
          <TransitionContainer
            transitionKey="research"
            duration={0.8}
            delay={0.1}
            direction="horizontal"
          >
            <ResearchSection />
          </TransitionContainer>
        </div>

        {/* Skills Section */}
        <div ref={skillsRef}>
          <TransitionContainer
            transitionKey="skills"
            duration={0.8}
            delay={0.1}
            direction="vertical"
          >
            <SkillsSection />
          </TransitionContainer>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full"
        >
          <Footer />
        </motion.div>
      </main>
    </>
  );
}
