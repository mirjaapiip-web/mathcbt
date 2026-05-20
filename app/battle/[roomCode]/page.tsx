import { BattleRoom } from "@/components/battle-room";
import { leaderboard, questions } from "@/lib/mock-data";

export const metadata = {
  title: "Layar Battle Berlangsung",
};

type BattlePageProps = {
  params: Promise<{
    roomCode: string;
  }>;
};

export default async function BattlePage({ params }: BattlePageProps) {
  const { roomCode } = await params;

  return (
    <BattleRoom
      roomId="demo-room"
      roomCode={roomCode.toUpperCase()}
      title="Battle Turunan Kilat"
      questions={questions}
      leaderboard={leaderboard}
      timerSeconds={900}
    />
  );
}
