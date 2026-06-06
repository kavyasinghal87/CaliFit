import React, { useState, useEffect, useRef } from 'react';
import {
  Dumbbell, Flame, Sparkles, Utensils, TrendingUp, CheckCircle2,
  MessageSquare, Award, ArrowUpRight, ArrowDownRight, Zap, Target
} from 'lucide-react';
import steakImg from '../assets/scanned_steak_dish.png';
import transformImg from '../assets/fitness_transformation.png';

export default function ProductDemoShowcase({ onEnterDashboard }) {
  const [activeStep, setActiveStep] = useState(0);
  const [logoAssembled, setLogoAssembled] = useState(false);
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const particlesRef = useRef([]);

  // Auto-play timeline loop (9 stages: 0 to 8) - optimized pacing to 4200ms
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 9);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  // Reset logo assembly state and clear canvas whenever step is not 8
  useEffect(() => {
    if (activeStep !== 8) {
      setLogoAssembled(false);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  }, [activeStep]);

  // Parallax Mouse Movement Handler - direct DOM manipulation to avoid React re-renders!
  const handleMouseMove = (e) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) - 0.5; // -0.5 to 0.5
    const y = ((e.clientY - rect.top) / rect.height) - 0.5; // -0.5 to 0.5
    wrapperRef.current.style.setProperty('--mouse-x', x);
    wrapperRef.current.style.setProperty('--mouse-y', y);
  };

  const handleMouseLeave = () => {
    if (!wrapperRef.current) return;
    wrapperRef.current.style.setProperty('--mouse-x', 0);
    wrapperRef.current.style.setProperty('--mouse-y', 0);
  };

  // Helper to determine widget morph transition direction
  const getWidgetStateClass = (widgetKey) => {
    switch (widgetKey) {
      case 'workout':
        if (activeStep <= 2) return 'visible present';
        return 'past';
      case 'nutrition':
        if (activeStep === 3) return 'visible present';
        if (activeStep < 3) return 'future';
        return 'past';
      case 'analytics':
        if (activeStep === 4 || activeStep === 6) return 'visible present';
        if (activeStep < 4) return 'future';
        if (activeStep === 5) return 'future-transition';
        return 'past';
      case 'coach':
        if (activeStep === 5) return 'visible present';
        if (activeStep < 5) return 'future';
        return 'past';
      case 'transformation':
        if (activeStep === 7) return 'visible present';
        if (activeStep < 7) return 'future';
        return 'past';
      default:
        return '';
    }
  };

  // Canvas particle system for Step 8 (Brand Reveal) - Optimized for 60 FPS
  useEffect(() => {
    if (activeStep !== 8) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      particlesRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Fit canvas resolution to screen size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();

    const cx = canvas.width / 2;
    const cy = canvas.height / 2 - 30; // slightly offset upward for text

    // Sample coordinates for the lightning bolt logo (centered at cx, cy)
    const logoVertices = [
      { x: 0, y: -75 },
      { x: 30, y: -15 },
      { x: 10, y: -15 },
      { x: -10, y: 75 },
      { x: -30, y: 15 },
      { x: -10, y: 15 }
    ];

    // Generate points along the vertices
    const targetPoints = [];
    const pointsPerSegment = 25; // slightly reduced count for faster calculation
    for (let i = 0; i < logoVertices.length; i++) {
      const p1 = logoVertices[i];
      const p2 = logoVertices[(i + 1) % logoVertices.length];
      for (let j = 0; j < pointsPerSegment; j++) {
        const t = j / pointsPerSegment;
        targetPoints.push({
          x: cx + (p1.x + (p2.x - p1.x) * t) * 1.25,
          y: cy + (p1.y + (p2.y - p1.y) * t) * 1.25
        });
      }
    }

    // Add some interior points to fill the logo volume
    for (let i = 0; i < 30; i++) {
      const t = Math.random();
      const p1 = logoVertices[0];
      const p2 = logoVertices[3];
      const midX = p1.x + (p2.x - p1.x) * t;
      const midY = p1.y + (p2.y - p1.y) * t;
      targetPoints.push({
        x: cx + midX * 1.25 + (Math.random() - 0.5) * 12,
        y: cy + midY * 1.25 + (Math.random() - 0.5) * 12
      });
    }

    const particleCount = targetPoints.length;
    const particles = [];

    // Spawn origins mapped to floating widget locations for a converging stream look
    const origins = [
      { x: canvas.width * 0.15, y: canvas.height * 0.3 },
      { x: canvas.width * 0.85, y: canvas.height * 0.3 },
      { x: canvas.width * 0.5, y: canvas.height * 0.8 },
      { x: canvas.width * 0.25, y: canvas.height * 0.15 },
      { x: canvas.width * 0.75, y: canvas.height * 0.7 }
    ];

    for (let i = 0; i < particleCount; i++) {
      const origin = origins[i % origins.length];
      const target = targetPoints[i];
      
      particles.push({
        x: origin.x + (Math.random() - 0.5) * 160,
        y: origin.y + (Math.random() - 0.5) * 160,
        tx: target.x,
        ty: target.y,
        vx: 0,
        vy: 0,
        size: Math.random() * 2 + 1.2,
        alpha: Math.random() * 0.6 + 0.4,
        speedFactor: Math.random() * 0.08 + 0.06, // increased speed factor for snappier convergence
        delay: Math.random() * 10 // reduced delay
      });
    }

    particlesRef.current = particles;
    let frame = 0;

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      
      let allAssembled = true;

      // GPU Drop shadow applied to canvas element, raw simple arcs drawn here to stay at 60 FPS
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        if (frame > p.delay) {
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          
          p.vx += dx * p.speedFactor;
          p.vy += dy * p.speedFactor;
          
          p.vx *= 0.81; // slightly lower friction for snappier snap-in
          p.vy *= 0.81;
          
          p.x += p.vx;
          p.y += p.vy;

          const distanceSq = dx * dx + dy * dy;
          if (distanceSq > 3) {
            allAssembled = false;
          }
        } else {
          allAssembled = false;
          p.x += Math.sin(frame * 0.05 + i) * 0.2;
          p.y += Math.cos(frame * 0.05 + i) * 0.2;
        }

        // Optimized Arc draw without save/restore or shadowBlur
        ctx.beginPath();
        if (Math.abs(p.vx) > 0.8 && frame < 70) {
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 1.3, p.y - p.vy * 1.3);
          ctx.strokeStyle = `rgba(255, 110, 0, ${p.alpha * 0.45})`;
          ctx.lineWidth = p.size * 0.5;
          ctx.stroke();
        } else {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 106, 0, ${p.alpha})`;
          ctx.fill();
        }
      }

      // Snappy brand reveal threshold
      if (allAssembled && frame > 48) {
        setLogoAssembled(true);
      } else if (frame > 120) {
        // Fallback assembly trigger
        setLogoAssembled(true);
      } else {
        requestRef.current = requestAnimationFrame(animateParticles);
      }
    };

    requestRef.current = requestAnimationFrame(animateParticles);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [activeStep]);

  return (
    <section 
      id="demo" 
      ref={wrapperRef}
      className={`showcase-wrapper-container step-${activeStep}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Layer: Mesh glows and rotating perspective wireframe grid */}
      <div className="showcase-bg-layer">
        <div className="mesh-glow mesh-glow-1"></div>
        <div className="mesh-glow mesh-glow-2"></div>
        <div className="showcase-perspective-grid"></div>
      </div>

      {/* Content Layer: Floating elements, typography reveals, HUD statistics */}
      <div className="showcase-content-layer">
        
        {/* Typographic Tag Overlay */}
        <div className="cinematic-tag">
          {activeStep === 0 && <span className="glow-text">PHASE 01 // PUSH DAY VOLUME</span>}
          {activeStep === 1 && <span className="glow-text">PHASE 02 // PULL DAY PROGRESSION</span>}
          {activeStep === 2 && <span className="glow-text">PHASE 03 // LEG DAY CONSISTENCY</span>}
          {activeStep === 3 && <span className="glow-text">PHASE 04 // MEAL RECOGNITION SCAN</span>}
          {activeStep === 4 && <span className="glow-text">PHASE 05 // LOGGED PERFORMANCE</span>}
          {activeStep === 5 && <span className="glow-text">PHASE 06 // ACTIVE AI COACHING</span>}
          {activeStep === 6 && <span className="glow-text">PHASE 07 // ANALYTICAL FORECAST</span>}
          {activeStep === 7 && <span className="glow-text">PHASE 08 // TRANSFORMATION INDEX</span>}
          {activeStep === 8 && <span className="glow-text">PHASE 09 // INTEGRATED SYSTEM</span>}
        </div>

        {/* Ambient Subtle Typography Support */}
        <div className="cinematic-backdrop-title">
          {activeStep === 0 && <div className="text-morph">PUSH</div>}
          {activeStep === 1 && <div className="text-morph">PULL</div>}
          {activeStep === 2 && <div className="text-morph">LEGS</div>}
          {activeStep === 3 && <div className="text-morph">FUEL</div>}
          {activeStep === 4 && <div className="text-morph">DATA</div>}
          {activeStep === 5 && <div className="text-morph">COACH</div>}
          {activeStep === 6 && <div className="text-morph">STATS</div>}
          {activeStep === 7 && <div className="text-morph">BODY</div>}
          {activeStep === 8 && <div className="text-morph">SYNC</div>}
        </div>

        {/* HUD ELEMENT: Workout Cards (Step 0, 1, 2) */}
        <div className={`hud-widget workout-hud-card ${getWidgetStateClass('workout')}`}>
          <div className="hud-header">
            <Dumbbell size={16} className="text-emerald" />
            <span>EXERCISE PROTOCOL</span>
            <span className="hud-badge">LIVE LOG</span>
          </div>

          <div className="exercise-list">
            {/* Step 0: Push Exercises */}
            <div className={`exercise-group ${activeStep === 0 ? 'active' : 'inactive'}`}>
              <div className="exercise-row">
                <span className="ex-name">BENCH PRESS</span>
                <span className="ex-stats">4 Sets × 8 Reps</span>
                <div className="checkbox-ring checked"><CheckCircle2 size={12} className="check-icon" /></div>
              </div>
              <div className="exercise-row">
                <span className="ex-name">OVERHEAD PRESS</span>
                <span className="ex-stats">3 Sets × 10 Reps</span>
                <div className="checkbox-ring checked"><CheckCircle2 size={12} className="check-icon" /></div>
              </div>
              <div className="exercise-row highlight-row">
                <span className="ex-name">TRICEPS DIP</span>
                <span className="ex-stats">3 Sets × 12 Reps</span>
                <div className="checkbox-ring pulse-check"><CheckCircle2 size={12} className="check-icon" /></div>
              </div>
            </div>

            {/* Step 1: Pull Exercises */}
            <div className={`exercise-group ${activeStep === 1 ? 'active' : 'inactive'}`}>
              <div className="exercise-row">
                <span className="ex-name">LAT PULLDOWN</span>
                <span className="ex-stats">4 Sets × 10 Reps</span>
                <div className="checkbox-ring checked"><CheckCircle2 size={12} className="check-icon" /></div>
              </div>
              <div className="exercise-row">
                <span className="ex-name">BARBELL ROW</span>
                <span className="ex-stats">4 Sets × 8 Reps</span>
                <div className="checkbox-ring checked"><CheckCircle2 size={12} className="check-icon" /></div>
              </div>
              <div className="exercise-row highlight-row">
                <span className="ex-name">INCLINE DB CURL</span>
                <span className="ex-stats">3 Sets × 12 Reps</span>
                <div className="checkbox-ring pulse-check"><CheckCircle2 size={12} className="check-icon" /></div>
              </div>
            </div>

            {/* Step 2: Leg Exercises */}
            <div className={`exercise-group ${activeStep === 2 ? 'active' : 'inactive'}`}>
              <div className="exercise-row">
                <span className="ex-name">BARBELL SQUAT</span>
                <span className="ex-stats">4 Sets × 6 Reps</span>
                <div className="checkbox-ring checked"><CheckCircle2 size={12} className="check-icon" /></div>
              </div>
              <div className="exercise-row">
                <span className="ex-name">ROMANIAN DEADLIFT</span>
                <span className="ex-stats">3 Sets × 10 Reps</span>
                <div className="checkbox-ring checked"><CheckCircle2 size={12} className="check-icon" /></div>
              </div>
              <div className="exercise-row highlight-row">
                <span className="ex-name">STANDING CALF RAISE</span>
                <span className="ex-stats">4 Sets × 15 Reps</span>
                <div className="checkbox-ring completion-ring"><CheckCircle2 size={12} className="check-icon animate-check" /></div>
              </div>
            </div>
          </div>

          <div className="hud-footer">
            <span>ACTIVE SPLIT</span>
            <span className="highlight-color font-mono">
              {activeStep === 0 && "PUSH DAY"}
              {activeStep === 1 && "PULL DAY"}
              {activeStep === 2 && "LEG DAY"}
            </span>
          </div>
        </div>

        {/* HUD ELEMENT: Nutrition Scan & Calorie/Macro Indicators (Step 3) */}
        <div className={`hud-widget nutrition-scan-widget ${getWidgetStateClass('nutrition')}`}>
          <div className="scanner-container">
            {/* Viewfinder corners */}
            <div className="viewfinder">
              <div className="corner tl"></div>
              <div className="corner tr"></div>
              <div className="corner bl"></div>
              <div className="corner br"></div>
              {/* Steak Food Image Background */}
              <div className="scan-image" style={{ backgroundImage: `url(${steakImg})` }}></div>
              {/* Laser Scan line */}
              <div className="laser-scanner-line"></div>
            </div>

            {/* Scanning details info box */}
            <div className="scanner-details">
              <div className="hud-badge pulse-badge">AI RECOGNITION</div>
              <h3>RIBEYE STEAK DISH</h3>
              <p className="font-mono text-emerald">MATCH CONFIDENCE: 94.7%</p>
              
              <div className="scan-macros-row">
                <div className="macro-chip highlight-macro">
                  <span className="label">CALORIES</span>
                  <span className="val text-lime">650 kcal</span>
                </div>
                <div className="macro-chip">
                  <span className="label">PROTEIN</span>
                  <span className="val text-emerald">42g</span>
                </div>
                <div className="macro-chip">
                  <span className="label">CARBS</span>
                  <span className="val">12g</span>
                </div>
                <div className="macro-chip">
                  <span className="label">FAT</span>
                  <span className="val">38g</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HUD ELEMENT: Workout Statistics / Progression Curves (Step 4, 6) */}
        <div className={`hud-widget analytics-graph-widget ${getWidgetStateClass('analytics')}`}>
          <div className="hud-header">
            <TrendingUp size={16} className="text-emerald" />
            <span>{activeStep === 4 ? "WORKOUT PERFORMANCE LOG" : "STRENGTH FORECAST ANALYTICS"}</span>
            <span className="hud-badge text-lime">PROGRESSION ENGINE</span>
          </div>

          <div className="analytics-metrics-panel">
            <div className="metric-box highlight-metric">
              <span className="label">TOTAL LIFT VOLUME</span>
              <span className="val counter-up">4,250 kg</span>
              <span className="delta positive font-mono"><ArrowUpRight size={10} /> +12%</span>
            </div>
            <div className="metric-box">
              <span className="label">ACTIVE DURATION</span>
              <span className="val font-mono">58:12</span>
              <span className="delta neutral font-mono">STABLE</span>
            </div>
            <div className="metric-box">
              <span className="label">COMPLETED SETS</span>
              <span className="val">12 / 12</span>
              <span className="delta positive font-mono"><ArrowUpRight size={10} /> 100%</span>
            </div>
          </div>

          {/* SVG Sparkline Graph */}
          <div className="svg-graph-container">
            <svg viewBox="0 0 500 150" className="chart-svg">
              <defs>
                <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.05)" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.05)" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.05)" />
              
              {/* Main Graph Path (animated via stroke-dashoffset) */}
              <path 
                className="sparkline-path"
                d="M 10 130 Q 80 110 150 70 T 300 80 T 420 30 T 490 10" 
                fill="none" 
                stroke="var(--primary)" 
                strokeWidth="3.5" 
              />
              
              {/* Secondary Comparison Path (Fades in in step 6) */}
              <path 
                className={`sparkline-path-secondary ${activeStep === 6 ? 'active' : ''}`}
                d="M 10 140 Q 90 120 160 90 T 320 60 T 430 45 T 490 20" 
                fill="none" 
                stroke="var(--lime)" 
                strokeWidth="2" 
                strokeDasharray="4,4"
              />

              {/* Area path */}
              <path 
                className="sparkline-area"
                d="M 10 130 Q 80 110 150 70 T 300 80 T 420 30 T 490 10 L 490 150 L 10 150 Z" 
                fill="url(#chart-glow)" 
              />

              {/* Data points */}
              <circle cx="150" cy="70" r="4" fill="#0A0A0A" stroke="var(--primary)" strokeWidth="2" className="chart-dot" />
              <circle cx="300" cy="80" r="4" fill="#0A0A0A" stroke="var(--primary)" strokeWidth="2" className="chart-dot" />
              <circle cx="420" cy="30" r="4" fill="#0A0A0A" stroke="var(--primary)" strokeWidth="2" className="chart-dot" />
              <circle cx="490" cy="10" r="5" fill="var(--primary)" className="chart-dot pulse" />
            </svg>
          </div>
        </div>

        {/* HUD ELEMENT: AI Coach Recommendation (Step 5) */}
        <div className={`hud-widget ai-coach-widget ${getWidgetStateClass('coach')}`}>
          <div className="hud-header">
            <Sparkles size={16} className="text-lime" />
            <span>FITSYNC AI ADVISOR</span>
            <span className="hud-badge pulse-badge glow-orange">ONLINE</span>
          </div>

          <div className="chat-dialogue-wrapper">
            <div className="message message-ai message-1">
              <div className="message-header">
                <Sparkles size={12} className="text-emerald" />
                <span>FITSYNC COACH</span>
              </div>
              <p>Excellent Leg session. You set a new Squat PR of <strong>120kg (4 reps)</strong>! 🏋️‍♂️</p>
            </div>

            <div className="message message-ai message-2">
              <div className="message-header">
                <Target size={12} className="text-lime" />
                <span>RECOVERY ANALYTICS</span>
              </div>
              <p>Hamstring fatigue: <strong>85%</strong>. Recommend 5-min active stretching and 30g fast protein intake.</p>
            </div>

            <div className="message message-ai message-3">
              <div className="message-header">
                <Flame size={12} className="text-emerald" />
                <span>NUTRITION INTEGRATION</span>
              </div>
              <p>Adding 35g Whey Protein isolates to your meal tracker matches your target recovery profile.</p>
            </div>
          </div>
        </div>

        {/* HUD ELEMENT: Transformation Tracker (Step 7) */}
        <div className={`hud-widget transformation-widget ${getWidgetStateClass('transformation')}`}>
          <div className="hud-header">
            <Award size={16} className="text-emerald" />
            <span>TRANSFORMATION METRICS</span>
            <span className="hud-badge">LEVEL UP</span>
          </div>

          <div className="transformation-split-view">
            {/* Split before-after images */}
            <div className="comparison-slider-box">
              <div className="photo-panel" style={{ backgroundImage: `url(${transformImg})` }}>
                <div className="label-badge left-badge">BEFORE</div>
                <div className="label-badge right-badge">AFTER</div>
                {/* Visual scan divider line */}
                <div className="slider-divider-line"></div>
              </div>
            </div>

            {/* Progress stats list */}
            <div className="progress-details-list">
              <div className="prog-item">
                <span className="label">TOTAL WEIGHT SHIFT</span>
                <div className="val-row">
                  <span className="val text-lime">78.4 kg</span>
                  <span className="change negative"><ArrowDownRight size={14} /> -6.8kg</span>
                </div>
              </div>
              <div className="prog-item highlight-metric">
                <span className="label">LEAN MUSCLE MASS</span>
                <div className="val-row">
                  <span className="val text-emerald">+2.4 kg</span>
                  <span className="change positive"><ArrowUpRight size={14} /> +4.2%</span>
                </div>
              </div>
              <div className="prog-item">
                <span className="label">CONSISTENCY SCORE</span>
                <div className="val-row">
                  <span className="val">98.2%</span>
                  <span className="badge-achieved">ELITE SHIELD</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Foreground Layer: Particles, canvas logo lines, and scanning overlays */}
      <div className="showcase-fg-layer">
        
        {/* Floating Ambient HUD Particles */}
        <div className="floating-particles">
          <div className="particle part-1"></div>
          <div className="particle part-2"></div>
          <div className="particle part-3"></div>
        </div>

        {/* Particle Canvas Attraction Engine */}
        <canvas ref={canvasRef} className="brand-particle-canvas"></canvas>

        {/* BRAND REVEAL CENTERPIECE (Step 8 - Canvas forms coordinates, HTML holds fully constructed logo for cinematic pulse & tagline) */}
        <div className={`cinematic-brand-reveal ${activeStep === 8 && logoAssembled ? 'reveal-logo' : ''}`}>
          <div className="logo-sparkle-layer">
            <div className="logo-glow-ring"></div>
            {/* High-fidelity Vector Zap Logo SVG */}
            <div className="vector-logo-glow">
              <svg viewBox="0 0 100 100" className="vector-logo-svg">
                <polygon points="50,10 75,45 55,45 65,90 25,55 45,55" fill="url(#logo-grad)" />
                <defs>
                  <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FF8C1A" />
                    <stop offset="50%" stopColor="#FF6A00" />
                    <stop offset="100%" stopColor="#FF6A00" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <h2 className="reveal-title">FIT<span className="text-gradient-emerald-lime">SYNC</span></h2>
          <p className="reveal-tagline">Track. Lift. Transform.</p>
          
          <button onClick={() => onEnterDashboard('signup')} className="reveal-cta-btn bg-gradient-emerald-lime">
            Begin Your Transformation <ArrowUpRight size={16} />
          </button>
        </div>

      </div>

      {/* Sleek Cinematic Timeline Progress Bar */}
      <div className="showcase-timeline-bar">
        <div 
          className="showcase-timeline-progress" 
          style={{ width: `${((activeStep + 1) / 9) * 100}%` }}
        ></div>
      </div>
    </section>
  );
}
