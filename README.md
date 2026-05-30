# 🥗 CaliFit

**Your Premium Fitness & Calorie Tracker** — A modern client-side health and fitness dashboard to track nutrition, plan workouts, analyze recovery, and consult your personal AI coach.

🔗 **Live Demo**: [https://cali-fit.vercel.app](https://cali-fit.vercel.app)

## What is CaliFit?

CaliFit is a web-based fitness companion designed to help you streamline nutrition tracking, log exercises, monitor physical metrics, and gain professional insights. Featuring an elegant dark glassmorphic design and reactive charts, it provides a comprehensive health tracking experience entirely in the browser.

## Features

* **📊 Comprehensive Dashboard** — Track active streaks, daily calorie budget, macronutrient breakdowns, and water intake progress.
* **🥗 Calorie & Food Logging** — Easily log meals, calculate dynamic macronutrients, and visualize real-time calorie progress.
* **🏋️ Workout Tracker** — Log exercises, track lifting volume, sets, reps, and monitor active training streaks.
* **🤖 FitSync AI Coach** — Chat with an online AI health advisor for meal templates, workout split optimization, and recovery advice.
* **📈 Progress & Body Metrics** — Log weight, body fat percentage, target metrics, and upload progress photos.
* **👥 Community Hub** — Share status updates, view daily community activity, and cheer fellow fitness enthusiasts.
* **⚙️ Admin Controls** — Mock system analytics and dashboard configuration metrics for a tailored experience.

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 (Vite) |
| **Language** | JavaScript |
| **Styling** | Vanilla CSS (Glassmorphic Dark Themes) |
| **Icons** | Lucide React |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

### 3. Open the app in your browser

Go to [http://localhost:5173](http://localhost:5173).

## Project Structure

```text
src/
├── assets/         # App assets, images, and mock illustrations
├── components/     # Core dashboard features and interactive UI
│   ├── AICoach.jsx          # AI Health advisor chat interface
│   ├── AdminPanel.jsx       # System settings & analytics configuration
│   ├── CalorieTracker.jsx   # Nutrition & meal tracking panel
│   ├── Community.jsx        # Social feed and status updates
│   ├── CustomCharts.jsx     # Reusable responsive progress visualization
│   ├── Dashboard.jsx        # Summary overview metrics
│   ├── LandingPage.jsx      # Premium marketing homepage
│   ├── ProgressTracking.jsx # Metrics & progress photo uploader
│   └── WorkoutTracker.jsx   # Weightlifting & cardio logger
├── App.css         # Global dashboard styling & themes
├── App.jsx         # Root app layout and navigation routing
├── index.css       # Core design system and global variables
└── main.jsx        # Entrypoint script
```

## License

This project is for educational purposes.
