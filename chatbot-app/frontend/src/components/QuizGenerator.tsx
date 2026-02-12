import { useState } from 'react';
import FileUploader from './FileUploader';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

interface QuizGeneratorProps {
  onInteraction: (title: string) => void;
}

const QuizGenerator = ({ onInteraction }: QuizGeneratorProps) => {
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (payload: { path: string; fileName: string }) => {
    setLoading(true);
    setScore(null);
    setResponses({});
    try {
const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/quiz/generate`,  {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_path: payload.path, file_name: payload.fileName })
      });
      const ct = res.headers.get('content-type') || '';
      const parsed = ct.includes('application/json') ? await res.json() : await res.text();
      if (!res.ok) throw new Error((typeof parsed === 'string' ? parsed : parsed?.detail) || `Request failed (${res.status}).`);
      const questions = typeof parsed === 'string' ? [] : parsed.questions;
      setQuiz(questions);
      onInteraction(`Quiz: ${payload.fileName}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error generating quiz.';
      setQuiz([{ question: message, options: [], answer: '' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    const correct = quiz.reduce((total, item, index) => {
      return total + (responses[index] === item.answer ? 1 : 0);
    }, 0);
    setScore(correct);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/5 backdrop-blur-xl p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/10">
      <div>
        <h3 className="text-lg font-semibold text-white">Quiz Generator</h3>
        <p className="text-sm text-slate-400">Upload a document to generate a quiz.</p>
      </div>
      <FileUploader label="Upload quiz source" onUploaded={handleGenerate} />
      {loading && <p className="text-sm text-slate-400">Generating quiz...</p>}
      {quiz.length > 0 && quiz[0].options.length > 0 && (
        <div className="space-y-4">
          {quiz.map((item, index) => (
            <div key={`${item.question}-${index}`} className="rounded-xl border border-slate-700/50 p-4 bg-slate-900/20">
              <p className="text-sm font-semibold text-white">{item.question}</p>
              <div className="mt-3 space-y-2">
                {item.options.map((option) => (
                  <label key={option} className="flex items-center gap-2 text-sm text-slate-200">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={responses[index] === option}
                      onChange={() => setResponses({ ...responses, [index]: option })}
                      className="text-cyan-500 focus:ring-cyan-500"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Submit Answers
          </button>
          {score !== null && (
            <p className="text-sm font-semibold text-slate-200">
              Your score: {score} / {quiz.length}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;