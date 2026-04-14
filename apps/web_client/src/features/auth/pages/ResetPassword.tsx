import React, { useState, useRef } from 'react';
import Logo from '@/assets/logo-white.svg';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import LoginRightColumn from './LoginRightColumn';
import { useAuthActions } from '../useAuthActions';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { forgotPassword, resetPassword } = useAuthActions();

  const [step, setStep] = useState<'request' | 'reset'>('request');

  const [requestEmail, setRequestEmail] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRequestReset = async () => {
    if (!requestEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    if (!recaptchaToken) {
      setErrorMessage("Please complete the reCAPTCHA.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await forgotPassword(requestEmail, recaptchaToken);
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
      setSuccessMessage("If an account exists for that email, a reset code has been sent.");
      setTimeout(() => {
        setStep("reset");
        setSuccessMessage("");
      }, 1200);
    } catch (err) {
      console.error("Error requesting password reset:", err);
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
      setErrorMessage("Failed to request password reset. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetCode || !newPassword || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await resetPassword(resetCode, newPassword);
      setSuccessMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login", { state: { mode: "login" } }), 1000);
    } catch (err: any) {
      console.error("Error resetting password:", err);
      const status = err?.response?.status;
      if (status === 400) {
        setErrorMessage("Invalid or expired reset token. Please request a new reset.");
      } else {
        setErrorMessage("Failed to reset password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login', { state: { mode: 'login' } });
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner { animation: spin 2s linear infinite; }

        @keyframes blobFloat1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(40px, -70px) scale(1.1); }
          66%  { transform: translate(-25px, 35px) scale(0.93); }
        }
        @keyframes blobFloat2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          40%  { transform: translate(-55px, 45px) scale(0.9); }
          70%  { transform: translate(35px, -45px) scale(1.08); }
        }
        .blob1 { animation: blobFloat1 20s ease-in-out infinite; will-change: transform; }
        .blob2 { animation: blobFloat2 25s ease-in-out infinite; will-change: transform; }
      `}</style>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
          <div className="spinner border-[3px] border-white/20 border-t-white rounded-full w-10 h-10" />
        </div>
      )}

      <div className="flex flex-row min-h-screen bg-[#0a0a14]">

        {/* LEFT COLUMN */}
        <main className="relative flex-1 bg-[#0a0a14] overflow-hidden flex items-center justify-center px-10 py-16">

          {/* Background blobs */}
          <div aria-hidden="true" className="blob1 absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none" />
          <div aria-hidden="true" className="blob2 absolute -bottom-16 -right-16 w-[440px] h-[440px] rounded-full bg-emerald-500/15 blur-[110px] pointer-events-none" />

          {/* Logo */}
          <div className="absolute top-6 left-7">
            <img src={Logo} alt="Orion" className="h-[18px] w-auto" />
          </div>

          {/* Form */}
          <div className="relative z-10 w-full max-w-[380px]">

            {/* Back link */}
            <button
              onClick={handleBackToLogin}
              className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors mb-8 font-sans"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to login
            </button>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-[1.75rem] font-bold text-white leading-tight mb-2 font-sans">
                {step === 'request' ? 'Reset your password' : 'Create new password'}
              </h1>
              <p className="text-sm text-white/70 font-sans">
                {step === 'request'
                  ? "Enter your email and we'll send you a reset code."
                  : 'Enter the code from your email and choose a new password.'}
              </p>
            </div>

            {/* Messages */}
            {successMessage && (
              <div className="mb-5 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-sans">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm font-sans">
                {errorMessage}
              </div>
            )}

            {/* STEP 1: Request reset */}
            {step === 'request' && (
              <>
                <div className="mb-5">
                  <label className="block text-[11px] font-medium uppercase tracking-widest text-white/60 mb-2 font-sans">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={requestEmail}
                    onChange={(e) => setRequestEmail(e.target.value)}
                    className="w-full h-11 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 px-4 focus:outline-none focus:border-white/25 focus:bg-white/10 transition-colors font-sans"
                  />
                </div>

                <div className="flex justify-center mb-5">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={siteKey}
                    theme="dark"
                    onChange={(token) => setRecaptchaToken(token)}
                  />
                </div>

                <button
                  onClick={handleRequestReset}
                  disabled={isLoading}
                  className="w-full h-11 rounded-lg bg-[#5B6AD4] hover:bg-[#4e5cbd] active:bg-[#434fb3] text-white text-sm font-semibold transition-colors font-sans"
                >
                  Send reset code
                </button>
              </>
            )}

            {/* STEP 2: Enter code + new password */}
            {step === 'reset' && (
              <>
                <div className="mb-4">
                  <label className="block text-[11px] font-medium uppercase tracking-widest text-white/60 mb-2 font-sans">
                    Reset Code
                  </label>
                  <input
                    type="text"
                    placeholder="Code from your email"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    className="w-full h-11 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 px-4 focus:outline-none focus:border-white/25 focus:bg-white/10 transition-colors font-sans tracking-widest"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-[11px] font-medium uppercase tracking-widest text-white/60 mb-2 font-sans">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-11 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 px-4 focus:outline-none focus:border-white/25 focus:bg-white/10 transition-colors font-sans"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-[11px] font-medium uppercase tracking-widest text-white/60 mb-2 font-sans">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-11 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 px-4 focus:outline-none focus:border-white/25 focus:bg-white/10 transition-colors font-sans"
                  />
                </div>

                <button
                  onClick={handleResetPassword}
                  disabled={isLoading}
                  className="w-full h-11 rounded-lg bg-[#5B6AD4] hover:bg-[#4e5cbd] active:bg-[#434fb3] text-white text-sm font-semibold transition-colors mb-4 font-sans"
                >
                  Reset password
                </button>

                <button
                  onClick={() => {
                    setStep('request');
                    setResetCode("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setErrorMessage("");
                  }}
                  className="w-full text-center text-xs text-white/60 hover:text-white transition-colors font-sans"
                >
                  Didn't receive a code? Request another
                </button>
              </>
            )}

          </div>
        </main>

        {/* RIGHT COLUMN */}
        <LoginRightColumn />
      </div>
    </>
  );
};

export default ResetPassword;
