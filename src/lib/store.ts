import type { Quest } from "@/types";

const KEY = "qrquest:quests";

function readAll(): Record<string, Quest> {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : {};
}

function writeAll(map: Record<string, Quest>) {
  localStorage.setItem(KEY, JSON.stringify(map));
}

export function saveQuest(q: Quest) {
  const map = readAll();
  map[q.id] = q;
  writeAll(map);
}

export function getQuest(id: string): Quest | null {
  const map = readAll();
  return map[id] ?? null;
}
