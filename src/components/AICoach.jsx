import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, User, Dumbbell, Flame, Heart, 
  HelpCircle, Compass, Smile, Info, RefreshCw, Zap
} from 'lucide-react';

export default function AICoach() {
  const [messages, setMessages] = useState([
    { 
      sender: 'ai', 
      text: "Hello Kavya! I am your FitSync AI Personal Coach. I have analyzed your metrics: 76.8 kg weight, 14.8% body fat, and your active workout streak of 14 days. How can I optimize your nutrition, lifting volumes, or recovery protocols today?",
      time: '16:02'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const suggestedPrompts = [
    "Design a 4-day PPL lifting routine",
    "Calculate my daily macro distribution for leaning out",
    "High-protein vegetarian breakfast ideas",
    "How to manage muscle soreness (DOMS)"
  ];

  // Auto-scroll chats
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate AI response after delay
    setTimeout(() => {
      let aiResponseText = '';
      const promptLower = text.toLowerCase();

      if (promptLower.includes('ppl') || promptLower.includes('workout') || promptLower.includes('routine')) {
        aiResponseText = "Here is a highly optimized 4-Day Push Pull Legs (PPL) hypertrophic split:\n\n• **Day 1 (Push)**: Incline Dumbbell Bench (3 sets x 8-10 reps) + Overhead Barbell Press (3 sets x 8-10 reps) + Lateral Raises + Tricep extensions.\n• **Day 2 (Pull)**: Weighted Pull-ups (4 sets x 6-8 reps) + Barbell Row (3 sets x 10 reps) + Incline Hammer Curls (3 sets x 12 reps).\n• **Day 3 (Legs)**: Back Squats (4 sets x 6-8 reps) + Romanian Deadlifts (3 sets x 10 reps) + Calf Raises + Ab Planks.\n• **Day 4 (Rest & Recovery)**: Steady-state cardio (30 mins zones 1-2) + active stretching.\n\nKeep progressive overload in focus—aim to increase weight or sets by 2.5-5% weekly.";
      } else if (promptLower.includes('macro') || promptLower.includes('nutrition') || promptLower.includes('protein')) {
        aiResponseText = "To target body fat reduction while retaining lean muscle tissues at 76.8 kg, your macro split is mapped at:\n\n• **Total Budget**: 2,200 kcal/day\n• **Protein (30%)**: 150 grams (essential for myofibrillar repair)\n• **Carbs (45%)**: 240 grams (glycogen replenishment)\n• **Fats (25%)**: 70 grams (hormonal regulation)\n\nTry to distribute this into 4 meals of 35g-40g protein each, spaced 3-4 hours apart to maximize muscle protein synthesis.";
      } else if (promptLower.includes('breakfast') || promptLower.includes('meal')) {
        aiResponseText = "Here is a premium high-protein breakfast template:\n\n**Option A: FitSync Oatmeal Pro (450 kcal)**\n- 60g Rolled Oats + 1 scoop Whey Protein Isolate (mix post-cooking)\n- 150ml unsweetened almond milk\n- 50g blueberries + 10g almonds\n*Macros: 42g Protein / 50g Carbs / 8g Fat*\n\n**Option B: Avocado & Egg Scramble (380 kcal)**\n- 2 whole organic eggs + 3 egg whites scramble\n- 50g avocado spread on 1 slice whole wheat sourdough bread\n*Macros: 35g Protein / 20g Carbs / 16g Fat*";
      } else if (promptLower.includes('soreness') || promptLower.includes('recovery') || promptLower.includes('doms')) {
        aiResponseText = "Muscle soreness (DOMS) indicates micro-tears in the muscle fibers. To fast-track your recovery:\n\n1. **Hydration**: Aim for 3.5L of water daily. Add electrolytes if training in warm rooms.\n2. **Active Recovery**: 15-20 min light walk to promote oxygenated blood flow to damaged tissues.\n3. **Nutrition**: Keep your protein intake high (150g target). Supplement with 5g Creatine Monohydrate daily.\n4. **Sleep**: Prioritize 7.5-8.5 hours. Growth hormone release peaks during slow-wave deep sleep cycles.";
      } else {
        aiResponseText = `Understood. That is a great question. In order to help you optimize that, I suggest maintaining your daily logging streak of 14 days and ensuring that you fuel your muscle recovery within 2 hours post-workout. Would you like me to generate a personalized meal template or adjust your active calorie target?`;
      }

      setIsTyping(false);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: aiResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  const handlePromptClick = (prompt) => {
    handleSendMessage(prompt);
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '2rem',
      alignItems: 'stretch'
    }}>
      
      {/* CHAT INTERFACE PANEL */}
      <div className="glass-panel" style={{ 
        padding: '1.5rem', 
        display: 'flex', 
        flexDirection: 'column', 
        height: '600px', 
        justifyContent: 'space-between',
        gridColumn: 'span 1'
      }}>
        {/* Chat header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-secondary)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left' }}>
            <div className="bg-gradient-emerald-lime animate-pulse-neon" style={{ 
              padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Sparkles size={18} color="#080d1a" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>FitSync Coach AI</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--emerald)' }}>Active Health Advisor • Online</p>
            </div>
          </div>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)' }}>
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Chats view screen */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.25rem', 
          paddingRight: '0.5rem',
          marginBottom: '1rem'
        }}>
          {messages.map((msg, idx) => {
            const isAI = msg.sender === 'ai';
            return (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignSelf: isAI ? 'flex-start' : 'flex-end',
                  alignItems: isAI ? 'flex-start' : 'flex-end',
                  maxWidth: '85%',
                  textAlign: 'left'
                }}
              >
                <div style={{ 
                  background: isAI ? 'var(--bg-tertiary)' : 'linear-gradient(135deg, var(--emerald) 0%, var(--lime) 100%)',
                  color: isAI ? 'var(--text-primary)' : '#080d1a',
                  padding: '0.75rem 1.1rem',
                  borderRadius: isAI ? '0.25rem 1rem 1rem 1rem' : '1rem 0.25rem 1rem 1rem',
                  fontSize: '0.9rem',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.55,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}>
                  {msg.text}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
                  {msg.time} {isAI ? '• Coach AI' : '• Kavya'}
                </span>
              </div>
            );
          })}

          {/* Typing Indicator bubbles */}
          {isTyping && (
            <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-start', background: 'var(--bg-tertiary)', padding: '0.75rem 1.25rem', borderRadius: '0.25rem 1rem 1rem 1rem' }}>
              <div style={{ width: '6px', height: '6px', background: 'var(--emerald)', borderRadius: '50%', animation: 'float 1s infinite alternate' }}></div>
              <div style={{ width: '6px', height: '6px', background: 'var(--emerald)', borderRadius: '50%', animation: 'float 1s infinite alternate', animationDelay: '0.2s' }}></div>
              <div style={{ width: '6px', height: '6px', background: 'var(--emerald)', borderRadius: '50%', animation: 'float 1s infinite alternate', animationDelay: '0.4s' }}></div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input box form */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Ask anything about protein, fat loss, rest splits..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputVal)}
            style={{ width: '100%', paddingRight: '3rem' }}
          />
          <button 
            onClick={() => handleSendMessage(inputVal)}
            style={{ 
              position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)',
              background: 'transparent', border: 'none', color: 'var(--emerald)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <Send size={18} />
          </button>
        </div>

      </div>

      {/* QUICK PROMPTS & AI DIAGNOSTICS COLUMN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Suggested Prompts List */}
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={18} className="text-lime" /> Quick Fitness Prompts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptClick(prompt)}
                className="glass-panel"
                style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.8rem',
                  textAlign: 'left',
                  background: 'rgba(255,255,255,0.01)',
                  color: 'var(--text-secondary)',
                  borderColor: 'rgba(255,255,255,0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e=>{e.target.style.borderColor='var(--emerald)'; e.target.style.color='var(--text-primary)'}}
                onMouseOut={e=>{e.target.style.borderColor='rgba(255,255,255,0.04)'; e.target.style.color='var(--text-secondary)'}}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* AI Diagnostics Panel */}
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={18} className="text-emerald" /> AI Diagnostics Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Metric 1 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-secondary)', paddingBottom: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>CNS Recovery Score</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Based on sleep & resting HR</div>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--lime)', fontFamily: 'var(--font-mono)' }}>94% <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>Optimal</span></div>
            </div>

            {/* Metric 2 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-secondary)', paddingBottom: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Hypertrophic Volume Index</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Accumulated tonnage index</div>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>4.2x <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>Steady</span></div>
            </div>

            {/* Metric 3 */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Daily Thermic Effect (TEF)</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Est. digestion energy expenditure</div>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>220 kcal</div>
            </div>
          </div>

          <div className="glass-panel" style={{ 
            marginTop: '1.5rem', padding: '0.75rem 1rem', background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.15)', fontSize: '0.8rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              <Info size={14} className="text-emerald" /> Recommended Action
            </div>
            Maintain active posture for at least 30 minutes after your high-carb post-workout shakes to improve glucose transit dynamics.
          </div>
        </div>

      </div>

    </div>
  );
}
