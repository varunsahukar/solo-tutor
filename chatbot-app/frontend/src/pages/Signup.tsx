import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

interface SignupProps {
  theme: 'light' | 'dark';
  setTheme: (value: 'light' | 'dark') => void;
}

const Signup = ({ theme, setTheme }: SignupProps) => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { first_name: firstName, last_name: lastName }
        }
      });
      if (authError) throw authError;
      if (data.user) {
        await supabase.from('users').insert({
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          email
        });
      }
      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign up.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-black dark:text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Create account</h2>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-xs uppercase tracking-[0.3em] text-neon"
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Start building your personalized study workspace.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="First name"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-black"
                required
              />
              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Last name"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-black"
                required
              />
            </div>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-black"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-black"
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm password"
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-black"
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:opacity-80 dark:bg-white dark:text-black"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Sign up'}
            </button>
          </form>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-neon">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
