import { useMemo } from "react";
import PageWrapper from "../components/PageWrapper";
import confetti from "canvas-confetti";

confetti({
  particleCount: 150,
  spread: 100,
  origin: { y: 0.8 },
});


export default function WinScreen() {
  const reward = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("reward") || "Congrats!";
  }, []);

  const isUrl = /^https?:\/\//i.test(reward);

  return (
    <PageWrapper>
    <div className="h-screen grid place-items-center bg-yellow-100 text-yellow-900 p-6">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold">You Won! 🏆</h1>
        {isUrl ? (
          <a href={reward} target="_blank" rel="noreferrer" className="underline text-blue-700">
            Open your reward
          </a>
        ) : (
          <p className="text-xl">{reward}</p>
        )}
      </div>
    </div>
    </PageWrapper>
  );
}
