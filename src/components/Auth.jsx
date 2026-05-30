import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, X, ShieldAlert, Sparkles } from 'lucide-react';
import transformImg from '../assets/fitness_transformation.png';

export default function Auth({ onLoginSuccess, initialMode = 'login', onBackToLanding }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  
  // Slide state for left inspirational column
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    {
      title: "Track. Lift. Transform.",
      desc: "All-in-one nutrition tracker, workout logger, and AI health coach to help you reach peak performance."
    },
    {
      title: "Effortless Calorie Tracking",
      desc: "Search over 10M foods or take a photo of your plate. We'll handle the macros and calculations."
    },
    {
      title: "Unlock Your Dream Body",
      desc: "Design customizable workout splits, track weights, sets, reps, and monitor active training streaks."
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Google Sign-In Simulation State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  // Form validation helper
  const isFormValid = email.trim().length > 0 && password.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setLoadingText(isLogin ? "Signing in..." : "Creating account...");

    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: isLogin 
          ? (email.includes('kavya') ? 'Kavya Singhal' : email.split('@')[0]) 
          : (name.trim() ? name : email.split('@')[0]),
        email: email,
        avatar: isLogin 
          ? 'KS' 
          : (name.trim() ? name.slice(0, 2).toUpperCase() : email.slice(0, 2).toUpperCase())
      });
    }, 1500);
  };

  const handleGoogleLogin = (selectedEmail, selectedName) => {
    setIsGoogleModalOpen(false);
    setIsLoading(true);
    setLoadingText("Connecting with Google...");

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: selectedName,
        email: selectedEmail,
        avatar: selectedName.split(' ').map(n => n[0]).join('').toUpperCase()
      });
    }, 1500);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#090e14',
      fontFamily: 'var(--font-sans)',
      color: '#ffffff',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 2000,
      overflow: 'hidden'
    }}>
      
      {/* LEFT COLUMN: Split Screen Image & Slideshow (Realnest Structure) */}
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem',
        backgroundImage: `url(${transformImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden'
      }} className="auth-left-panel">
        
        {/* Overlay to darken image & match theme */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to right, rgba(9, 14, 20, 0.4) 0%, rgba(9, 14, 20, 0.8) 100%)',
          zIndex: 1
        }}></div>

        {/* Top Header/Logo */}
        <div 
          onClick={onBackToLanding}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            cursor: 'pointer', 
            position: 'relative', 
            zIndex: 2,
            width: 'fit-content'
          }}
        >
          <span style={{ 
            fontFamily: 'var(--font-heading)', 
            fontWeight: 900, 
            fontSize: '1.5rem', 
            letterSpacing: '-0.04em',
            color: '#ffffff'
          }}>
            FIT<span style={{ color: '#88ef3c' }}>SYNC</span>
          </span>
        </div>

        {/* Slideshow Content block */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '520px', textAlign: 'left' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 800, 
            lineHeight: 1.15, 
            marginBottom: '1rem',
            letterSpacing: '-0.03em',
            transition: 'all 0.5s ease'
          }}>
            {slides[activeSlide].title}
          </h2>
          <p style={{ 
            fontSize: '1.05rem', 
            color: '#a0aec0', 
            lineHeight: 1.5,
            marginBottom: '2rem'
          }}>
            {slides[activeSlide].desc}
          </p>

          {/* Dots Indicator */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                style={{
                  width: activeSlide === idx ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '999px',
                  background: activeSlide === idx ? '#88ef3c' : 'rgba(255, 255, 255, 0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div style={{ position: 'relative', zIndex: 2, fontSize: '0.8rem', color: '#718096', textAlign: 'left' }}>
          © {new Date().getFullYear()} FitSync. All rights reserved.
        </div>
      </div>

      {/* RIGHT COLUMN: FITSYNC Dark Neon Sign-In Form */}
      <div style={{
        width: '540px',
        background: '#090e14',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem',
        position: 'relative',
        zIndex: 2,
        flexShrink: 0
      }} className="auth-right-panel">
        
        {/* Toggle sign in / sign up pill at top right corner */}
        <div style={{
          position: 'absolute',
          top: '3rem',
          right: '4rem'
        }}>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setEmail('');
              setPassword('');
              setName('');
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.5rem 1.25rem',
              borderRadius: '999px',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
            onMouseOver={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = '#88ef3c'; }}
            onMouseOut={e => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>

        {/* Form Container */}
        <div style={{ maxWidth: '380px', width: '100%', margin: '0 auto', textAlign: 'left' }}>
          {/* Logo block above heading */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span style={{ 
              fontFamily: 'var(--font-heading)', 
              fontWeight: 900, 
              fontSize: '1.75rem', 
              letterSpacing: '-0.04em',
              color: '#ffffff'
            }}>
              FIT<span style={{ color: '#88ef3c' }}>SYNC</span>
            </span>
          </div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 800, 
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            {isLogin ? "Log In" : "Create Account"}
          </h1>
          <p style={{ 
            fontSize: '0.85rem', 
            color: '#718096', 
            marginBottom: '2.5rem',
            lineHeight: 1.4
          }}>
            {isLogin 
              ? "To log in, please enter your email address and confirm your password." 
              : "Register below to track nutrition, log lifting splits, and access your AI coach."
            }
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Name field (Sign up only) */}
            {!isLogin && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0' }}>Full Name</label>
                <input
                  type="text"
                  placeholder="Kavya Singhal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    background: '#161d28',
                    border: '1px solid rgba(255,255,255,0.05)',
                    padding: '0.85rem 1.1rem',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    color: '#ffffff',
                    width: '100%'
                  }}
                  required
                />
              </div>
            )}

            {/* Email Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0' }}>Email address</label>
              <input
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: '#161d28',
                  border: '1px solid rgba(255,255,255,0.05)',
                  padding: '0.85rem 1.1rem',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  color: '#ffffff',
                  width: '100%'
                }}
                required
              />
            </div>

            {/* Password Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    background: '#161d28',
                    border: '1px solid rgba(255,255,255,0.05)',
                    padding: '0.85rem 1.1rem',
                    paddingRight: '3rem',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    color: '#ffffff',
                    width: '100%'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#718096',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.8rem',
              marginTop: '0.25rem'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <div 
                  onClick={() => setKeepLoggedIn(!keepLoggedIn)}
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: '1.5px solid',
                    borderColor: keepLoggedIn ? '#88ef3c' : '#4a5568',
                    background: keepLoggedIn ? '#88ef3c' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {keepLoggedIn && <Check size={12} color="#090e14" strokeWidth={3} />}
                </div>
                <span style={{ color: '#a0aec0' }}>Keep me logged in</span>
              </label>
              <a 
                href="#forgot" 
                onClick={(e) => { e.preventDefault(); alert("Verification link sent to your email!"); }}
                style={{ color: '#88ef3c', textDecoration: 'none', fontWeight: 600 }}
              >
                Forgot Password?
              </a>
            </div>

            {/* Login / Signup Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              style={{
                width: '100%',
                padding: '0.9rem',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: isFormValid ? 'pointer' : 'not-allowed',
                background: isFormValid ? '#88ef3c' : '#1a2230',
                color: isFormValid ? '#090e14' : '#718096',
                marginTop: '1rem',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: isFormValid ? '0 4px 15px rgba(136, 239, 60, 0.2)' : 'none'
              }}
            >
              {isLoading ? (
                <>
                  <div className="auth-spinner" /> {loadingText}
                </>
              ) : (
                isLogin ? "Log in" : "Create Account"
              )}
            </button>
          </form>

          {/* Social login divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '2rem 0',
            color: '#4a5568',
            fontSize: '0.8rem',
            textTransform: 'lowercase'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }}></div>
            <span style={{ padding: '0 1rem' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }}></div>
          </div>

          {/* Social Login buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            
            {/* Google */}
            <button
              onClick={() => setIsGoogleModalOpen(true)}
              style={{
                background: '#161d28',
                border: '1px solid rgba(255,255,255,0.05)',
                padding: '0.8rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
            >
              {/* Google G Logo in SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.478 0-6.3-2.822-6.3-6.3 0-3.478 2.822-6.3 6.3-6.3 1.506 0 2.887.533 3.978 1.429l3.072-3.072C19.043 2.502 15.827 1.5 12.24 1.5c-5.799 0-10.5 4.701-10.5 10.5s4.701 10.5 10.5 10.5c5.776 0 10.5-4.485 10.5-10.285 0-.583-.053-1.14-.148-1.63H12.24z" />
              </svg>
            </button>

            {/* Apple */}
            <button
              onClick={() => alert("Apple Sign-In is simulated: please use Google Sign-In.")}
              style={{
                background: '#161d28',
                border: '1px solid rgba(255,255,255,0.05)',
                padding: '0.8rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-1.01 2.96 1.07.08 2.18-.54 2.84-1.35z"/>
              </svg>
            </button>

            {/* Facebook */}
            <button
              onClick={() => alert("Facebook Sign-In is simulated: please use Google Sign-In.")}
              style={{
                background: '#161d28',
                border: '1px solid rgba(255,255,255,0.05)',
                padding: '0.8rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#3b5998">
                <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h3V1h-4c-3.3 0-6 2.7-6 6v1z" />
              </svg>
            </button>

          </div>

          {/* Footer toggle text */}
          <div style={{
            marginTop: '2.5rem',
            textAlign: 'center',
            fontSize: '0.85rem',
            color: '#718096'
          }}>
            {isLogin ? "Don't you have an account? " : "Already have an account? "}
            <span
              onClick={() => {
                setIsLogin(!isLogin);
                setEmail('');
                setPassword('');
                setName('');
              }}
              style={{
                color: '#88ef3c',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </span>
          </div>

        </div>

      </div>

      {/* MOCK GOOGLE AUTHENTICATION DIALOG (Popup selector) */}
      {isGoogleModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000
        }}>
          <div className="glass-panel" style={{
            width: '380px',
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
            padding: '2rem',
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}>
            {/* Close button */}
            <button
              onClick={() => setIsGoogleModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'transparent',
                border: 'none',
                color: '#a0aec0',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            {/* Google logo & header */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.2rem', marginBottom: '0.5rem' }}>
                <span style={{ color: '#4285F4', fontWeight: 900, fontSize: '1.4rem' }}>G</span>
                <span style={{ color: '#EA4335', fontWeight: 900, fontSize: '1.4rem' }}>o</span>
                <span style={{ color: '#FBBC05', fontWeight: 900, fontSize: '1.4rem' }}>o</span>
                <span style={{ color: '#4285F4', fontWeight: 900, fontSize: '1.4rem' }}>g</span>
                <span style={{ color: '#34A853', fontWeight: 900, fontSize: '1.4rem' }}>l</span>
                <span style={{ color: '#EA4335', fontWeight: 900, fontSize: '1.4rem' }}>e</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Choose an account</h3>
              <p style={{ fontSize: '#718096', color: '#718096', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                to continue to FitSync
              </p>
            </div>

            {/* Account List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              
              {/* Account 1 */}
              <button
                onClick={() => handleGoogleLogin('kavyabtp2005@gmail.com', 'Kavya Singhal')}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#88ef3c',
                  color: '#090e14',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>KS</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>Kavya Singhal</span>
                  <span style={{ fontSize: '0.7rem', color: '#718096' }}>kavyabtp2005@gmail.com</span>
                </div>
              </button>

              {/* Account 2 */}
              <button
                onClick={() => handleGoogleLogin('kavyasinghal87@gmail.com', 'Kavya Singhal')}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#0066ee',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>KS</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>Kavya Singhal</span>
                  <span style={{ fontSize: '0.7rem', color: '#718096' }}>kavyasinghal87@gmail.com</span>
                </div>
              </button>

              {/* Account 3: Use another */}
              <button
                onClick={() => {
                  const newMail = prompt("Enter your Google email:");
                  if (newMail && newMail.includes('@')) {
                    handleGoogleLogin(newMail, newMail.split('@')[0]);
                  }
                }}
                style={{
                  background: 'transparent',
                  border: '1.5px dashed rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  color: '#a0aec0',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                + Use another account
              </button>

            </div>

            <p style={{ fontSize: '0.65rem', color: '#718096', textAlign: 'center', lineHeight: 1.3 }}>
              To continue, Google will share your name, email address, profile picture, and personal info with FitSync.
            </p>
          </div>
        </div>
      )}

      {/* CSS Spinners & Style Adjustments */}
      <style>{`
        .auth-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: currentColor;
          border-radius: 50%;
          animation: auth-spin 0.8s linear infinite;
        }

        @keyframes auth-spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 950px) {
          .auth-left-panel {
            display: none !important;
          }
          .auth-right-panel {
            width: 100% !important;
            padding: 2rem !important;
          }
        }
      `}</style>

    </div>
  );
}
