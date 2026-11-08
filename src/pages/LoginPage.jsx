import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn, FiInfo } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../services/api';

/**
 * ==============================================================================
 * LOGIN PAGE (src/pages/LoginPage.jsx)
 * ==============================================================================
 * Renders the login form styled like a lined page of the student's notebook.
 * Features:
 * - Email & Password inputs with icons
 * - Show / Hide password toggle (FiEye / FiEyeOff)
 * - Client-side form validation
 * - Links to /forgot-password and /register
 * - Detailed // [BACKEND SPOT] instructions for Express auth & JWT creation
 */
export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validations
    if (!formData.email.trim() || !formData.password.trim()) {
      toast.warning('Please enter both your email and password! ✍️');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error('Please enter a valid email address!');
      return;
    }

    setLoading(true);

    try {
      /**
       * ========================================================================
       * // [BACKEND SPOT] - Express User Login & JWT Generation
       * ========================================================================
       * HTTP Method : POST
       * Endpoint    : /api/auth/login
       * Headers     : Content-Type: application/json
       * Request Body:
       *   {
       *     "email": formData.email,
       *     "password": formData.password
       *   }
       * 
       * What happens on your Node.js + Express backend:
       * 1. Route: `app.post('/api/auth/login', authController.login);`
       * 2. Find user in MongoDB:
       *    const user = await User.findOne({ email: req.body.email });
       *    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
       * 3. Compare hashed password with bcrypt:
       *    const isMatch = await bcrypt.compare(req.body.password, user.password);
       *    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
       * 4. Sign a JSON Web Token:
       *    const token = jwt.sign(
       *      { id: user._id, email: user.email, name: user.name },
       *      process.env.JWT_SECRET,
       *      { expiresIn: '7d' }
       *    );
       * 5. Send back response:
       *    res.status(200).json({
       *      success: true,
       *      token,
       *      user: { id: user._id, name: user.name, email: user.email }
       *    });
       * ========================================================================
       */
      const response = await api.loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      toast.success(`Welcome back, ${response.user?.name || 'Dev'}! Logged in successfully ☕`);
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-4">
      {/* Page Header */}
      <div className="text-center mb-6">
        <span className="inline-block p-2.5 rounded-full bg-[#D8E2DC] text-[#4A403A] mb-2 shadow-xs">
          <FiLogIn className="w-5 h-5" />
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#4A403A]">
          Login to Notebook
        </h1>
        <p className="text-xs text-[#7A6E65] mt-1">
          Access your personal Node.js learning tasks and goals.
        </p>
      </div>

      {/* Demo Credentials Hint Box */}
      <div className="mb-5 p-3 rounded-lg bg-[#FFF3B0]/40 border border-[#EAD98A] text-xs text-[#4A403A] flex items-start gap-2">
        <FiInfo className="w-4 h-4 text-[#F4A298] flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold">Quick Demo Login:</p>
          <p className="text-[11px] text-[#7A6E65]">
            Email: <code className="bg-white/80 px-1 rounded">student@creativeit.com</code> &bull; Password: <code className="bg-white/80 px-1 rounded">creative123</code> (or create a new account!)
          </p>
        </div>
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#FFFDF9] border border-[#EAE0D5] rounded-xl p-5 sm:p-6 shadow-sm space-y-4"
      >
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-[#4A403A] mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E9289]">
              <FiMail className="w-4 h-4" />
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[#F7EFEA]/40 text-[#4A403A] placeholder-[#9E9289] rounded-lg border border-[#EAE0D5] focus:outline-none focus:ring-2 focus:ring-[#F4A298] focus:bg-white font-mono transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-[#4A403A]">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-[#7A6E65] hover:text-[#4A403A] hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E9289]">
              <FiLock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#F7EFEA]/40 text-[#4A403A] placeholder-[#9E9289] rounded-lg border border-[#EAE0D5] focus:outline-none focus:ring-2 focus:ring-[#F4A298] focus:bg-white font-mono transition-all"
            />
            {/* Show/Hide Password Toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9E9289] hover:text-[#4A403A] transition-colors cursor-pointer"
            >
              {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-2.5 px-4 bg-[#4A403A] hover:bg-[#382F2A] text-[#FFFDF9] text-sm font-semibold rounded-lg shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span>Verifying credentials...</span>
          ) : (
            <>
              <FiLogIn className="w-4 h-4" />
              <span>Log In</span>
            </>
          )}
        </button>
      </form>

      {/* Footer Navigation */}
      <div className="text-center mt-5 text-xs text-[#7A6E65]">
        Don't have an account yet?{' '}
        <Link
          to="/register"
          className="font-semibold text-[#4A403A] underline decoration-[#F4A298] decoration-2 underline-offset-2 hover:text-[#F4A298] transition-colors"
        >
          Register for free
        </Link>
      </div>
    </div>
  );
}
