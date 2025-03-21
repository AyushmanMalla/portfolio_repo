"use client";

import React, { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MathVisualizationProps {
  title?: string;
  description?: string;
  defaultTab?: string;
}

const MathVisualization = ({
  title = "Interactive Probability Distribution",
  description = "Explore how parameters affect probability distributions and mathematical models",
  defaultTab = "normal",
}: MathVisualizationProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [parameters, setParameters] = useState({
    normal: { mean: 0, stdDev: 1 },
    binomial: { n: 20, p: 0.5 },
    poisson: { lambda: 5 },
  });
  const [isExpanded, setIsExpanded] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Get data based on active tab
    let data;
    switch (activeTab) {
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
    ctx.strokeStyle = "rgba(220, 38, 38, 0.8)"; // Red color
    ctx.lineWidth = 2;
    ctx.beginPath();

    // For discrete distributions (binomial, poisson), draw bars
    if (activeTab === "binomial" || activeTab === "poisson") {
      const barWidth = graphWidth / (data.length + 1);

      data.forEach((point, i) => {
        const x = padding + (i + 0.5) * barWidth;
        const y = height - padding - (point.y / maxY) * graphHeight;

        ctx.fillStyle = "rgba(220, 38, 38, 0.6)";
        ctx.fillRect(
          x - barWidth / 3,
          height - padding,
          barWidth / 1.5,
          -((point.y / maxY) * graphHeight),
        );

        // Add point labels for x-axis
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillText(point.x.toString(), x, height - padding + 15);
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
      ctx.fillStyle = "rgba(220, 38, 38, 0.2)";
      ctx.fill();

      // Add axis labels
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";

      // X-axis labels
      const xStep = graphWidth / 8;
      for (let i = 0; i <= 8; i++) {
        const x = padding + i * xStep;
        const value =
          data[0].x + (i / 8) * (data[data.length - 1].x - data[0].x);
        ctx.fillText(value.toFixed(1), x, height - padding + 15);
      }
    }

    // Add Y-axis labels
    ctx.textAlign = "right";
    const yStep = graphHeight / 5;
    for (let i = 0; i <= 5; i++) {
      const y = height - padding - i * yStep;
      const value = (i / 5) * maxY;
      ctx.fillText(value.toFixed(2), padding - 5, y + 3);
    }

    // Add grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 0.5;

    // Horizontal grid lines
    for (let i = 1; i <= 5; i++) {
      const y = height - padding - i * yStep;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Vertical grid lines
    const xStep =
      activeTab === "normal" ? graphWidth / 8 : graphWidth / (data.length + 1);
    const xCount = activeTab === "normal" ? 8 : data.length;

    for (let i = 1; i <= xCount; i++) {
      const x = padding + i * xStep;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Add title
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      activeTab === "normal"
        ? "Normal Distribution"
        : activeTab === "binomial"
          ? "Binomial Distribution"
          : "Poisson Distribution",
      width / 2,
      padding - 15,
    );
  }, [activeTab, parameters]);

  // Handle parameter changes
  const handleParameterChange = (
    tab: string,
    param: string,
    value: number | number[],
  ) => {
    const newValue = Array.isArray(value) ? value[0] : value;
    setParameters((prev) => ({
      ...prev,
      [tab]: {
        ...prev[tab as keyof typeof prev],
        [param]: newValue,
      },
    }));
  };

  return (
    <Card
      className={cn(
        "w-full max-w-6xl mx-auto bg-black/80 border-purple-900/50 overflow-hidden transition-all duration-500",
        isExpanded ? "p-6" : "p-4",
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          {isExpanded && (
            <p className="text-gray-400 text-sm mt-1">{description}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white hover:bg-purple-900/20"
        >
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>

      {isExpanded && (
        <>
          <Tabs
            defaultValue={defaultTab}
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-6 bg-gray-900/50">
              <TabsTrigger
                value="normal"
                className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
              >
                Normal
              </TabsTrigger>
              <TabsTrigger
                value="binomial"
                className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
              >
                Binomial
              </TabsTrigger>
              <TabsTrigger
                value="poisson"
                className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
              >
                Poisson
              </TabsTrigger>
            </TabsList>

            <TabsContent value="normal" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm text-gray-400">
                        Mean (μ): {parameters.normal.mean.toFixed(1)}
                      </label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 text-gray-500"
                            >
                              <Info size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px] text-xs">
                              The mean determines the center of the
                              distribution.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Slider
                      value={[parameters.normal.mean]}
                      min={-5}
                      max={5}
                      step={0.1}
                      onValueChange={(value) =>
                        handleParameterChange("normal", "mean", value)
                      }
                      className="py-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm text-gray-400">
                        Standard Deviation (σ):{" "}
                        {parameters.normal.stdDev.toFixed(1)}
                      </label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 text-gray-500"
                            >
                              <Info size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px] text-xs">
                              The standard deviation controls the spread of the
                              distribution.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Slider
                      value={[parameters.normal.stdDev]}
                      min={0.1}
                      max={3}
                      step={0.1}
                      onValueChange={(value) =>
                        handleParameterChange("normal", "stdDev", value)
                      }
                      className="py-2"
                    />
                  </div>
                </div>
                <div className="bg-gray-900/30 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Formula:
                  </h4>
                  <div className="flex justify-center items-center h-16 bg-black/40 rounded-md">
                    <p className="text-purple-300 font-mono">
                      f(x) = (1/σ√2π) · e^(-(x-μ)²/2σ²)
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-4">
                    The normal distribution is a continuous probability
                    distribution that is symmetric about the mean, showing that
                    data near the mean are more frequent in occurrence than data
                    far from the mean.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="binomial" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm text-gray-400">
                        Number of Trials (n): {parameters.binomial.n}
                      </label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 text-gray-500"
                            >
                              <Info size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px] text-xs">
                              The number of independent trials in the
                              experiment.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Slider
                      value={[parameters.binomial.n]}
                      min={1}
                      max={50}
                      step={1}
                      onValueChange={(value) =>
                        handleParameterChange("binomial", "n", value)
                      }
                      className="py-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm text-gray-400">
                        Success Probability (p):{" "}
                        {parameters.binomial.p.toFixed(2)}
                      </label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 text-gray-500"
                            >
                              <Info size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px] text-xs">
                              The probability of success in a single trial.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Slider
                      value={[parameters.binomial.p]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={(value) =>
                        handleParameterChange("binomial", "p", value)
                      }
                      className="py-2"
                    />
                  </div>
                </div>
                <div className="bg-gray-900/30 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Formula:
                  </h4>
                  <div className="flex justify-center items-center h-16 bg-black/40 rounded-md">
                    <p className="text-purple-300 font-mono">
                      P(X=k) = (n choose k) · p^k · (1-p)^(n-k)
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-4">
                    The binomial distribution models the number of successes in
                    a fixed number of independent trials, each with the same
                    probability of success. It's commonly used in quality
                    control, genetics, and polling.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="poisson" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm text-gray-400">
                        Rate Parameter (λ):{" "}
                        {parameters.poisson.lambda.toFixed(1)}
                      </label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 text-gray-500"
                            >
                              <Info size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px] text-xs">
                              The average number of events in the given time
                              interval.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Slider
                      value={[parameters.poisson.lambda]}
                      min={0.1}
                      max={15}
                      step={0.1}
                      onValueChange={(value) =>
                        handleParameterChange("poisson", "lambda", value)
                      }
                      className="py-2"
                    />
                  </div>
                </div>
                <div className="bg-gray-900/30 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Formula:
                  </h4>
                  <div className="flex justify-center items-center h-16 bg-black/40 rounded-md">
                    <p className="text-purple-300 font-mono">
                      P(X=k) = (λ^k · e^-λ) / k!
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-4">
                    The Poisson distribution models the number of events
                    occurring in a fixed time interval, knowing the average rate
                    of occurrence. It's used in queueing theory,
                    telecommunications, and modeling rare events like equipment
                    failures.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 bg-gray-900/30 rounded-lg p-2 relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full h-[400px] rounded"
            />
          </div>
        </>
      )}
    </Card>
  );
};

export default MathVisualization;
