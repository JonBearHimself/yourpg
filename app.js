// YOURPG - Gamified Self-Improvement App

// ============================================
// Data Model & Constants
// ============================================

const STORAGE_KEY = 'yourpg_data';

const DEFAULT_DATA = {
    currentDayExp: 0,
    totalExp: 0,
    level: 1,
    history: [],
    dailyBossCompleted: false,
    weeklyBossCompleted: false,
    monthlyBossCompleted: false,
    lastDailyBoss: null,
    lastWeeklyBoss: null,
    lastMonthlyBoss: null,
    lastActiveDate: null,
    settings: {
        soundEnabled: true,
        notificationsEnabled: true,
        notificationFrequency: 60,
        dailyBossTime: 21,      // 9 PM
        weeklyBossDay: 0,       // Sunday
        monthlyBossDay: 'last', // Last day of month
        dailyResetTime: 0       // Midnight (0-23, hour when day resets)
    },
    isPro: false
};

// Level thresholds - exponential growth
const LEVEL_THRESHOLDS = [
    0,      // Level 1
    100,    // Level 2
    300,    // Level 3
    600,    // Level 4
    1000,   // Level 5
    1500,   // Level 6
    2200,   // Level 7
    3000,   // Level 8
    4000,   // Level 9
    5200,   // Level 10
    6600,   // Level 11
    8200,   // Level 12
    10000,  // Level 13
    12000,  // Level 14
    14500,  // Level 15
    17500,  // Level 16
    21000,  // Level 17
    25000,  // Level 18
    30000,  // Level 19
    36000,  // Level 20
    43000,  // Level 21
    51000,  // Level 22
    60000,  // Level 23
    70000,  // Level 24
    82000,  // Level 25
    95000,  // Level 26
    110000, // Level 27
    130000, // Level 28
    155000, // Level 29
    185000  // Level 30
];

// Boss Battle Questions
const DAILY_BOSS_QUESTIONS = [
    "Did you meditate or do breathwork for at least 10 minutes?",
    "Did you read at least 10 pages of non-fiction?",
    "Did you write down 5 things you're grateful for?",
    "Did you take action towards your dream life today?",
    "Did you exercise today (weights, walk, or workout)?",
    "Did you express genuine appreciation to someone?",
    "Did you avoid watching porn today?",
    "Did you avoid fapping today?",
    "Did you dress well and groom yourself properly?",
    "Did you maintain good posture, eye contact, and body language?"
];

const WEEKLY_BOSS_QUESTIONS = [
    "Did you get 7+ hours of sleep at least 4 out of 7 days?",
    "Did you maintain a consistent wake time this week?",
    "Did you lift weights at least 3 times with intensity?",
    "Did you do daily affirmations and visualization?",
    "Did you keep social media usage under 30 min/day?",
    "Did you dress well every day this week?",
    "Did you speak slower, deeper, and with certainty?",
    "Did you approach or talk to a stranger this week?"
];

const MONTHLY_BOSS_QUESTIONS = [
    "Did you make meaningful progress towards your dream life this month?"
];

// Notification messages (Autopilot Breakers)
const NOTIFICATION_MESSAGES = [
    "Are you gaining EXP now or losing EXP?",
    "If someone watched you for the last 2 hours, would they think you're a HERO or a WORM?",
    "Are you avoiding something right now?",
    "Are you acting like a HERO right now?",
    "What would the best version of you be doing right now?",
    "Is what you're doing moving you towards your goals?",
    "Are you being productive or just busy?",
    "Would you be proud to tell someone what you did today?",
    "What task have you been putting off? How much EXP is it worth?",
    "What's one small thing you could do right now for +10 EXP?",
    "Is there something you know you should do but keep avoiding?"
];

// EXP values for boss battles
const BOSS_EXP = {
    daily: { yes: 100, no: -200 },
    weekly: { yes: 500, no: -1000 },
    monthly: { yes: 2000, no: -3000 }
};

// ============================================
// App State
// ============================================

