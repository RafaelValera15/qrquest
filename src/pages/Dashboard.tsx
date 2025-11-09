import { useState } from "react";
import { nanoid } from "nanoid";
import QRCode from "react-qr-code";
import type { Quest, Question } from "../types";
import { saveQuest, getQuest } from "../lib/store";
import PageWrapper from "../components/PageWrapper";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [mode, setMode] = useState<"home" | "create" | "play" | "win">("home");
  const [quest, setQuest] = useState<Quest | null>(null);
  const [title, setTitle] = useState("");
  const [reward, setReward] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { id: nanoid(), prompt: "", answer: "" },
  ]);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [guess, setGuess] = useState("");
  const [correctMoment, setCorrectMoment] = useState(false);

  // ---------- CREATE ----------
  const addQuestion = () =>
    setQuestions((q) => [...q, { id: nanoid(), prompt: "", answer: "" }]);

  const updateQuestion = (id: string, field: "prompt" | "answer", val: string) =>
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, [field]: val } : q)));

  const handleCreate = () => {
    const clean = questions.filter((q) => q.prompt && q.answer);
    const newQuest: Quest = {
      id: nanoid(10),
      title,
      reward,
      questions: clean,
      createdAt: Date.now(),
    };
    saveQuest(newQuest);
    setQuest(newQuest);
    setCreatedLink(`play/${newQuest.id}`);
    setMode("play");
  };

  // ---------- PLAY ----------
  const current = quest?.questions[idx];
  const check = () => {
  if (!quest || !current) return;

  const ok =
    guess.trim().toLowerCase() === current.answer.trim().toLowerCase();

  if (!ok) return alert("Try again 👀");

  // ✅ Trigger correct animation
  setCorrectMoment(true);
  setTimeout(() => setCorrectMoment(false), 600);

  if (idx + 1 < quest.questions.length) {
  setTimeout(() => {
    setIdx((i) => i + 1);
    setGuess("");
  }, 8000); // allow animation to play
} else {
  setTimeout(() => {
    setMode("win");
  }, 500);
}}



  // ---------- UI ----------
  return (
    <PageWrapper>
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center">
        {mode === "home" && (
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-blue-400">QR Quest Dashboard</h1>
            <button
              onClick={() => setMode("create")}
              className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-500"
            >
              Create a Quest
            </button>
          </div>
        )}

        {mode === "create" && (
          <div className="w-full max-w-3xl space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Create Quest</h2>
            <input
              className="w-full bg-slate-800 rounded px-3 py-2"
              placeholder="Quest title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="w-full bg-slate-800 rounded px-3 py-2"
              placeholder="Reward (message or link)"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
            />
            {questions.map((q, i) => (
              <div key={q.id} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  className="bg-slate-800 rounded px-3 py-2"
                  placeholder={`Question ${i + 1}`}
                  value={q.prompt}
                  onChange={(e) => updateQuestion(q.id, "prompt", e.target.value)}
                />
                <input
                  className="bg-slate-800 rounded px-3 py-2"
                  placeholder="Answer"
                  value={q.answer}
                  onChange={(e) => updateQuestion(q.id, "answer", e.target.value)}
                />
              </div>
            ))}
            <div className="flex gap-3">
              <button
                onClick={addQuestion}
                className="bg-slate-700 px-4 py-2 rounded hover:bg-slate-600"
              >
                + Add Question
              </button>
              <button
                onClick={handleCreate}
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
              >
                Generate & Play
              </button>
            </div>
          </div>
        )}

        {mode === "play" && quest && current && (
          <div className="w-full max-w-xl text-center space-y-6">
            {/* ✅ CORRECT FEEDBACK */}
            {correctMoment && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1, 1.2, 1], opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="text-green-400 font-bold text-xl"
        >
                ✅ Correct!
              </motion.div>
        )}
            <h2 className="text-2xl font-bold">{quest.title}</h2>
            <p className="text-slate-400">
              Question {idx + 1} / {quest.questions.length}
            </p>
            
            <div className="bg-slate-800 rounded p-4">{current.prompt}</div>
            <input
              className="w-full bg-slate-900 rounded px-3 py-2"
              placeholder="Your answer"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && check()}
            />
            
            <button
              onClick={check}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
            >
              Submit
            </button>
          </div>
        )}

        {mode === "win" && quest && (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-yellow-400">You Won! 🏆</h2>
            {/^https?:\/\//.test(quest.reward) ? (
              <a
                href={quest.reward}
                target="_blank"
                rel="noreferrer"
                className="underline text-blue-400"
              >
                Open your reward
              </a>
            ) : (
              <p className="text-xl">{quest.reward}</p>
            )}
            <button
              onClick={() => setMode("home")}
              className="bg-slate-700 px-4 py-2 rounded hover:bg-slate-600"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}