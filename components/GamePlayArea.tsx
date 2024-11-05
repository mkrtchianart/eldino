"use client";

import { useRef, useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useGameContext } from '../lib/game-context';
import MiniGame from './MiniGame';
import styles from '../styles/telegram-scroll.css';

interface GamePlayAreaProps {
  gameScore: number;
  setGameScore: React.Dispatch<React.SetStateAction<number>>;
  onGameOver: () => void;
}

export default function GamePlayArea({ gameScore, setGameScore, onGameOver }: GamePlayAreaProps) {
  const { setTotalScore, timer } = useGameContext();
  const miniGameRef = useRef<{ handleTap: () => void } | null>(null);

  // Define the game duration in seconds
  const gameDuration = 30;

  // Trigger game over when timer reaches the game duration
  useEffect(() => {
    if (timer >= gameDuration) {
      onGameOver();
    }
  }, [timer, onGameOver]);

  const handleScore = useCallback((points: number) => {
    if (points < 0) {
      setGameScore(prevScore => {
        const newScore = Math.max(Math.floor(prevScore / 2), 0); // Cut score in half, not below 0
        return newScore;
      });
      setTotalScore(prevTotal => Math.max(Math.floor(prevTotal / 2), 0)); // Similarly cut total score in half
    } else {
      setGameScore(prevScore => prevScore + points);
      setTotalScore(prevTotal => prevTotal + points);
    }
  }, [setGameScore, setTotalScore]);

  const handleTap = useCallback(() => {
    if (miniGameRef.current) {
      miniGameRef.current.handleTap();
    }
  }, []);

  const buttonVariants = {
    rest: { scale: 1 },
    pressed: { scale: 0.95 },
  };

  return (
    <motion.div
      key="game"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className={`flex-1 flex flex-col bg-[#F8F8F7] ${styles.telegramScroll}`}
      style={{ height: 'calc(100vh - 64px)' }}
    >
      <div className="flex justify-between p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-bold bg-white px-4 py-2 rounded-2xl border-2 border-[#b00000]"
        >
          Time: {gameDuration - timer}s
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-bold bg-white px-4 py-2 rounded-2xl border-2 border-[#b00000]"
        >
          Score: {gameScore}
        </motion.div>
      </div>
      <motion.div
        className="flex-1 border-4 border-[#b00000] mx-4 mt-4 mb-6 rounded-2xl bg-white overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.3)] h-[60vh]"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <MiniGame 
          ref={miniGameRef} 
          onScore={handleScore} 
          gameActive={timer < gameDuration}
          onGameOver={onGameOver}
          currentScore={gameScore}
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
            background: `url('/boxes/orangebox.png')`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
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