let appData = null;
let currentBossType = null;
let currentBossQuestion = 0;
let bossExpTotal = 0;

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    checkNewDay();
    initializeUI();
    setupEventListeners();
    registerServiceWorker();
    initNotificationStatus();
    scheduleNotifications();
    // Check for pending boss battles after a short delay
    setTimeout(checkPendingBossBattles, 1000);

    // Re-check for new day when app becomes visible (user switches back to app)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            const dayChanged = checkNewDay();
            if (dayChanged) {
                initializeUI();
                checkPendingBossBattles();
            } else {
                // Even if day didn't change, re-check boss battles (time may have passed)
                checkPendingBossBattles();
            }
        }
    });

    // Periodic check every minute (for apps left open)
    setInterval(() => {
        const dayChanged = checkNewDay();
        if (dayChanged) {
            initializeUI();
        }
        checkPendingBossBattles();
    }, 60000);
});

function loadData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        appData = { ...DEFAULT_DATA, ...JSON.parse(stored) };
        // Ensure settings object has all properties
        appData.settings = { ...DEFAULT_DATA.settings, ...appData.settings };
    } else {
        appData = { ...DEFAULT_DATA };
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

function checkNewDay() {
    const resetTime = appData.settings.dailyResetTime || 0;
    const now = new Date();
    const currentHour = now.getHours();

    // Calculate the "logical" date based on reset time
    // If reset time is 4am and it's 2am, we're still on "yesterday"
    let logicalDate = new Date(now);
    if (currentHour < resetTime) {
        logicalDate.setDate(logicalDate.getDate() - 1);
    }
    const today = logicalDate.toISOString().split('T')[0];

    if (appData.lastActiveDate !== today) {
        // Save previous day to history (even if EXP was 0, to track neutral days)
        if (appData.lastActiveDate) {
            // Check if this date is already in history
            const existingEntry = appData.history.find(h => h.date === appData.lastActiveDate);
            if (!existingEntry) {
                let rating = 'NEUTRAL';
                if (appData.currentDayExp > 0) rating = 'HERO';
                else if (appData.currentDayExp < 0) rating = 'WORM';

                appData.history.unshift({
                    date: appData.lastActiveDate,
                    exp: appData.currentDayExp,
                    rating: rating
                });
                // Keep only last 90 days
                if (appData.history.length > 90) {
                    appData.history = appData.history.slice(0, 90);
                }
            }
        }

        // Reset daily values
        appData.currentDayExp = 0;
        appData.lastActiveDate = today;

        // Reset daily boss for new day
        appData.dailyBossCompleted = false;

        // Check if weekly boss should reset
        const currentWeek = getWeekString();
        if (appData.lastWeeklyBoss !== currentWeek) {
            appData.weeklyBossCompleted = false;
        }

        // Check if monthly boss should reset
        const currentMonth = getMonthString();
        if (appData.lastMonthlyBoss !== currentMonth) {
            appData.monthlyBossCompleted = false;
        }

        saveData();
        return true; // Day changed
    }
    return false; // Day did not change
}

function initializeUI() {
    updateExpDisplay();
    updateTotalExpDisplay();
    updateLevelDisplay();
    updateStatusBadge();
    updateBossButtons();
    updateSettingsUI();
}

// ============================================
// Automatic Boss Battle Triggers
// ============================================

let pendingBossBattles = [];

function checkPendingBossBattles() {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay(); // 0 = Sunday
    const dayOfMonth = now.getDate();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    // Get custom times from settings
    const dailyTime = appData.settings.dailyBossTime || 21;
    const weeklyDay = appData.settings.weeklyBossDay || 0;
    const monthlyDay = appData.settings.monthlyBossDay || 'last';

    // Collect pending battles
    pendingBossBattles = [];

    // Daily boss - available after custom time
    if (!appData.dailyBossCompleted && hour >= dailyTime) {
        pendingBossBattles.push('daily');
    }

    // Weekly boss - available on custom day after daily boss time
    if (!appData.weeklyBossCompleted && dayOfWeek === parseInt(weeklyDay) && hour >= dailyTime) {
        pendingBossBattles.push('weekly');
    }

    // Monthly boss - available on custom day after daily boss time
    const monthlyDayNum = monthlyDay === 'last' ? lastDayOfMonth : parseInt(monthlyDay);
    if (!appData.monthlyBossCompleted && dayOfMonth === monthlyDayNum && hour >= dailyTime) {
        pendingBossBattles.push('monthly');
    }

    // Update EXP buttons state
    updateExpButtonsState();

    // Show reminder if there are pending battles
    if (pendingBossBattles.length > 0) {
        showBossReminder(pendingBossBattles);
    }
}

function updateExpButtonsState() {
    const expButtons = document.querySelectorAll('.exp-btn');
    if (pendingBossBattles.length > 0) {
        expButtons.forEach(btn => btn.classList.add('blocked'));
    } else {
        expButtons.forEach(btn => btn.classList.remove('blocked'));
    }
}

function showBossReminder(battles) {
    const reminderModal = document.getElementById('bossReminderModal');
    if (!reminderModal) return;

    const battleList = document.getElementById('pendingBattlesList');
    const battleNames = {
        daily: '⚔️ Daily Boss Battle',
        weekly: '🐉 Weekly Boss Battle',
        monthly: '👹 Monthly Boss Battle'
    };

    battleList.innerHTML = battles.map(type =>
        `<div class="pending-battle" data-type="${type}">${battleNames[type]}</div>`
    ).join('');

    // Add click handlers
    battleList.querySelectorAll('.pending-battle').forEach(el => {
        el.addEventListener('click', () => {
            closeModal('bossReminderModal');
            startBossBattle(el.dataset.type);
        });
    });

    openModal('bossReminderModal');
}

// ============================================
// Date Utilities
// ============================================

function getLogicalDate() {
    // Returns the "logical" date based on the daily reset time setting
    // If reset time is 4am and current time is 2am, we're still on "yesterday"
    const resetTime = appData.settings.dailyResetTime || 0;
    const now = new Date();
    let logicalDate = new Date(now);

    if (now.getHours() < resetTime) {
        logicalDate.setDate(logicalDate.getDate() - 1);
    }
    return logicalDate;
}

function getDateString() {
    return getLogicalDate().toISOString().split('T')[0];
}

function getWeekString() {
    const now = new Date();
    const year = now.getFullYear();
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDays = (now - firstDayOfYear) / 86400000;
    const weekNum = Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);
    return `${year}-W${String(weekNum).padStart(2, '0')}`;
}

