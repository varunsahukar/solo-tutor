import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls, Stars } from '@react-three/drei';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

interface LoginProps {
  theme: 'light' | 'dark';
  setTheme: (value: 'light' | 'dark') => void;
}

const AnimatedBackground = () => (
  <Canvas className="absolute inset-0" camera={{ position: [0, 0, 6], fov: 60 }}>
    <ambientLight intensity={0.6} />
    <pointLight position={[5, 5, 5]} intensity={1} />
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh>
        <icosahedronGeometry args={[1.6, 0]} />
        <meshStandardMaterial color="#17f9a2" wireframe opacity={0.6} transparent />
      </mesh>
    </Float>
    <Stars radius={50} depth={20} count={1500} factor={2} saturation={0} fade speed={1} />
    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
  </Canvas>
);

const Login = ({ theme, setTheme }: LoginProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to login.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white">
      <AnimatedBackground />
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-black/70 p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-xs uppercase tracking-[0.3em] text-neon"
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
        <p className="mt-2 text-sm text-slate-300">Log in to continue your learning journey.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="w-full rounded-full border border-white/20 bg-transparent px-4 py-2 text-sm"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="w-full rounded-full border border-white/20 bg-transparent px-4 py-2 text-sm"
            required
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-neon px-4 py-2 text-sm font-semibold text-black"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Log in'}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-400">
          New here?{' '}
          <Link to="/signup" className="text-neon">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
