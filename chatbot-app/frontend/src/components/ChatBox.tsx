import { useState, useRef, useEffect } from 'react';

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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (documentId && messages.length === 0) {
      setMessages([
        { role: 'assistant', content: 'Ready to learn! Ask me anything about the selected content.' }
      ]);
    }
  }, [documentId, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [input]);

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
      setMessages([...updatedMessages, { role: 'assistant', content: `Sorry, I encountered an error: ${message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-white">
      <div className="flex-1 overflow-y-auto space-y-6 pr-4 -mr-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center font-bold">
                S
              </div>
            )}
            <div
              className={`max-w-xl rounded-lg px-4 py-2 text-base ${
                message.role === 'user'
                  ? 'bg-gray-700'
                  : 'bg-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="relative mt-8">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={documentId ? 'Learn anything...' : 'Select a content source to start'}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg py-3 pl-4 pr-14 resize-none text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={!documentId || loading}
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={loading || !documentId || !input.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-700 hover:bg-gray-600 p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v12" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatBox;