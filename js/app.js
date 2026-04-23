/**
 * ELEVATE90 - Frontend Execution Logic
 * Handles daily resets, progress tracking, and streak calculation via LocalStorage.
 */

const STATE_KEY = 'elevate90_local_state';

// 1. Define Default State
function getInitialState() {
    return {
        streak: 0,
        lastCompletedDate: null, 
        lastResetDate: new Date().toDateString(), // Used to track daily resets
        habits: {
            water: false,
            workout: false,
            meals: false
        }
    };
}

// 2. Load State from LocalStorage
let appState = JSON.parse(localStorage.getItem(STATE_KEY)) || getInitialState();

// 3. Core Functions
function saveState() {
    localStorage.setItem(STATE_KEY, JSON.stringify(appState));
    updateUI();
}

function checkDailyReset() {
    const today = new Date().toDateString();
    
    // If it's a new day, reset the checkboxes but keep the streak history intact
    if (appState.lastResetDate !== today) {
        appState.habits = { water: false, workout: false, meals: false };
        appState.lastResetDate = today;
        saveState();
    }
}

function toggleHabit(habitId) {
    // Toggle the boolean value
    appState.habits[habitId] = !appState.habits[habitId];
    calculateProgress();
    saveState();
}

function calculateProgress() {
    const habitsArray = Object.values(appState.habits);
    const completedCount = habitsArray.filter(Boolean).length;
    const totalCount = habitsArray.length;
    
    const isAllCompleted = completedCount === totalCount;
    const today = new Date().toDateString();

    // Streak Logic: Increment ONCE per day when 100% is hit
    if (isAllCompleted && appState.lastCompletedDate !== today) {
        appState.streak += 1;
        appState.lastCompletedDate = today;
        showFeedbackMessage("🔥 All protocols complete! Streak increased.");
    } 
    // Edge case: User unchecks a box on the same day they completed it
    else if (!isAllCompleted && appState.lastCompletedDate === today) {
        appState.streak = Math.max(0, appState.streak - 1);
        appState.lastCompletedDate = null;
    }
}

function showFeedbackMessage(msg) {
    const feedbackEl = document.getElementById('feedback-message');
    if (!feedbackEl) return;
    
    feedbackEl.textContent = msg;
    feedbackEl.classList.remove('hidden');
    
    // Fade in effect
    setTimeout(() => {
        feedbackEl.style.opacity = '1';
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
        feedbackEl.style.opacity = '0';
        setTimeout(() => {
            feedbackEl.classList.add('hidden');
        }, 300); // Wait for fade transition
    }, 3000);
}

// 4. Update the DOM
function updateUI() {
    // Update Streak DOM
    const streakEl = document.getElementById('streak-counter');
    if (streakEl) streakEl.textContent = appState.streak;

    // Update Checkboxes DOM
    Object.keys(appState.habits).forEach(key => {
        const checkbox = document.getElementById(`habit-${key}`);
        if (checkbox) checkbox.checked = appState.habits[key];
    });

    // Update Progress Bar DOM
    const habitsArray = Object.values(appState.habits);
    const completedCount = habitsArray.filter(Boolean).length;
    const percentage = Math.round((completedCount / habitsArray.length) * 100) || 0;
    
    const progressBar = document.getElementById('progress-bar-fill');
    const progressText = document.getElementById('progress-text');
    
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${percentage}%`;
}

// 5. Initialize App on Load
document.addEventListener('DOMContentLoaded', () => {
    // Only run logic if we are on the dashboard page
    if (window.location.pathname.includes('basic-dashboard')) {
        checkDailyReset();
        updateUI();

        // Listeners for Checkboxes
        document.querySelectorAll('.habit-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const habitId = e.target.id.replace('habit-', '');
                toggleHabit(habitId);
            });
        });
    }
});
