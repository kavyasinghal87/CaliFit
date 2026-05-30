import React, { useState } from 'react';
import { 
  ShieldAlert, Users, Database, Activity, RefreshCw, 
  Trash2, ToggleLeft, ToggleRight, Plus, CheckCircle, Info, Server, Cpu
} from 'lucide-react';

export default function AdminPanel() {
  const [usersList, setUsersList] = useState([
    { id: 1, name: "Kavya S.", email: "kavya@gmail.com", role: "Premium Member", workoutsLogged: 42, activeStreak: 14, joinDate: "May 14, 2026" },
    { id: 2, name: "Alex Rivers", email: "alex@rivers.io", role: "Premium Member", workoutsLogged: 92, activeStreak: 4, joinDate: "Feb 02, 2026" },
    { id: 3, name: "Sarah Chen", email: "sarah_chen@outlook.com", role: "Basic Member", workoutsLogged: 12, activeStreak: 0, joinDate: "Apr 28, 2026" },
    { id: 4, name: "Marcus Aurelius", email: "emperor@rome.gov", role: "Basic Member", workoutsLogged: 114, activeStreak: 30, joinDate: "Jan 12, 2026" }
  ]);

  const [newExName, setNewExName] = useState('');
  const [newExGroup, setNewExGroup] = useState('Chest');
  const [newExDifficulty, setNewExDifficulty] = useState('Intermediate');
  const [showAddSuccess, setShowAddSuccess] = useState(false);

  const [systemLogs, setSystemLogs] = useState([
    { id: 1, type: "info", text: "Database optimization script executed successfully", time: "16:20:11" },
    { id: 2, type: "warning", text: "AI Coach assistant prompt buffer reached 85% capacity", time: "15:45:02" },
    { id: 3, type: "success", text: "Synced 12,420 user backup logs to storage cluster B", time: "14:00:22" }
  ]);

  const handleDeleteUser = (id) => {
    setUsersList(prev => prev.filter(u => u.id !== id));
  };

  const handleTogglePremium = (id) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === id) {
        const isPremium = u.role === "Premium Member";
        return {
          ...u,
          role: isPremium ? "Basic Member" : "Premium Member"
        };
      }
      return u;
    }));
  };

  const handleAddExerciseSubmit = (e) => {
    e.preventDefault();
    if (!newExName) return;

    setShowAddSuccess(true);
    setNewExName('');
    setTimeout(() => {
      setShowAddSuccess(false);
    }, 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* SYSTEM KPI ROW */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem'
      }}>
        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.6rem', borderRadius: '0.5rem' }}>
            <Users size={20} className="text-emerald" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL PLATFORM USERS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>12,854</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(132, 204, 22, 0.1)', padding: '0.6rem', borderRadius: '0.5rem' }}>
            <Activity size={20} className="text-lime" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>WORKOUTS LOGGED TODAY</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>4,820</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.6rem', borderRadius: '0.5rem' }}>
            <Database size={20} className="text-emerald" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FOOD DATABASE ITEMS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>10.2M</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(132, 204, 22, 0.1)', padding: '0.6rem', borderRadius: '0.5rem' }}>
            <Server size={20} className="text-lime" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SYSTEM CLUSTER LOAD</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--lime)' }}>24.2%</div>
          </div>
        </div>
      </div>

      {/* ADMIN UTILITIES WORKSPACE */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        
        {/* USER LIST MANAGER */}
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left', gridColumn: 'span 1' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            User Account Management
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {usersList.map((user) => {
              const isPremium = user.role === "Premium Member";
              return (
                <div key={user.id} className="glass-panel" style={{ 
                  padding: '1rem', background: 'rgba(255,255,255,0.01)', borderColor: 'var(--border-secondary)',
                  display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem'
                }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email} • Streaks: {user.activeStreak}d</div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Joined: {user.joinDate}</span>
                      <span style={{ fontSize: '0.7rem', color: isPremium ? 'var(--emerald)' : 'var(--text-muted)', fontWeight: 600 }}>{user.role}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button 
                      onClick={() => handleTogglePremium(user.id)}
                      style={{ background: 'transparent', border: 'none', color: isPremium ? 'var(--emerald)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                      title="Toggle Premium Status"
                    >
                      {isPremium ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      onMouseOver={e=>e.currentTarget.style.color='#ef4444'}
                      onMouseOut={e=>e.currentTarget.style.color='var(--text-muted)'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DATABASE EXERCISE MANAGER & LOGS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Add exercise form */}
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Add Exercise Template</h3>

            {showAddSuccess && (
              <div className="glass-panel" style={{ padding: '0.75rem', marginBottom: '1rem', background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.25)', color: 'var(--emerald)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} /> Movement added to system database template.
              </div>
            )}

            <form onSubmit={handleAddExerciseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Exercise Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Hack Squats"
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Muscle Group</label>
                  <select value={newExGroup} onChange={(e) => setNewExGroup(e.target.value)} style={{ width: '100%' }}>
                    <option value="Chest">Chest</option>
                    <option value="Back">Back</option>
                    <option value="Shoulders">Shoulders</option>
                    <option value="Triceps">Triceps</option>
                    <option value="Biceps">Biceps</option>
                    <option value="Quadriceps">Quadriceps</option>
                    <option value="Hamstrings">Hamstrings</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Difficulty</label>
                  <select value={newExDifficulty} onChange={(e) => setNewExDifficulty(e.target.value)} style={{ width: '100%' }}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="bg-gradient-emerald-lime"
                style={{ width: '100%', padding: '0.6rem', border: 'none', borderRadius: '0.75rem', color: '#080d1a', fontWeight: 700, fontSize: '0.85rem' }}
              >
                Create Global Template
              </button>
            </form>
          </div>

          {/* System logs */}
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              System Alert & Log Cluster
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              {systemLogs.map((log) => {
                let badgeColor = 'var(--text-muted)';
                if (log.type === 'warning') badgeColor = '#f59e0b';
                if (log.type === 'success') badgeColor = 'var(--emerald)';
                
                return (
                  <div key={log.id} style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-secondary)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>[{log.time}]</span>
                    <span style={{ color: badgeColor, fontWeight: 'bold' }}>[{log.type.toUpperCase()}]</span>
                    <span style={{ color: 'var(--text-primary)' }}>{log.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
