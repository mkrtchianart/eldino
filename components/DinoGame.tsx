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
  const { tickets, setTickets } = useGameContext();

  const handlePlay = () => {
    if (tickets > 0) {
      setIsPlaying(true);
      setGameScore(0);
      setTickets(prevTickets => prevTickets - 1);
    }
  };

  const handleGameOver = () => {
    setIsPlaying(false);
    setShowPopup(true);
  };

  const handlePlayAgain = () => {
    setShowPopup(false);
    handlePlay();
  };

  const handleClose = () => {
    setShowPopup(false);
    setIsPlaying(false);
  };

  return (
    <div className="h-screen bg-[#F8F8F7] flex flex-col text-[#3d3929]">
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