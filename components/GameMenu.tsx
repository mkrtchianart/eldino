"use client";

import { useState, useEffect } from 'react';
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
  const [background, setBackground] = useState('/bgs/bg1.png');

  useEffect(() => {
    const backgrounds = [
      '/bgs/bg1.png',
      '/bgs/bg2.png',
      '/bgs/bg3.png',
      '/bgs/bg4.png'
    ];
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBackground(randomBg);
  }, []);

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
      className="flex-1 flex flex-col p-4 relative"
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'auto 100%',
      }}
    >
      <div className="flex justify-end mb-4">
        <ProfileButton />
      </div>
      <div className="text-center mb-6 mt-4">
        <h2 className="text-2xl font-bold text-[#3d3929] drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
          Username
        </h2>
        <p className="text-xl text-[#3d3929] drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
          Total Score: {totalScore}
        </p>
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
        className="w-full h-20 mb-4 flex rounded-md overflow-hidden gap-2"
      >
        <div 
          className="h-full flex items-center justify-center text-white text-xl font-bold relative"
          style={{ 
            background: `url('/buttons/smallred.png')`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100px'
          }}
        >
          <div className="w-6 h-6 mr-2 relative">
            <Image
              src="/buttons/key.png"
              alt="key"
              layout="fill"
              objectFit="contain"
            />
          </div>
          {tickets}
        </div>
        <div className="flex-grow h-full flex items-center justify-center">
          <motion.div 
            onClick={onPlay}
            className="w-[95%] h-[90%] relative cursor-pointer"
            animate={{
              scale: [1, 1.06, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div 
              className="absolute inset-0"
              style={{ 
                background: `url('/buttons/playbutton.png')`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            <div className="flex items-center justify-center h-full relative">
              <span className="text-white text-2xl font-bold">Play</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <div className="flex">
        <div className="flex-grow mr-2">
          <AutoRunButton />
        </div>
        <motion.div variants={buttonVariants} whileTap="pressed" className="w-1/4">
          <Link href="/upgrades" passHref>
            <div 
              className="w-full h-16 flex flex-col items-center justify-center text-white font-bold"
              style={{ 
                background: `url('/buttons/blueBtnRd.png')`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="w-6 h-6 relative mb-1">
                <Image
                  src="/buttons/shop.png"
                  alt="shop"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <span className="text-sm">Upgrades</span>
            </div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}