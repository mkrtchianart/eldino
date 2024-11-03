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

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '1.5vh', // Reduced from 2vh
  },
  title: {
    fontSize: '5vh', // Reduced from 6vh
    marginBottom: '2vh', // Reduced from 3vh
  },
  button: {
    fontSize: '2.5vh', // Reduced from 3vh
    padding: '1.25vh 2.5vh', // Reduced from 1.5vh 3vh
    margin: '0.8vh', // Reduced from 1vh
    minWidth: '20vh', // Reduced from 25vh
  },
  select: {
    fontSize: '2.5vh', // Reduced from 3vh
    padding: '1.25vh', // Reduced from 1.5vh
    minWidth: '20vh', // Reduced from 25vh
  },
  // ... rest of the styles
};