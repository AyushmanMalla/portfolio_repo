"use client";

import React, { useRef, useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import { cn } from "@/lib/utils";
// Dynamically import THREE.js to avoid SSR issues
import dynamic from "next/dynamic";

// Create a placeholder for THREE until it's loaded
const THREE = typeof window !== "undefined" ? {} : null;

interface ParticleSystemProps {
  className?: string;
  particleCount?: number;
  particleSize?: number;
  colorPrimary?: string;
  colorSecondary?: string;
  interactionStrength?: number;
  decayFactor?: number;
  speedFactor?: number;
}

const ParticleSystem = ({
  className = "",
  particleCount = 1000,
  particleSize = 3,
  colorPrimary = "#ff0066",
  colorSecondary = "#9900ff",
  interactionStrength = 0.5,
  decayFactor = 0.95,
  speedFactor = 0.2,
}: ParticleSystemProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Animation for container opacity
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 200,
    config: { duration: 1000 },
  });

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    // Dynamically import THREE.js
    const importTHREE = async () => {
      const THREE = await import("three");

      // Initialize Three.js scene after import
      const initThree = () => {
        const container = containerRef.current;
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        // Create scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Create camera
        const camera = new THREE.PerspectiveCamera(
          75,
          width / height,
          0.1,
          1000,
        );
        camera.position.z = 50;
        cameraRef.current = camera;

        // Create renderer
        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
        });
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0); // Transparent background
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Create particles
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const color1 = new THREE.Color(colorPrimary);
        const color2 = new THREE.Color(colorSecondary);

        for (let i = 0; i < particleCount; i++) {
          // Position
          positions[i * 3] = (Math.random() - 0.5) * 100; // x
          positions[i * 3 + 1] = (Math.random() - 0.5) * 100; // y
          positions[i * 3 + 2] = (Math.random() - 0.5) * 100; // z

          // Velocity
          velocities[i * 3] = (Math.random() - 0.5) * 0.2;
          velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
          velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

          // Color - interpolate between primary and secondary
          const mixRatio = Math.random();
          const mixedColor = new THREE.Color().lerpColors(
            color1,
            color2,
            mixRatio,
          );
          colors[i * 3] = mixedColor.r;
          colors[i * 3 + 1] = mixedColor.g;
          colors[i * 3 + 2] = mixedColor.b;

          // Size - vary slightly
          sizes[i] = particleSize * (0.5 + Math.random() * 0.5);
        }

        particleGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3),
        );
        particleGeometry.setAttribute(
          "color",
          new THREE.BufferAttribute(colors, 3),
        );
        particleGeometry.setAttribute(
          "size",
          new THREE.BufferAttribute(sizes, 1),
        );

        // Store velocities in userData for animation
        particleGeometry.userData = { velocities };

        // Create particle material
        const particleMaterial = new THREE.PointsMaterial({
          size: particleSize,
          vertexColors: true,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
        });

        // Create points system
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);
        particlesRef.current = particles;

        setIsInitialized(true);
      };

      // Handle mouse movement
      const handleMouseMove = (event: MouseEvent) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        mousePositionRef.current = {
          x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
          y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
        };
      };

      // Handle touch movement
      const handleTouchMove = (event: TouchEvent) => {
        if (!containerRef.current || !event.touches[0]) return;

        const rect = containerRef.current.getBoundingClientRect();
        mousePositionRef.current = {
          x: ((event.touches[0].clientX - rect.left) / rect.width) * 2 - 1,
          y: -((event.touches[0].clientY - rect.top) / rect.height) * 2 + 1,
        };
      };

      // Animation loop
      const animate = () => {
        if (
          !particlesRef.current ||
          !sceneRef.current ||
          !cameraRef.current ||
          !rendererRef.current
        ) {
          animationFrameRef.current = requestAnimationFrame(animate);
          return;
        }

        const particles = particlesRef.current;
        const positionAttribute = particles.geometry.getAttribute(
          "position",
        ) as THREE.BufferAttribute;
        const velocities = particles.geometry.userData.velocities;

        // Update particle positions based on velocities and mouse interaction
        for (let i = 0; i < particleCount; i++) {
          const ix = i * 3;
          const iy = i * 3 + 1;
          const iz = i * 3 + 2;

          // Current position
          let x = positionAttribute.array[ix];
          let y = positionAttribute.array[iy];
          let z = positionAttribute.array[iz];

          // Apply mouse influence - create a flow toward mouse position
          const dx = mousePositionRef.current.x * 50 - x;
          const dy = mousePositionRef.current.y * 50 - y;
          const distance = Math.sqrt(dx * dx + dy * dy + z * z);

          if (distance < 30) {
            // Particles close to mouse get pushed
            velocities[ix] += (dx / distance) * interactionStrength;
            velocities[iy] += (dy / distance) * interactionStrength;
            velocities[iz] += (Math.random() - 0.5) * 0.01; // Small random z movement
          }

          // Apply velocity with speed factor
          positionAttribute.array[ix] += velocities[ix] * speedFactor;
          positionAttribute.array[iy] += velocities[iy] * speedFactor;
          positionAttribute.array[iz] += velocities[iz] * speedFactor;

          // Decay velocity over time
          velocities[ix] *= decayFactor;
          velocities[iy] *= decayFactor;
          velocities[iz] *= decayFactor;

          // Boundary check - wrap around or bounce
          if (Math.abs(positionAttribute.array[ix]) > 50) {
            positionAttribute.array[ix] *= -0.9;
            velocities[ix] *= -0.5;
          }
          if (Math.abs(positionAttribute.array[iy]) > 50) {
            positionAttribute.array[iy] *= -0.9;
            velocities[iy] *= -0.5;
          }
          if (Math.abs(positionAttribute.array[iz]) > 50) {
            positionAttribute.array[iz] *= -0.9;
            velocities[iz] *= -0.5;
          }
        }

        positionAttribute.needsUpdate = true;

        // Rotate the entire particle system slightly for more dynamic effect
        particles.rotation.x += 0.0003;
        particles.rotation.y += 0.0005;

        // Render
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      // Handle window resize
      const handleResize = () => {
        if (!containerRef.current || !cameraRef.current || !rendererRef.current)
          return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      };

      // Initialize and start animation
      initThree();
      animate();
    };

    importTHREE().catch(console.error);

    // Add event listeners
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameRef.current);

      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [
    particleCount,
    particleSize,
    colorPrimary,
    colorSecondary,
    interactionStrength,
    decayFactor,
    speedFactor,
  ]);

  return (
    <animated.div
      ref={containerRef}
      style={fadeIn}
      className={cn(
        "w-full h-full absolute top-0 left-0 z-0 bg-black",
        className,
      )}
    />
  );
};

export default ParticleSystem;
