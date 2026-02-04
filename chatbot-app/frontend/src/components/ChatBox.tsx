import { useState } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBoxProps {
  documentId: string | null;
  onInteraction: (title: string) => void;
}

const ChatBox = ({ documentId, onInteraction }: ChatBoxProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || !documentId) return;
    const newMessage: ChatMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/document/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_id: documentId, question: newMessage.content })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to answer question.');
      }
      const assistantMessage: ChatMessage = { role: 'assistant', content: data.answer };
      setMessages([...updatedMessages, assistantMessage]);
      onInteraction(`Doc Q&A: ${newMessage.content.slice(0, 40)}...`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error.';
      setMessages([...updatedMessages, { role: 'assistant', content: message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex-1 space-y-4 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Upload a document and start asking questions.
          </p>
        ) : (
          messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                message.role === 'user'
                  ? 'ml-auto bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white'
              }`}
            >
              {message.content}
            </div>
          ))
        )}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={documentId ? 'Ask about the document...' : 'Upload a document first'}
          className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-black"
          disabled={!documentId}
        />
        <button
          onClick={handleSend}
          disabled={loading || !documentId}
          className="rounded-full bg-neon px-4 py-2 text-sm font-semibold text-black transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
