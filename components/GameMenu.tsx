"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useGameContext } from '../lib/game-context';
import ProfileButton from './ProfileButton';
import AutoRunButton from './AutoRunButton';
import { Button } from "@/components/ui/button";
import dinoImage from './assets/dino.png';

interface GameMenuProps {
  onPlay: () => void;
}

export default function GameMenu({ onPlay }: GameMenuProps) {
  const { totalScore, tickets } = useGameContext();
  const [imageError, setImageError] = useState<string | null>(null);

  const buttonVariants = {
    rest: { scale: 1 },
    pressed: { scale: 0.95 },
  };

  return (
    <motion.div
      key="menu"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col p-4"
    >
      <div className="flex justify-end mb-4">
        <ProfileButton />
      </div>
      <div className="text-center mb-6 mt-4">
        <h2 className="text-2xl font-bold">Username</h2>
        <p className="text-xl">Total Score: {totalScore}</p>
      </div>
      <div className="flex-1 flex items-center justify-center mb-6 w-full overflow-hidden">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full h-full relative"
          style={{ 
            paddingTop: '56.25%', // 16:9 aspect ratio
            maskImage: 'radial-gradient(circle, black 50%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 80%)'
          }}
        >
          <div className="absolute inset-0" style={{ transform: 'scale(1.5)' }}>
            <Image
              src={dinoImage}
              alt="Chrome Dinosaur"
              layout="fill"
              objectFit="contain"
              onError={(e) => {
                console.error("Error loading image:", e);
                setImageError("Failed to load image");
              }}
            />
          </div>
          {imageError && <p className="text-red-500 mt-2 absolute bottom-0 left-0 right-0 text-center">{imageError}</p>}
        </motion.div>
      </div>
      <motion.div
        variants={buttonVariants}
        whileTap="pressed"
        className="w-full h-20 mb-4 flex rounded-md overflow-hidden"
      >
        <div className="bg-[#bd5d3a] flex items-center justify-center text-white text-xl font-bold border-r border-[#da7756] px-4">
          <span role="img" aria-label="ticket" className="mr-2">🎟️</span>
          {tickets}
        </div>
        <Button
          onClick={onPlay}
          className="flex-grow h-full text-2xl rounded-none bg-[#da7756] hover:bg-[#bd5d3a] text-white"
        >
          Play
        </Button>
      </motion.div>
      <div className="flex">
        <div className="flex-grow mr-2">
          <AutoRunButton />
        </div>
        <motion.div variants={buttonVariants} whileTap="pressed" className="w-1/4">
          <Link href="/upgrades" passHref>
            <Button variant="outline" className="w-full h-14 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-md">
              Upgrades
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}