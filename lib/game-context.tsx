"use client";

import React, { createContext, useContext, useState } from 'react';

type GameContextType = {
  totalScore: number;
  setTotalScore: React.Dispatch<React.SetStateAction<number>>;
  tickets: number;
  setTickets: React.Dispatch<React.SetStateAction<number>>;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [totalScore, setTotalScore] = useState(0);
  const [tickets, setTickets] = useState(5);

  return (
    <GameContext.Provider value={{ totalScore, setTotalScore, tickets, setTickets }}>
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