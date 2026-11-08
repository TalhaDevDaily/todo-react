import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiUserPlus, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../services/api';

/**
 * ==============================================================================
 * REGISTER PAGE (src/pages/RegisterPage.jsx)
 * ==============================================================================
 * Clean registration form with client-side validation, password match verification,
 * and comprehensive // [BACKEND SPOT] documentation on password hashing with bcrypt
 * and Mongoose user creation.
 */
export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation checks
    if (!formData.name.trim()) {
      toast.warning('Please enter your full name! ✍️');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error('Please enter a valid email address!');
      return;
    }

    if (formData.password.length < 6) {
      toast.warning('Password must be at least 6 characters long!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match! Please check again.');
      return;
    }

    setLoading(true);

    try {
      /**
       * ========================================================================
       * // [BACKEND SPOT] - Express User Registration & Password Hashing
       * ========================================================================
       * HTTP Method : POST
       * Endpoint    : /api/auth/register
       * Headers     : Content-Type: application/json
       * Request Body:
       *   {
       *     "name": formData.name.trim(),
       *     "email": formData.email.trim(),
       *     "password": formData.password
       *   }
       * 
       * What happens on your Node.js + Express backend:
       * 1. Route: `app.post('/api/auth/register', authController.register);`
       * 2. Express validation (using express-validator):
       *    check('email').isEmail().normalizeEmail();
       *    check('password').isLength({ min: 6 });
       * 3. Check for existing user in MongoDB:
       *    const userExists = await User.findOne({ email: req.body.email });
       *    if (userExists) {
       *      return res.status(400).json({ message: 'User already exists with this email' });
       *    }
       * 4. Hash password with bcrypt before saving:
       *    const salt = await bcrypt.genSalt(10);
       *    const hashedPassword = await bcrypt.hash(req.body.password, salt);
       * 5. Save new user into MongoDB database:
       *    const newUser = await User.create({
       *      name: req.body.name,
       *      email: req.body.email,
       *      password: hashedPassword
       *    });
       * 6. Send HTTP 201 Created:
       *    res.status(201).json({
       *      success: true,
       *      message: 'User registered successfully',
       *      userId: newUser._id
       *    });
       * ========================================================================
       */
      await api.registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      toast.success('Account created successfully! Please log in 🚀');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-4">
      {/* Header */}
      <div className="text-center mb-6">
        <span className="inline-block p-2.5 rounded-full bg-[#FFE5D9] text-[#4A403A] mb-2 shadow-xs">
          <FiUserPlus className="w-5 h-5" />
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#4A403A]">
          Create New Notebook
        </h1>
        <p className="text-xs text-[#7A6E65] mt-1">
          Join to organize your backend learning journey.
        </p>
      </div>

      {/* Registration Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#FFFDF9] border border-[#EAE0D5] rounded-xl p-5 sm:p-6 shadow-sm space-y-4"
      >
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-[#4A403A] mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E9289]">
              <FiUser className="w-4 h-4" />
            </span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alex Turing"
              className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[#F7EFEA]/40 text-[#4A403A] placeholder-[#9E9289] rounded-lg border border-[#EAE0D5] focus:outline-none focus:ring-2 focus:ring-[#F4A298] focus:bg-white font-mono transition-all"
            />
          </div>
        </div>

        {/* Email */}
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
              placeholder="alex@creativeit.com"
              className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[#F7EFEA]/40 text-[#4A403A] placeholder-[#9E9289] rounded-lg border border-[#EAE0D5] focus:outline-none focus:ring-2 focus:ring-[#F4A298] focus:bg-white font-mono transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-[#4A403A] mb-1.5">
            Password (min 6 characters)
          </label>
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
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9E9289] hover:text-[#4A403A] transition-colors cursor-pointer"
            >
              {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-[#4A403A] mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E9289]">
              <FiCheck className="w-4 h-4" />
            </span>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#F7EFEA]/40 text-[#4A403A] placeholder-[#9E9289] rounded-lg border border-[#EAE0D5] focus:outline-none focus:ring-2 focus:ring-[#F4A298] focus:bg-white font-mono transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9E9289] hover:text-[#4A403A] transition-colors cursor-pointer"
            >
              {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
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
            <span>Creating account...</span>
          ) : (
            <>
              <FiUserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      {/* Footer Navigation */}
      <div className="text-center mt-5 text-xs text-[#7A6E65]">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-[#4A403A] underline decoration-[#F4A298] decoration-2 underline-offset-2 hover:text-[#F4A298] transition-colors"
        >
          Log in here
        </Link>
      </div>
    </div>
  );
}
