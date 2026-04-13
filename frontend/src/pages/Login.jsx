import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Utensils } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { setCredentials } from '../store/authSlice';
import { fetchCart } from '../store/cartSlice';

const ACCENT = '#C5F135';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please enter email and password'); return; }
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const data = response.data.data;
      dispatch(setCredentials({
        user: { name: data.name, email: data.email, role: data.role, userId: data.userId },
        token: data.token
      }));
      dispatch(fetchCart());
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4" style={{ backgroundColor: '#111111' }}>
      <div className="max-w-md w-full space-y-8 p-10 rounded-2xl" style={{ backgroundColor: '#1C1C1C', border: '1px solid #2E2E2E' }}>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(197,241,53,0.12)' }}>
            <Utensils className="h-8 w-8" style={{ color: ACCENT }} />
          </div>
          <h2 className="text-center text-3xl font-black text-white tracking-tight">Welcome back</h2>
          <p className="mt-2 text-center text-sm text-gray-500">Sign in to access your account</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5" htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 border outline-none transition-all text-sm"
                style={{ backgroundColor: '#242424', borderColor: '#2E2E2E', caretColor: ACCENT }}
                onFocus={(e) => e.target.style.borderColor = ACCENT}
                onBlur={(e) => e.target.style.borderColor = '#2E2E2E'}
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 border outline-none transition-all text-sm"
                style={{ backgroundColor: '#242424', borderColor: '#2E2E2E', caretColor: ACCENT }}
                onFocus={(e) => e.target.style.borderColor = ACCENT}
                onBlur={(e) => e.target.style.borderColor = '#2E2E2E'}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-black transition-all hover:opacity-90 active:scale-[0.98] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ backgroundColor: ACCENT, color: '#111111' }}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="text-center">
            <span className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold hover:opacity-80 transition-opacity" style={{ color: ACCENT }}>
                Sign up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
