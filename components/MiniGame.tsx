"use client";

import React, { forwardRef, useImperativeHandle, useState, useEffect, useRef, useCallback, memo } from 'react';
import styles from './MiniGame.module.css';

interface MiniGameProps {
  onScore: (points: number) => void;
  gameActive: boolean;
  onGameOver: () => void;
}

interface Cactus {
  id: number;
  position: number;
  scored: boolean;
}

const MAX_CACTUSES = 10;

const CactusComponent = memo(({ position }: { position: number }) => (
  <div className={styles.cactus} style={{ left: `${position}%` }}>
    <div className={styles.collisionBox}></div>
  </div>
));

CactusComponent.displayName = 'CactusComponent';

const MiniGame = forwardRef<{ handleTap: () => void }, MiniGameProps>(({ onScore, gameActive, onGameOver }, ref) => {
  const [isJumping, setIsJumping] = useState(false);
  const [cactuses, setCactuses] = useState<Cactus[]>([]);
  const characterRef = useRef<HTMLDivElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const lastCactusPosition = useRef(100);
  const scoreRef = useRef(0);

  const handleTap = useCallback(() => {
    if (!gameActive || isJumping) return;
    setIsJumping(true);
  }, [gameActive, isJumping]);

  useEffect(() => {
    if (isJumping) {
      const jumpTimer = setTimeout(() => {
        setIsJumping(false);
      }, 480);

      return () => clearTimeout(jumpTimer);
    }
  }, [isJumping]);

  const addCactus = useCallback(() => {
    setCactuses(prevCactuses => {
      if (prevCactuses.length >= MAX_CACTUSES) return prevCactuses;
      const minDistance = 20;
      const maxDistance = 60;
      const randomDistance = Math.random() * (maxDistance - minDistance) + minDistance;
      const newPosition = Math.max(100, lastCactusPosition.current + randomDistance);
      lastCactusPosition.current = newPosition;
      return [...prevCactuses, { id: Date.now(), position: newPosition, scored: false }];
    });
  }, []);

  const moveCactuses = useCallback(() => {
    setCactuses(prevCactuses => {
      const updatedCactuses = prevCactuses
        .map(cactus => ({
          ...cactus,
          position: cactus.position - 1.2
        }))
        .filter(cactus => cactus.position > -20);

      if (updatedCactuses.length > 0) {
        lastCactusPosition.current = Math.max(...updatedCactuses.map(c => c.position));
      } else {
        lastCactusPosition.current = 100;
      }

      return updatedCactuses;
    });
  }, []);

  useEffect(() => {
    let cactusInterval: NodeJS.Timeout;
    let scoreInterval: NodeJS.Timeout;
    let generateCactusTimeout: NodeJS.Timeout;

    const generateCactus = () => {
      addCactus();
      const nextInterval = Math.random() * 240 + 160;
      generateCactusTimeout = setTimeout(generateCactus, nextInterval);
    };

    if (gameActive) {
      cactusInterval = setInterval(moveCactuses, 16);
      generateCactus();

      scoreInterval = setInterval(() => {
        scoreRef.current += 1;
        onScore(1);
      }, 2400);
    }

    return () => {
      clearInterval(cactusInterval);
      clearInterval(scoreInterval);
      clearTimeout(generateCactusTimeout);
    };
  }, [gameActive, addCactus, moveCactuses, onScore]);

  const checkCollisionAndScore = useCallback(() => {
    if (characterRef.current && gameContainerRef.current) {
      const characterRect = characterRef.current.getBoundingClientRect();
      const containerRect = gameContainerRef.current.getBoundingClientRect();

      setCactuses(prevCactuses => prevCactuses.filter(cactus => {
        const cactusLeft = containerRect.left + (cactus.position / 100) * containerRect.width;
        const cactusRight = cactusLeft + 20; // Assuming cactus width is 20px
        const cactusTop = containerRect.bottom - 60; // Assuming cactus height is 40px and it's 20px above ground

        if (
          characterRect.right > cactusLeft &&
          characterRect.left < cactusRight &&
          characterRect.bottom > cactusTop &&
          !cactus.scored
        ) {
          scoreRef.current -= 25;
          onScore(-25);
          return false; // Remove the cactus
        } else if (
          characterRect.left > cactusRight &&
          !cactus.scored
        ) {
          scoreRef.current += 10;
          onScore(10);
          return { ...cactus, scored: true };
        }
        return true;
      }));
    }
  }, [onScore]);

  useEffect(() => {
    const collisionInterval = setInterval(checkCollisionAndScore, 100);
    return () => clearInterval(collisionInterval);
  }, [checkCollisionAndScore]);

  useImperativeHandle(ref, () => ({
    handleTap
  }), [handleTap]);

  return (
    <div ref={gameContainerRef} className={styles.gameContainer}>
      <div 
        ref={characterRef}
        className={`${styles.character} ${isJumping ? styles.jump : ''}`}
      >
        <div className={styles.collisionBox}></div>
      </div>
      {cactuses.map((cactus) => (
        <CactusComponent key={cactus.id} position={cactus.position} />
      ))}
      <div className={styles.ground} />
    </div>
  );
});

MiniGame.displayName = 'MiniGame';

export default MiniGame;