"use client";

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import GameMenu from './GameMenu';
import GamePlayArea from './GamePlayArea';
import GameOverPopup from './GameOverPopup';
import { useGameContext } from '../lib/game-context';

export default function DinoGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const { tickets, setTickets, startTimer, stopTimer, resetTimer } = useGameContext();

  const handlePlay = () => {
    if (tickets > 0) {
      setIsPlaying(true);
      setGameScore(0);
      setTickets(prevTickets => prevTickets - 1);
      resetTimer();
      startTimer(); // Start the timer immediately when play is clicked
    }
  };

  const handleGameOver = () => {
    setIsPlaying(false);
    setShowPopup(true);
    stopTimer(); // Stop the timer when the game is over
  };

  const handlePlayAgain = () => {
    setShowPopup(false);
    handlePlay();
  };

  const handleClose = () => {
    setShowPopup(false);
    setIsPlaying(false);
    resetTimer();
  };

  return (
    <div className="h-screen bg-[#F8F8F7] flex flex-col text-[#3d3929] overflow-hidden">
      <AnimatePresence mode="wait">
        {!isPlaying ? (
          <GameMenu onPlay={handlePlay} />
        ) : (
          <GamePlayArea 
            gameScore={gameScore} 
            setGameScore={setGameScore} 
            onGameOver={handleGameOver} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPopup && (
          <GameOverPopup 
            score={gameScore} 
            onPlayAgain={handlePlayAgain} 
            onClose={handleClose} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}