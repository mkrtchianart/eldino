"use client";

import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GameOverPopupProps {
  score: number;
  onPlayAgain: () => void;
  onClose: () => void;
}

export default function GameOverPopup({ score, onPlayAgain, onClose }: GameOverPopupProps) {
  const buttonVariants = {
    rest: { scale: 1 },
    pressed: { scale: 0.95 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <Card className="w-80 bg-[url('/boxes/table.png')] bg-contain bg-no-repeat bg-center text-[#3d3929] rounded-lg border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-center">Game Over!</CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          <p className="text-lg mb-4 text-center">Your score: {score}</p>
          <div className="flex flex-row space-x-3 px-8">
            <motion.div variants={buttonVariants} whileTap="pressed" className="flex-1">
              <div 
                onClick={onPlayAgain}
                className="w-full h-12 flex items-center justify-center text-white font-bold"
                style={{ 
                  background: `url('/buttons/greenBtnRd.png')`,
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                Play Again
              </div>
            </motion.div>
            <motion.div variants={buttonVariants} whileTap="pressed" className="flex-1">
              <div 
                onClick={onClose}
                className="w-full h-12 flex items-center justify-center text-white font-bold"
                style={{ 
                  background: `url('/buttons/smallred.png')`,
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                Close
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}