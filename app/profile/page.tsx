import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#F8F8F7] flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">User&apos;s Profile</h1>
      <p className="text-xl mb-8">This is where you&apos;d see your profile information.</p>
      <Link href="/" passHref>
        <Button className="bg-[#da7756] hover:bg-[#bd5d3a] text-white">
          Back to Game
        </Button>
      </Link>
    </div>
  );
}