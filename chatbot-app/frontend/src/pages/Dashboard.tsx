import { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';
import FileUploader from '../components/FileUploader';
import ChatBox from '../components/ChatBox';
import YouTubeAnalyzer from '../components/YouTubeAnalyzer';
import CodeAnalyzer from '../components/CodeAnalyzer';
import QuizGenerator from '../components/QuizGenerator';

interface DashboardProps {
  theme: 'light' | 'dark';
  setTheme: (value: 'light' | 'dark') => void;
  session: Session | null;
}

const Dashboard = ({ theme, setTheme, session }: DashboardProps) => {
  const [history, setHistory] = useState<{ id: string; title: string; timestamp: string }[]>([]);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [docStatus, setDocStatus] = useState<string>('');

  const addHistory = (title: string) => {
    setHistory((prev) => [
      { id: crypto.randomUUID(), title, timestamp: new Date().toLocaleString() },
      ...prev
    ]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleDocumentUpload = async (payload: { path: string; fileName: string }) => {
    setDocStatus('Processing document...');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/document/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_path: payload.path, file_name: payload.fileName })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to process document.');
      setDocumentId(data.document_id);
      setDocStatus(`Ready: ${payload.fileName}`);
      addHistory(`Document uploaded: ${payload.fileName}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Document processing failed.';
      setDocStatus(message);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-black dark:text-white">
      <Sidebar history={history} session={session} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
      <main className="flex-1 space-y-8 px-10 py-8">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Learning Dashboard</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your centralized study control panel.</p>
          </div>
          <span className="rounded-full border border-neon px-3 py-1 text-xs uppercase tracking-[0.3em] text-neon">
            {theme} mode
          </span>
        </header>
        <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <FileUploader label="Upload textbook" onUploaded={handleDocumentUpload} />
            {docStatus && <p className="text-sm text-slate-500 dark:text-slate-400">{docStatus}</p>}
            <ChatBox documentId={documentId} onInteraction={addHistory} />
          </div>
          <div className="space-y-6">
            <YouTubeAnalyzer onInteraction={addHistory} />
            <CodeAnalyzer onInteraction={addHistory} />
          </div>
        </section>
        <section>
          <QuizGenerator onInteraction={addHistory} />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