function getMonthString() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// ============================================
// UI Updates
// ============================================

function updateExpDisplay() {
    const expDisplay = document.getElementById('expDisplay');
    const exp = appData.currentDayExp;

    expDisplay.textContent = exp >= 0 ? exp : exp;
    expDisplay.classList.remove('positive', 'negative');

    if (exp > 0) {
        expDisplay.classList.add('positive');
    } else if (exp < 0) {
        expDisplay.classList.add('negative');
    }
}

function updateTotalExpDisplay() {
    // Total EXP is now shown in My Month modal, no main screen element
    const el = document.getElementById('totalExpDisplay');
    if (el) el.textContent = appData.totalExp.toLocaleString();
}

function updateLevelDisplay() {
    document.getElementById('levelNum').textContent = appData.level;
}

function updateStatusBadge() {
    const badge = document.getElementById('statusBadge');
    badge.classList.remove('hero', 'worm', 'neutral');

    if (appData.currentDayExp > 0) {
        badge.textContent = 'HERO';
        badge.classList.add('hero');
    } else if (appData.currentDayExp < 0) {
        badge.textContent = 'WORM';
        badge.classList.add('worm');
    } else {
        badge.textContent = 'NEUTRAL';
        badge.classList.add('neutral');
    }
}

function updateBossButtons() {
    const dailyBtn = document.getElementById('dailyBossBtn');
    const weeklyBtn = document.getElementById('weeklyBossBtn');
    const monthlyBtn = document.getElementById('monthlyBossBtn');

    dailyBtn.classList.toggle('completed', appData.dailyBossCompleted);
    weeklyBtn.classList.toggle('completed', appData.weeklyBossCompleted);
    monthlyBtn.classList.toggle('completed', appData.monthlyBossCompleted);
}

