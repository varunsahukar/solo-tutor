import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Hero3DBackground from '../components/Hero3DBackground';
import FloatingElements from '../components/FloatingElements';

interface SignupProps {}

export const Signup = ({}: SignupProps) => {
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
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <Hero3DBackground />
      <FloatingElements />
      
      <div className="relative z-10">
        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 sticky top-0 z-20 bg-black/80 backdrop-blur-sm">
          <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 drop-shadow-[0_0_8px_rgba(0,255,136,0.7)]">SOLO AI</Link>
        </header>
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 drop-shadow-[0_0_8px_rgba(0,255,136,0.7)] mb-2">
              Create Account
            </h1>
            <p className="text-gray-300 text-lg">
              Start your personalized learning journey
            </p>
          </div>
          
          <div className="rounded-3xl border border-gray-800 bg-gray-900/50 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-200">First Name</label>
                  <input
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="John"
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-4 text-white placeholder-gray-400 focus:border-white focus:ring-2 focus:ring-white/20 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-200">Last Name</label>
                  <input
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Doe"
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-4 text-white placeholder-gray-400 focus:border-white focus:ring-2 focus:ring-white/20 transition-all"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-200">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-4 text-white placeholder-gray-400 focus:border-white focus:ring-2 focus:ring-white/20 transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-200">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-4 text-white placeholder-gray-400 focus:border-white focus:ring-2 focus:ring-white/20 transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-200">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-4 text-white placeholder-gray-400 focus:border-white focus:ring-2 focus:ring-white/20 transition-all"
                  required
                />
              </div>
              
              {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg px-4 py-3 text-red-300 text-center">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-white py-4 text-black font-semibold transition-all duration-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-white hover:text-gray-300 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Signup;
