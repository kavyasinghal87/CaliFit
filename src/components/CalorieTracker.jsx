import React, { useState } from 'react';
import { 
  Search, Plus, Flame, Scan, Apple, Sparkles, X, 
  ChevronDown, AlertCircle, ShoppingBag, Eye
} from 'lucide-react';
import { ProgressRing } from './CustomCharts';

export default function CalorieTracker() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMealSection, setActiveMealSection] = useState('Breakfast');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  
  // Custom Food state
  const [foodName, setFoodName] = useState('');
  const [foodCalories, setFoodCalories] = useState('');
  const [foodProtein, setFoodProtein] = useState('');
  const [foodCarbs, setFoodCarbs] = useState('');
  const [foodFat, setFoodFat] = useState('');

  // Initial logged meals database
  const [loggedFoods, setLoggedFoods] = useState([
    { id: 1, meal: 'Breakfast', name: 'Scrambled Eggs with Avocado', kcal: 380, protein: 24, carbs: 4, fat: 28, portion: '2 large eggs + 1/2 avocado' },
    { id: 2, meal: 'Breakfast', name: 'Whole Wheat Toast', kcal: 150, protein: 6, carbs: 28, fat: 2, portion: '2 slices' },
    { id: 3, meal: 'Lunch', name: 'Grilled Chicken Salad', kcal: 450, protein: 42, carbs: 12, fat: 18, portion: '150g breast + mixed greens' },
    { id: 4, meal: 'Lunch', name: 'Olive Oil Dressing', kcal: 120, protein: 0, carbs: 0, fat: 14, portion: '1 tbsp' },
    { id: 5, meal: 'Dinner', name: 'Baked Salmon with Quinoa', kcal: 580, protein: 46, carbs: 45, fat: 22, portion: '200g salmon + 1 cup quinoa' },
    { id: 6, meal: 'Snacks', name: 'Greek Yogurt with Blueberries', kcal: 180, protein: 18, carbs: 16, fat: 3, portion: '150g yogurt + 50g berries' }
  ]);

  // Food Database dictionary for search and quick-add
  const mockFoodDatabase = [
    { name: 'Double Whey Shake', kcal: 260, protein: 50, carbs: 6, fat: 3, portion: '2 scoops (60g)' },
    { name: 'Oatmeal with Honey', kcal: 320, protein: 10, carbs: 55, fat: 5, portion: '1 cup cooked' },
    { name: 'Ribeye Steak (Grilled)', kcal: 620, protein: 54, carbs: 0, fat: 46, portion: '250g' },
    { name: 'Sweet Potato (Baked)', kcal: 160, protein: 3, carbs: 37, fat: 0, portion: '1 medium' },
    { name: 'Almonds', kcal: 170, protein: 6, carbs: 6, fat: 15, portion: '1 oz (28g)' },
    { name: 'Banana', kcal: 105, protein: 1, carbs: 27, fat: 0, portion: '1 medium' },
    { name: 'Canned Tuna in Water', kcal: 150, protein: 32, carbs: 0, fat: 1.5, portion: '1 can' },
    { name: 'Brown Rice', kcal: 215, protein: 5, carbs: 45, fat: 2, portion: '1 cup cooked' }
  ];

  // Calculations
  const totalCalories = loggedFoods.reduce((acc, f) => acc + f.kcal, 0);
  const totalProtein = loggedFoods.reduce((acc, f) => acc + f.protein, 0);
  const totalCarbs = loggedFoods.reduce((acc, f) => acc + f.carbs, 0);
  const totalFat = loggedFoods.reduce((acc, f) => acc + f.fat, 0);
  
  const calorieGoal = 2200;
  const calPercent = Math.round((totalCalories / calorieGoal) * 100);

  const handleQuickAdd = (food) => {
    const newFood = {
      id: Date.now(),
      meal: activeMealSection,
      name: food.name,
      kcal: food.kcal,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      portion: food.portion
    };
    setLoggedFoods(prev => [...prev, newFood]);
  };

  const handleCustomAddSubmit = (e) => {
    e.preventDefault();
    if (!foodName || !foodCalories) return;
    
    const newFood = {
      id: Date.now(),
      meal: activeMealSection,
      name: foodName,
      kcal: parseInt(foodCalories) || 0,
      protein: parseInt(foodProtein) || 0,
      carbs: parseInt(foodCarbs) || 0,
      fat: parseInt(foodFat) || 0,
      portion: 'Custom portion'
    };

    setLoggedFoods(prev => [...prev, newFood]);
    setFoodName('');
    setFoodCalories('');
    setFoodProtein('');
    setFoodCarbs('');
    setFoodFat('');
    setShowAddModal(false);
  };

  const handleDeleteFood = (id) => {
    setLoggedFoods(prev => prev.filter(f => f.id !== id));
  };

  const filteredDB = mockFoodDatabase.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* TOP HEADER SUMMARY BAR */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem'
      }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <ProgressRing percentage={calPercent} size={90} strokeWidth={8} color="var(--emerald)" glow={false}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{calPercent}%</span>
          </ProgressRing>
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Daily Goal</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{totalCalories} <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>/ {calorieGoal} kcal</span></div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'left' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>PROTEIN TARGET</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--emerald)' }}>{totalProtein}g <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ 150g</span></div>
          <div style={{ height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', marginTop: '0.5rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(100, (totalProtein / 150) * 100)}%`, background: 'var(--emerald)' }}></div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'left' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>CARBS TARGET</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--lime)' }}>{totalCarbs}g <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ 240g</span></div>
          <div style={{ height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', marginTop: '0.5rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(100, (totalCarbs / 240) * 100)}%`, background: 'var(--lime)' }}></div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'left' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>FATS TARGET</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--emerald)' }}>{totalFat}g <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ 70g</span></div>
          <div style={{ height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', marginTop: '0.5rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(100, (totalFat / 70) * 100)}%`, background: 'var(--emerald)', opacity: 0.7 }}></div>
          </div>
        </div>
      </div>

      {/* CORE LOGGING WORKSPACE */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        
        {/* FOOD LOGGER COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Meal Section Toggle Tab */}
          <div className="glass-panel" style={{ display: 'flex', padding: '0.35rem', gap: '0.25rem' }}>
            {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal) => (
              <button
                key={meal}
                onClick={() => setActiveMealSection(meal)}
                style={{
                  flex: 1,
                  padding: '0.6rem 0.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: activeMealSection === meal ? 'var(--bg-tertiary)' : 'transparent',
                  color: activeMealSection === meal ? 'var(--emerald)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {meal}
              </button>
            ))}
          </div>

          {/* Active Logged Food List */}
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Logged for {activeMealSection}</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => setShowScanner(true)}
                  className="glass-panel"
                  style={{
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    borderColor: 'var(--lime)',
                    color: 'var(--lime)',
                    background: 'transparent'
                  }}
                >
                  <Scan size={14} /> Scanner
                </button>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-emerald-lime"
                  style={{
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.8rem',
                    border: 'none',
                    borderRadius: '0.50rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: '#080d1a',
                    fontWeight: 700
                  }}
                >
                  <Plus size={14} /> Add custom
                </button>
              </div>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {loggedFoods.filter(f => f.meal === activeMealSection).length === 0 ? (
                <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Apple size={36} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                  <p style={{ fontSize: '0.9rem' }}>No meals logged yet. Search the database or log a custom plate above.</p>
                </div>
              ) : (
                loggedFoods.filter(f => f.meal === activeMealSection).map((food) => (
                  <div key={food.id} className="glass-panel" style={{ 
                    padding: '1rem', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.01)',
                    borderColor: 'var(--border-secondary)'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{food.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{food.portion}</div>
                      
                      {/* Macro chips */}
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                        <span style={{ color: 'var(--emerald)' }}>P: {food.protein}g</span>
                        <span style={{ color: 'var(--lime)' }}>C: {food.carbs}g</span>
                        <span style={{ color: 'var(--text-secondary)' }}>F: {food.fat}g</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--emerald)' }}>{food.kcal}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>kcal</div>
                      </div>
                      
                      <button 
                        onClick={() => handleDeleteFood(food.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          padding: '0.2rem',
                          cursor: 'pointer'
                        }}
                        onMouseOver={e=>e.target.style.color='#f43f5e'}
                        onMouseOut={e=>e.target.style.color='var(--text-muted)'}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Calories sum footer */}
            {loggedFoods.filter(f => f.meal === activeMealSection).length > 0 && (
              <div style={{ 
                marginTop: '1.5rem', 
                borderTop: '1px solid var(--border-secondary)', 
                paddingTop: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.9rem',
                fontWeight: 700
              }}>
                <span>Total {activeMealSection} Calories:</span>
                <span className="text-gradient-emerald-lime" style={{ fontFamily: 'var(--font-mono)' }}>
                  {loggedFoods.filter(f => f.meal === activeMealSection).reduce((a, b) => a + b.kcal, 0)} kcal
                </span>
              </div>
            )}

          </div>
        </div>

        {/* FOOD SEARCH & AI SUGGESTIONS COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Quick-Search Bar */}
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Search Food Database</h3>
            
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Search chicken, eggs, oatmeal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', paddingLeft: '2.5rem' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto', paddingRight: '0.25rem' }}>
              {filteredDB.map((food, idx) => (
                <div key={idx} className="glass-panel" style={{ 
                  padding: '0.75rem 1rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.01)',
                  borderColor: 'rgba(255,255,255,0.04)'
                }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{food.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{food.portion} • P: {food.protein}g</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{food.kcal} kcal</span>
                    <button 
                      onClick={() => handleQuickAdd(food)}
                      className="glass-panel"
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        borderColor: 'var(--emerald)',
                        color: 'var(--emerald)',
                        background: 'transparent',
                        fontWeight: 700
                      }}
                      onMouseOver={e=>{e.target.style.background='var(--emerald)'; e.target.style.color='#080d1a'}}
                      onMouseOut={e=>{e.target.style.background='transparent'; e.target.style.color='var(--emerald)'}}
                    >
                      + Log
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI MEAL RECOMMENDATION BOX */}
          <div className="glass-panel" style={{ 
            padding: '1.5rem', 
            textAlign: 'left',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(132,204,22,0.03) 100%)',
            borderColor: 'rgba(16, 185, 129, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Sparkles size={18} className="text-emerald" />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>AI Meal Intelligence</h3>
            </div>
            
            <p style={{ fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>
              Based on your target of 2,200 kcal and current remaining balance of <strong>720 kcal</strong>, here is a suggested high-protein meal:
            </p>

            <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(12,20,40,0.5)', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--lime)' }}>Grilled Cod with Asparagus & Yam</div>
              <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                Cod fish provides lean muscle-synthesizing proteins, while yams release slow-glycemic carbs for muscle recovery.
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                <span>🔥 420 kcal</span>
                <span>🍗 38g Protein</span>
                <span>🥖 45g Carbs</span>
              </div>
            </div>

            <button 
              onClick={() => handleQuickAdd({ name: 'Grilled Cod with Asparagus & Yam', kcal: 420, protein: 38, carbs: 45, fat: 4, portion: '200g cod + yams' })}
              className="bg-gradient-emerald-lime"
              style={{
                width: '100%',
                padding: '0.6rem',
                border: 'none',
                borderRadius: '0.75rem',
                color: '#080d1a',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              Add Suggested Meal to {activeMealSection}
            </button>
          </div>

        </div>
      </div>

      {/* SCANNING BARCODE MODAL SIMULATION */}
      {showScanner && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(8,13,26,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel animate-fade-in-up" style={{ padding: '2rem', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Barcode Scanner</h3>
              <button onClick={() => setShowScanner(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Camera Mockup viewport */}
            <div style={{
              width: '100%', height: '240px', background: '#020617', borderRadius: '1rem', position: 'relative',
              overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-primary)'
            }}>
              {/* Scan target guidelines */}
              <div style={{
                width: '80%', height: '60%', border: '2px dashed var(--lime)', borderRadius: '0.5rem',
                boxShadow: '0 0 20px rgba(132, 204, 22, 0.2)', position: 'relative'
              }}>
                {/* Horizontal scanner beam line */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '3px',
                  background: 'var(--lime)', boxShadow: '0 0 10px var(--lime)',
                  animation: 'float 2s ease-in-out infinite'
                }}></div>
              </div>
              <div style={{ position: 'absolute', bottom: '1rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                [Simulating camera feed...]
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', margin: '1rem 0', color: 'var(--text-secondary)' }}>
              Hold a food barcode in front of the lens to search databases.
            </p>

            <button 
              onClick={() => {
                handleQuickAdd({ name: 'Peak Protein Fuel Shake (Scanned)', kcal: 280, protein: 40, carbs: 12, fat: 4, portion: '1 bottle (330ml)' });
                setShowScanner(false);
              }}
              className="bg-gradient-emerald-lime"
              style={{ width: '100%', padding: '0.75rem', border: 'none', borderRadius: '0.75rem', color: '#080d1a', fontWeight: 700 }}
            >
              Simulate Scan: "Protein Fuel Shake"
            </button>
          </div>
        </div>
      )}

      {/* CUSTOM ADD MODAL */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(8,13,26,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel animate-fade-in-up" style={{ padding: '2rem', maxWidth: '450px', width: '90%', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Add Custom Meal Log</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCustomAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Meal Category</label>
                <select value={activeMealSection} onChange={(e) => setActiveMealSection(e.target.value)} style={{ width: '100%' }}>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Food / Dish Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Protein Oatmeal Bowl"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Calories (kcal)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g., 350"
                    value={foodCalories}
                    onChange={(e) => setFoodCalories(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Protein (g)</label>
                  <input
                    type="number"
                    placeholder="e.g., 25"
                    value={foodProtein}
                    onChange={(e) => setFoodProtein(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Carbs (g)</label>
                  <input
                    type="number"
                    placeholder="e.g., 30"
                    value={foodCarbs}
                    onChange={(e) => setFoodCarbs(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Fat (g)</label>
                  <input
                    type="number"
                    placeholder="e.g., 8"
                    value={foodFat}
                    onChange={(e) => setFoodFat(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="bg-gradient-emerald-lime"
                style={{ width: '100%', padding: '0.75rem', border: 'none', borderRadius: '0.75rem', color: '#080d1a', fontWeight: 700, marginTop: '1rem' }}
              >
                Log Meal Plate
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
