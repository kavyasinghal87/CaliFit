import React, { useState, useRef } from 'react';
import { 
  Search, Plus, Flame, Scan, Apple, Sparkles, X, 
  ChevronDown, AlertCircle, ShoppingBag, Eye, Camera
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

  // AI Meal Scanner state
  const [showMealScanner, setShowMealScanner] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [scannedImage, setScannedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [apiError, setApiError] = useState(null);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = async () => {
    try {
      setApiError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Could not start video stream, falling back to file upload:", err);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const handleOpenScanner = () => {
    setScannedImage(null);
    setAnalysisResult(null);
    setShowResults(false);
    setApiError(null);
    setShowMealScanner(true);
    // Attempt camera start
    startCamera();
  };

  const handleCloseScanner = () => {
    stopCamera();
    setShowMealScanner(false);
    setScannedImage(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !cameraStream) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setScannedImage(dataUrl);
    stopCamera();
    analyzeMealImage(dataUrl, 'captured_meal.jpg');
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setScannedImage(dataUrl);
      stopCamera();
      analyzeMealImage(dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  };

  const analyzeMealImage = async (dataUrl, fileName) => {
    setIsAnalyzing(true);
    setApiError(null);
    
    // Simulate active scan loader delay (gives user a premium visual experience)
    const scanDelayPromise = new Promise(resolve => setTimeout(resolve, 2500));
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      let result = null;
      
      if (apiKey && apiKey !== 'your_copied_key_here' && !apiKey.includes('your_')) {
        // Run live API call to Gemini 1.5 Flash
        try {
          const base64Data = dataUrl.split(',')[1];
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{
                  parts: [
                    {
                      text: "You are a professional fitness coach and nutritionist. Analyze this meal photo. Estimate the food items, portions, and total calories (kcal), protein (g), carbs (g), fat (g), and fiber (g). Respond ONLY with a valid raw JSON object. Do not wrap it in markdown block quotes (like ```json). The structure must be EXACTLY: { \"foodName\": \"Name of the dish\", \"portion\": \"Estimated portion size\", \"kcal\": number, \"protein\": number, \"carbs\": number, \"fat\": number, \"fiber\": number }."
                    },
                    {
                      inlineData: {
                        mimeType: "image/jpeg",
                        data: base64Data
                      }
                    }
                  ]
                }]
              })
            }
          );

          if (!response.ok) {
            throw new Error(`Gemini API error: Status ${response.status}`);
          }

          const data = await response.json();
          let responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (!responseText) {
            throw new Error("Invalid response structure from Gemini API");
          }

          // Clean up any potential markdown wrap
          responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
          result = JSON.parse(responseText);
        } catch (err) {
          console.error("Live scan failed, falling back to simulated mock meal:", err);
          setApiError("Live API request failed. Using local Simulation Mode instead.");
        }
      }

      // If no API key or API call failed, fall back to Simulation Mode
      if (!result) {
        // Wait for the scan loader to finish
        await scanDelayPromise;
        
        // Pick simulated meal based on file name or random
        const nameLower = fileName.toLowerCase();
        
        const simulatedMeals = [
          {
            foodName: "Premium Avocado Toast with Egg",
            portion: "1 slice sourdough + 1/2 avocado + 1 poached egg",
            kcal: 340,
            protein: 14,
            carbs: 24,
            fat: 22,
            fiber: 7
          },
          {
            foodName: "Seared Salmon Bowl",
            portion: "150g grilled salmon + 1 cup brown rice + broccoli",
            kcal: 560,
            protein: 42,
            carbs: 38,
            fat: 18,
            fiber: 5
          },
          {
            foodName: "Mediterranean Chicken Salad",
            portion: "150g chicken breast + cucumbers + olives + feta + light vinaigrette",
            kcal: 410,
            protein: 38,
            carbs: 10,
            fat: 16,
            fiber: 4
          },
          {
            foodName: "Protein Berry Waffles",
            portion: "2 oat waffles + 1 scoop vanilla protein cream + blueberries",
            kcal: 380,
            protein: 28,
            carbs: 45,
            fat: 6,
            fiber: 8
          }
        ];

        if (nameLower.includes('salmon') || nameLower.includes('fish')) {
          result = simulatedMeals[1];
        } else if (nameLower.includes('avocado') || nameLower.includes('toast') || nameLower.includes('egg')) {
          result = simulatedMeals[0];
        } else if (nameLower.includes('chicken') || nameLower.includes('salad')) {
          result = simulatedMeals[2];
        } else if (nameLower.includes('waffle') || nameLower.includes('berry') || nameLower.includes('breakfast')) {
          result = simulatedMeals[3];
        } else {
          // Choose randomly
          result = simulatedMeals[Math.floor(Math.random() * simulatedMeals.length)];
        }
      } else {
        // Guarantee fields are numbers and exist
        result = {
          foodName: result.foodName || "Scanned Plate",
          portion: result.portion || "1 serving",
          kcal: Number(result.kcal) || 0,
          protein: Number(result.protein) || 0,
          carbs: Number(result.carbs) || 0,
          fat: Number(result.fat) || 0,
          fiber: Number(result.fiber) || 0
        };
      }

      await scanDelayPromise; // Ensure scan feel is premium
      setAnalysisResult(result);
      setIsAnalyzing(false);
      setShowMealScanner(false);
      setShowResults(true);
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
    }
  };

  const adjustMacro = (field, amount) => {
    setAnalysisResult(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: Math.max(0, (prev[field] || 0) + amount)
      };
    });
  };

  const handleLogScannedMeal = () => {
    if (!analysisResult) return;
    const newFood = {
      id: Date.now(),
      meal: activeMealSection,
      name: analysisResult.foodName,
      kcal: parseInt(analysisResult.kcal) || 0,
      protein: parseInt(analysisResult.protein) || 0,
      carbs: parseInt(analysisResult.carbs) || 0,
      fat: parseInt(analysisResult.fat) || 0,
      fiber: parseInt(analysisResult.fiber) || 0,
      portion: analysisResult.portion
    };
    setLoggedFoods(prev => [...prev, newFood]);
    setShowResults(false);
  };

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
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
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
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={handleOpenScanner}
                  className="glass-panel animate-pulse-neon"
                  style={{
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    borderColor: 'var(--primary)',
                    color: 'var(--primary)',
                    background: 'rgba(255, 106, 0, 0.05)',
                    fontWeight: 700
                  }}
                >
                  <Sparkles size={14} /> AI Meal Scan
                </button>
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
                    color: '#ffffff',
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
                        {food.fiber !== undefined && (
                          <span style={{ color: '#60a5fa' }}>Fb: {food.fiber}g</span>
                        )}
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
                      onMouseOver={e=>{e.target.style.background='var(--emerald)'; e.target.style.color='#ffffff'}}
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
            background: 'linear-gradient(135deg, rgba(255, 106, 0, 0.08) 0%, rgba(255, 140, 26, 0.03) 100%)',
            borderColor: 'rgba(255, 106, 0, 0.25)'
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
                color: '#ffffff',
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
                boxShadow: '0 0 20px rgba(255, 106, 0, 0.2)', position: 'relative'
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
              style={{ width: '100%', padding: '0.75rem', border: 'none', borderRadius: '0.75rem', color: '#ffffff', fontWeight: 700 }}
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
                style={{ width: '100%', padding: '0.75rem', border: 'none', borderRadius: '0.75rem', color: '#ffffff', fontWeight: 700, marginTop: '1rem' }}
              >
                Log Meal Plate
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI MEAL SCANNER VIEWPORT MODAL */}
      {showMealScanner && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(8,13,26,0.9)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200
        }}>
          <div className="glass-panel animate-fade-in-up" style={{ 
            padding: '2rem', maxWidth: '480px', width: '92%', textAlign: 'center',
            borderColor: 'var(--primary)', boxShadow: '0 0 30px rgba(255, 106, 0, 0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles className="text-emerald animate-pulse-neon" size={20} />
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>AI Meal Scanner</h3>
              </div>
              <button onClick={handleCloseScanner} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Viewfinder Wrapper */}
            <div style={{
              width: '100%', height: '320px', background: '#020617', borderRadius: '1.25rem', position: 'relative',
              overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-primary)'
            }}>
              
              {isAnalyzing ? (
                // Scanning animation & processing state
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', zIndex: 10 }}>
                  {scannedImage && (
                    <img 
                      src={scannedImage} 
                      alt="Scanned Plate Preview" 
                      style={{ 
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                        objectFit: 'cover', opacity: 0.6 
                      }} 
                    />
                  )}
                  {/* Laser line running down the viewfinder */}
                  <div className="scanner-laser-line"></div>
                  
                  <div className="glass-panel" style={{ 
                    padding: '0.75rem 1.25rem', background: 'rgba(18,18,18,0.85)', 
                    display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--primary)'
                  }}>
                    <Sparkles className="text-emerald animate-spin-slow" size={16} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Analyzing meal content...
                    </span>
                  </div>
                </div>
              ) : cameraStream ? (
                // Live Camera Viewport
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  {/* Overlay crosshairs */}
                  <div style={{
                    position: 'absolute', width: '70%', height: '70%',
                    border: '1px dashed rgba(255, 106, 0, 0.4)', borderRadius: '1rem', pointerEvents: 'none'
                  }}></div>
                  
                  {/* Capture Button */}
                  <button 
                    onClick={capturePhoto}
                    style={{
                      position: 'absolute', bottom: '1.5rem', width: '3.5rem', height: '3.5rem',
                      borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--lime) 100%)',
                      border: '4px solid #ffffff', boxShadow: '0 0 15px rgba(255, 106, 0, 0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff'
                    }}
                  >
                    <Camera size={20} />
                  </button>
                </>
              ) : (
                // Viewfinder Fallback (No camera active / prompt)
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <Camera size={48} style={{ opacity: 0.4, color: 'var(--primary)' }} />
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '0 1rem' }}>
                    Place food in viewfinder to scan. Camera failed or permission not granted.
                  </p>
                  <button 
                    onClick={triggerFileUpload}
                    className="bg-gradient-emerald-lime"
                    style={{ padding: '0.5rem 1.25rem', border: 'none', borderRadius: '0.75rem', color: '#ffffff', fontWeight: 700, fontSize: '0.85rem' }}
                  >
                    Upload Photo or Select File
                  </button>
                </div>
              )}
            </div>

            {/* Native camera file picker inputs */}
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*" 
              onChange={handleImageUpload} 
            />

            {!isAnalyzing && (
              <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                {cameraStream && (
                  <button 
                    onClick={triggerFileUpload}
                    className="glass-panel"
                    style={{ 
                      padding: '0.5rem 1rem', fontSize: '0.8rem', background: 'transparent',
                      borderColor: 'var(--border-primary)', color: 'var(--text-secondary)'
                    }}
                  >
                    Use File Upload instead
                  </button>
                )}
                
                {!import.meta.env.VITE_GEMINI_API_KEY && (
                  <div style={{ 
                    fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', 
                    alignItems: 'center', gap: '0.25rem', background: 'rgba(255,106,0,0.05)',
                    padding: '0.4rem 0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(255,106,0,0.1)'
                  }}>
                    <AlertCircle size={12} className="text-emerald" />
                    <span>No Gemini key configured. Running in Demo Simulation mode.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SCAN RESULTS BOTTOM SHEET CARD */}
      {showResults && analysisResult && (
        <div className="bottom-sheet-backdrop" onClick={() => setShowResults(false)}>
          <div className="bottom-sheet-content animate-slide-up" onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} className="text-emerald animate-pulse-neon" />
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Scanned Plate Analysis</h3>
              </div>
              <button onClick={() => setShowResults(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)' }}>
                <X size={20} />
              </button>
            </div>

            {apiError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={14} />
                <span>{apiError}</span>
              </div>
            )}

            {/* Thumbnail and Title Section */}
            <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem', alignItems: 'center' }}>
              {scannedImage ? (
                <img 
                  src={scannedImage} 
                  alt="Scanned thumbnail" 
                  style={{ width: '80px', height: '80px', borderRadius: '0.75rem', objectFit: 'cover', border: '1px solid var(--border-primary)' }} 
                />
              ) : (
                <div style={{ width: '80px', height: '80px', borderRadius: '0.75rem', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Apple size={32} style={{ opacity: 0.3 }} />
                </div>
              )}

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Food Name</label>
                  <input 
                    type="text" 
                    value={analysisResult.foodName} 
                    onChange={(e) => setAnalysisResult(prev => ({ ...prev, foodName: e.target.value }))}
                    style={{ width: '100%', padding: '0.4rem 0.75rem', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Portion</label>
                  <input 
                    type="text" 
                    value={analysisResult.portion} 
                    onChange={(e) => setAnalysisResult(prev => ({ ...prev, portion: e.target.value }))}
                    style={{ width: '100%', padding: '0.4rem 0.75rem', fontSize: '0.9rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Nutrition Gauges Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1.5rem', marginBottom: '2rem', alignItems: 'center' }}>
              {/* Calories Ring */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <ProgressRing 
                  percentage={Math.min(100, Math.round((analysisResult.kcal / calorieGoal) * 100))} 
                  size={85} 
                  strokeWidth={7} 
                  color="var(--emerald)" 
                  glow={true}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{analysisResult.kcal}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>kcal</span>
                  </div>
                </ProgressRing>
                
                {/* One Handed Calorie Adjuster */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <button className="adjuster-btn" onClick={() => adjustMacro('kcal', -10)}>-</button>
                  <button className="adjuster-btn" onClick={() => adjustMacro('kcal', 10)}>+</button>
                </div>
              </div>

              {/* Macros Horizontal Progress Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                
                {/* Protein */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                    <span>Protein</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--emerald)' }}>{analysisResult.protein}g</span>
                      <button style={{ padding: '0.1rem 0.35rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-primary)', background: 'rgba(255,255,255,0.03)' }} onClick={() => adjustMacro('protein', -1)}>-</button>
                      <button style={{ padding: '0.1rem 0.35rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-primary)', background: 'rgba(255,255,255,0.03)' }} onClick={() => adjustMacro('protein', 1)}>+</button>
                    </div>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (analysisResult.protein / 150) * 100)}%`, background: 'var(--emerald)' }}></div>
                  </div>
                </div>

                {/* Carbs */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                    <span>Carbs</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--lime)' }}>{analysisResult.carbs}g</span>
                      <button style={{ padding: '0.1rem 0.35rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-primary)', background: 'rgba(255,255,255,0.03)' }} onClick={() => adjustMacro('carbs', -1)}>-</button>
                      <button style={{ padding: '0.1rem 0.35rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-primary)', background: 'rgba(255,255,255,0.03)' }} onClick={() => adjustMacro('carbs', 1)}>+</button>
                    </div>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (analysisResult.carbs / 240) * 100)}%`, background: 'var(--lime)' }}></div>
                  </div>
                </div>

                {/* Fat */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                    <span>Fat</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#f87171' }}>{analysisResult.fat}g</span>
                      <button style={{ padding: '0.1rem 0.35rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-primary)', background: 'rgba(255,255,255,0.03)' }} onClick={() => adjustMacro('fat', -1)}>-</button>
                      <button style={{ padding: '0.1rem 0.35rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-primary)', background: 'rgba(255,255,255,0.03)' }} onClick={() => adjustMacro('fat', 1)}>+</button>
                    </div>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (analysisResult.fat / 70) * 100)}%`, background: '#f87171' }}></div>
                  </div>
                </div>

                {/* Fiber */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                    <span>Fiber</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#60a5fa' }}>{analysisResult.fiber}g</span>
                      <button style={{ padding: '0.1rem 0.35rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-primary)', background: 'rgba(255,255,255,0.03)' }} onClick={() => adjustMacro('fiber', -1)}>-</button>
                      <button style={{ padding: '0.1rem 0.35rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-primary)', background: 'rgba(255,255,255,0.03)' }} onClick={() => adjustMacro('fiber', 1)}>+</button>
                    </div>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (analysisResult.fiber / 30) * 100)}%`, background: '#60a5fa' }}></div>
                  </div>
                </div>

              </div>
            </div>

            {/* Meal Category & Log Button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Log into Category</label>
                <select 
                  value={activeMealSection} 
                  onChange={(e) => setActiveMealSection(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 1rem' }}
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks</option>
                </select>
              </div>

              <button 
                onClick={handleLogScannedMeal}
                className="bg-gradient-emerald-lime"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  border: 'none',
                  borderRadius: '0.85rem',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 15px rgba(255, 106, 0, 0.25)',
                  marginTop: '0.5rem'
                }}
              >
                Log Scanned Meal
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
