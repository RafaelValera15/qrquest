export type Question = { id: string; prompt: string; answer: string };
export type Quest = {
  id: string;
  title: string;
  reward: string; // text or URL
  questions: Question[];
  createdAt: number;
};
