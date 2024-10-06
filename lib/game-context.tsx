"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type GameContextType = {
  totalScore: number;
  setTotalScore: React.Dispatch<React.SetStateAction<number>>;
  tickets: number;
  setTickets: React.Dispatch<React.SetStateAction<number>>;
  timer: number;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
};

// Define the TelegramConfig interface to resolve the TypeScript error
interface TelegramConfig {
    disableVerticalSwipes: boolean;
    // Add other configuration properties as needed
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const TelegramContext = React.createContext<TelegramConfig>({
    disableVerticalSwipes: true, // Added to disable vertical swipes
    // ... other configurations ...
});

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [totalScore, setTotalScore] = useState(0);
  const [tickets, setTickets] = useState(5);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const startTimer = () => setIsTimerRunning(true);
  const stopTimer = () => setIsTimerRunning(false);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimer(0);
  };

  return (
    <GameContext.Provider value={{ 
      totalScore, 
      setTotalScore, 
      tickets, 
      setTickets, 
      timer, 
      startTimer, 
      stopTimer, 
      resetTimer 
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};