"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { useGameContext } from '../lib/game-context';
import confetti from 'canvas-confetti';

const AnimatedDigit = ({ digit }: { digit: string }) => (
  <motion.span
    key={digit}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    {digit}
  </motion.span>
);

export default function AutoRunButton() {
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [autoRunProgress, setAutoRunProgress] = useState(0);
  const [autoRunPoints, setAutoRunPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState('00:10');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { setTotalScore } = useGameContext();

  const totalRunTime = 10; // 10 seconds

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoRunning) {
      const endTime = Date.now() + totalRunTime * 1000;
      interval = setInterval(() => {
        const now = Date.now();
        const remainingTime = Math.max(0, endTime - now);
        const progress = 100 - (remainingTime / (totalRunTime * 1000)) * 100;
        
        setAutoRunProgress(progress);

        const seconds = Math.ceil(remainingTime / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        setTimeLeft(`${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`);

        if (remainingTime <= 0) {
          setIsAutoRunning(false);
          setAutoRunPoints(Math.floor(Math.random() * 50) + 10); // Random points between 10 and 59
          setAutoRunProgress(100);
          setTimeLeft('00:10');
          clearInterval(interval);
        }
      }, 100); // Update every 100ms for smooth animation
    }
    return () => clearInterval(interval);
  }, [isAutoRunning]);

  const handleAutoRun = () => {
    if (!isAutoRunning && autoRunPoints === 0) {
      setIsAutoRunning(true);
      setAutoRunProgress(0);
    } else if (autoRunPoints > 0) {
      setTotalScore(prevScore => prevScore + autoRunPoints);
      setAutoRunPoints(0);
      
      // Trigger confetti
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x, y }
        });
      }
    }
  };

  const buttonVariants = {
    rest: { y: 0 },
    pressed: { scale: 0.95 },
    collect: {
      y: [0, -5, 0, -5, 0, -5, 0, -5, 0],
      transition: {
        times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 4
      },
    },
  };

  return (
    <AnimatePresence>
      <motion.div 
        variants={buttonVariants} 
        animate={autoRunPoints > 0 ? "collect" : "rest"}
        whileTap={!isAutoRunning ? "pressed" : undefined}
        className="relative mb-8" // Changed from mb-4 to mb-8 for more bottom margin
      >
        <Button
          ref={buttonRef}
          onClick={handleAutoRun}
          disabled={isAutoRunning}
          variant="outline"
          className={`w-full h-14 border-2 ${
            isAutoRunning
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : autoRunPoints > 0
              ? 'bg-[#BD5D39] text-white'
              : 'border-[#bd5d3a] text-[#3d3929] hover:bg-[#da7756] hover:text-white'
          } rounded-md relative overflow-hidden`}
        >
          <div className="flex justify-center items-center w-full h-full">
            <span className="z-10 relative">
              {isAutoRunning ? (
                "Running"
              ) : autoRunPoints > 0 ? (
                `Collect ${autoRunPoints}`
              ) : (
                "Auto Run"
              )}
            </span>
            {isAutoRunning && (
              <span className="z-10 absolute right-4">
                {timeLeft.split('').map((digit, index) => (
                  <AnimatePresence mode="wait" key={`${index}-${digit}`}>
                    <AnimatedDigit digit={digit} />
                  </AnimatePresence>
                ))}
              </span>
            )}
          </div>
          {isAutoRunning && (
            <div className="absolute inset-0 bg-[#da7756] opacity-30 transition-all duration-100 ease-linear"
                 style={{ width: `${autoRunProgress}%` }}
            />
          )}
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}