function updateSettingsUI() {
    document.getElementById('soundToggle').checked = appData.settings.soundEnabled;
    document.getElementById('notificationToggle').checked = appData.settings.notificationsEnabled;
    document.getElementById('notificationFreq').value = appData.settings.notificationFrequency;
    document.getElementById('dailyBossTime').value = appData.settings.dailyBossTime || 21;
    document.getElementById('weeklyBossDay').value = appData.settings.weeklyBossDay || 0;
    document.getElementById('monthlyBossDay').value = appData.settings.monthlyBossDay || 'last';
    document.getElementById('dailyResetTime').value = appData.settings.dailyResetTime || 0;
}

function animateExpChange(element) {
    element.classList.add('animating');
    setTimeout(() => element.classList.remove('animating'), 300);
}

// ============================================
// EXP Logic
// ============================================

function addExp(amount) {
    appData.currentDayExp += amount;
    appData.totalExp += amount;

    // Prevent total from going negative
    if (appData.totalExp < 0) {
        appData.totalExp = 0;
    }

    // Check for level up
    const newLevel = calculateLevel(appData.totalExp);
    if (newLevel > appData.level) {
        appData.level = newLevel;
        showLevelUp(newLevel);
    }

    saveData();

    // Update UI
    const expDisplay = document.getElementById('expDisplay');
    animateExpChange(expDisplay);
    updateExpDisplay();
    updateTotalExpDisplay();
    updateLevelDisplay();
    updateStatusBadge();

    // Play sound
    playSound(amount > 0);
}

function calculateLevel(totalExp) {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (totalExp >= LEVEL_THRESHOLDS[i]) {
            return i + 1;
        }
    }
    return 1;
}

// ============================================
// Sound Effects
// ============================================

function playSound(positive) {
    if (!appData.settings.soundEnabled) return;

    const audio = positive ?
        document.getElementById('expUpSound') :
        document.getElementById('expDownSound');

    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {
            // Ignore audio play errors (e.g., user hasn't interacted yet)
        });
    }
}

// ============================================
// Boss Battle System
// ============================================

function startBossBattle(type) {
    // Check if already completed
    if (type === 'daily' && appData.dailyBossCompleted) return;
    if (type === 'weekly' && appData.weeklyBossCompleted) return;
    if (type === 'monthly' && appData.monthlyBossCompleted) return;

    currentBossType = type;
    currentBossQuestion = 0;
    bossExpTotal = 0;

    const questions = getBossQuestions(type);
    const expValues = BOSS_EXP[type];

    // Update modal title
    const titles = {
        daily: 'Daily Boss Battle',
        weekly: 'Weekly Boss Battle',
        monthly: 'Monthly Boss Battle'
    };
    document.getElementById('bossTitle').textContent = titles[type];

    // Update EXP display
    document.getElementById('yesExp').textContent = `YES: +${expValues.yes} EXP`;
    document.getElementById('noExp').textContent = `NO: ${expValues.no} EXP`;

    showBossQuestion(questions, 0);
    openModal('bossModal');
}

function getBossQuestions(type) {
    switch (type) {
        case 'daily': return DAILY_BOSS_QUESTIONS;
        case 'weekly': return WEEKLY_BOSS_QUESTIONS;
        case 'monthly': return MONTHLY_BOSS_QUESTIONS;
        default: return [];
    }
}

function showBossQuestion(questions, index) {
    document.getElementById('bossQuestion').textContent = questions[index];
    document.getElementById('bossProgress').textContent = `${index + 1}/${questions.length}`;
}

function answerBossQuestion(answer) {
    const questions = getBossQuestions(currentBossType);
    const expValues = BOSS_EXP[currentBossType];

    // Add EXP based on answer
    const expGain = answer ? expValues.yes : expValues.no;
    bossExpTotal += expGain;

    // Play sound
    playSound(answer);

    currentBossQuestion++;

    if (currentBossQuestion < questions.length) {
        // Show next question
        showBossQuestion(questions, currentBossQuestion);
    } else {
        // Battle complete
        completeBossBattle();
    }
}

