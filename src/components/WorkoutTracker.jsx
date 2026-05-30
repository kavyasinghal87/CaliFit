import React, { useState, useEffect } from 'react';
import { 
  Play, Square, RefreshCw, Trophy, Dumbbell, Calendar, 
  Sparkles, Check, CheckCircle2, ChevronRight, X, Clock, AlertCircle
} from 'lucide-react';

export default function WorkoutTracker() {
  const [activeSplit, setActiveSplit] = useState('Push');
  
  // Exercise database states
  const [exercises, setExercises] = useState([
    { id: 1, name: 'Incline Dumbbell Press', group: 'Chest', difficulty: 'Intermediate', equipment: 'Dumbbells', sets: [
      { reps: 10, lbs: 65, done: false },
      { reps: 8, lbs: 70, done: false },
      { reps: 8, lbs: 70, done: false }
    ]},
    { id: 2, name: 'Overhead Barbell Press', group: 'Shoulders', difficulty: 'Intermediate', equipment: 'Barbell', sets: [
      { reps: 12, lbs: 95, done: false },
      { reps: 10, lbs: 115, done: false },
      { reps: 8, lbs: 115, done: false }
    ]},
    { id: 3, name: 'Tricep Rope Overhead Extension', group: 'Triceps', difficulty: 'Beginner', equipment: 'Cable Machine', sets: [
      { reps: 15, lbs: 45, done: false },
      { reps: 12, lbs: 50, done: false }
    ]}
  ]);

  // Overall workout tracker
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutDuration, setWorkoutDuration] = useState(0); // seconds
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);

  // Rest Timer popup states
  const [restSecondsRemaining, setRestSecondsRemaining] = useState(0);
  const [timerMaxSeconds, setTimerMaxSeconds] = useState(90);
  const [showRestPopup, setShowRestPopup] = useState(false);

  // PPL exercise suggestions
  const pplSuggestions = {
    Push: [
      { name: 'Incline Dumbbell Press', group: 'Chest', difficulty: 'Intermediate', equipment: 'Dumbbells' },
      { name: 'Overhead Barbell Press', group: 'Shoulders', difficulty: 'Intermediate', equipment: 'Barbell' },
      { name: 'Tricep Rope Extension', group: 'Triceps', difficulty: 'Beginner', equipment: 'Cables' }
    ],
    Pull: [
      { name: 'Weighted Pull Ups', group: 'Back', difficulty: 'Advanced', equipment: 'Bodyweight + Plates' },
      { name: 'Barbell Rows', group: 'Back', difficulty: 'Intermediate', equipment: 'Barbell' },
      { name: 'Incline Hammer Curls', group: 'Biceps', difficulty: 'Beginner', equipment: 'Dumbbells' }
    ],
    Legs: [
      { name: 'Barbell Back Squats', group: 'Quadriceps', difficulty: 'Advanced', equipment: 'Barbell' },
      { name: 'Romanian Deadlifts', group: 'Hamstrings', difficulty: 'Intermediate', equipment: 'Barbell' },
      { name: 'Standing Calf Raises', group: 'Calves', difficulty: 'Beginner', equipment: 'Smith Machine' }
    ]
  };

  // Duration ticking
  useEffect(() => {
    let interval = null;
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setWorkoutDuration(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive]);

  // Rest timer countdown ticking
  useEffect(() => {
    let interval = null;
    if (restSecondsRemaining > 0) {
      interval = setInterval(() => {
        setRestSecondsRemaining(prev => {
          if (prev <= 1) {
            setShowRestPopup(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [restSecondsRemaining]);

  const handleStartWorkout = () => {
    setIsWorkoutActive(true);
    setWorkoutDuration(0);
  };

  const handleCompleteWorkout = () => {
    setIsWorkoutActive(false);
    setShowCompletionOverlay(true);
  };

  const handleSetToggle = (exerciseId, setIdx) => {
    // If not active, active it automatically!
    if (!isWorkoutActive) setIsWorkoutActive(true);

    const updated = exercises.map(ex => {
      if (ex.id === exerciseId) {
        const nextSets = [...ex.sets];
        const isNowDone = !nextSets[setIdx].done;
        nextSets[setIdx] = { ...nextSets[setIdx], done: isNowDone };
        
        // Start rest timer popup if checked done!
        if (isNowDone) {
          setRestSecondsRemaining(timerMaxSeconds);
          setShowRestPopup(true);
        }
        
        return { ...ex, sets: nextSets };
      }
      return ex;
    });
    setExercises(updated);
  };

  const handleInputChange = (exerciseId, setIdx, field, val) => {
    const updated = exercises.map(ex => {
      if (ex.id === exerciseId) {
        const nextSets = [...ex.sets];
        nextSets[setIdx] = { ...nextSets[setIdx], [field]: parseInt(val) || 0 };
        return { ...ex, sets: nextSets };
      }
      return ex;
    });
    setExercises(updated);
  };

  const handleLoadSplit = (splitName) => {
    setActiveSplit(splitName);
    const suggested = pplSuggestions[splitName] || [];
    const formatted = suggested.map((s, idx) => ({
      id: idx + 1,
      name: s.name,
      group: s.group,
      difficulty: s.difficulty,
      equipment: s.equipment,
      sets: [
        { reps: 10, lbs: 100, done: false },
        { reps: 10, lbs: 100, done: false },
        { reps: 8, lbs: 110, done: false }
      ]
    }));
    setExercises(formatted);
  };

  // Format Duration string
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Consistency calendar mock values (5 weeks, 7 days/week)
  const heatmapDays = [
    [30, 45, 0, 60, 45, 90, 0],
    [0, 60, 30, 45, 0, 75, 60],
    [45, 0, 60, 45, 50, 90, 0],
    [50, 60, 0, 75, 45, 0, 30],
    [60, 45, 0, 60, 50, 90, 30] // This week
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* WORKOUT STATE TIMER PANEL */}
      <div className="glass-panel" style={{ 
        padding: '1.5rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '1rem',
        background: 'linear-gradient(135deg, rgba(132,204,22,0.15) 0%, rgba(12,20,40,0.7) 100%)',
        borderLeft: '5px solid var(--lime)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
          <div style={{ background: 'rgba(132, 204, 22, 0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
            <Clock size={28} className="text-lime" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Gym Session Logger</h3>
            <p style={{ fontSize: '0.85rem' }}>Active Split: <strong style={{ color: 'var(--lime)' }}>{activeSplit} Workout</strong></p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SESSION DURATION</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{formatTime(workoutDuration)}</div>
          </div>

          {!isWorkoutActive ? (
            <button onClick={handleStartWorkout} className="bg-gradient-emerald-lime" style={{ 
              padding: '0.75rem 1.5rem', border: 'none', borderRadius: '0.75rem', color: '#080d1a', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              <Play size={16} fill="#080d1a" /> Start Workout
            </button>
          ) : (
            <button onClick={handleCompleteWorkout} style={{ 
              padding: '0.75rem 1.5rem', border: '1px solid #ef4444', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', 
              borderRadius: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              <Square size={14} fill="#ef4444" /> End Workout
            </button>
          )}
        </div>
      </div>

      {/* COLUMN LAYOUT */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        
        {/* EXERCISES LOG COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Split selector */}
          <div className="glass-panel" style={{ display: 'flex', padding: '0.35rem', gap: '0.25rem' }}>
            {['Push', 'Pull', 'Legs'].map(split => (
              <button
                key={split}
                onClick={() => handleLoadSplit(split)}
                style={{
                  flex: 1,
                  padding: '0.6rem 0.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: activeSplit === split ? 'var(--bg-tertiary)' : 'transparent',
                  color: activeSplit === split ? 'var(--lime)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}
              >
                {split} Split
              </button>
            ))}
          </div>

          {/* Exercises list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {exercises.map((ex) => (
              <div key={ex.id} className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid var(--border-secondary)', paddingBottom: '0.75rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{ex.name}</h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      {ex.group} • {ex.equipment}
                    </div>
                  </div>
                  <span className="glass-panel" style={{ 
                    padding: '0.2rem 0.5rem', fontSize: '0.7rem', color: 'var(--lime)', borderColor: 'rgba(132,204,22,0.3)',
                    background: 'transparent', fontWeight: 600
                  }}>
                    {ex.difficulty}
                  </span>
                </div>

                {/* Sets Header labels */}
                <div style={{ display: 'grid', gridTemplateColumns: '0.5fr 1fr 1fr 0.5fr', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                  <span>SET</span>
                  <span>LBS (WEIGHT)</span>
                  <span>REPS</span>
                  <span style={{ textAlign: 'center' }}>DONE</span>
                </div>

                {/* Sets values */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {ex.sets.map((set, setIdx) => (
                    <div key={setIdx} style={{ 
                      display: 'grid', gridTemplateColumns: '0.5fr 1fr 1fr 0.5fr', gap: '1rem', alignItems: 'center',
                      padding: '0.35rem 0.5rem', borderRadius: '0.5rem',
                      background: set.done ? 'rgba(16, 185, 129, 0.04)' : 'transparent',
                      transition: 'background 0.2s'
                    }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: set.done ? 'var(--emerald)' : 'var(--text-primary)' }}>{setIdx + 1}</span>
                      
                      <input 
                        type="number" 
                        value={set.lbs}
                        disabled={set.done}
                        onChange={(e) => handleInputChange(ex.id, setIdx, 'lbs', e.target.value)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                      />
                      
                      <input 
                        type="number" 
                        value={set.reps}
                        disabled={set.done}
                        onChange={(e) => handleInputChange(ex.id, setIdx, 'reps', e.target.value)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                      />

                      <button 
                        onClick={() => handleSetToggle(ex.id, setIdx)}
                        style={{
                          margin: '0 auto',
                          width: '24px', height: '24px', borderRadius: '50%',
                          border: set.done ? 'none' : '1px solid var(--border-primary)',
                          background: set.done ? 'var(--emerald)' : 'transparent',
                          color: set.done ? '#080d1a' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Check size={14} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* GYM TIMERS & CONSISTENCY HEATMAP COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Rest settings card */}
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Rest Period Configurations</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[30, 45, 60, 90, 120].map(s => (
                <button
                  key={s}
                  onClick={() => setTimerMaxSeconds(s)}
                  className="glass-panel"
                  style={{
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.8rem',
                    borderColor: timerMaxSeconds === s ? 'var(--lime)' : 'var(--card-border)',
                    color: timerMaxSeconds === s ? 'var(--lime)' : 'var(--text-secondary)',
                    background: timerMaxSeconds === s ? 'rgba(132, 204, 22, 0.05)' : 'transparent'
                  }}
                >
                  {s}s
                </button>
              ))}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              Your rest countdown will trigger automatically for <strong style={{ color: 'var(--text-primary)' }}>{timerMaxSeconds} seconds</strong> each time you click check on a set.
            </p>
          </div>

          {/* GYM HEATMAP CALENDAR */}
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Gym Consistency Grid</h3>
              <Calendar size={16} className="text-lime" />
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Heatmap visualizing logged workouts. Brighter cells indicate higher activity volumes (mins).
            </p>

            {/* Grid calendar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {/* Header days */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.35rem', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>
              
              {heatmapDays.map((week, weekIdx) => (
                <div key={weekIdx} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.35rem' }}>
                  {week.map((val, dIdx) => {
                    // Decide background color depending on activity value
                    let bg = 'rgba(18, 31, 58, 0.3)';
                    let border = '1px solid rgba(30, 48, 86, 0.4)';
                    if (val > 0 && val <= 45) {
                      bg = 'rgba(16, 185, 129, 0.25)';
                      border = '1px solid rgba(16, 185, 129, 0.4)';
                    } else if (val > 45 && val <= 60) {
                      bg = 'rgba(16, 185, 129, 0.5)';
                      border = '1px solid rgba(16, 185, 129, 0.7)';
                    } else if (val > 60) {
                      bg = 'var(--emerald)';
                      border = 'none';
                    }

                    return (
                      <div 
                        key={dIdx} 
                        style={{
                          height: '24px',
                          borderRadius: '4px',
                          background: bg,
                          border: border,
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                        title={val > 0 ? `${val} minutes logged` : 'Rest day'}
                      ></div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', fontSize: '0.7rem', marginTop: '1rem', alignItems: 'center' }}>
              <span>Less</span>
              <div style={{ width: '10px', height: '10px', background: 'rgba(18, 31, 58, 0.3)', borderRadius: '2px' }}></div>
              <div style={{ width: '10px', height: '10px', background: 'rgba(16, 185, 129, 0.25)', borderRadius: '2px' }}></div>
              <div style={{ width: '10px', height: '10px', background: 'rgba(16, 185, 129, 0.6)', borderRadius: '2px' }}></div>
              <div style={{ width: '10px', height: '10px', background: 'var(--emerald)', borderRadius: '2px' }}></div>
              <span>More</span>
            </div>
          </div>

          {/* AI COACH WORKOUT PROMPTS */}
          <div className="glass-panel" style={{ 
            padding: '1.5rem', 
            textAlign: 'left',
            background: 'linear-gradient(135deg, rgba(132,204,22,0.08) 0%, rgba(16,185,129,0.03) 100%)',
            borderColor: 'rgba(132, 204, 22, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Sparkles size={16} className="text-lime" />
              <h4 style={{ fontSize: '1rem', margin: 0 }}>Workout Optimization Tips</h4>
            </div>
            <p style={{ fontSize: '0.8rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
              "Your incline dumbbell volume increased by <strong>8%</strong> last week. We recommend sticking to 70 lbs for chest movements today, targeting 8 reps to hit mechanical failure in your hypertrophic zone."
            </p>
          </div>

        </div>
      </div>

      {/* REST TIMER POPUP */}
      {showRestPopup && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem', width: '320px', zIndex: 1000,
        }} className="glass-panel animate-fade-in-up glow-lime">
          <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '1.25rem', border: '1px solid rgba(132, 204, 22, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--lime)', letterSpacing: '0.05em' }}>REST TIME COUNTDOWN</span>
              <button 
                onClick={() => { setShowRestPopup(false); setRestSecondsRemaining(0); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                {restSecondsRemaining}s
              </div>
              
              {/* Progress bar */}
              <div style={{ flex: 1, height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${(restSecondsRemaining / timerMaxSeconds) * 100}%`, 
                  background: 'var(--lime)',
                  transition: 'width 1s linear'
                }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <button 
                onClick={() => setRestSecondsRemaining(prev => Math.min(timerMaxSeconds, prev + 15))}
                className="glass-panel"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', flex: 1, background: 'transparent', color: 'var(--text-primary)' }}
              >
                + 15s
              </button>
              <button 
                onClick={() => { setShowRestPopup(false); setRestSecondsRemaining(0); }}
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', flex: 1, background: 'transparent', border: '1px solid var(--border-primary)', borderRadius: '0.5rem', color: 'var(--text-muted)' }}
              >
                Skip Rest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SESSION COMPLETE OVERLAY */}
      {showCompletionOverlay && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(8,13,26,0.92)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100
        }}>
          <div className="glass-panel animate-fade-in-up" style={{ padding: '3rem 2rem', maxWidth: '450px', width: '90%', textAlign: 'center', border: '1px solid var(--lime)' }}>
            <div style={{
              background: 'rgba(132, 204, 22, 0.1)', width: 'fit-content', padding: '1rem', borderRadius: '50%', margin: '0 auto 1.5rem',
              border: '2px solid var(--lime)'
            }}>
              <Trophy size={48} className="text-lime" />
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Workout Finished! ⚡
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Congratulations Kavya! You completed today's <strong>{activeSplit}</strong> split and successfully logged <strong>8 total sets</strong>.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div className="glass-panel" style={{ padding: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duration Logged</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{formatTime(workoutDuration)}</div>
              </div>
              <div className="glass-panel" style={{ padding: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Est. Calories Burned</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--lime)' }}>340 kcal</div>
              </div>
            </div>

            <button 
              onClick={() => setShowCompletionOverlay(false)}
              className="bg-gradient-emerald-lime"
              style={{ width: '100%', padding: '0.75rem', border: 'none', borderRadius: '0.75rem', color: '#080d1a', fontWeight: 700 }}
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
