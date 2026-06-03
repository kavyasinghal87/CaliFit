import { useState, useEffect } from 'react';
import { 
  Zap, LayoutDashboard, Utensils, Dumbbell, Calendar, 
  TrendingUp, Sparkles, Users, Settings, 
  LogOut, Menu, X, CheckCircle, Moon, Sun
} from 'lucide-react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CalorieTracker from './components/CalorieTracker';
import WorkoutTracker from './components/WorkoutTracker';
import AICoach from './components/AICoach';
import ProgressTracking from './components/ProgressTracking';
import Community from './components/Community';
import AdminPanel from './components/AdminPanel';
import Auth from './components/Auth';
import { supabase } from './supabaseClient';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authScreen, setAuthScreen] = useState('landing');
  const [user, setUser] = useState({ name: '', email: '', avatar: '' });
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  function handleSession(session) {
    if (session) {
      const emailVal = session.user.email;
      const nameVal = session.user.user_metadata?.full_name || session.user.user_metadata?.name || emailVal.split('@')[0];
      const initials = nameVal.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

      setUser({
        name: nameVal,
        email: emailVal,
        avatar: initials || 'US'
      });
      setIsLoggedIn(true);
    } else {
      setUser({ name: '', email: '', avatar: '' });
      setIsLoggedIn(false);
    }
  }

  // Monitor Supabase auth session
  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // 2. Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sync theme attribute with DOM for CSS variables
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    showToast(`Switched to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setAuthScreen('landing');
    showToast("Logged out successfully");
  };

  const handleLogin = (userData) => {
    if (userData) {
      setUser(userData);
    }
    setIsLoggedIn(true);
    setActiveTab('Dashboard');
    showToast(`Welcome back, ${userData?.name || 'Kavya'}!`);
  };

  // Meal Planner content for the specialized tab
  const renderMealPlanner = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const plans = {
      Monday: { meal: 'Tuna Salad Wrap + Sweet Potato', kcal: 550, protein: '42g', carbs: '50g' },
      Tuesday: { meal: 'Grilled Cod + Quinoa & Broccoli', kcal: 480, protein: '38g', carbs: '45g' },
      Wednesday: { meal: 'Protein Oatmeal + Whey & Almonds', kcal: 450, protein: '40g', carbs: '55g' },
      Thursday: { meal: 'Chicken Breast Salad + Dressing', kcal: 520, protein: '45g', carbs: '20g' },
      Friday: { meal: 'Baked Salmon + Brown Rice', kcal: 620, protein: '48g', carbs: '48g' },
      Saturday: { meal: 'Ribeye Steak + Steamed Asparagus', kcal: 680, protein: '55g', carbs: '5g' },
      Sunday: { meal: 'Greek Yogurt Bowl + Chia Seeds', kcal: 320, protein: '32g', carbs: '15g' }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(255, 106, 0, 0.1) 0%, rgba(10, 10, 10, 0.7) 100%)', borderLeft: '5px solid var(--emerald)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Weekly Nutrition Planner</h2>
          <p style={{ fontSize: '0.9rem' }}>Get custom high-protein templates curated by FitSync AI to fit your daily 2,200 kcal budget.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem' }}>
          {days.map((day) => (
            <div key={day} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--lime)', textTransform: 'uppercase' }}>{day} template</div>
                <h3 style={{ fontSize: '1.15rem', marginTop: '0.25rem' }}>{plans[day].meal}</h3>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-secondary)', paddingTop: '0.75rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                <span>🔥 {plans[day].kcal} kcal</span>
                <span style={{ color: 'var(--emerald)' }}>🍗 {plans[day].protein}</span>
                <span style={{ color: 'var(--lime)' }}>🥖 {plans[day].carbs}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard theme={theme} toggleTheme={toggleTheme} />;
      case 'Calories':
        return <CalorieTracker />;
      case 'Workouts':
        return <WorkoutTracker />;
      case 'Meal Planner':
        return renderMealPlanner();
      case 'Analytics':
        return <ProgressTracking />;
      case 'AI Coach':
        return <AICoach />;
      case 'Community':
        return <Community />;
      case 'Settings':
        return <AdminPanel />;
      default:
        return <Dashboard theme={theme} toggleTheme={toggleTheme} />;
    }
  };

  const sidebarLinks = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Calories', icon: <Utensils size={18} /> },
    { name: 'Workouts', icon: <Dumbbell size={18} /> },
    { name: 'Meal Planner', icon: <Calendar size={18} /> },
    { name: 'Analytics', icon: <TrendingUp size={18} /> },
    { name: 'AI Coach', icon: <Sparkles size={18} /> },
    { name: 'Community', icon: <Users size={18} /> },
    { name: 'Settings', icon: <Settings size={18} />, label: 'Admin' }
  ];

  if (!isLoggedIn) {
    return (
      <>
        {authScreen === 'landing' ? (
          <LandingPage onEnterDashboard={(mode) => setAuthScreen(mode)} />
        ) : (
          <Auth 
            onLoginSuccess={handleLogin} 
            initialMode={authScreen} 
            onBackToLanding={() => setAuthScreen('landing')} 
          />
        )}
        {toastMessage && (
          <div style={{
            position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
            zIndex: 5000, background: 'var(--bg-secondary)', border: '1px solid var(--emerald)',
            padding: '0.75rem 1.5rem', borderRadius: '999px', fontSize: '0.9rem', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }} className="animate-fade-in-up">
            <CheckCircle size={16} className="text-emerald" /> {toastMessage}
          </div>
        )}
      </>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', position: 'relative', width: '100%', overflow: 'hidden' }}>
      
      {/* SIDEBAR NAVIGATION - DESKTOP */}
      <aside className="glass-panel desktop-only" style={{ 
        width: '260px', 
        height: 'calc(100vh - 2rem)', 
        position: 'sticky', 
        top: '1rem', 
        margin: '1rem',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div>
          {/* Logo block */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '0.5rem', marginBottom: '2rem' }}>
            <div className="bg-gradient-emerald-lime" style={{ 
              padding: '0.4rem', borderRadius: '0.4rem', display: 'flex' 
            }}>
              <Zap size={18} color="#080d1a" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem' }}>
              FITSYNC
            </span>
          </div>

          {/* Links list */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {sidebarLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => { setActiveTab(link.name); }}
                className={`sidebar-nav-btn ${activeTab === link.name ? 'active' : ''}`}
              >
                {link.icon}
                <span style={{ flex: 1 }}>{link.name}</span>
                {link.label && (
                  <span style={{ fontSize: '0.65rem', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                    {link.label}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* User profile logout block */}
        <div style={{ borderTop: '1px solid var(--border-secondary)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', paddingLeft: '0.5rem' }}>
            <div style={{ 
              width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-tertiary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--lime)'
            }}>{user.avatar}</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{user.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Premium Member</div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="sidebar-logout-btn"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER BAR */}
      <header className="mobile-only" style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '56px',
        background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-secondary)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem',
        zIndex: 500
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            onClick={() => setShowMobileSidebar(true)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', display: 'flex' }}
          >
            <Menu size={22} />
          </button>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.05rem' }}>FITSYNC</span>
        </div>

        <button 
          onClick={toggleTheme}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)' }}
        >
          {theme === 'dark' ? <Sun size={18} className="text-lime" /> : <Moon size={18} className="text-emerald" />}
        </button>
      </header>

      {/* MOBILE DRAWER SIDEBAR */}
      {showMobileSidebar && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(8,13,26,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 1000, display: 'flex'
        }}>
          <div className="glass-panel" style={{ width: '280px', height: '100%', borderRadius: 0, padding: '2rem 1.5rem', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>FITSYNC</span>
                <button onClick={() => setShowMobileSidebar(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)' }}>
                  <X size={20} />
                </button>
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {sidebarLinks.map(link => (
                  <button
                    key={link.name}
                    onClick={() => { setActiveTab(link.name); setShowMobileSidebar(false); }}
                    className={`sidebar-nav-btn ${activeTab === link.name ? 'active' : ''}`}
                  >
                    {link.icon} {link.name}
                  </button>
                ))}
              </nav>
            </div>

            <button 
              onClick={handleLogout}
              className="sidebar-logout-btn"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
          
          {/* Dismiss touch target outside panel */}
          <div style={{ flex: 1 }} onClick={() => setShowMobileSidebar(false)}></div>
        </div>
      )}

      {/* MAIN VIEWPORT */}
      <main style={{ 
        flex: 1, 
        width: '100%',
        minWidth: 0,
        padding: '2rem', 
        paddingTop: isLoggedIn ? '5rem' : '2rem', // space for mobile header bar
        paddingBottom: isLoggedIn ? '6rem' : '2rem', // space for mobile bottom navigation bar
        overflowY: 'auto',
        maxWidth: '1200px',
        margin: '0 auto'
      }} className="main-content-layout">
        <div key={activeTab} className="tab-transition">
          {renderActiveContent()}
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      {isLoggedIn && (
        <nav className="mobile-only" style={{
          position: 'fixed', bottom: 0, left: 0, width: '100%', height: '64px',
          background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-secondary)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-around',
          zIndex: 500, paddingBottom: 'env(safe-area-inset-bottom)'
        }}>
          {sidebarLinks.slice(0, 4).map(link => (
            <button
              key={link.name}
              onClick={() => { setActiveTab(link.name); }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'transparent', border: 'none',
                color: activeTab === link.name ? 'var(--emerald)' : 'var(--text-secondary)',
                fontSize: '0.65rem', fontWeight: activeTab === link.name ? 700 : 500
              }}
            >
              {link.icon}
              <span style={{ marginTop: '0.2rem' }}>{link.name}</span>
            </button>
          ))}
          <button
            onClick={() => { setActiveTab('AI Coach'); }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none',
              color: activeTab === 'AI Coach' ? 'var(--emerald)' : 'var(--text-secondary)',
              fontSize: '0.65rem', fontWeight: activeTab === 'AI Coach' ? 700 : 500
            }}
          >
            <Sparkles size={18} />
            <span style={{ marginTop: '0.2rem' }}>AI Coach</span>
          </button>
        </nav>
      )}

      {/* TOAST POPUPS CONTAINER */}
      {toastMessage && (
        <div style={{
          position: 'fixed', bottom: '5rem', left: '50%', transform: 'translateX(-50%)',
          zIndex: 5000, background: 'var(--bg-secondary)', border: '1px solid var(--emerald)',
          padding: '0.5rem 1.25rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          pointerEvents: 'none'
        }} className="animate-fade-in-up">
          <CheckCircle size={15} className="text-emerald" /> {toastMessage}
        </div>
      )}

      {/* CSS stylesheet helpers for responsive rules */}
      <style>{`
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          main.main-content-layout {
            padding: 1rem !important;
            padding-top: 5rem !important;
            padding-bottom: 5.5rem !important;
          }
        }
      `}</style>

    </div>
  );
}
