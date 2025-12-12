import React, { useState } from "react";

const theme = {
  bgGradient: "linear-gradient(180deg,#e6f8ff 0%,#d9eefb 50%, #eaf6ff 100%)",
  cardBg: "#f8feff",
  highlight: "#dff6fb",
  textDark: "#0f2f3a",
};

// Component Types 

interface QuestionType {
  q: string;
  opts: string[];
  ans: number;
}

interface QuestionCardProps {
  question: string;
  options: string[];
  selected: number | null;
  onSelect: (idx: number) => void;
}

interface NavButtonProps {
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isLast: boolean;
}

interface FinalScoreProps {
  scorePercent: number;
  onRestart: () => void;
}

// Layout Wrapper 

function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: theme.bgGradient }}
    >
      <div
        className="w-full max-w-5xl rounded-2xl p-6"
        style={{ boxShadow: "0 20px 40px rgba(6,40,60,0.08)" }}
      >
        <div
          className="bg-white/90 rounded-xl p-8 md:p-12"
          style={{ background: theme.cardBg }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// Progress Bar 

function QuizProgress({ current, total }: { current: number; total: number }) {
  const steps = Array.from({ length: total });

  return (
    <div className="mb-6">
      <div className="flex items-center justify-center gap-3">
        {steps.map((_, i) => (
          <div key={i} className="flex-1">
            <div
              className="h-2 rounded-full mx-4"
              style={{
                background: i < current ? theme.textDark : "#e6eef1",
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Question Card 

function QuestionCard({
  question,
  options,
  selected,
  onSelect,
}: QuestionCardProps) {
  return (
    <div>
      <div
        className="rounded-md p-3 text-center font-semibold mb-4"
        style={{ background: theme.highlight }}
      >
        {question}
      </div>

      <div className="space-y-3 max-w-2xl mx-auto">
        {options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`w-full text-left px-5 py-4 rounded-md border bg-white shadow-sm ${
              selected === idx
                ? "border-purple-500 ring-2 ring-purple-200"
                : "border-gray-200"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// Navigation Buttons 

function NavButtons({
  onPrev,
  onNext,
  onSubmit,
  isLast,
}: NavButtonProps) {
  return (
    <div className="flex items-center justify-between mt-6 max-w-2xl mx-auto">
      <button className="px-3 py-2 rounded-lg bg-white border shadow-sm" onClick={onPrev}>
        ←
      </button>

      {!isLast ? (
        <button className="px-4 py-2 rounded-lg bg-white border shadow-sm" onClick={onNext}>
          →
        </button>
      ) : (
        <button
          className="px-5 py-2 rounded-lg bg-blue-200 hover:bg-blue-300"
          onClick={onSubmit}
        >
          Submit
        </button>
      )}
    </div>
  );
}

// Final Score Screen 

function FinalScore({ scorePercent, onRestart }: FinalScoreProps) {
  return (
    <div className="text-center py-20">
      <div
        className="inline-block px-4 py-1 rounded-md mb-6 text-sm"
        style={{ background: "#f0fbff" }}
      >
        Keep Learning!
      </div>

      <h2 className="text-2xl md:text-4xl font-serif text-[#0f2f3a] mb-6">
        Your Final score is
      </h2>

      <div className="text-6xl md:text-8xl font-extrabold text-[#0c445b] mb-8">
        {scorePercent}%
      </div>

      <button
        onClick={onRestart}
        className="px-6 py-3 rounded-full bg-blue-200 hover:bg-blue-300"
      >
        Start Again
      </button>
    </div>
  );
}

// Main App Component 

export default function App() {
  const quiz: QuestionType[] = [
    { q: "1. What sound does a cat make?", opts: ["Bhau-Bhau", "Meow-Meow", "Oink-Oink"], ans: 1 },
    { q: "2. What would you probably find in your fridge?", opts: ["Shoes", "Ice Cream", "Books"], ans: 1 },
    { q: "3. What color are bananas?", opts: ["Blue", "Yellow", "Red"], ans: 1 },
    { q: "4. How many stars are in the sky?", opts: ["Two", "Infinite", "One Hundred"], ans: 1 },
  ];

  const total = quiz.length;

  const [index, setIndex] = useState<number>(0);
  const [selected, setSelected] = useState<(number | null)[]>(Array(total).fill(null));
  const [submitted, setSubmitted] = useState<boolean>(false);

  function handleSelect(idx: number) {
    const copy = [...selected];
    copy[index] = idx;
    setSelected(copy);
  }

  function prev() {
    setIndex((i) => Math.max(0, i - 1));
  }

  function next() {
    setIndex((i) => Math.min(total - 1, i + 1));
  }

  function submit() {
    setSubmitted(true);
  }

  function restart() {
    setIndex(0);
    setSelected(Array(total).fill(null));
    setSubmitted(false);
  }

  if (submitted) {
    const score = quiz.reduce(
      (acc, cur, i) => acc + (selected[i] === cur.ans ? 1 : 0),
      0
    );
    const percent = Math.round((score / total) * 100) || 0;

    return (
      <QuizLayout>
        <FinalScore scorePercent={percent} onRestart={restart} />
      </QuizLayout>
    );
  }

  return (
    <QuizLayout>
      <div className="text-center mb-4">
        <h1 className="text-3xl md:text-5xl font-serif text-[#063246d9]">
          Test Your Knowledge
        </h1>
        <p className="text-sm text-[#06324676] mt-2">
          Answer all questions to see your results
        </p>
      </div>

      <QuizProgress current={index + 1} total={total} />

      <QuestionCard
        question={quiz[index].q}
        options={quiz[index].opts}
        selected={selected[index]}
        onSelect={handleSelect}
      />

      <NavButtons
        onPrev={prev}
        onNext={next}
        onSubmit={submit}
        isLast={index === total - 1}
      />
    </QuizLayout>
  );
}
