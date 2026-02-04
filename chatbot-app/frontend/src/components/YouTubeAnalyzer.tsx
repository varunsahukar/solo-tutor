import { useState } from 'react';

interface YouTubeAnalyzerProps {
  onInteraction: (title: string) => void;
}

const YouTubeAnalyzer = ({ onInteraction }: YouTubeAnalyzerProps) => {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/youtube/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Unable to analyze video.');
      setSummary(data.summary);
      setAnalysisId(data.analysis_id);
      onInteraction(`YouTube: ${data.title || 'Video analysis'}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error analyzing video.';
      setSummary(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUp = async () => {
    if (!question.trim() || !analysisId) return;
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/youtube/follow-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis_id: analysisId, question })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Unable to answer follow-up.');
      setSummary(`${summary}\n\nFollow-up answer:\n${data.answer}`);
      setQuestion('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error answering follow-up.';
      setSummary(`${summary}\n\n${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div>
        <h3 className="text-lg font-semibold">YouTube Analyzer</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Paste a YouTube URL to summarize the content.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-black"
        />
        <button
          onClick={handleAnalyze}
          className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:opacity-80 dark:bg-white dark:text-black"
        >
          {loading ? 'Analyzing...' : 'Analyze Video'}
        </button>
      </div>
      {summary && (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-black dark:text-slate-200">
          <p className="whitespace-pre-line">{summary}</p>
        </div>
      )}
      <div className="space-y-3">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask a follow-up question"
          className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-black"
        />
        <button
          onClick={handleFollowUp}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold transition hover:border-neon hover:text-neon dark:border-slate-700"
          disabled={!analysisId || loading}
        >
          Ask follow-up
        </button>
      </div>
    </div>
  );
};

export default YouTubeAnalyzer;
