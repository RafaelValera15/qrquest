import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQuest } from "../lib/store";
import type { Quest } from "../types";
import PageWrapper from "../components/PageWrapper";

export default function PlayQuest() {
  const { questId } = useParams();
  const nav = useNavigate();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [idx, setIdx] = useState(0);
  const [guess, setGuess] = useState("");
  const current = useMemo(() => quest?.questions[idx], [quest, idx]);

  useEffect(() => {
    if (!questId) return;
    const q = getQuest(questId);
    setQuest(q);
  }, [questId]);

  if (!quest) {
    return (
      <div className="h-screen grid place-items-center bg-slate-950 text-slate-100">
        <div>No quest found.</div>
      </div>
    );
  }

const check = () => {
  if (!current) return;

  const guessNormalized = guess.trim().toLowerCase();
  const relationshipPrompt = "do you have a boyfriend/husband?";

  // 🔹 Special logic for the relationship question
  if (current.prompt.toLowerCase() === relationshipPrompt) {
    // YES → end game
    if (guessNormalized === "yes" || guessNormalized === "y") {
      // 👉 Change this to whatever "game over" route you build
      // For example: nav("/game-over");
      // or send them to a playful "thanks for playing" page
      nav("/"); // temporary: send back to home
      return;
    }

    // NO → advance to the next question (the "code" question)
    if (guessNormalized === "no" || guessNormalized === "n") {
      if (idx + 1 < quest.questions.length) {
        setIdx((prev) => prev + 1);
        setGuess("");
      } else {
        // If for some reason it's the last question, treat as win
        const url = new URL("/win", window.location.origin);
        url.searchParams.set("reward", quest.reward);
        window.location.href = url.toString();
      }
      return;
    }

    // If they type something else (not yes/no)
    console.log("Please answer with yes or no.");
    return;
  }

  // 🔹 Default behavior for all other questions
  const ok =
    guessNormalized === (current.answer ?? "").toLowerCase();

  if (!ok) {
    console.log("Try again 😬");
    return;
  }

  // Instantly move to next question
  if (idx + 1 < quest.questions.length) {
    setIdx((prev) => prev + 1);
    setGuess("");
  } else {
    // When finished, go to win screen immediately
    const url = new URL("/win", window.location.origin);
    url.searchParams.set("reward", quest.reward);
    window.location.href = url.toString();
  }
};

  return (
    <PageWrapper>
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">{quest.title}</h1>
        <p className="text-sm text-slate-400">
          Question {idx + 1} of {quest.questions.length}
        </p>
        <div className="bg-slate-800 rounded p-4">
          <div className="mb-3">{current?.prompt}</div>
          <input
            className="w-full bg-slate-900 rounded px-3 py-2"
            placeholder="Your answer"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && check()}
          />
        </div>
        
        <button
          className="bg-green-600 rounded px-4 py-2 hover:bg-green-500"
          onClick={check}
        >
          Submit
        </button>
      </div>
    </div>
    </PageWrapper>
  );
}
