import { Session } from '@supabase/supabase-js';

interface SidebarProps {
  history: { id: string; title: string; timestamp: string }[];
  session: Session | null;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Sidebar = ({ history, session, onLogout, theme, onToggleTheme }: SidebarProps) => {
  return (
    <aside className="flex h-full w-72 flex-col justify-between border-r border-slate-200 bg-white px-6 py-8 text-slate-900 dark:border-slate-800 dark:bg-black dark:text-white">
      <div>
        <h2 className="text-xl font-semibold">Assistant History</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Recent conversations and analyses.
        </p>
        <div className="mt-6 space-y-4">
          {history.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No interactions yet.</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.timestamp}</p>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="space-y-4">
        <button
          onClick={onToggleTheme}
          className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold transition hover:border-neon hover:text-neon dark:border-slate-700"
        >
          Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </button>
        <div className="rounded-lg border border-slate-200 p-4 text-sm dark:border-slate-800">
          <p className="font-semibold">
            {session?.user.user_metadata.first_name || session?.user.email || 'Student'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{session?.user.email}</p>
          <button
            onClick={onLogout}
            className="mt-3 w-full rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold transition hover:border-neon hover:text-neon dark:border-slate-700"
          >
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
