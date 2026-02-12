import { Session } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero3DBackground from './Hero3DBackground';


interface SidebarProps {
  history: { id: string; title: string; timestamp: string }[];
  session: Session | null;
  onLogout: () => Promise<void>;
}

const SpaceItem = ({ text, active = false }: { text: string; active?: boolean }) => (


  <li className={`flex items-center p-2 rounded-lg cursor-pointer ${active ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
    <span className="w-2 h-2 bg-gray-600 rounded-full mr-3"></span>
    <span className="text-sm font-medium">{text}</span>
  </li>
);


const Sidebar = ({ session, onLogout }: SidebarProps) => {

  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [spaces, setSpaces] = useState<{ id: string; name: string }[]>([]);
  const [spacesError, setSpacesError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  useEffect(() => {
    try {
      const saved = localStorage.getItem('solo_spaces');
      if (saved) setSpaces(JSON.parse(saved));
    } catch {
      setSpacesError('Load failed');
    }
  }, []);
  const addSpace = () => {
    const name = newSpaceName.trim();
    if (!name) return;
    const updated = [{ id: `${Date.now()}`, name }, ...spaces];
    setSpaces(updated);
    localStorage.setItem('solo_spaces', JSON.stringify(updated));
    setNewSpaceName('');
    setIsCreateOpen(false);
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col p-6 border-r border-gray-800">
      <div className="flex items-center mb-10">
        <Link to="/dashboard" className="flex items-center">
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-md font-bold text-lg mr-3">S</div>
          <h1 className="text-xl font-bold tracking-wider">SOLO AI</h1>
        </Link>
      </div>

      <nav className="flex-1 flex flex-col">
        
          <div className="mt-10">
            <h2 className="text-gray-500 text-sm font-bold tracking-widest mb-4">SPACES</h2>
            {spacesError && (
              <div className="text-xs text-red-400 mb-2">{spacesError}</div>
            )}
            <ul className="space-y-2">
              <SpaceItem text={`${(((session?.user?.user_metadata?.first_name || '') + ' ' + (session?.user?.user_metadata?.last_name || '')).trim() || (session?.user?.email?.split('@')[0] || 'USER'))}'S SPACE`} active />
              {spaces.map((s) => (
                <SpaceItem key={s.id} text={s.name} />
              ))}
            </ul>
            <div className="mt-4">
              {!isCreateOpen ? (
                <button onClick={() => setIsCreateOpen(true)} className="text-sm text-gray-300 hover:text-white">+ Create Space</button>
              ) : (
                <div className="space-y-2">
                  <input value={newSpaceName} onChange={(e) => setNewSpaceName(e.target.value)} placeholder="Space name" className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm" />
                  <div className="flex gap-2">
                    <button onClick={addSpace} className="px-3 py-1 rounded-md bg-green-500 text-black text-sm">Save</button>
                    <button onClick={() => { setIsCreateOpen(false); setNewSpaceName(''); }} className="px-3 py-1 rounded-md border border-gray-700 text-sm">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
    



          <div className="relative mt-auto">
            <button 
              onClick={() => setUserMenuOpen(!isUserMenuOpen)}
              className="w-full flex items-center text-left p-3 bg-gray-900 rounded-lg hover:bg-gray-800"
            >
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center font-bold text-black mr-3">
                {((((session?.user?.user_metadata?.first_name || '') + ' ' + (session?.user?.user_metadata?.last_name || '')).trim() || (session?.user?.email?.split('@')[0] || 'U'))[0] || 'U').toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">{(((session?.user?.user_metadata?.first_name || '') + ' ' + (session?.user?.user_metadata?.last_name || '')).trim() || (session?.user?.email?.split('@')[0] || 'Guest'))}</p>
                <p className="text-xs text-gray-400">{session ? 'Signed in' : 'Not signed in'}</p>
              </div>
              <svg className={`w-5 h-5 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {isUserMenuOpen && (
              <div className="absolute bottom-full mb-2 w-full bg-gray-800 rounded-lg shadow-lg">
                <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                  <div>{(((session?.user?.user_metadata?.first_name || '') + ' ' + (session?.user?.user_metadata?.last_name || '')).trim() || (session?.user?.email?.split('@')[0] || 'Guest'))}</div>
                  <div className="text-xs text-gray-400">{session?.user?.id || ''}</div>
                </div>
                <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Settings</a>
                <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700">
                  Logout
                </button>
              </div>
            )}
          </div>
        
      </nav>
    </aside>
  );
};

export function HeroSection() {

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <Hero3DBackground />

      <div className="relative z-10 flex min-h-screen items-center justify-center text-white">
        <h1 className="text-5xl font-bold">SOLO AI</h1>
      </div>
    </div>
  );
}

export default Sidebar;
