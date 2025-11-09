import { useState } from "react";
import { nanoid } from "nanoid";
import QRCode from "react-qr-code";
import { saveQuest } from "../lib/store";
import type { Question, Quest } from "../types";
import PageWrapper from "../components/PageWrapper";
import { motion } from "framer-motion";

export default function CreateQuest() {
  const [title, setTitle] = useState("");
  const [reward, setReward] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { id: nanoid(), prompt: "", answer: "" },
  ]);
  const [createdLink, setCreatedLink] = useState<string | null>(null);

  const addQuestion = () =>
    setQuestions((q) => [...q, { id: nanoid(), prompt: "", answer: "" }]);

  const updateQuestion = (id: string, field: "prompt" | "answer", val: string) =>
    setQuestions((qs) => qs.map(q => q.id === id ? { ...q, [field]: val } : q));

  const removeQuestion = (id: string) =>
    setQuestions((qs) => qs.filter(q => q.id !== id));

  const handleCreate = () => {
    const clean = questions
      .filter(q => q.prompt.trim() && q.answer.trim())
      .map(q => ({ ...q, prompt: q.prompt.trim(), answer: q.answer.trim() }));

    const quest: Quest = {
      id: nanoid(10),
      title: title.trim() || "Untitled Quest",
      reward: reward.trim(),
      questions: clean,
      createdAt: Date.now(),
    };

    saveQuest(quest);
    const url = `${window.location.origin}/play/${quest.id}`;
    setCreatedLink(url);
  };

  return (
    <PageWrapper>
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Create a Quest</h1>

        <div className="grid gap-4">
          <input
            className="bg-slate-800 rounded px-3 py-2"
            placeholder="Quest title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="bg-slate-800 rounded px-3 py-2"
            placeholder="Reward (message or URL)"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
          />
        </div>
        

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Questions</h2>
          {questions.map((q, i) => (
            <div key={q.id} className="grid grid-cols-1 md:grid-cols-5 gap-2">
              <input
                className="bg-slate-800 rounded px-3 py-2 md:col-span-3"
                placeholder={`Question ${i + 1}`}
                value={q.prompt}
                onChange={(e) => updateQuestion(q.id, "prompt", e.target.value)}
              />
              <input
                className="bg-slate-800 rounded px-3 py-2 md:col-span-2"
                placeholder="Answer"
                value={q.answer}
                onChange={(e) => updateQuestion(q.id, "answer", e.target.value)}
              />
              <button
                className="text-sm text-red-300 hover:text-red-200"
                onClick={() => removeQuestion(q.id)}
              >
                remove
              </button>
            </div>
          ))}
          <button
            className="bg-slate-800 rounded px-3 py-2 hover:bg-slate-700"
            onClick={addQuestion}
          >
            + Add question
          </button>
        </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="bg-blue-600 rounded px-4 py-2 hover:bg-blue-500"
            onClick={handleCreate}
>
              Generate Link & QR
          </motion.button>


        {createdLink && (
          <div className="mt-6 p-4 rounded bg-slate-800 flex flex-col items-center gap-3">
            <p className="text-sm break-all">{createdLink}</p>
            <QRCode value={createdLink} />
            <button
              className="text-xs underline"
              onClick={() => navigator.clipboard.writeText(createdLink)}
            >
              Copy link
            </button>
          </div>
        )}
      </div>
    </div>
    </PageWrapper>
  );
}
