import React, { useState } from 'react';
import { 
  Trophy, Award, Scale, Flame, Zap, Shield, Sparkles, 
  ChevronRight, Calendar, Star, Compass, UserCheck
} from 'lucide-react';
import transformImg from '../assets/fitness_transformation.png';

export default function ProgressTracking() {
  const [xpPoints, setXpPoints] = useState(2450);
  const nextLevelXp = 3000;
  const levelPercent = Math.round((xpPoints / nextLevelXp) * 100);

  const achievements = [
    { title: "Streak Master", desc: "Maintained a calorie logging streak of 14 days.", xp: 500, unlocked: true, icon: <Flame size={20} color="#fb923c" /> },
    { title: "Iron Warrior", desc: "Logged 10 complete PPL lifting sessions.", xp: 800, unlocked: true, icon: <Trophy size={20} className="text-lime" /> },
    { title: "Hydration Hero", desc: "Drank 8+ cups of water daily for 7 days.", xp: 300, unlocked: true, icon: <Award size={20} color="#38bdf8" /> },
    { title: "Macro Perfection", desc: "Hit exactly +/- 5g of your protein target.", xp: 600, unlocked: false, icon: <Zap size={20} className="text-emerald" /> },
    { title: "Weight Shifter", desc: "Lost 2.5 kg of body mass in 1 month.", xp: 1000, unlocked: false, icon: <Scale size={20} color="#a855f7" /> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* LEVEL PROGRESS HEADER BANNER */}
      <div className="glass-panel" style={{ 
        padding: '2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap',
        gap: '1.5rem',
        background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(132,204,22,0.05) 100%)',
        borderColor: 'rgba(16, 185, 129, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', textAlign: 'left' }}>
          <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Inner level number */}
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--lime)' }}>Lvl 8</div>
            {/* SVG circle stroke representation of level progress */}
            <svg width="80" height="80" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
              <circle stroke="var(--bg-tertiary)" fill="transparent" strokeWidth="6" r="34" cx="40" cy="40" />
              <circle 
                stroke="var(--lime)" 
                fill="transparent" 
                strokeWidth="6" 
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 - (levelPercent / 100) * (2 * Math.PI * 34)}`}
                r="34" cx="40" cy="40" 
                style={{ strokeLinecap: 'round', transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </svg>
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Kavya's Fitness Rank</h3>
            <p style={{ fontSize: '0.85rem' }}>Next level unlocks at <strong style={{ color: 'var(--text-primary)' }}>{nextLevelXp} XP</strong>. Earn XP by logging workouts and remaining within macros.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <div style={{ width: '150px', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${levelPercent}%`, background: 'var(--lime)' }}></div>
              </div>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{xpPoints} / {nextLevelXp} XP</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setXpPoints(prev => Math.min(nextLevelXp, prev + 100))}
          className="glass-panel"
          style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--emerald)', borderColor: 'var(--emerald)', background: 'transparent' }}
          onMouseOver={e=>{e.target.style.background='var(--emerald)'; e.target.style.color='#080d1a'}}
          onMouseOut={e=>{e.target.style.background='transparent'; e.target.style.color='var(--emerald)'}}
        >
          + Claim 100 Daily XP
        </button>
      </div>

      {/* CORE WORKSPACE */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        
        {/* BEFORE/AFTER GALLERY CARD */}
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left', gridColumn: 'span 1' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Before & After Comparison</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Visual progression over 90 days. Keep logging meals and lifts to witness physical transformations.
          </p>

          <div style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--card-border)', background: 'var(--bg-secondary)' }}>
            <img 
              src={transformImg} 
              alt="Fitness transformation comparison" 
              style={{ width: '100%', display: 'block' }} 
            />

            {/* Labels overlay */}
            <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', background: 'rgba(8,13,26,0.7)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>
              Day 1: 79.5 kg
            </div>
            <div style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem', background: 'rgba(16,185,129,0.85)', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#080d1a' }}>
              Day 90: 76.8 kg
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.85rem' }}>
            <span>Fat Loss: <strong style={{ color: 'var(--lime)' }}>- 4.2%</strong></span>
            <span>Muscle Gain: <strong style={{ color: 'var(--emerald)' }}>+ 1.8 kg</strong></span>
          </div>
        </div>

        {/* ACHIEVEMENTS LIST */}
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Unlocked Achievements</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {achievements.map((item, idx) => (
              <div 
                key={idx} 
                className="glass-panel" 
                style={{ 
                  padding: '1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  opacity: item.unlocked ? 1 : 0.45,
                  background: item.unlocked ? 'rgba(16, 185, 129, 0.02)' : 'transparent',
                  borderColor: item.unlocked ? 'rgba(16, 185, 129, 0.25)' : 'var(--card-border)'
                }}
              >
                <div style={{ 
                  background: item.unlocked ? 'var(--bg-tertiary)' : 'rgba(255,255,255,0.02)', 
                  padding: '0.6rem', 
                  borderRadius: '0.75rem',
                  border: item.unlocked ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent'
                }}>
                  {item.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.title}</span>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--lime)', fontWeight: 700 }}>+{item.xp} XP</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
