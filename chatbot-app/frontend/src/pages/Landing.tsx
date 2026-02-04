import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-black dark:text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <h1 className="text-xl font-bold">AI Learning Assistant</h1>
        <div className="space-x-4">
          <Link
            to="/login"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold transition hover:border-neon hover:text-neon dark:border-slate-700"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:opacity-80 dark:bg-white dark:text-black"
          >
            Get started
          </Link>
        </div>
      </header>
      <main className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">AI-Powered Learning</p>
          <h2 className="text-4xl font-semibold leading-tight">Study smarter with textbooks, code, and videos in one workspace.</h2>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Upload documents, analyze YouTube lectures, and generate quizzes with a production-ready assistant designed for academic rigor.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="rounded-2xl border border-slate-200 p-4 text-sm dark:border-slate-800">
              Document chat with grounded answers.
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 text-sm dark:border-slate-800">
              Explain code and technical notes.
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 text-sm dark:border-slate-800">
              Summarize and query YouTube content.
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-lg font-semibold">What you can do</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li>• Secure Supabase auth and storage.</li>
            <li>• Modular FastAPI backend with LLM abstraction.</li>
            <li>• Dark & light mode dashboard.</li>
            <li>• End-to-end pipeline from upload to insights.</li>
          </ul>
          <Link
            to="/signup"
            className="mt-6 inline-flex rounded-full bg-neon px-5 py-2 text-sm font-semibold text-black"
          >
            Start building
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Landing;
