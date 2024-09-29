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
      <Card className="w-80 bg-[#F8F8F7] text-[#3d3929] rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Game Over!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl mb-6 text-center">Your score: {score}</p>
          <div className="flex flex-col space-y-4">
            <motion.div variants={buttonVariants} whileTap="pressed">
              <Button onClick={onPlayAgain} className="w-full bg-[#da7756] hover:bg-[#bd5d3a] text-white rounded-md">
                Play Again
              </Button>
            </motion.div>
            <motion.div variants={buttonVariants} whileTap="pressed">
              <Button onClick={onClose} variant="outline" className="w-full border-[#bd5d3a] text-[#3d3929] hover:bg-[#da7756] hover:text-white rounded-md">
                Close
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}