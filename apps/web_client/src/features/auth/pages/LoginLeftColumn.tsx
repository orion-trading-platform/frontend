import React, { useState, useRef } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuthActions } from '../useAuthActions';
import { Spinner } from 'ui-kit';

const LoginLeftColumn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin, register: authRegister, loginWithGoogle } = useAuthActions();

  const sessionExpired = (location.state as { reason?: string } | null)?.reason === 'session_expired';

  const [isSignUpMode, setIsSignUpMode] = useState(() => {
    const stateMode = (location.state as { mode?: string } | null)?.mode;
    if (stateMode === 'login') return false;
    if (localStorage.getItem('orion_returning_user')) return false;
    return true;
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        await loginWithGoogle(tokenResponse.access_token);
        localStorage.setItem('orion_returning_user', '1');
        setSuccessMessage("Logged in with Google. Redirecting...");
        setTimeout(() => navigate('/dashboard'), 600);
      } catch (err) {
        console.error('Error during Google login:', err);
        setErrorMessage("Google login failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error('Login failed:', errorResponse);
    },
  });

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email) {
      setErrorMessage("Please enter your email.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }
    if (isSignUpMode && password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }
    if (isSignUpMode && password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (!recaptchaToken) {
      setErrorMessage("Please complete the reCAPTCHA.");
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUpMode) {
        await authRegister(email, password, recaptchaToken);
        setSuccessMessage("Account created! Please sign in.");
        setIsSignUpMode(false);
        setPassword("");
        setConfirmPassword("");
        recaptchaRef.current?.reset();
        setRecaptchaToken(null);
        return;
      }
      await authLogin(email, password, recaptchaToken);
      localStorage.setItem('orion_returning_user', '1');
      setSuccessMessage("Logged in. Redirecting...");
      setTimeout(() => navigate("/dashboard"), 600);
    } catch (err: any) {
      const status = err?.response?.status;
      if (isSignUpMode) {
        if (status === 409) setErrorMessage("Email already registered. Please log in.");
        else setErrorMessage("Failed to create account. Please try again.");
      } else {
        if (status === 401) setErrorMessage("Incorrect email or password.");
        else setErrorMessage("Login failed. Please try again.");
      }
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <>
      <style>{`
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

      {isLoading && <Spinner overlay />}

      <main className="relative flex-1 bg-[#0a0a14] overflow-hidden flex items-center justify-center px-10 py-16">

        {/* BG BLOBS */}
        <div aria-hidden="true" className="blob1 absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none" />
        <div aria-hidden="true" className="blob2 absolute -bottom-16 -right-16 w-[440px] h-[440px] rounded-full bg-emerald-500/15 blur-[110px] pointer-events-none" />

        {/* FORM */}
        <div className="relative z-10 w-full max-w-[380px]">

          {/* HEADING */}
          <div className="mb-8">
            <h1 className="text-[1.75rem] font-bold text-white leading-tight mb-2">
              {isSignUpMode ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-sm text-white/50">
              {isSignUpMode ? 'Sign up to start trading on Orion' : 'Sign in to your trading account'}
            </p>
          </div>

          {/* GOOGLE SSO */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 h-11 rounded-lg border border-[#8E918F] bg-[#131314] text-[#E3E3E3] text-sm font-medium transition-colors hover:bg-[#1e1f20] active:bg-[#2a2b2c]"
            onClick={() => googleLogin()}
          >
            <svg aria-hidden="true" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 flex-shrink-0">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            {isSignUpMode ? 'Sign up with Google' : 'Continue with Google'}
          </button>

          {/* OR DIVIDER */}
          <div className="flex items-center gap-3 my-6" aria-hidden="true">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/55 tracking-widest uppercase">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* SESSION EXPIRED / SUCCESS / ERROR */}
          {sessionExpired && (
            <div role="alert" className="mb-5 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
              Your session expired. Please sign in again.
            </div>
          )}
          {successMessage && (
            <div role="alert" className="mb-5 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div role="alert" className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              {errorMessage}
            </div>
          )}

          {/* FIELDS */}
          <form onSubmit={handleSubmit} noValidate>

            <div className="mb-4">
              <label htmlFor="email" className="block text-[11px] font-medium uppercase tracking-widest text-white/60 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 px-4 focus:outline-none focus:border-white/25 focus:bg-white/10 transition-colors"
              />
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-[11px] font-medium uppercase tracking-widest text-white/60">
                  Password
                </label>
                {!isSignUpMode && (
                  <Link
                    to="/reset-password"
                    className="text-xs text-[#818cf8] hover:text-white transition-colors"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignUpMode ? "new-password" : "current-password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 px-4 pr-14 focus:outline-none focus:border-white/25 focus:bg-white/10 transition-colors"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                </button>
              </div>
            </div>

            {isSignUpMode && (
              <div className="mb-5">
                <label htmlFor="confirm-password" className="block text-[11px] font-medium uppercase tracking-widest text-white/60 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-11 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 px-4 pr-14 focus:outline-none focus:border-white/25 focus:bg-white/10 transition-colors"
                  />
                  <button
                    type="button"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showConfirmPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {/* AUXILIARY LINKS */}
            {isSignUpMode && (
              <p className="text-xs text-white/60 leading-relaxed mb-5">
                By clicking CREATE ACCOUNT, you agree to Orion's{' '}
                <a href="/#/terms" target="_blank" rel="noopener noreferrer" className="text-white/55 hover:text-white underline transition-colors">
                  Terms of Use
                </a>{' '}and{' '}
                <a href="/#/privacy" target="_blank" rel="noopener noreferrer" className="text-white/55 hover:text-white underline transition-colors">
                  Privacy Policy
                </a>.
              </p>
            )}

            {/* reCAPTCHA */}
            <div className="flex justify-center mb-5">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={siteKey}
                theme="dark"
                onChange={(token) => setRecaptchaToken(token)}
              />
            </div>

            {/* SUBMIT BTN */}
            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-[#5B6AD4] hover:bg-[#4e5cbd] active:bg-[#434fb3] text-white text-sm font-semibold transition-colors mb-6"
            >
              {isSignUpMode ? 'Create account' : 'Log in to Orion'}
            </button>

          </form>

          {/* STATE TOGGLE */}
          <p className="text-sm text-white/60 text-center">
            {isSignUpMode ? (
              <>
                Already have an account?{' '}
                <button type="button" onClick={toggleMode} className="text-[#818cf8] hover:text-white transition-colors font-medium">
                  Log in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button type="button" onClick={toggleMode} className="text-[#818cf8] hover:text-white transition-colors font-medium">
                  Sign up
                </button>
              </>
            )}
          </p>

          <div className="mt-5">
            <Link to="/" className="text-xs text-white/35 hover:text-white/60 transition-colors">
              ← Return to home
            </Link>
          </div>

        </div>
      </main>
    </>
  );
};

export default LoginLeftColumn;
