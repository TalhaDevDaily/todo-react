import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiSend, FiArrowLeft, FiCheckCircle, FiHelpCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../services/api';

/**
 * ==============================================================================
 * FORGOT PASSWORD PAGE (src/pages/ForgotPasswordPage.jsx)
 * ==============================================================================
 * Handles the password recovery request flow.
 * Features:
 * - Email validation
 * - Dynamic confirmation state with cozy mail envelope visual
 * - Detailed // [BACKEND SPOT] instructions for crypto.randomBytes and nodemailer
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.warning('Please enter your email address! ✉️');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Please enter a valid email address!');
      return;
    }

    setLoading(true);

    try {
      /**
       * ========================================================================
       * // [BACKEND SPOT] - Forgot Password & Nodemailer Email Delivery
       * ========================================================================
       * HTTP Method : POST
       * Endpoint    : /api/auth/forgot-password
       * Headers     : Content-Type: application/json
       * Request Body: { "email": email.trim() }
       * 
       * What happens on your Node.js + Express backend:
       * 1. Route: `app.post('/api/auth/forgot-password', authController.forgotPassword);`
       * 2. Find user by email:
       *    const user = await User.findOne({ email: req.body.email });
       *    if (!user) return res.status(404).json({ message: 'No account found with this email' });
       * 3. Generate a cryptographically secure random token:
       *    const crypto = require('crypto');
       *    const resetToken = crypto.randomBytes(32).toString('hex');
       * 4. Hash and store token on user document with expiration (e.g., 10 minutes):
       *    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
       *    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
       *    await user.save({ validateBeforeSave: false });
       * 5. Send email with reset URL using Nodemailer:
       *    const transporter = nodemailer.createTransport({ ...smtpConfig });
       *    const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
       *    await transporter.sendMail({
       *      to: user.email,
       *      subject: 'Password Reset Request',
       *      text: `Reset your password at: ${resetURL}`
       *    });
       * 6. Return response:
       *    res.status(200).json({ message: 'Password reset link sent to email' });
       * ========================================================================
       */
      await api.forgotPassword({ email: email.trim() });

      setIsSubmitted(true);
      toast.info(`Password reset link sent to ${email} ✉️`);
    } catch (err) {
      toast.error(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-4">
      {/* Header */}
      <div className="text-center mb-6">
        <span className="inline-block p-2.5 rounded-full bg-[#E8DFF5] text-[#4A403A] mb-2 shadow-xs">
          <FiHelpCircle className="w-5 h-5" />
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#4A403A]">
          Recover Password
        </h1>
        <p className="text-xs text-[#7A6E65] mt-1">
          We'll send recovery instructions straight to your email inbox.
        </p>
      </div>

      {isSubmitted ? (
        /* Confirmation State */
        <div className="bg-[#FFFDF9] border border-[#EAE0D5] rounded-xl p-6 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#D8E2DC] text-[#4A403A] flex items-center justify-center">
            <FiCheckCircle className="w-6 h-6 text-[#84A98C]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#4A403A]">
              Check Your Inbox!
            </h2>
            <p className="text-xs text-[#7A6E65] mt-1.5 leading-relaxed">
              We have generated a mock password reset link and dispatched it to:
              <br />
              <strong className="text-[#4A403A] bg-[#FFF3B0]/60 px-2 py-0.5 rounded mt-1 inline-block">
                {email}
              </strong>
            </p>
          </div>

          <div className="p-3 bg-[#F7EFEA] rounded-lg text-left text-[11px] text-[#7A6E65] border border-[#EAE0D5]">
            <p className="font-semibold text-[#4A403A] mb-1">
              💡 Backend Learning Note:
            </p>
            <p>
              In a production Node.js server, the email would contain a temporary token URL (e.g., <code className="bg-white px-1">/reset-password/:token</code>) valid for 10 minutes.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-xs text-[#7A6E65] hover:text-[#4A403A] underline transition-colors cursor-pointer"
            >
              Need to send to a different email?
            </button>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 py-2 px-4 bg-[#4A403A] text-white text-xs font-semibold rounded-lg hover:bg-[#382F2A] transition-colors"
            >
              <FiArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Form State */
        <form
          onSubmit={handleSubmit}
          className="bg-[#FFFDF9] border border-[#EAE0D5] rounded-xl p-5 sm:p-6 shadow-sm space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-[#4A403A] mb-1.5">
              Your Registered Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E9289]">
                <FiMail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@creativeit.com"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[#F7EFEA]/40 text-[#4A403A] placeholder-[#9E9289] rounded-lg border border-[#EAE0D5] focus:outline-none focus:ring-2 focus:ring-[#F4A298] focus:bg-white font-mono transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-[#4A403A] hover:bg-[#382F2A] text-[#FFFDF9] text-sm font-semibold rounded-lg shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Sending reset link...</span>
            ) : (
              <>
                <FiSend className="w-4 h-4" />
                <span>Send Reset Link</span>
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-[#7A6E65] hover:text-[#4A403A] transition-colors"
            >
              <FiArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Login</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
