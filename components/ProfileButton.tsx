"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ProfileButton() {
  const buttonVariants = {
    rest: { scale: 1 },
    pressed: { scale: 0.95 },
  };

  return (
    <motion.div variants={buttonVariants} whileTap="pressed">
      <Link href="/profile" passHref>
        <div 
          className="flex items-center justify-center text-white font-bold px-4 py-2 relative"
          style={{ 
            background: `url('/buttons/greenBtnRd.png')`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          Profile
        </div>
      </Link>
    </motion.div>
  );
}