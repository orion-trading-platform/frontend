import React, { useState, useRef } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import LoginGraphic from '../../assets/login-graphic.svg';
import Logo from '../../assets/logo.svg';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  // State to track if user is signing up (true) or logging in (false)
  const [isSignUpMode, setIsSignUpMode] = useState(true);
  
  // Local state for manual sign-up fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Loading state for the login process
  const [isLoading, setIsLoading] = useState(false);
  
  // reCAPTCHA token
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  
  const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '';

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        // Fetch user info from Google
        const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        const userData = res.data;
        const userEmail = userData.email || '';
        localStorage.setItem('loggedInUserEmail', userEmail);
        
        // Send user info to the backend
        const backendResponse = await axios.post(
          `${backendUrl}/append_user_id`,
          {
            user_id: userEmail,
            name: userData.name,
            picture: userData.picture,
          },
          {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
          }
        );
        // const redirectTo = backendResponse.data.redirect_to;
        
        // if (userEmail.toLowerCase() === import.meta.env.DEV_LOGIN_EMAIL) {
        //   navigate('/admin');
        // } else if (redirectTo === 'dashboard') {
        //   navigate('/dashboard');
        // } else {
        //   ... // onboarding?
        // }
      } catch (err) {
        console.error('Error during login:', err);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error('Login failed:', errorResponse);
    },
  });
  
  const handleManualSignupOrLogin = () => {
    if (isSignUpMode) {
      console.log("Manual signup with:", { email, password });
      alert("Manual signup is not yet implemented.");
    } else {
      console.log("Manual login with:", { email, password });
      alert("Manual login is not yet implemented.");
    }
  };

  const handleForgotPassword = () => {
    navigate('/reset-password');
  };

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    // Clear form fields when switching modes
    setEmail("");
    setPassword("");
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

      <div className="flex flex-row h-screen">
        {/* LEFT COLUMN */}
        <div className="relative flex-1 bg-white flex items-center justify-center p-16 md:w-full">
          <div
            style={styles.logoStyle}
            role="img"
            aria-label="SiteName logo"
          />
          
          <div className="max-w-[480px] w-full">
            {/* Welcome/Login Title */}
            <h1 className="mb-12 text-[2.2rem] font-normal text-gray-900 text-center font-sans">
              {isSignUpMode ? 'Log in to SiteName' : 'Welcome back!'}
            </h1>

            {/* Sign up/Continue with Google */}
            <button
              className="select-none appearance-none bg-[#F2F2F2] border-none rounded box-border text-[#1F1F1F] cursor-pointer font-['Roboto',arial,sans-serif] text-sm h-10 tracking-[0.25px] outline-none overflow-hidden px-3 relative text-center align-middle whitespace-nowrap w-[280px] max-w-[280px] min-w-min mx-auto block transition-[background-color_.218s,border-color_.218s,box-shadow_.218s] hover:bg-[#DFE1E3]"
              onClick={() => login()}
            >
              <div className="flex items-center justify-center h-full">
                <div className="h-5 mr-3 w-5">
                  <svg 
                    version="1.1" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 48 48" 
                    className="block h-full w-full"
                  >
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span className="font-medium flex-grow font-['Roboto',arial,sans-serif] text-sm">
                  {isSignUpMode ? 'Sign up with Google' : 'Continue with Google'}
                </span>
              </div>
            </button>

            {/* Divider */}
            <div className="flex items-center my-8 mt-[3.4rem] mb-[3.4rem] w-full">
              <div className="flex-1 h-px bg-gray-300 -mx-4" />
              <span className="mx-4 text-gray-500 text-xs whitespace-nowrap bg-white px-2 relative z-[1]">
                OR
              </span>
              <div className="flex-1 h-px bg-gray-300 -mx-4" />
            </div>

            {/* Manual signup/login fields */}
            <div className="text-left mb-6">
              <label className="block mb-2 text-gray-900 text-base font-medium font-sans">
                Email
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded border border-gray-300 text-base font-sans text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>

            <div className="text-left mb-6">
              <label className="block mb-2 text-gray-900 text-base font-medium font-sans">
                Password
              </label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded border border-gray-300 text-base font-sans text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>

            {/* Terms text for sign up mode, Forgot password for login mode */}
            {isSignUpMode ? (
              <p className="text-sm text-gray-600 leading-relaxed text-left">
                By clicking SIGN UP, you acknowledge that you have read and agree to SITENAME's{' '}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline font-normal hover:text-blue-800"
                >
                  Terms of Use
                </a>{' '}
                and{' '}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline font-normal hover:text-blue-800"
                >
                  Privacy Policy
                </a>.
              </p>
            ) : (
              <div className="text-left mb-2">
                <button
                  onClick={handleForgotPassword}
                  className="bg-transparent border-none text-blue-600 underline text-sm cursor-pointer font-sans p-0 font-normal hover:text-blue-800"
                >
                  Forgot my password
                </button>
              </div>
            )}

            {/* reCAPTCHA */}
            <div className="flex justify-center mt-4">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={siteKey}
                onChange={(token) => setRecaptchaToken(token)}
              />
            </div>

            {/* Sign Up/Log In Button */}
            <button
              className="bg-gray-900 text-white py-3 px-6 w-full border-none rounded-full cursor-pointer text-base font-sans font-medium my-6 transition-colors duration-200 hover:bg-gray-700"
              onClick={handleManualSignupOrLogin}
            >
              {isSignUpMode ? 'SIGN UP' : 'LOG IN'}
            </button>

            {/* Toggle between sign up and log in */}
            <p className="mt-0 text-base text-gray-600 text-center font-normal">
              {isSignUpMode ? (
                <>
                  Already have an account?{' '}
                  <button 
                    onClick={toggleMode}
                    className="bg-transparent border-none text-blue-600 no-underline text-base cursor-pointer font-sans p-0 font-normal hover:underline"
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button 
                    onClick={toggleMode}
                    className="bg-transparent border-none text-blue-600 no-underline text-base cursor-pointer font-sans p-0 font-normal hover:underline"
                  >
                    Sign up
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
        
        {/* RIGHT COLUMN (hidden for medium screens and below ~768px) */}
        <div className="hidden md:flex md:flex-1 bg-[#1a1a1a] items-center justify-center text-white p-16"> 
          <img
            src={LoginGraphic}
            alt="TODO LoginGraphic alttext"
            className="text-center max-w-[480px]"
          />
        </div>
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

export default Login;