function completeBossBattle() {
    closeModal('bossModal');

    // Mark as completed
    const today = getDateString();
    switch (currentBossType) {
        case 'daily':
            appData.dailyBossCompleted = true;
            appData.lastDailyBoss = today;
            break;
        case 'weekly':
            appData.weeklyBossCompleted = true;
            appData.lastWeeklyBoss = getWeekString();
            break;
        case 'monthly':
            appData.monthlyBossCompleted = true;
            appData.lastMonthlyBoss = getMonthString();
            break;
    }

    // Add total EXP
    addExp(bossExpTotal);

    // Update boss buttons
    updateBossButtons();

    // Remove completed boss from pending list and unblock EXP buttons
    pendingBossBattles = pendingBossBattles.filter(b => b !== currentBossType);
    updateExpButtonsState();

    // Show completion modal
    const resultExp = document.getElementById('resultExp');
    resultExp.textContent = bossExpTotal >= 0 ? `+${bossExpTotal} EXP` : `${bossExpTotal} EXP`;
    resultExp.classList.remove('positive', 'negative');
    resultExp.classList.add(bossExpTotal >= 0 ? 'positive' : 'negative');

    const messages = {
        daily: bossExpTotal >= 0 ? 'You defeated the Daily Boss!' : 'The Daily Boss defeated you...',
        weekly: bossExpTotal >= 0 ? 'You conquered the Weekly Boss!' : 'The Weekly Boss crushed you...',
        monthly: bossExpTotal >= 0 ? 'You vanquished the Monthly Boss!' : 'The Monthly Boss destroyed you...'
    };
    document.getElementById('bossMessage').textContent = messages[currentBossType];

    openModal('bossCompleteModal');
}

// ============================================
// Level Up Modal
// ============================================

function showLevelUp(level) {
    document.getElementById('newLevel').textContent = level;
    setTimeout(() => openModal('levelUpModal'), 500);
}

// ============================================
// Modal Management
// ============================================

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// ============================================
// My Month / Calendar
// ============================================

function showMyMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // Update title
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('monthTitle').textContent = `${monthNames[month]} ${year}`;

    // Update stats
    document.getElementById('totalExpStat').textContent = appData.totalExp.toLocaleString();
    document.getElementById('levelStat').textContent = appData.level;
    document.getElementById('streakStat').textContent = calculateStreak();

    // Build calendar
    const calendarGrid = document.getElementById('calendarGrid');
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = now.getDate();

    // Create history lookup by date
    const historyMap = {};
    appData.history.forEach(item => {
        historyMap[item.date] = item;
    });

    // Add today's data to map (always, even if EXP is 0)
    const todayStr = getDateString();
    let todayRating = 'NEUTRAL';
    if (appData.currentDayExp > 0) todayRating = 'HERO';
    else if (appData.currentDayExp < 0) todayRating = 'WORM';

    historyMap[todayStr] = {
        date: todayStr,
        exp: appData.currentDayExp,
        rating: todayRating
    };

    let html = '';

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day empty"></div>';
    }

    // Get the logical "today" (accounting for reset time)
    const logicalToday = getLogicalDate();
    const logicalTodayNum = logicalToday.getDate();
    const logicalTodayMonth = logicalToday.getMonth();
    const logicalTodayYear = logicalToday.getFullYear();

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayData = historyMap[dateStr];

        let classes = 'calendar-day';

        // Check if this is today (using logical date)
        const isToday = (day === logicalTodayNum && month === logicalTodayMonth && year === logicalTodayYear);
        const isFuture = (year > logicalTodayYear) ||
                        (year === logicalTodayYear && month > logicalTodayMonth) ||
                        (year === logicalTodayYear && month === logicalTodayMonth && day > logicalTodayNum);

        if (isToday) classes += ' today';
        if (isFuture) classes += ' future';

        if (dayData) {
            if (dayData.rating === 'HERO' || dayData.exp > 0) {
                classes += ' hero';
            } else if (dayData.rating === 'WORM' || dayData.exp < 0) {
                classes += ' worm';
            } else {
                classes += ' neutral-day';
            }
        }

        html += `<div class="${classes}">${day}</div>`;
    }

    calendarGrid.innerHTML = html;
    openModal('myMonthModal');
}

