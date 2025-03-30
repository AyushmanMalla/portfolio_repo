"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const RubiksCubeAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cube properties
    const cubeSize = 150;
    const faceSize = cubeSize / 3;

    // Colors
    const colors = {
      red: "#D84040",
      darkRed: "#8E1616",
      black: "#1D1616",
      white: "#EEEEEE",
    };

    // Face colors
    const faceColors = [
      colors.red,
      colors.darkRed,
      colors.white,
      colors.black,
      colors.red,
      colors.darkRed,
    ];

    let angle = 0;
    let rotationSpeed = 0.01;

    const drawCube = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Center the cube
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw the cube
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);

      // Draw the 3x3 grid for each visible face
      const faces = [
        { x: -cubeSize / 2, y: -cubeSize / 2, z: 0 }, // Front face
        { x: cubeSize / 2, y: -cubeSize / 2, z: 0 }, // Right face
        { x: -cubeSize / 2, y: cubeSize / 2, z: 0 }, // Top face
      ];

      faces.forEach((face, faceIndex) => {
        ctx.save();
        ctx.translate(face.x, face.y);

        // Apply perspective transformation
        if (faceIndex === 1) {
          ctx.transform(Math.cos(angle), 0, 0.5, 1, 0, 0);
        } else if (faceIndex === 2) {
          ctx.transform(1, 0.5, 0, Math.cos(angle), 0, 0);
        }

        // Draw 3x3 grid
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            // Randomize colors for animation effect
            const colorIndex =
              (faceIndex + row + col + Math.floor(angle * 5)) %
              faceColors.length;
            ctx.fillStyle = faceColors[colorIndex];

            ctx.fillRect(col * faceSize, row * faceSize, faceSize, faceSize);

            // Draw grid lines
            ctx.strokeStyle = "rgba(0,0,0,0.3)";
            ctx.lineWidth = 2;
            ctx.strokeRect(col * faceSize, row * faceSize, faceSize, faceSize);
          }
        }

        ctx.restore();
      });

      ctx.restore();

      // Update rotation
      angle += rotationSpeed;

      // Request next frame
      requestAnimationFrame(drawCube);
    };

    // Start animation
    drawCube();

    // Cleanup
    return () => {
      // Cancel animation frame if component unmounts
      cancelAnimationFrame(0);
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="bg-black/30 rounded-lg"
      />
    </div>
  );
};

const DistributionAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentDistribution, setCurrentDistribution] =
    useState<string>("normal");
  const [parameters, setParameters] = useState({
    normal: { mean: 0, stdDev: 1 },
    binomial: { n: 20, p: 0.5 },
    poisson: { lambda: 5 },
  });

  // Auto-change parameters for animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setParameters((prev) => {
        if (currentDistribution === "normal") {
          return {
            ...prev,
            normal: {
              mean: prev.normal.mean + (Math.random() * 0.4 - 0.2),
              stdDev: Math.max(
                0.2,
                Math.min(3, prev.normal.stdDev + (Math.random() * 0.2 - 0.1)),
              ),
            },
          };
        } else if (currentDistribution === "binomial") {
          return {
            ...prev,
            binomial: {
              n: Math.max(
                5,
                Math.min(50, prev.binomial.n + (Math.random() > 0.5 ? 1 : -1)),
              ),
              p: Math.max(
                0.1,
                Math.min(0.9, prev.binomial.p + (Math.random() * 0.1 - 0.05)),
              ),
            },
          };
        } else {
          return {
            ...prev,
            poisson: {
              lambda: Math.max(
                0.5,
                Math.min(
                  15,
                  prev.poisson.lambda + (Math.random() * 0.5 - 0.25),
                ),
              ),
            },
          };
        }
      });
    }, 300);

    // Auto-change distribution type
    const typeInterval = setInterval(() => {
      setCurrentDistribution((prev) => {
        if (prev === "normal") return "binomial";
        if (prev === "binomial") return "poisson";
        return "normal";
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(typeInterval);
    };
  }, [currentDistribution]);

  // Draw the visualization on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up dimensions
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    // Draw axes
    ctx.strokeStyle = "rgba(238, 238, 238, 0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Generate data based on current distribution
    let data;
    switch (currentDistribution) {
      case "normal":
        data = generateNormalDistribution(
          parameters.normal.mean,
          parameters.normal.stdDev,
        );
        break;
      case "binomial":
        data = generateBinomialDistribution(
          parameters.binomial.n,
          parameters.binomial.p,
        );
        break;
      case "poisson":
        data = generatePoissonDistribution(parameters.poisson.lambda);
        break;
      default:
        data = [];
    }

    // Find max Y value for scaling
    const maxY = Math.max(...data.map((point) => point.y));

    // Draw the distribution
    ctx.strokeStyle = "#D84040"; // Red color from theme
    ctx.lineWidth = 2;
    ctx.beginPath();

    // For discrete distributions (binomial, poisson), draw bars
    if (
      currentDistribution === "binomial" ||
      currentDistribution === "poisson"
    ) {
      const barWidth = graphWidth / (data.length + 1);

      data.forEach((point, i) => {
        const x = padding + (i + 0.5) * barWidth;
        const y = height - padding - (point.y / maxY) * graphHeight;

        ctx.fillStyle = "#8E1616"; // Dark red from theme
        ctx.fillRect(
          x - barWidth / 3,
          height - padding,
          barWidth / 1.5,
          -((point.y / maxY) * graphHeight),
        );
      });
    }
    // For continuous distributions (normal), draw curve
    else {
      data.forEach((point, i) => {
        const x =
          padding +
          ((point.x - data[0].x) / (data[data.length - 1].x - data[0].x)) *
            graphWidth;
        const y = height - padding - (point.y / maxY) * graphHeight;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Fill area under the curve
      ctx.lineTo(padding + graphWidth, height - padding);
      ctx.lineTo(padding, height - padding);
      ctx.closePath();
      ctx.fillStyle = "rgba(216, 64, 64, 0.3)"; // Red with transparency
      ctx.fill();
    }

    // Add title
    ctx.fillStyle = "#EEEEEE"; // White from theme
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      currentDistribution === "normal"
        ? "Normal Distribution"
        : currentDistribution === "binomial"
          ? "Binomial Distribution"
          : "Poisson Distribution",
      width / 2,
      padding - 15,
    );
  }, [currentDistribution, parameters]);

  // Function to generate normal distribution data points
  const generateNormalDistribution = (
    mean: number,
    stdDev: number,
    points = 100,
  ) => {
    const data = [];
    const range = 4 * stdDev;
    for (let i = 0; i < points; i++) {
      const x = mean - range + (i / (points - 1)) * range * 2;
      const y =
        (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
        Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
      data.push({ x, y });
    }
    return data;
  };

  // Function to generate binomial distribution data points
  const generateBinomialDistribution = (n: number, p: number) => {
    const data = [];
    for (let k = 0; k <= n; k++) {
      // Calculate binomial coefficient (n choose k)
      let coeff = 1;
      for (let i = n - k + 1; i <= n; i++) coeff *= i;
      for (let i = 1; i <= k; i++) coeff /= i;

      const y = coeff * Math.pow(p, k) * Math.pow(1 - p, n - k);
      data.push({ x: k, y });
    }
    return data;
  };

  // Function to generate Poisson distribution data points
  const generatePoissonDistribution = (lambda: number, maxK = 20) => {
    const data = [];
    for (let k = 0; k <= maxK; k++) {
      // Calculate Poisson PMF: P(X = k) = (λ^k * e^-λ) / k!
      let factorial = 1;
      for (let i = 2; i <= k; i++) factorial *= i;

      const y = (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial;
      data.push({ x: k, y });
    }
    return data;
  };

  return (
    <div className="flex items-center justify-center h-full">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="bg-black/30 rounded-lg"
      />
    </div>
  );
};

interface ResearchMontageProps {
  onComplete: () => void;
}

const ResearchMontage = ({ onComplete }: ResearchMontageProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    // Show skip button after a delay
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 2000);

    // Auto-advance slides
    const slideTimer = setTimeout(() => {
      if (currentSlide < 2) {
        setCurrentSlide(currentSlide + 1);
      } else {
        onComplete();
      }
    }, 5000);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(slideTimer);
    };
  }, [currentSlide, onComplete]);

  const slides = [
    {
      title: "Probability Distributions",
      description:
        "Visualizing mathematical models that describe the probability of different outcomes",
      component: <DistributionAnimation />,
    },
    {
      title: "Combinatorial Optimization",
      description:
        "Exploring complex problem-solving through mathematical modeling",
      component: <RubiksCubeAnimation />,
    },
    {
      title: "Data Science & Research",
      description:
        "Leveraging mathematics to extract insights from complex datasets",
      component: <DistributionAnimation />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      <motion.div
        key={currentSlide}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl px-4"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#EEEEEE] mb-2">
            {slides[currentSlide].title}
          </h2>
          <p className="text-[#EEEEEE]/70 max-w-2xl mx-auto">
            {slides[currentSlide].description}
          </p>
        </div>

        <div className="bg-[#1D1616]/50 p-6 rounded-xl border border-[#8E1616]/30 shadow-lg">
          {slides[currentSlide].component}
        </div>
      </motion.div>

      {showSkip && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-10"
        >
          <Button
            onClick={onComplete}
            variant="ghost"
            className="text-[#EEEEEE]/70 hover:text-[#EEEEEE] hover:bg-[#8E1616]/20 flex items-center gap-2"
          >
            Skip to website <ChevronDown size={16} />
          </Button>
        </motion.div>
      )}

      <div className="absolute bottom-6 flex gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentSlide ? "bg-[#D84040]" : "bg-[#8E1616]/50"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ResearchMontage;
