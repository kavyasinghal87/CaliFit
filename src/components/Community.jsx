import React, { useState } from 'react';
import { 
  Users, MessageSquare, ThumbsUp, Flame, Trophy, 
  Compass, Shield, AlertCircle, Share2, Award, Heart, Plus, Sparkles
} from 'lucide-react';

export default function Community() {
  const [activeTab, setActiveTab] = useState('Feed');
  
  // Follow button toggle state dictionary
  const [following, setFollowing] = useState({});

  // Likes counts state
  const [likes, setLikes] = useState({
    1: 42,
    2: 128,
    3: 86
  });

  const posts = [
    {
      id: 1,
      author: "Alex Rivers",
      handle: "@alex_lifts",
      avatarLetter: "A",
      role: "Pro Athlete",
      time: "2 hours ago",
      text: "Just hit a new PR on squats! 140kg for 6 reps. Feeling incredibly fueled after adopting the FitSync AI custom carb loading suggestion last night. Consistency pays off!",
      workout: "Legs Split: 4 Exercises • 420 kcal burned",
      comments: 6
    },
    {
      id: 2,
      author: "Sarah Chen",
      handle: "@sarah_fit",
      avatarLetter: "S",
      role: "Certified Coach",
      time: "5 hours ago",
      text: "Prep meals for the week are complete! 🍱 Focused on getting 160g protein a day. Lots of grilled cod, chicken breast, steamed yams, and egg white muffins. If anyone needs meal planning templates, hit me up!",
      workout: "Nutrition Plan: 1,800 kcal high-protein split",
      comments: 18
    },
    {
      id: 3,
      author: "Marcus Aurelius",
      handle: "@marcus_fit",
      avatarLetter: "M",
      role: "FitSync Ambassador",
      time: "1 day ago",
      text: "Completed the 10,000 steps streak challenge! 14 straight days hitting the target. Energy levels are higher than ever, and my cardiovascular recovery is down to 58 bpm.",
      workout: "Cardio Log: 11,200 Steps • 45 mins",
      comments: 11
    }
  ];

  const leaderboards = [
    { rank: 1, name: "Marcus Aurelius", score: "148,420 steps", avatarLetter: "M", color: "#fb923c" },
    { rank: 2, name: "Sarah Chen", score: "135,100 steps", avatarLetter: "S", color: "#e2e8f0" },
    { rank: 3, name: "Kavya (You)", score: "128,420 steps", avatarLetter: "K", color: "#a97c50" },
    { rank: 4, name: "Alex Rivers", score: "112,500 steps", avatarLetter: "A", color: "transparent" }
  ];

  const challenges = [
    { title: "Summer Shred 30-Day", participants: "12,420 joined", reward: "+500 XP", active: true },
    { title: "150g Protein Daily Log", participants: "8,920 joined", reward: "+300 XP", active: true },
    { title: "100k Steps Week Sprint", participants: "6,500 joined", reward: "+400 XP", active: false }
  ];

  const handleFollowToggle = (handle) => {
    setFollowing(prev => ({
      ...prev,
      [handle]: !prev[handle]
    }));
  };

  const handleLikeClick = (id) => {
    setLikes(prev => ({
      ...prev,
      [id]: prev[id] + 1
    }));
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '2rem',
      alignItems: 'stretch'
    }}>
      
      {/* SOCIAL FEED COLUMN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', gridColumn: 'span 1' }}>
        
        {/* Post creation box mockup */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Share Your Progress</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-tertiary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--lime)'
            }}>K</div>
            <textarea 
              placeholder="Completed a lifting session? Hit your protein goals? Share here..."
              rows={2}
              style={{ flex: 1, resize: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="bg-gradient-emerald-lime" style={{ 
              border: 'none', color: '#080d1a', fontWeight: 700, padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontSize: '0.8rem'
            }}>
              Post Feed
            </button>
          </div>
        </div>

        {/* Feed tab selections */}
        <div className="glass-panel" style={{ display: 'flex', padding: '0.35rem', gap: '0.25rem' }}>
          {['Feed', 'Trending', 'My Activity'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: activeTab === tab ? 'var(--bg-tertiary)' : 'transparent',
                color: activeTab === tab ? 'var(--emerald)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Social posts list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {posts.map((post) => (
            <div key={post.id} className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left' }}>
              
              {/* Post author header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-tertiary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--lime)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>{post.avatarLetter}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{post.author}</span>
                      <span className="glass-panel" style={{ 
                        padding: '0.1rem 0.4rem', fontSize: '0.65rem', color: 'var(--emerald)', borderColor: 'rgba(16,185,129,0.3)',
                        background: 'transparent', fontWeight: 600
                      }}>{post.role}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{post.handle} • {post.time}</div>
                  </div>
                </div>

                <button 
                  onClick={() => handleFollowToggle(post.handle)}
                  className="glass-panel"
                  style={{
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.75rem',
                    borderColor: following[post.handle] ? 'var(--card-border)' : 'var(--emerald)',
                    color: following[post.handle] ? 'var(--text-muted)' : 'var(--emerald)',
                    background: 'transparent',
                    fontWeight: 700
                  }}
                >
                  {following[post.handle] ? 'Following' : '+ Follow'}
                </button>
              </div>

              {/* Body */}
              <p style={{ fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                {post.text}
              </p>

              {/* Shared workout attachment badge */}
              {post.workout && (
                <div className="glass-panel" style={{ 
                  padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.01)', borderColor: 'var(--border-secondary)',
                  display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem'
                }}>
                  <div style={{ background: 'rgba(132, 204, 22, 0.1)', padding: '0.4rem', borderRadius: '0.5rem' }}>
                    <Flame size={16} className="text-lime" />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{post.workout}</span>
                </div>
              )}

              {/* Actions footer */}
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-secondary)', paddingTop: '0.75rem' }}>
                <button 
                  onClick={() => handleLikeClick(post.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  onMouseOver={e=>e.currentTarget.style.color='var(--emerald)'}
                  onMouseOut={e=>e.currentTarget.style.color='var(--text-muted)'}
                >
                  <ThumbsUp size={15} /> {likes[post.id]} Likes
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MessageSquare size={15} /> {post.comments} Comments
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                  <Share2 size={15} /> Share
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* LEADERBOARDS & CHALLENGES COLUMN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* LEADERBOARD WIDGET */}
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={18} className="text-lime" /> Weekly Step Leaderboard
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {leaderboards.map((user, idx) => {
              const isKavya = user.name.includes("Kavya");
              return (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '0.75rem',
                    background: isKavya ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                    border: isKavya ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Rank indicator color */}
                    <span style={{ 
                      width: '22px', height: '22px', borderRadius: '50%', background: user.color, 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800,
                      color: user.color !== 'transparent' ? '#080d1a' : 'var(--text-muted)'
                    }}>{user.rank}</span>
                    
                    <div style={{ 
                      width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-tertiary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem'
                    }}>{user.avatarLetter}</div>

                    <span style={{ fontWeight: isKavya ? 700 : 600, fontSize: '0.85rem' }}>{user.name}</span>
                  </div>

                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: isKavya ? 'var(--emerald)' : 'var(--text-primary)' }}>
                    {user.score}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ACTIVE CHALLENGES */}
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} className="text-emerald" /> Global Challenges
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {challenges.map((item, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)', borderColor: 'var(--border-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{item.participants}</div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--lime)', fontWeight: 700 }}>
                    {item.reward}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--emerald)' }}></div>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--lime)' }}></div>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)' }}></div>
                  </div>

                  {item.active ? (
                    <button style={{ 
                      border: '1px solid var(--border-primary)', color: 'var(--text-muted)', background: 'transparent',
                      padding: '0.3rem 0.75rem', fontSize: '0.75rem', borderRadius: '0.5rem', cursor: 'default'
                    }}>
                      Joined
                    </button>
                  ) : (
                    <button 
                      className="bg-gradient-emerald-lime"
                      style={{ 
                        border: 'none', color: '#080d1a', fontWeight: 700,
                        padding: '0.3rem 0.75rem', fontSize: '0.75rem', borderRadius: '0.5rem'
                      }}
                    >
                      Join Challenge
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