function calculateStreak() {
    let streak = 0;

    // Use the logical date (accounting for reset time)
    const logicalToday = getLogicalDate();
    logicalToday.setHours(0, 0, 0, 0);
    const todayStr = getDateString();

    // Check if today is a hero day
    if (appData.currentDayExp > 0) {
        streak = 1;
    } else if (appData.currentDayExp < 0) {
        // Today is a worm day, streak is 0
        return 0;
    }
    // If currentDayExp === 0, we check history (day not counted yet)

    // Build a map of dates to their ratings for quick lookup
    const dateRatings = {};
    appData.history.forEach(item => {
        dateRatings[item.date] = item.rating || (item.exp > 0 ? 'HERO' : (item.exp < 0 ? 'WORM' : 'NEUTRAL'));
    });

    // Start checking from yesterday (or today if no activity yet)
    let checkDate = new Date(logicalToday);
    if (streak === 1) {
        // Today is hero, start checking from yesterday
        checkDate.setDate(checkDate.getDate() - 1);
    } else if (appData.currentDayExp === 0) {
        // No activity today, start from yesterday
        checkDate.setDate(checkDate.getDate() - 1);
    }

    // Check consecutive days backwards
    for (let i = 0; i < 365; i++) { // Max 1 year back
        const checkDateStr = checkDate.toISOString().split('T')[0];
        const rating = dateRatings[checkDateStr];

        if (rating === 'HERO') {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else if (rating === 'WORM' || rating === 'NEUTRAL') {
            // Streak broken by worm or neutral day
            break;
        } else {
            // No data for this day (gap), streak broken
            break;
        }
    }

    return streak;
}

// ============================================
// Settings
// ============================================

function resetDayExp() {
    if (confirm('Are you sure you want to reset today\'s EXP to 0?')) {
        // Adjust total EXP
        appData.totalExp -= appData.currentDayExp;
        if (appData.totalExp < 0) appData.totalExp = 0;

        appData.currentDayExp = 0;

        // Recalculate level
        appData.level = calculateLevel(appData.totalExp);

        saveData();
        updateExpDisplay();
        updateTotalExpDisplay();
        updateLevelDisplay();
        updateStatusBadge();
        closeModal('settingsModal');
    }
}

// ============================================
// Notifications
// ============================================

function requestNotificationPermission() {
    if (!('Notification' in window)) {
        updateNotificationButton('Not Supported');
        return;
    }

    if (Notification.permission === 'granted') {
        updateNotificationButton('Enabled');
        scheduleNotifications();
        return;
    }

    if (Notification.permission === 'denied') {
        updateNotificationButton('Blocked');
        return;
    }

    // Request permission (must be triggered by user action on iOS)
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            updateNotificationButton('Enabled');
            scheduleNotifications();
            // Send a test notification
            new Notification('YOURPG', {
                body: 'Notifications enabled! You\'ll receive autopilot breakers.',
                icon: './icons/icon-192.png'
            });
        } else {
            updateNotificationButton('Denied');
        }
    });
}

function updateNotificationButton(status) {
    const btn = document.getElementById('requestNotifBtn');
    if (!btn) return;

    btn.textContent = status;
    btn.disabled = status !== 'Enable';

    if (status === 'Enabled') {
        btn.classList.add('success');
    } else if (status === 'Blocked' || status === 'Denied' || status === 'Not Supported') {
        btn.classList.add('disabled');
    }
}

function initNotificationStatus() {
    if (!('Notification' in window)) {
        updateNotificationButton('Not Supported');
    } else if (Notification.permission === 'granted') {
        updateNotificationButton('Enabled');
    } else if (Notification.permission === 'denied') {
        updateNotificationButton('Blocked');
    } else {
        updateNotificationButton('Enable');
    }
}

