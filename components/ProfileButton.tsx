 "use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { User } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ProfileButton() {
  const buttonVariants = {
    rest: { scale: 1 },
    pressed: { scale: 0.95 },
  };

  return (
    <motion.div variants={buttonVariants} whileTap="pressed">
      <Link href="/profile" passHref>
        <Button
          variant="outline"
          className="rounded-md transition-all duration-300 ease-in-out flex items-center justify-center px-4 py-2 border-[#bd5d3a] text-[#3d3929]"
        >
          <User size={24} className="mr-2" />
          <span>My Profile</span>
        </Button>
      </Link>
    </motion.div>
  );
}