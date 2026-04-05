import React, { useState, useRef } from 'react';
import Logo from '../../assets/logo.svg';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import LoginRightColumn from './LoginRightColumn';
import { useAuthActions } from './useAuthActions';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { forgotPassword, resetPassword } = useAuthActions();

  // State to track the reset flow step
  // 'request': User requests a reset code via email
  // 'reset': User enters new password with a reset code
  const [step, setStep] = useState<'request' | 'reset'>('request');
  
  // Request reset step
  const [requestEmail, setRequestEmail] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';
  
  // Reset password step
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Status messages
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
      // Backend always returns 202 to prevent user enumeration
      await forgotPassword(requestEmail, recaptchaToken);

      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
      setSuccessMessage("If an account exists for that email, a reset link/code has been sent.");
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
      setTimeout(() => navigate("/", { state: { mode: "login" } }), 1000);
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
    navigate('/');
  };

  return (
    <>
      {/* Loading animation spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .spinner {
            animation: spin 2s linear infinite;
          }
        `}
      </style>

      {/* Loading Animation Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="spinner border-8 border-gray-300 border-t-gray-900 rounded-full w-20 h-20"></div>
        </div>
      )}

      <div className="flex flex-row min-h-screen">
        {/* LEFT COLUMN */}
        <div className="relative flex-1 bg-white flex items-center justify-center p-16 md:w-full">
          <div
            style={styles.logoStyle}
            role="img"
            aria-label="Orion logo"
          />

          <div className="max-w-[480px] w-full">
            {/* Back button */}
            <button
              onClick={handleBackToLogin}
              className="bg-transparent border-none text-blue-600 underline text-sm cursor-pointer font-sans p-0 font-normal hover:text-blue-800 mb-6"
            >
              ← Back to Login
            </button>

            {/* Title */}
            <h1 className="mb-4 text-[2.2rem] font-normal text-gray-900 text-center font-sans">
              {step === 'request' ? 'Reset Password' : 'Create New Password'}
            </h1>

            {/* Subtitle */}
            <p className="mb-8 text-base text-gray-600 text-center font-normal font-sans">
              {step === 'request'
                ? 'Enter your email address and we\'ll send you a code to reset your password.'
                : 'Enter the code we sent to your email and create a new password.'}
            </p>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded text-green-700 text-sm font-sans">
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm font-sans">
                {errorMessage}
              </div>
            )}

            {/* STEP 1: Request Reset */}
            {step === 'request' && (
              <div>
                <div className="text-left mb-6">
                  <label className="block mb-2 text-gray-900 text-base font-medium font-sans">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={requestEmail}
                    onChange={(e) => setRequestEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded border border-gray-300 text-base font-sans text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-center mt-4 mb-2">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={siteKey}
                    onChange={(token) => setRecaptchaToken(token)}
                  />
                </div>

                <button
                  className="bg-gray-900 text-white py-3 px-6 w-full border-none rounded-full cursor-pointer text-base font-sans font-medium my-8 transition-colors duration-200 hover:bg-gray-700"
                  onClick={handleRequestReset}
                  disabled={isLoading}
                >
                  SEND RESET CODE
                </button>
              </div>
            )}

            {/* STEP 2: Reset Password */}
            {step === 'reset' && (
              <div>
                <div className="text-left mb-6">
                  <label className="block mb-2 text-gray-900 text-base font-medium font-sans">
                    Reset Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the code from your email"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    className="w-full px-4 py-3 rounded border border-gray-300 text-base font-sans text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </div>

                <div className="text-left mb-6">
                  <label className="block mb-2 text-gray-900 text-base font-medium font-sans">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded border border-gray-300 text-base font-sans text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </div>

                <div className="text-left mb-6">
                  <label className="block mb-2 text-gray-900 text-base font-medium font-sans">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded border border-gray-300 text-base font-sans text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </div>

                <button
                  className="bg-gray-900 text-white py-3 px-6 w-full border-none rounded-full cursor-pointer text-base font-sans font-medium my-8 transition-colors duration-200 hover:bg-gray-700"
                  onClick={handleResetPassword}
                  disabled={isLoading}
                >
                  RESET PASSWORD
                </button>

                <button
                  onClick={() => {
                    setStep('request');
                    setResetCode("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setErrorMessage("");
                  }}
                  className="bg-transparent border-none text-blue-600 underline text-sm cursor-pointer font-sans p-0 font-normal hover:text-blue-800 w-full text-center"
                >
                  Didn't receive a code? Request another
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (hidden for medium screens and below ~768px) */}
        <LoginRightColumn />
      </div>
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  logoStyle: {
    position: 'absolute',
    top: '15px',
    left: '15px',
    height: '19px',
    width: '70px',
    minHeight: '19px',
    minWidth: '70px',
    zIndex: 1000,
    backgroundColor: '#1a1a1a',
    mask: `url(${Logo}) no-repeat center`,
    maskSize: 'contain',
    WebkitMask: `url(${Logo}) no-repeat center`,
    WebkitMaskSize: 'contain',
  },
};

export default ResetPassword;