function scheduleNotifications() {
    if (!appData.settings.notificationsEnabled) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    // Clear existing interval
    if (window.notificationInterval) {
        clearInterval(window.notificationInterval);
    }

    // Set new interval
    const frequency = appData.settings.notificationFrequency * 60 * 1000; // Convert to ms
    window.notificationInterval = setInterval(() => {
        sendNotification();
    }, frequency);
}

function sendNotification() {
    if (!appData.settings.notificationsEnabled) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const message = NOTIFICATION_MESSAGES[Math.floor(Math.random() * NOTIFICATION_MESSAGES.length)];

    new Notification('YOURPG - Autopilot Breaker', {
        body: message,
        icon: 'icons/icon-192.png',
        badge: 'icons/icon-192.png',
        tag: 'autopilot-breaker',
        renotify: true
    });
}

// ============================================
// Service Worker Registration
// ============================================

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // EXP Buttons - check for pending boss battles first
    document.querySelectorAll('.exp-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // If boss battles are pending, show reminder instead
            if (pendingBossBattles.length > 0) {
                showBossReminder(pendingBossBattles);
                return;
            }
            const exp = parseInt(btn.dataset.exp);
            addExp(exp);
        });
    });

    // Boss Battle Buttons
    document.getElementById('dailyBossBtn').addEventListener('click', () => startBossBattle('daily'));
    document.getElementById('weeklyBossBtn').addEventListener('click', () => startBossBattle('weekly'));
    document.getElementById('monthlyBossBtn').addEventListener('click', () => startBossBattle('monthly'));

    // Boss Answer Buttons
    document.getElementById('bossYesBtn').addEventListener('click', () => answerBossQuestion(true));
    document.getElementById('bossNoBtn').addEventListener('click', () => answerBossQuestion(false));

    // Settings Button
    document.getElementById('settingsBtn').addEventListener('click', () => openModal('settingsModal'));

    // Pro Button
    document.getElementById('proBtn').addEventListener('click', () => openModal('proModal'));

    // My Month Button
    document.getElementById('myMonthBtn').addEventListener('click', showMyMonth);

    // Settings toggles
    document.getElementById('soundToggle').addEventListener('change', (e) => {
        appData.settings.soundEnabled = e.target.checked;
        saveData();
    });

    document.getElementById('notificationToggle').addEventListener('change', (e) => {
        appData.settings.notificationsEnabled = e.target.checked;
        saveData();
        if (e.target.checked) {
            requestNotificationPermission();
            scheduleNotifications();
        }
    });

    document.getElementById('notificationFreq').addEventListener('change', (e) => {
        appData.settings.notificationFrequency = parseInt(e.target.value);
        saveData();
        scheduleNotifications();
    });

    // Notification permission button (required for iOS)
    document.getElementById('requestNotifBtn').addEventListener('click', () => {
        requestNotificationPermission();
    });

    // Settings actions
    document.getElementById('resetDayBtn').addEventListener('click', resetDayExp);
    document.getElementById('viewHistoryBtn').addEventListener('click', () => {
        closeModal('settingsModal');
        showMyMonth();
    });

    // Close buttons
    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(btn.dataset.close);
        });
    });

    // Close modal on backdrop click (except mandatory modals)
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal && !modal.classList.contains('mandatory')) {
                closeModal(modal.id);
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                // Don't close mandatory modals or boss battle modal with escape
                if (modal.id !== 'bossModal' && modal.id !== 'bossReminderModal') {
                    closeModal(modal.id);
                }
            });
        }
    });

    // Day reset time setting
    document.getElementById('dailyResetTime').addEventListener('change', (e) => {
        appData.settings.dailyResetTime = parseInt(e.target.value);
        saveData();
    });

    // Boss schedule settings
    document.getElementById('dailyBossTime').addEventListener('change', (e) => {
        appData.settings.dailyBossTime = parseInt(e.target.value);
        saveData();
    });

    document.getElementById('weeklyBossDay').addEventListener('change', (e) => {
        appData.settings.weeklyBossDay = parseInt(e.target.value);
        saveData();
    });

    document.getElementById('monthlyBossDay').addEventListener('change', (e) => {
        appData.settings.monthlyBossDay = e.target.value;
        saveData();
    });
}
