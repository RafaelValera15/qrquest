import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Quest } from "../types";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import PageWrapper from "../components/PageWrapper";

export default function PlayQuest() {
  const { questId } = useParams();
  const nav = useNavigate();

  const [quest, setQuest] = useState<Quest | null>(null);
  const [idx, setIdx] = useState(0);
  const [guess, setGuess] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const current = useMemo(() => {
    if (!quest) return null;
    return quest.questions[idx];
  }, [quest, idx]);

  // Load quest from Firestore using the ID from the URL
  useEffect(() => {
    const fetchQuest = async () => {
      if (!questId) {
        setError("Missing quest id in link.");
        setLoading(false);
        return;
      }

      try {
        const ref = doc(db, "quests", questId as string);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          console.warn("No quest found for id:", questId);
          setError("No quest found. Check the link.");
          setQuest(null);
        } else {
          setQuest({ id: snap.id, ...(snap.data() as Quest) });
        }
      } catch (err) {
        console.error("Failed to load quest:", err);
        setError("Failed to load quest. Try again later.");
        setQuest(null);
      } finally {
        setLoading(false);
      }
    };

    fetchQuest();
  }, [questId]);

  const goToWinScreen = () => {
    if (!quest) return;
    const url = new URL("/win", window.location.origin);
    url.searchParams.set("reward", quest.reward ?? "");
    window.location.href = url.toString();
  };

  const check = () => {
    // If for some reason things aren't ready, don't do anything
    if (!quest || !current) return;

    const guessNormalized = guess.trim().toLowerCase();
    const relationshipPrompt = "do you have a boyfriend/husband";

    // 💘 Special logic for the relationship question
    if (current.prompt.toLowerCase() === relationshipPrompt) {
      if (guessNormalized === "yes" || guessNormalized === "y") {
        // YES → game over
        // You can change this route to a custom "game over" screen
        nav("/");
        return;
      }

      if (guessNormalized === "no" || guessNormalized === "n") {
        // NO → advance to next question
        if (idx + 1 < quest.questions.length) {
          setIdx((prev) => prev + 1);
          setGuess("");
        } else {
          // that was the last question → win
          goToWinScreen();
        }
        return;
      }

      console.log("Please answer with yes or no.");
      return;
    }

    // ✅ Default behavior for other questions
    const currentAnswer = (current.answer ?? "").toLowerCase();
    const ok = guessNormalized === currentAnswer;

    if (!ok) {
      console.log("try again 🙂");
      return;
    }

    // Correct answer
    if (idx + 1 < quest.questions.length) {
      setIdx((prev) => prev + 1);
      setGuess("");
    } else {
      goToWinScreen();
    }
  };

  // ---- Render guards ----

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
          <p>Loading quest...</p>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
          <p className="text-red-400">{error}</p>
        </div>
      </PageWrapper>
    );
  }

  if (!quest || !current) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
          <p>No quest found.</p>
        </div>
      </PageWrapper>
    );
  }

  // ---- Main UI ----

  return (
    <PageWrapper>
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">{quest.title}</h1>
          <p className="text-sm text-slate-400">
            Question {idx + 1} of {quest.questions.length}
          </p>

          <div className="bg-slate-800 rounded p-4">
            <div className="mb-3">{current.prompt}</div>
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
