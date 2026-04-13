import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Utensils } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { setCredentials } from '../store/authSlice';
import { fetchCart } from '../store/cartSlice';

const ACCENT = '#C5F135';

const inputClass = "block w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 border outline-none transition-all text-sm";
const inputStyle = { backgroundColor: '#242424', borderColor: '#2E2E2E', caretColor: ACCENT };

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFocus = (e) => (e.target.style.borderColor = ACCENT);
  const handleBlur  = (e) => (e.target.style.borderColor = '#2E2E2E');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || formData.password.length < 6) {
      toast.error('Please fill all required fields correctly (password min 6 chars)'); return;
    }
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/register', formData);
      const data = response.data.data;
      dispatch(setCredentials({
        user: { name: data.name, email: data.email, role: data.role, userId: data.userId },
        token: data.token
      }));
      dispatch(fetchCart());
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
          <h2 className="text-center text-3xl font-black text-white tracking-tight">Create an account</h2>
          <p className="mt-2 text-center text-sm text-gray-500">Join us to start ordering delicious food</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {[
            { id: 'name',     label: 'Full Name',     type: 'text',     placeholder: 'John Doe' },
            { id: 'email',    label: 'Email address', type: 'email',    placeholder: 'name@example.com', autoComplete: 'email' },
            { id: 'password', label: 'Password',      type: 'password', placeholder: 'Min 6 characters', autoComplete: 'new-password', minLength: 6 },
            { id: 'phone',    label: 'Phone Number',  type: 'tel',      placeholder: '1234567890' },
          ].map(({ id, label, ...rest }) => (
            <div key={id}>
              <label className="block text-sm font-medium text-gray-400 mb-1.5" htmlFor={id}>{label}</label>
              <input
                id={id} name={id}
                className={inputClass} style={inputStyle}
                value={formData[id]}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required={id !== 'phone'}
                {...rest}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5" htmlFor="address">Address</label>
            <textarea
              id="address" name="address" rows="2"
              value={formData.address} onChange={handleChange}
              onFocus={handleFocus} onBlur={handleBlur}
              className={inputClass + ' resize-none'} style={inputStyle}
              placeholder="Enter your delivery address"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-black transition-all hover:opacity-90 active:scale-[0.98] mt-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ backgroundColor: ACCENT, color: '#111111' }}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>

          <div className="text-center">
            <span className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold hover:opacity-80 transition-opacity" style={{ color: ACCENT }}>
                Sign in
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
