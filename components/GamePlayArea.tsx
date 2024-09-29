"use client";

import { useRef, useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useGameContext } from '../lib/game-context';
import MiniGame from './MiniGame';

interface GamePlayAreaProps {
  gameScore: number;
  setGameScore: React.Dispatch<React.SetStateAction<number>>;
  onGameOver: () => void;
}

export default function GamePlayArea({ gameScore, setGameScore, onGameOver }: GamePlayAreaProps) {
  const { setTotalScore } = useGameContext();
  const gameActiveRef = useRef(true);
  const miniGameRef = useRef<{ handleTap: () => void } | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<number | null>(null);

  const handleScore = useCallback((points: number) => {
    setGameScore((prevScore) => prevScore + points);
    setTotalScore((prevTotal) => prevTotal + points);
  }, [setGameScore, setTotalScore]);

  const handleTap = useCallback(() => {
    if (gameActiveRef.current && miniGameRef.current) {
      miniGameRef.current.handleTap();
    }
  }, []);

  const buttonVariants = {
    rest: { scale: 1 },
    pressed: { scale: 0.95 },
  };

  useEffect(() => {
    startTimeRef.current = Date.now();
    
    const updateTimer = () => {
      const elapsedTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const newTimeLeft = Math.max(30 - elapsedTime, 0);
      
      setTimeLeft(newTimeLeft);

      if (newTimeLeft > 0 && gameActiveRef.current) {
        timerRef.current = requestAnimationFrame(updateTimer);
      } else {
        gameActiveRef.current = false;
        onGameOver();
      }
    };

    timerRef.current = requestAnimationFrame(updateTimer);

    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, []); // Empty dependency array to run only once on mount

  return (
    <motion.div
      key="game"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col bg-[#F8F8F7]"
    >
      <div className="flex justify-between p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-bold bg-white px-4 py-2 rounded-md border-2 border-[#bd5d3a]"
        >
          Time: {timeLeft}s
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-bold bg-white px-4 py-2 rounded-md border-2 border-[#bd5d3a]"
        >
          Score: {gameScore}
        </motion.div>
      </div>
      <motion.div
        className="flex-1 border-4 border-[#bd5d3a] mx-4 mt-4 mb-6 rounded-lg bg-white overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.3)] h-[60vh]"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <MiniGame 
          ref={miniGameRef} 
          onScore={handleScore} 
          gameActive={gameActiveRef.current} 
          onGameOver={onGameOver} 
        />
      </motion.div>
      <motion.div 
        variants={buttonVariants} 
        whileTap="pressed" 
        className="h-1/3 mx-4 mb-4"
        onTouchStart={handleTap}
        onMouseDown={handleTap}
      >
        <Button
          className="w-full h-full text-[#3D3929] text-2xl font-bold rounded-lg flex items-center justify-center relative overflow-hidden"
          style={{
            background: 'radial-gradient(circle, #F8F8F7 5%, #EBC3B1 40%, #DA7756 100%)',
          }}
        >
          <span className="relative z-10 flex items-center justify-center">
            <ChevronUp size={32} className="mr-2" />
            Tap
            <ChevronUp size={32} className="ml-2" />
          </span>
        </Button>
      </motion.div>
    </motion.div>
  );
}