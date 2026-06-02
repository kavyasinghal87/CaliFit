import React, { useState } from 'react';
import { 
  Flame, CupSoda, Footprints, Clock, Scale, 
  ChevronRight, Dumbbell, Compass, Award, Calendar, TrendingUp, Sparkles, Moon, Sun
} from 'lucide-react';
import { ProgressRing, CustomAreaChart, CustomBarChart, CustomLineChart } from './CustomCharts';

export default function Dashboard({ theme, toggleTheme }) {
  // Local reactive states for interactive counters
  const [waterCups, setWaterCups] = useState(5); // Out of 8 cups goal
  const [steps, setSteps] = useState(8420); // Out of 10k steps
  const [caloriesConsumed, setCaloriesConsumed] = useState(1480);
  const calorieGoal = 2200;
  const caloriesBurned = 340;
  const remainingCalories = calorieGoal - caloriesConsumed + caloriesBurned;
  const remainingPercentage = Math.round((caloriesConsumed / (calorieGoal + caloriesBurned)) * 100);

  // Mock data for graphs
  const weeklyCalorieData = [
    { label: 'Mon', value: 1850 },
    { label: 'Tue', value: 2100 },
    { label: 'Wed', value: 1650 },
    { label: 'Thu', value: 1980 },
    { label: 'Fri', value: 2200 },
    { label: 'Sat', value: 2450 },
    { label: 'Sun', value: 1480 } // Today
  ];

  const weeklyWorkoutData = [
    { label: 'Mon', value: 45 },
    { label: 'Tue', value: 60 },
    { label: 'Wed', value: 0 },
    { label: 'Thu', value: 75 },
    { label: 'Fri', value: 50 },
    { label: 'Sat', value: 90 },
    { label: 'Sun', value: 30 }
  ];

  const weightProgressData = [
    { label: 'Week 1', value: 79.5 },
    { label: 'Week 2', value: 78.8 },
    { label: 'Week 3', value: 78.2 },
    { label: 'Week 4', value: 77.9 },
    { label: 'Week 5', value: 77.4 },
    { label: 'Week 6', value: 76.8 }
  ];

  const handleAddWater = () => {
    setWaterCups(prev => Math.min(12, prev + 1));
  };

  const handleSubWater = () => {
    setWaterCups(prev => Math.max(0, prev - 1));
  };

  const handleAddSteps = () => {
    setSteps(prev => prev + 500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* WELCOME BANNER */}
      <div className="glass-panel" style={{ 
        padding: '2rem', 
        background: 'linear-gradient(135deg, rgba(255, 106, 0, 0.15) 0%, rgba(10, 10, 10, 0.7) 100%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem',
        borderLeft: '5px solid var(--emerald)',
      }}>
        <div style={{ textAlign: 'left' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Welcome back, <span className="text-gradient-emerald-lime">Kavya</span>!
          </h2>
          <p style={{ fontSize: '0.95rem' }}>
            You're doing fantastic today. You've hit <strong style={{ color: 'var(--lime)' }}>84%</strong> of your step goals and logged your morning lifting split.
          </p>
        </div>

        {/* Streak & Mode controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ 
            padding: '0.6rem 1.25rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            background: 'rgba(251, 146, 60, 0.1)',
            borderColor: 'rgba(251, 146, 60, 0.3)',
          }}>
            <Flame size={20} color="#fb923c" style={{ filter: 'drop-shadow(0 0 4px #fb923c)' }} />
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#fb923c', fontFamily: 'var(--font-mono)' }}>
              14 DAYS STREAK
            </span>
          </div>

          <button 
            onClick={toggleTheme}
            className="glass-panel"
            style={{
              padding: '0.6rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            {theme === 'dark' ? <Sun size={18} className="text-lime" /> : <Moon size={18} className="text-emerald" />}
          </button>
        </div>
      </div>

      {/* CORE STATS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: '1.5rem'
      }}>
        
        {/* CALORIE Progress Card */}
        <div className="glass-panel" style={{ 
          padding: '1.5rem', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', alignSelf: 'flex-start' }}>Daily Calories Budget</h3>
          
          <ProgressRing percentage={remainingPercentage} color="var(--emerald)">
            <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              {remainingCalories}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              kcal remaining
            </span>
          </ProgressRing>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            width: '100%', 
            marginTop: '1.5rem',
            fontSize: '0.85rem',
            borderTop: '1px solid var(--border-secondary)',
            paddingTop: '1rem'
          }}>
            <div>
              <div style={{ color: 'var(--text-muted)' }}>Target</div>
              <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{calorieGoal} kcal</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)' }}>Food</div>
              <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--emerald)' }}>{caloriesConsumed} kcal</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)' }}>Burned</div>
              <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--lime)' }}>{caloriesBurned} kcal</div>
            </div>
          </div>
        </div>

        {/* MACROS CARD */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'left' }}>Daily Macronutrients</h3>
            
            {/* Protein bar */}
            <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600 }}>Protein 🍗</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>110g / 150g</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '73%', background: 'var(--emerald)', borderRadius: '4px' }}></div>
              </div>
            </div>

            {/* Carbs bar */}
            <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600 }}>Carbohydrates 🥖</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>160g / 240g</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '66%', background: 'var(--lime)', borderRadius: '4px' }}></div>
              </div>
            </div>

            {/* Fats bar */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600 }}>Fats 🥑</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>45g / 70g</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '64%', background: 'var(--emerald)', opacity: 0.7, borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ 
            padding: '0.75rem', 
            marginTop: '1rem', 
            fontSize: '0.8rem', 
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            borderColor: 'rgba(255, 106, 0, 0.2)'
          }}>
            <Sparkles size={16} className="text-emerald" />
            <span>AI Advice: Load 40g more Protein to maximize gym hypertrophy today!</span>
          </div>
        </div>

        {/* LOGGERS GRID (Water & Steps) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* WATER TRACKER */}
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(14, 165, 233, 0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                <CupSoda size={24} color="#0ea5e9" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '1rem' }}>Water Intake</h4>
                <p style={{ fontSize: '0.8rem' }}><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>{waterCups}</span> / 8 cups logged</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleSubWater} style={{ 
                width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border-primary)', 
                background: 'transparent', color: 'var(--text-primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>-</button>
              <button onClick={handleAddWater} style={{ 
                width: '32px', height: '32px', borderRadius: '8px', border: 'none', 
                background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>+</button>
            </div>
          </div>

          {/* STEPS TRACKER */}
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(255, 106, 0, 0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                <Footprints size={24} className="text-lime" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '1rem' }}>Steps Tracked</h4>
                <p style={{ fontSize: '0.8rem' }}><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>{steps.toLocaleString()}</span> / 10,000 steps</p>
              </div>
            </div>

            <button onClick={handleAddSteps} className="glass-panel" style={{ 
              padding: '0.4rem 0.8rem', fontSize: '0.8rem', fontWeight: 600, border: '1px solid var(--border-primary)', background: 'transparent', color: 'var(--text-primary)'
            }}>
              + 500 Steps
            </button>
          </div>

          {/* WEIGHT CARD */}
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(255, 106, 0, 0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
              <Scale size={24} className="text-emerald" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ fontSize: '1rem' }}>Weight & Body BMI</h4>
              <p style={{ fontSize: '0.8rem' }}>Current Weight: <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>76.8 kg</span> | BMI: <span style={{ color: 'var(--emerald)', fontWeight: 700 }}>22.3</span> (Normal)</p>
            </div>
          </div>

        </div>
      </div>

      {/* ANALYTICS CHARTS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))',
        gap: '1.5rem'
      }}>
        
        {/* Calorie Intake Area Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Calorie Consumption Trends</h3>
              <p style={{ fontSize: '0.8rem' }}>Weekly average: 1,900 kcal/day</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
              <span style={{ color: 'var(--emerald)', cursor: 'pointer', borderBottom: '2px solid var(--emerald)', paddingBottom: '2px' }}>Calories</span>
              <span style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Macros</span>
            </div>
          </div>
          <CustomAreaChart data={weeklyCalorieData} />
        </div>

        {/* Workout duration Consistency Bar Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Gym Consistency (Active Minutes)</h3>
              <p style={{ fontSize: '0.8rem' }}>Total time this week: 345 mins</p>
            </div>
            <Dumbbell size={18} className="text-lime" />
          </div>
          <CustomBarChart data={weeklyWorkoutData} />
        </div>

        {/* Weight Progression Line Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left', gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Weight Progress Curve</h3>
              <p style={{ fontSize: '0.8rem' }}>Net loss: -2.7 kg over 6 weeks</p>
            </div>
            <TrendingUp size={18} className="text-lime" />
          </div>
          <CustomLineChart data={weightProgressData} />
        </div>

        {/* Muscle Gain Statistics */}
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Muscle Volume Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span>Chest & Push Groups</span>
                <span style={{ fontWeight: 700 }}>+ 12.5% volume</span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '85%', background: 'linear-gradient(90deg, var(--emerald) 0%, var(--lime) 100%)' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span>Back & Pull Groups</span>
                <span style={{ fontWeight: 700 }}>+ 8.0% volume</span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '60%', background: 'linear-gradient(90deg, var(--emerald) 0%, var(--lime) 100%)' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span>Legs & Core Groups</span>
                <span style={{ fontWeight: 700 }}>+ 15.2% volume</span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '92%', background: 'linear-gradient(90deg, var(--emerald) 0%, var(--lime) 100%)' }}></div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-secondary)', paddingTop: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Lean Mass</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--lime)' }}>61.2 kg</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-secondary)', paddingLeft: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Body Fat Percentage</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--emerald)' }}>14.8%</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
