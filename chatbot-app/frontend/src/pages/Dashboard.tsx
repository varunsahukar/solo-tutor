import { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import FeatureCard from '../components/FeatureCard';
import FileUploader from '../components/FileUploader';
import YouTubeAnalyzer from '../components/YouTubeAnalyzer';
import CodeAnalyzer from '../components/CodeAnalyzer';
import QuizGenerator from '../components/QuizGenerator';
import Hero3DBackground from '../components/Hero3DBackground';
import FloatingElements from '../components/FloatingElements';


interface DashboardProps {
  session: Session | null;
}

const Dashboard = ({ session }: DashboardProps) => {
  const [history, setHistory] = useState<{ id: string; title: string; timestamp: string }[]>([]);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const addHistory = (title: string) => {
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setHistory((prev) => [
      { id: uniqueId, title, timestamp: new Date().toLocaleString() },
      ...prev
    ]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleFeatureSelect = (feature: string) => {
    setActiveFeature(feature);
    setDocumentId(null);
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans">
      <Sidebar 
        history={history}
        session={session} 
        onLogout={handleLogout} 
      />
      
      <main className="relative flex-1 flex flex-col px-12 pt-28 pb-8">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Hero3DBackground />
          <FloatingElements />
        </div>
        <header className="sticky top-0 z-20 w-full bg-black/80 backdrop-blur-sm flex justify-between items-center px-12 py-6">
          <div>
            <h1 className="text-3xl font-bold">{(((session?.user?.user_metadata?.first_name || '') + ' ' + (session?.user?.user_metadata?.last_name || '')).trim() || (session?.user?.email?.split('@')[0] || 'USER'))}'S SPACE</h1>
          </div>
          <div className="flex items-center space-x-4">
            {activeFeature && (
              <button
                onClick={() => { setActiveFeature(null); setDocumentId(null); }}
                className="px-4 py-2 rounded-lg border border-gray-700 hover:border-white hover:bg-gray-800 transition"
              >
                Back
              </button>
            )}
          </div>
        </header>
        
        <div className="flex-1 flex flex-col items-center justify-start mt-6">
          <div className="w-full max-w-4xl mx-auto">
            {!activeFeature ? (
              <>
                <div className="text-center mb-8">
                  <p className="text-gray-400">READY TO LEARN, {(((session?.user?.user_metadata?.first_name || '') + ' ' + (session?.user?.user_metadata?.last_name || '')).trim() || (session?.user?.email?.split('@')[0] || 'USER'))}?</p>
                </div>
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <FeatureCard icon="" title="UPLOAD" subtitle="FILE, AUDIO, VIDEO" onClick={() => handleFeatureSelect('upload')} active={activeFeature === 'upload'} />
                    <FeatureCard icon="" title="LINK" subtitle="YOUTUBE, WEBSITE" onClick={() => handleFeatureSelect('link')} active={activeFeature === 'link'} />
                    <FeatureCard icon="" title="PASTE" subtitle="COPIED TEXT" onClick={() => handleFeatureSelect('paste')} active={activeFeature === 'paste'} />
                    <FeatureCard icon="" title="QUIZ MAKER" subtitle="GENERATE ASSESSMENT" onClick={() => handleFeatureSelect('quiz')} active={activeFeature === 'quiz'} />
                  </div>
                </div>
              </>
            ) : activeFeature === 'upload' ? (
              <div className="space-y-6">
                <FileUploader label="Upload content" onUploaded={async ({ path, fileName }) => {
                  try {
                    const api = import.meta.env.VITE_API_BASE_URL; // '/api'
                    // ...
                    const res = await fetch(`${api}/document/process`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ file_path: path, file_name: fileName })
                    });
                    const ct = res.headers.get('content-type') || '';
                    const parsed = ct.includes('application/json') ? await res.json() : await res.text();
                    if (!res.ok) {
                      const detail = typeof parsed === 'string' ? parsed : parsed?.detail;
                      throw new Error(detail || `Request failed (${res.status}).`);
                    }
                    const docId = typeof parsed === 'string' ? null : parsed.document_id;
                    setDocumentId(docId || null);
                  } catch (err) {
                    console.error(err);
                    setDocumentId(null);
                  }
                }} />
                <div className="w-full h-[60vh] bg-gray-900 border border-gray-700 rounded-2xl p-6">
<ChatBox documentId={documentId} onInteraction={addHistory} />                </div>
              </div>
            ) : activeFeature === 'link' ? (
              <YouTubeAnalyzer onInteraction={addHistory} />
            ) : activeFeature === 'paste' ? (
              <CodeAnalyzer onInteraction={addHistory} />
            ) : activeFeature === 'quiz' ? (
              <QuizGenerator onInteraction={addHistory} />
            ) : (
              <div className="text-center text-gray-400">Feature coming soon</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;