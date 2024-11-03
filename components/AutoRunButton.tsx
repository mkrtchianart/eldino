"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
        className="relative mb-8"
      >
        <div 
          className={`relative w-full h-16 flex items-center justify-center ${
            isAutoRunning
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer'
          }`}
          onClick={!isAutoRunning ? handleAutoRun : undefined}
        >
          <div 
            className="absolute inset-0"
            style={{ 
              background: `url('/buttons/orangeBtnSq.png')`,
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div className="flex justify-center items-center w-full h-full relative">
            <span className="z-10 text-white font-bold">
              {isAutoRunning ? (
                "Running"
              ) : autoRunPoints > 0 ? (
                `Collect ${autoRunPoints}`
              ) : (
                "Auto Run"
              )}
            </span>
            {isAutoRunning && (
              <span className="z-10 absolute right-4 text-white">
                {timeLeft.split('').map((digit, index) => (
                  <AnimatePresence mode="wait" key={`${index}-${digit}`}>
                    <AnimatedDigit digit={digit} />
                  </AnimatePresence>
                ))}
              </span>
            )}
          </div>
          {isAutoRunning && (
            <div 
              className="absolute inset-0 transition-all duration-100 ease-linear z-20"
              style={{ 
                width: `${autoRunProgress}%`,
                backgroundColor: 'rgba(61, 57, 41, 0.3)' // Darker tone with some transparency
              }}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}