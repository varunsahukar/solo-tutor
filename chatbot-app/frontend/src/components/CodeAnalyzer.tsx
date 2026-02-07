import { useState } from 'react';

const API = import.meta.env.VITE_API_BASE_URL;

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
      if (!API) {
        throw new Error('API base URL not configured (VITE_API_BASE_URL).');
      }
      const endpoint = `${API}/code/analyze`;
      const result = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input })
      });
      const contentType = result.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await result.json() : await result.text();
      if (!result.ok) {
        const detail = typeof data === 'string' ? data : data?.detail;
        throw new Error(detail || `Request failed (${result.status}).`);
      }
      const explanation = typeof data === 'string' ? data : data.explanation;
      setResponse(explanation || 'No explanation returned.');
      onInteraction('Code analysis');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error.';
      setResponse(`Sorry, I encountered an error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
 <div className="space-y-4 rounded-2xl border border-gray-700 bg-gray-900 p-6">      <div>
        <h3 className="text-lg font-semibold text-white">Code & Text Explainer</h3>
        <p className="text-sm text-gray-400">
          Paste code or text and get a structured explanation.
        </p>
      </div>
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={6}
        placeholder="Paste code or text here..."
        className="w-full rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-500"
      />
      <button
        onClick={handleSubmit}
        className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold text-white hover:border-white hover:bg-gray-800 transition"
      >
        {loading ? 'Analyzing...' : 'Explain'}
      </button>
      {response && (
        <div className="rounded-xl border border-gray-700/50 bg-gray-900/30 p-4 text-sm text-gray-200">
          <p className="whitespace-pre-line">{response}</p>
        </div>
      )}
    </div>
  );
};

export default CodeAnalyzer;