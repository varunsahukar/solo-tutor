import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Landing from './Landing';
import { Login as Login_1 } from './Login';
import { Signup } from './Signup';
import Dashboard from './Dashboard';

const App = () => {
  const [session, setSession] = useState<Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Force dark mode
    const root = document.documentElement;
    root.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setAuthReady(true);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const authValue = useMemo(() => ({ session, setSession }), [session]);

  return (
    authReady ? (
      <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login_1 />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          session ? (
            <Dashboard session={authValue.session} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    ) : (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    ))  
};

export default App;
