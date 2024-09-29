import DinoGame from '@/components/DinoGame';
import { GameProvider } from '@/lib/game-context';

export default function Home() {
  return (
    <GameProvider>
      <DinoGame />
    </GameProvider>
  );
}