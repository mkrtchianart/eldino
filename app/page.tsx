import DinoGame from '@/components/DinoGame';
import { GameProvider } from '@/lib/game-context';
import Image from 'next/image'
import styles from './page.module.css'
import '../styles/globals.css' // Add this line to import global styles

export default function Home() {
  return (
    <GameProvider>
      <DinoGame />
    </GameProvider>
  );
}