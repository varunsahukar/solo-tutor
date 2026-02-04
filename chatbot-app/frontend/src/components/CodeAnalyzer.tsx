import { useState } from 'react';

interface CodeAnalyzerProps {
  onInteraction: (title: string) => void;
}

const CodeAnalyzer = ({ onInteraction }: CodeAnalyzerProps) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const result = await fetch(`${import.meta.env.VITE_API_BASE_URL}/code/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input })
      });
      const data = await result.json();
      if (!result.ok) throw new Error(data.detail || 'Failed to analyze.');
      setResponse(data.explanation);
      onInteraction('Code analysis');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error analyzing code.';
      setResponse(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div>
        <h3 className="text-lg font-semibold">Code & Text Explainer</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Paste code or text and get a structured explanation.
        </p>
      </div>
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={6}
        placeholder="Paste code or text here..."
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-black"
      />
      <button
        onClick={handleSubmit}
        className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:opacity-80 dark:bg-white dark:text-black"
      >
        {loading ? 'Analyzing...' : 'Explain'}
      </button>
      {response && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-black dark:text-slate-200">
          <p className="whitespace-pre-line">{response}</p>
        </div>
      )}
    </div>
  );
};

export default CodeAnalyzer;
