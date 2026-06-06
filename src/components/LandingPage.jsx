import React, { useState, useEffect } from 'react';
import {
  Zap, Activity, Target, Shield, Heart, Award,
  ChevronRight, Compass, Users, Sparkles, MessageSquare,
  Utensils, Flame, Calendar, Bell, ArrowRight
} from 'lucide-react';
import ProductDemoShowcase from './ProductDemoShowcase';
import heroMockup from '../assets/hero_dashboard_mockup.png';
import steakImg from '../assets/scanned_steak_dish.png';
import transformImg from '../assets/fitness_transformation.png';
import workoutBg from '../assets/hero_bg_workout_tracking.png';
import mealBg from '../assets/hero_bg_meal_logging.png';
import strengthBg from '../assets/hero_bg_strength_training.png';
import cardioBg from '../assets/hero_bg_cardio_workout.png';
import dumbbellBg from '../assets/hero_bg_dumbbell_training.png';
import recoveryBg from '../assets/hero_bg_recovery_stretch.png';
import boxingCoachBg from '../assets/hero_bg_boxing_coach_v2.png';
import boxingSparringBg from '../assets/hero_bg_sparring_v2.png';

export default function LandingPage({ onEnterDashboard }) {
  const [scrolled, setScrolled] = useState(false);
  const [bgState, setBgState] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    // Run once on mount to capture initial scroll if user reloaded page below top
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setBgState(prev => (prev + 1) % 4);
    }, 4500);
    return () => clearInterval(timer);
  }, []);
  const features = [
    {
      icon: <Utensils size={24} className="text-emerald" />,
      title: "Calorie Tracker",
      desc: "Instant search database of over 10M food items with automatic macro-nutritional calculations."
    },
    {
      icon: <Flame size={24} className="text-lime" />,
      title: "Gym Workout Logger",
      desc: "Log sets, reps, and weights in seconds. Track progression with detailed weight curves and logs."
    },
    {
      icon: <Sparkles size={24} className="text-emerald" />,
      title: "AI Fitness Coach",
      desc: "ChatGPT-powered health advisor providing meal suggestions, workout splits, and rest advice."
    },
    {
      icon: <Calendar size={24} className="text-lime" />,
      title: "Smart Meal Planner",
      desc: "Get personalized diet templates based on your body mass, active calorie expenditure, and goals."
    },
    {
      icon: <Activity size={24} className="text-emerald" />,
      title: "Progress Analytics",
      desc: "Beautiful custom SVG charts visualizing weight fluctuations, lean muscle gains, and consistency grids."
    },
    {
      icon: <Users size={24} className="text-lime" />,
      title: "Community Challenges",
      desc: "Compete in global step logs, macro challenges, and group workout routines with friends."
    }
  ];

  const brands = [
    "PeakGrip Gyms", "AeroFitness", "Titan Nutrition",
    "Velo Labs", "PulseWear", "Vertex Training", "FlexCo"
  ];

  return (
    <div className="bg-gradient-dark-glow min-h-screen" style={{ overflowX: 'hidden' }}>

      {/* Background Grid Lines Wrapper */}
      <div className="landing-hero-grid-container">
        {/* Subtle grid pattern background overlay */}
        <div className="landing-bg-grid-pattern"></div>

        {/* Ambient Integrated Background Graphics */}
        <div className="landing-hero-bg-graphics">
          {/* LEFT GRAPHIC: Workout and Progress scenes */}
          <div className="landing-hero-bg-graphic left">
            <div className={`graphic-image ${bgState === 0 ? 'active' : ''}`} style={{ backgroundImage: `url(${workoutBg})` }}></div>
            <div className={`graphic-image ${bgState === 1 ? 'active' : ''}`} style={{ backgroundImage: `url(${strengthBg})` }}></div>
            <div className={`graphic-image ${bgState === 2 ? 'active' : ''}`} style={{ backgroundImage: `url(${dumbbellBg})` }}></div>
            <div className={`graphic-image ${bgState === 3 ? 'active' : ''}`} style={{ backgroundImage: `url(${boxingCoachBg})` }}></div>
          </div>
          {/* RIGHT GRAPHIC: Calorie and Meal scenes */}
          <div className="landing-hero-bg-graphic right">
            <div className={`graphic-image ${bgState === 0 ? 'active' : ''}`} style={{ backgroundImage: `url(${mealBg})` }}></div>
            <div className={`graphic-image ${bgState === 1 ? 'active' : ''}`} style={{ backgroundImage: `url(${cardioBg})` }}></div>
            <div className={`graphic-image ${bgState === 2 ? 'active' : ''}`} style={{ backgroundImage: `url(${recoveryBg})` }}></div>
            <div className={`graphic-image ${bgState === 3 ? 'active' : ''}`} style={{ backgroundImage: `url(${boxingSparringBg})` }}></div>
          </div>
        </div>

        {/* NAVBAR */}
        <nav className={`glass-panel landing-nav ${scrolled ? 'scrolled' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <div className="bg-gradient-emerald-lime" style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(0, 102, 238, 0.4)'
            }}>
              <Zap size={20} color="#080d1a" strokeWidth={2.5} />
            </div>
            <span className="landing-logo-text">
              FIT<span style={{ color: 'var(--emerald)' }}>SYNC</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="desktop-only" style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', fontWeight: 500 }}>
            <a href="#demo" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>3D Demo</a>
            <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Features</a>
            <a href="#pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Pricing</a>
            <a href="#coach" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--text-primary)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>AI Coach</a>
          </div>

          <div className="landing-nav-actions">
            <button
              onClick={() => onEnterDashboard('login')}
              className="landing-login-btn"
            >
              Login
            </button>
            <button
              onClick={() => onEnterDashboard('signup')}
              className="bg-gradient-emerald-lime landing-signup-btn"
            >
              Get Started <ChevronRight size={16} />
            </button>
          </div>
        </nav>

        <header className="animate-fade-in-up landing-hero">
          {/* Glow pill */}
          <div className="glass-panel" style={{
            padding: '0.4rem 1.25rem',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--lime)',
            border: '1px solid rgba(0, 82, 180, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '2rem'
          }}>
            <Sparkles size={14} /> Interactive 3D App Preview Below
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: '850px',
            letterSpacing: '-0.04em',
            marginBottom: '1.5rem'
          }}>
            Track Calories. Build Muscle. <br />
            <span className="text-gradient-emerald-lime">Transform Yourself.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            maxWidth: '600px',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '2.5rem'
          }}>
            All-in-one AI-powered calorie tracker, macro journal, and gym progress platform built for peak performance.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
            <button
              onClick={() => onEnterDashboard('signup')}
              className="bg-gradient-emerald-lime animate-pulse-neon"
              style={{
                border: 'none',
                color: '#080d1a',
                padding: '1rem 2rem',
                borderRadius: '0.85rem',
                fontWeight: 800,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'transform 0.2s'
              }}
              onMouseOver={e => e.target.style.transform = 'scale(1.03)'}
              onMouseOut={e => e.target.style.transform = 'none'}
            >
              Launch Web App <ArrowRight size={18} />
            </button>
            <a
              href="#demo"
              className="glass-panel"
              style={{
                textDecoration: 'none',
                color: 'var(--text-primary)',
                padding: '1rem 2rem',
                borderRadius: '0.85rem',
                fontWeight: 700,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={e => e.target.style.background = 'var(--bg-tertiary)'}
              onMouseOut={e => e.target.style.background = 'var(--card-bg)'}
            >
              View 3D Demo
            </a>
          </div>
        </header>

        <ProductDemoShowcase onEnterDashboard={onEnterDashboard} />
      </div>

      {/* TRUSTED BY BRAND TICKER */}
      <section className="brand-ticker-section" style={{
        background: 'rgba(12,20,40,0.4)',
        padding: '2.5rem 0'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.25rem', fontSize: '0.8rem', textTransform: 'uppercase', tracking: '0.15em', fontWeight: 700, color: 'var(--text-muted)' }}>
          INTEGRATES WITH THE LEADING BRANDS & NETWORKS • OVER <span className="text-gradient-emerald-lime" style={{ fontWeight: 800 }}>1M+ WORKOUTS</span> LOGGED
        </div>
        <div className="ticker-wrap">
          <div className="ticker-content" style={{ gap: '4rem', display: 'flex', alignItems: 'center' }}>
            {brands.concat(brands).map((brand, i) => (
              <span key={i} style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                opacity: 0.5,
                whiteSpace: 'nowrap'
              }}>
                ✦ {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section id="features" style={{
        maxWidth: '1200px',
        margin: '6rem auto',
        padding: '0 1.5rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem' }}>
            Engineered For Your <span className="text-gradient-emerald-lime">Best Physique</span>
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
            Ditch spreadsheet notebooks and basic trackers. Track macros and lift volumes within one intelligent ecosystem.
          </p>
        </div>

        <div className="grid-masonry">
          {features.map((feature, i) => (
            <div key={i} className="glass-panel glass-panel-hover" style={{
              padding: '2rem',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{
                background: 'rgba(255, 106, 0, 0.08)',
                width: 'fit-content',
                padding: '0.75rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255, 106, 0, 0.15)'
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{feature.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        maxWidth: '1200px',
        margin: '6rem auto 2rem',
        padding: '3rem 1.5rem 1.5rem',
        borderTop: '1px solid var(--border-secondary)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '2rem',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--text-primary)' }}>FITSYNC</span>
          </div>
          <p style={{ maxWidth: '250px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            The premium all-in-one AI powered health tracker for elite athletes.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'clamp(1.5rem, 5vw, 4rem)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Product</span>
            <span style={{ cursor: 'pointer' }}>Features</span>
            <span style={{ cursor: 'pointer' }}>Integrations</span>
            <span style={{ cursor: 'pointer' }}>Changelog</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Company</span>
            <span style={{ cursor: 'pointer' }}>About Us</span>
            <span style={{ cursor: 'pointer' }}>Careers</span>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
          </div>
        </div>
        <div style={{ width: '100%', textAlign: 'center', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
          © {new Date().getFullYear()} FitSync AI. All rights reserved. Made for high performers.
        </div>
      </footer>
    </div>
  );
}
