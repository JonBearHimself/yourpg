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
    onboardingComplete: false,
    customDailyQuestions: null, // null = use defaults, array = custom questions
    dailyBossAnswers: {}, // Track daily answers: { "2026-01-23": [true, false, true, ...] }
    lastQuoteDate: null, // Track when quote was last shown
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

// Default Boss Battle Questions (can be customized by user)
const DEFAULT_DAILY_BOSS_QUESTIONS = [
    "Did you meditate or do breathwork for at least 10 minutes?",
    "Did you read at least 10 pages of a non-fiction book?",
    "Did you write down 5 things you are grateful for?",
    "Did you spend at least 1 hour working on your goal?",
    "Did you exercise today?",
    "Did you avoid PMO (porn/masturbation)?",
    "Did you avoid consuming alcohol today?"
];

const WEEKLY_BOSS_QUESTIONS = [
    "Did you get 7+ hours of sleep at least 4 out of 7 days?",
    "Did you wake up at the same time each day?",
    "Did you lift weights at least 3 times with intensity?",
    "Did you do daily affirmations or visualization?",
    "Did you keep social media usage under 30 min/day?",
    "Did you dress well every day this week?",
    "Did you speak slower, deeper, and with certainty?",
    "Did you approach or talk to a stranger this week?"
];

const MONTHLY_BOSS_QUESTIONS = [
    "Did you make meaningful progress towards your dream life this month?"
];

// Daily Motivational Quotes
const DAILY_QUOTES = [
    "Waking up is not guaranteed. Millions went to sleep last night with plans and promises and never woke up.",
    "You woke up not because you deserved it, but because there is still work left in you.",
    "If waking up feels heavy, it is not because life is cruel. It is because you are misaligned.",
    "Morning is where you either lead yourself or lose yourself.",
    "Time is the most expensive currency in existence. It cannot be stored. It cannot be recovered.",
    "You can think, you can choose, you can act. That is power. And power carries responsibility.",
    "Training the body is not vanity. It is alignment. It is you telling the universe: I respect what I've been given.",
    "Every time you train, you are not just lifting weight. You are lifting standards.",
    "One missed workout becomes many. One indulgence becomes habit. One excuse becomes identity.",
    "Pain is not the enemy. Weakness is. Discomfort is not a threat. Decay is.",
    "Work is not a curse. It is permission to contribute, to build, to become useful.",
    "Idleness destroys. Not because rest is bad, but because meaning requires effort.",
    "Excellence is not about position. It is about presence.",
    "Struggle is not evidence of failure. It is evidence of engagement. You only struggle with things that matter.",
    "Steel is not hardened in softness. It is forged under heat and pressure.",
    "Real freedom is the ability to choose discipline even when desire pulls the other way.",
    "Without discipline, talent decays. Without discipline, opportunity collapses.",
    "Discipline builds self-respect. You trust yourself because you keep promises to yourself.",
    "Most regret is not caused by failure. It is caused by avoidance.",
    "Confidence is not a prerequisite. It is a byproduct. It grows only after movement.",
    "Later is the most dangerous word. Because later assumes certainty and certainty does not exist.",
    "Time rewards consistency, not intensity. A little effort daily outperforms dramatic bursts followed by collapse.",
    "There comes a moment when comfort begins to rot the soul.",
    "That ache of potential buried alive is not anxiety. That is your calling to rise.",
    "You are not ready for the blessings you pray for until you are strong enough to carry them.",
    "Can you stay righteous when nobody's watching? Can you walk in integrity when compromise feels easier?",
    "You asked for greatness. You're being given grit. You asked for success. You're being given strength.",
    "Every sleepless night, every failure, every heartbreak is sacred construction.",
    "Isolation is not punishment. It's purification.",
    "In solitude, you learn that being alone isn't the same as being abandoned.",
    "If you can't handle being unseen, you're not ready to be chosen.",
    "Every delay is proof that heaven is still investing in you.",
    "Discipline is not glamorous. It's gritty. It's repetitive. It's lonely. But it's the language heaven understands.",
    "The blade must be heated and hammered again before it becomes sharp enough to serve its purpose.",
    "If you are being tested severely, it's because you are being prepared for something powerful.",
    "Pain is temporary. Discipline is eternal.",
    "Many can climb, but few can stay clean at the top.",
    "Comfort doesn't heal you. It hides you. It's the slowest form of decay.",
    "Every time you choose ease over effort, you're feeding the version of yourself that must die.",
    "You can't be powerful and pitiful at the same time.",
    "Pain isn't punishment, it's payment. And discipline is the currency.",
    "When your weakness dies, your clarity returns. When your addiction dies, your purpose breathes.",
    "Until you conquer yourself, you will be conquered by everything.",
    "What's built in silence always shakes the earth when it's revealed.",
    "The cost of greatness is isolation. While others seek pleasure, you seek purpose.",
    "Discipline is not chains, it's protection.",
    "The difference between a child and an adult isn't age, money, or muscles. It's accountability.",
    "Uncontrolled fire burns everything it touches. Controlled fire forges empires.",
    "You were never being tested. You were being built.",
    "The enemy doesn't come for the weak. It comes for the trusted. Guard your soul with vigilance."
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
let currentBossAnswers = []; // Track answers for current daily boss battle

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

    // Check if onboarding needed
    if (!appData.onboardingComplete) {
        initOnboarding();
    } else {
        // Check for daily quote first, then boss battles
        setTimeout(() => {
            const today = getDateString();
            if (appData.lastQuoteDate !== today) {
                showDailyQuote();
            } else {
                checkPendingBossBattles();
            }
        }, 1000);
    }

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
    currentBossAnswers = []; // Reset answers tracking

    // Weekly and Monthly are now automatic award screens
    if (type === 'weekly') {
        showWeeklyAwards();
        return;
    }
    if (type === 'monthly') {
        showMonthlyAwards();
        return;
    }

    // Daily boss battle (questions)
    const questions = getBossQuestions(type);
    const expValues = BOSS_EXP[type];

    document.getElementById('bossTitle').textContent = 'Daily Boss Battle';
    document.getElementById('yesExp').textContent = `YES: +${expValues.yes} EXP`;
    document.getElementById('noExp').textContent = `NO: ${expValues.no} EXP`;

    showBossQuestion(questions, 0);
    openModal('bossModal');
}

function getBossQuestions(type) {
    switch (type) {
        case 'daily':
            // Use custom questions if set, otherwise use defaults
            return appData.customDailyQuestions || DEFAULT_DAILY_BOSS_QUESTIONS;
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

    // Track the answer for daily boss
    currentBossAnswers.push(answer);

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
            // Save answers for weekly/monthly calculations
            if (!appData.dailyBossAnswers) appData.dailyBossAnswers = {};
            appData.dailyBossAnswers[today] = [...currentBossAnswers];
            // Clean up old answers (keep last 35 days)
            cleanupOldAnswers();
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
        weekly: bossExpTotal >= 0 ? 'Weekly rewards claimed!' : 'Keep pushing next week!',
        monthly: bossExpTotal >= 0 ? 'Monthly rewards claimed!' : 'A new month awaits!'
    };
    document.getElementById('bossMessage').textContent = messages[currentBossType];

    openModal('bossCompleteModal');
}

function cleanupOldAnswers() {
    if (!appData.dailyBossAnswers) return;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 35);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    Object.keys(appData.dailyBossAnswers).forEach(date => {
        if (date < cutoffStr) {
            delete appData.dailyBossAnswers[date];
        }
    });
}

// ============================================
// Weekly & Monthly Awards System
// ============================================

// Stat descriptions for built-in questions (index -> description generator)
const QUESTION_STAT_GENERATORS = {
    0: (days) => `Meditated ${days} time${days !== 1 ? 's' : ''} this week`,
    1: (days) => `Read ~${days * 10} pages this week`,
    2: (days) => `Wrote ${days * 5} gratitudes this week`,
    3: (days) => `Spent ~${days} hour${days !== 1 ? 's' : ''} on your goal`,
    4: (days) => `Exercised ${days} time${days !== 1 ? 's' : ''} this week`,
    5: (days) => `${days} day${days !== 1 ? 's' : ''} PMO-free`,
    6: (days) => `${days} alcohol-free day${days !== 1 ? 's' : ''}`
};

const MONTHLY_STAT_GENERATORS = {
    0: (days) => `Meditated ${days} time${days !== 1 ? 's' : ''} this month`,
    1: (days) => `Read ~${days * 10} pages this month`,
    2: (days) => `Wrote ${days * 5} gratitudes this month`,
    3: (days) => `Spent ~${days} hour${days !== 1 ? 's' : ''} on your goal`,
    4: (days) => `Exercised ${days} time${days !== 1 ? 's' : ''} this month`,
    5: (days) => `${days} day${days !== 1 ? 's' : ''} PMO-free`,
    6: (days) => `${days} alcohol-free day${days !== 1 ? 's' : ''}`
};

function getWeeklyThresholdExp(daysCompleted) {
    if (daysCompleted >= 7) return 200;  // Perfect
    if (daysCompleted >= 5) return 100;  // Strong
    if (daysCompleted >= 3) return 50;   // Okay
    return 0; // No reward
}

function getMonthlyThresholdExp(daysCompleted, totalDays) {
    const percentage = daysCompleted / totalDays;
    if (percentage >= 0.9) return 500;   // 90%+ Perfect
    if (percentage >= 0.7) return 300;   // 70%+ Strong
    if (percentage >= 0.5) return 150;   // 50%+ Okay
    return 0; // No reward
}

function calculateWeeklyStats() {
    const answers = appData.dailyBossAnswers || {};
    const questions = getBossQuestions('daily');
    const stats = [];

    // Get dates for last 7 days
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
    }

    // Calculate stats for each question
    for (let qIndex = 0; qIndex < questions.length; qIndex++) {
        let daysCompleted = 0;

        dates.forEach(date => {
            if (answers[date] && answers[date][qIndex] === true) {
                daysCompleted++;
            }
        });

        const exp = getWeeklyThresholdExp(daysCompleted);
        const isCustom = appData.customDailyQuestions &&
                         appData.customDailyQuestions[qIndex] !== DEFAULT_DAILY_BOSS_QUESTIONS[qIndex];

        let description;
        if (isCustom || !QUESTION_STAT_GENERATORS[qIndex]) {
            description = `Completed ${daysCompleted}/7 days`;
        } else {
            description = QUESTION_STAT_GENERATORS[qIndex](daysCompleted);
        }

        stats.push({
            question: questions[qIndex],
            daysCompleted,
            exp,
            description,
            isCustom
        });
    }

    return stats;
}

function calculateMonthlyStats() {
    const answers = appData.dailyBossAnswers || {};
    const questions = getBossQuestions('daily');
    const stats = [];

    // Get dates for last 30 days
    const dates = [];
    for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
    }

    // Count how many days have data
    let daysWithData = 0;
    dates.forEach(date => {
        if (answers[date]) daysWithData++;
    });

    // Calculate stats for each question
    for (let qIndex = 0; qIndex < questions.length; qIndex++) {
        let daysCompleted = 0;

        dates.forEach(date => {
            if (answers[date] && answers[date][qIndex] === true) {
                daysCompleted++;
            }
        });

        const exp = getMonthlyThresholdExp(daysCompleted, Math.max(daysWithData, 1));
        const isCustom = appData.customDailyQuestions &&
                         appData.customDailyQuestions[qIndex] !== DEFAULT_DAILY_BOSS_QUESTIONS[qIndex];

        let description;
        if (isCustom || !MONTHLY_STAT_GENERATORS[qIndex]) {
            description = `Completed ${daysCompleted}/${daysWithData} days`;
        } else {
            description = MONTHLY_STAT_GENERATORS[qIndex](daysCompleted);
        }

        stats.push({
            question: questions[qIndex],
            daysCompleted,
            totalDays: daysWithData,
            exp,
            description,
            isCustom
        });
    }

    // Add hero/worm day count
    let heroDays = 0;
    let wormDays = 0;
    appData.history.slice(0, 30).forEach(day => {
        if (day.rating === 'HERO' || day.exp > 0) heroDays++;
        else if (day.rating === 'WORM' || day.exp < 0) wormDays++;
    });

    return { questionStats: stats, heroDays, wormDays, totalDays: daysWithData };
}

function showWeeklyAwards() {
    const stats = calculateWeeklyStats();
    let totalExp = 0;

    // Build awards HTML
    let awardsHtml = '<div class="awards-list">';
    stats.forEach(stat => {
        totalExp += stat.exp;
        const expClass = stat.exp > 0 ? 'positive' : 'zero';
        const tierLabel = stat.daysCompleted >= 7 ? '★ PERFECT' :
                          stat.daysCompleted >= 5 ? '◆ STRONG' :
                          stat.daysCompleted >= 3 ? '○ OKAY' : '';

        awardsHtml += `
            <div class="award-item ${expClass}">
                <div class="award-description">${stat.description}</div>
                <div class="award-exp">${stat.exp > 0 ? '+' + stat.exp : stat.exp} EXP</div>
                ${tierLabel ? `<div class="award-tier">${tierLabel}</div>` : ''}
            </div>
        `;
    });
    awardsHtml += '</div>';

    // Update modal
    document.getElementById('awardsTitle').textContent = 'Weekly Rewards';
    document.getElementById('awardsSubtitle').textContent = 'Based on your daily boss battles';
    document.getElementById('awardsList').innerHTML = awardsHtml;
    document.getElementById('totalAwardsExp').textContent = `Total: +${totalExp} EXP`;
    document.getElementById('totalAwardsExp').className = 'total-awards-exp ' + (totalExp > 0 ? 'positive' : '');

    bossExpTotal = totalExp;
    currentBossType = 'weekly';
    openModal('awardsModal');
}

function showMonthlyAwards() {
    const { questionStats, heroDays, wormDays, totalDays } = calculateMonthlyStats();
    let totalExp = 0;

    // Build awards HTML
    let awardsHtml = '<div class="awards-list">';

    // Hero/Worm summary
    const heroBonus = heroDays >= 20 ? 300 : heroDays >= 15 ? 200 : heroDays >= 10 ? 100 : 0;
    totalExp += heroBonus;
    awardsHtml += `
        <div class="award-item hero-summary ${heroBonus > 0 ? 'positive' : 'zero'}">
            <div class="award-description">${heroDays} HERO days vs ${wormDays} WORM days</div>
            <div class="award-exp">${heroBonus > 0 ? '+' + heroBonus : heroBonus} EXP</div>
        </div>
    `;

    questionStats.forEach(stat => {
        totalExp += stat.exp;
        const expClass = stat.exp > 0 ? 'positive' : 'zero';

        awardsHtml += `
            <div class="award-item ${expClass}">
                <div class="award-description">${stat.description}</div>
                <div class="award-exp">${stat.exp > 0 ? '+' + stat.exp : stat.exp} EXP</div>
            </div>
        `;
    });
    awardsHtml += '</div>';

    // Update modal
    document.getElementById('awardsTitle').textContent = 'Monthly Rewards';
    document.getElementById('awardsSubtitle').textContent = 'Your month in review';
    document.getElementById('awardsList').innerHTML = awardsHtml;
    document.getElementById('totalAwardsExp').textContent = `Total: +${totalExp} EXP`;
    document.getElementById('totalAwardsExp').className = 'total-awards-exp ' + (totalExp > 0 ? 'positive' : '');

    bossExpTotal = totalExp;
    currentBossType = 'monthly';
    openModal('awardsModal');
}

function claimAwards() {
    closeModal('awardsModal');
    completeBossBattle();
}

// ============================================
// Daily Quote System
// ============================================

function checkDailyQuote() {
    const today = getDateString();
    if (appData.lastQuoteDate !== today) {
        showDailyQuote();
    }
}

function showDailyQuote() {
    // Pick a random quote
    const quote = DAILY_QUOTES[Math.floor(Math.random() * DAILY_QUOTES.length)];
    document.getElementById('dailyQuoteText').textContent = quote;

    // Mark as shown for today
    appData.lastQuoteDate = getDateString();
    saveData();

    openModal('quoteModal');
}

function dismissQuote() {
    closeModal('quoteModal');
    // After quote is dismissed, check for pending boss battles
    setTimeout(checkPendingBossBattles, 300);
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

function wipeAllData() {
    if (confirm('WARNING: This will delete ALL your data including EXP, history, and settings. This cannot be undone!\n\nAre you sure?')) {
        if (confirm('Are you REALLY sure? All progress will be lost forever.')) {
            localStorage.removeItem(STORAGE_KEY);
            location.reload();
        }
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

    // Wipe all data button
    document.getElementById('wipeDataBtn').addEventListener('click', wipeAllData);

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
                // Don't close mandatory modals with escape
                const mandatoryModals = ['bossModal', 'bossReminderModal', 'onboardingModal', 'awardsModal', 'quoteModal'];
                if (!mandatoryModals.includes(modal.id)) {
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

    // Boss customization (in settings)
    const customizeBossBtn = document.getElementById('customizeBossBtn');
    if (customizeBossBtn) {
        customizeBossBtn.addEventListener('click', () => {
            closeModal('settingsModal');
            showBossCustomization();
        });
    }

    // Save/Reset boss questions
    const saveQuestionsBtn = document.getElementById('saveQuestionsBtn');
    if (saveQuestionsBtn) {
        saveQuestionsBtn.addEventListener('click', saveBossQuestions);
    }

    const resetQuestionsBtn = document.getElementById('resetQuestionsBtn');
    if (resetQuestionsBtn) {
        resetQuestionsBtn.addEventListener('click', resetBossQuestions);
    }

    // Onboarding start button
    const startJourneyBtn = document.getElementById('startJourneyBtn');
    if (startJourneyBtn) {
        startJourneyBtn.addEventListener('click', completeOnboarding);
    }

    // Claim awards button
    const claimAwardsBtn = document.getElementById('claimAwardsBtn');
    if (claimAwardsBtn) {
        claimAwardsBtn.addEventListener('click', claimAwards);
    }

    // Dismiss quote button
    const dismissQuoteBtn = document.getElementById('dismissQuoteBtn');
    if (dismissQuoteBtn) {
        dismissQuoteBtn.addEventListener('click', dismissQuote);
    }

    // Swipe to dismiss quote
    const quoteModal = document.getElementById('quoteModal');
    if (quoteModal) {
        let quoteStartX = 0;
        quoteModal.addEventListener('touchstart', (e) => {
            quoteStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        quoteModal.addEventListener('touchend', (e) => {
            const diff = quoteStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                dismissQuote();
            }
        }, { passive: true });
    }
}

// ============================================
// Onboarding System
// ============================================

let currentOnboardingCard = 0;
const TOTAL_ONBOARDING_CARDS = 15;
let touchStartX = 0;
let touchEndX = 0;

function initOnboarding() {
    // Create progress dots
    const progressContainer = document.getElementById('onboardingProgress');
    progressContainer.innerHTML = '';
    for (let i = 0; i < TOTAL_ONBOARDING_CARDS; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot' + (i === 0 ? ' active' : '');
        progressContainer.appendChild(dot);
    }

    // Set up swipe detection
    const onboardingCards = document.getElementById('onboardingCards');

    onboardingCards.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    onboardingCards.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleOnboardingSwipe();
    }, { passive: true });

    // Also allow tap to advance (except on last card)
    onboardingCards.addEventListener('click', (e) => {
        // Don't advance if clicking the button on last card
        if (e.target.id === 'startJourneyBtn' || e.target.closest('.start-btn')) {
            return;
        }
        if (currentOnboardingCard < TOTAL_ONBOARDING_CARDS - 1) {
            goToOnboardingCard(currentOnboardingCard + 1);
        }
    });

    // Show onboarding modal
    openModal('onboardingModal');
}

function handleOnboardingSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swiped left - go forward
            if (currentOnboardingCard < TOTAL_ONBOARDING_CARDS - 1) {
                goToOnboardingCard(currentOnboardingCard + 1);
            }
        } else {
            // Swiped right - go back
            if (currentOnboardingCard > 0) {
                goToOnboardingCard(currentOnboardingCard - 1);
            }
        }
    }
}

function goToOnboardingCard(index) {
    const cards = document.querySelectorAll('.onboarding-card');
    const dots = document.querySelectorAll('.progress-dot');
    const swipeHint = document.getElementById('swipeHint');

    // Update cards
    cards.forEach((card, i) => {
        card.classList.remove('active', 'prev');
        if (i === index) {
            card.classList.add('active');
        } else if (i < index) {
            card.classList.add('prev');
        }
    });

    // Update progress dots
    dots.forEach((dot, i) => {
        dot.classList.remove('active', 'completed');
        if (i === index) {
            dot.classList.add('active');
        } else if (i < index) {
            dot.classList.add('completed');
        }
    });

    // Hide swipe hint on last card
    if (index === TOTAL_ONBOARDING_CARDS - 1) {
        swipeHint.style.display = 'none';
    } else {
        swipeHint.style.display = 'block';
    }

    currentOnboardingCard = index;
}

function completeOnboarding() {
    appData.onboardingComplete = true;
    saveData();
    closeModal('onboardingModal');

    // Now check for pending boss battles
    setTimeout(checkPendingBossBattles, 500);
}

// ============================================
// Boss Question Customization
// ============================================

const MAX_FREE_EDITS = 2;
let editedQuestions = [];
let editCount = 0;

function showBossCustomization() {
    const questionsList = document.getElementById('questionsList');
    const editLimitText = document.getElementById('editLimitText');
    const proHint = document.getElementById('proUpgradeHint');

    // Get current questions
    const currentQuestions = appData.customDailyQuestions || [...DEFAULT_DAILY_BOSS_QUESTIONS];
    editedQuestions = [...currentQuestions];

    // Track which questions have been edited (different from defaults)
    const editedIndices = [];
    for (let i = 0; i < currentQuestions.length; i++) {
        if (currentQuestions[i] !== DEFAULT_DAILY_BOSS_QUESTIONS[i]) {
            editedIndices.push(i);
        }
    }
    editCount = editedIndices.length;

    // Update edit limit text
    const remaining = appData.isPro ? 'all' : Math.max(0, MAX_FREE_EDITS - editCount);
    editLimitText.textContent = appData.isPro ? 'all' : remaining;

    // Show/hide pro hint
    proHint.style.display = appData.isPro ? 'none' : 'block';

    // Build questions list
    questionsList.innerHTML = '';
    currentQuestions.forEach((question, index) => {
        const isAlreadyEdited = editedIndices.includes(index);
        // Can edit if: Pro user OR already edited this one OR haven't hit limit yet
        const canEdit = appData.isPro || isAlreadyEdited || editCount < MAX_FREE_EDITS;

        const item = document.createElement('div');
        item.className = 'question-item' + (canEdit ? '' : ' locked');
        item.dataset.index = index;
        item.dataset.edited = isAlreadyEdited ? 'true' : 'false';

        item.innerHTML = `
            <span class="question-text">${question}</span>
            <span class="edit-indicator">${canEdit ? '✎' : '🔒'}</span>
        `;

        if (canEdit) {
            item.addEventListener('click', () => editQuestion(index, item));
        } else {
            // Show upgrade prompt when clicking locked question
            item.addEventListener('click', () => showProUpgradePrompt());
        }

        questionsList.appendChild(item);
    });

    openModal('bossCustomizeModal');
}

function showProUpgradePrompt() {
    alert('Upgrade to Pro to customize all boss battle questions!');
}

function editQuestion(index, element) {
    // Check if already editing
    if (element.classList.contains('editing')) return;

    const currentText = editedQuestions[index];
    const wasAlreadyEdited = element.dataset.edited === 'true';

    // Create input
    element.classList.add('editing');
    element.innerHTML = `
        <textarea class="question-input" rows="3">${currentText}</textarea>
    `;

    const input = element.querySelector('.question-input');
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);

    // Save on blur
    input.addEventListener('blur', () => {
        const newText = input.value.trim();
        if (newText && newText !== currentText) {
            // Check if this is a new edit (not previously edited)
            if (!wasAlreadyEdited && newText !== DEFAULT_DAILY_BOSS_QUESTIONS[index]) {
                editCount++;
                element.dataset.edited = 'true';
            }
            // Check if reverted back to default
            if (wasAlreadyEdited && newText === DEFAULT_DAILY_BOSS_QUESTIONS[index]) {
                editCount--;
                element.dataset.edited = 'false';
            }
            editedQuestions[index] = newText;
        }

        // Restore display
        element.classList.remove('editing');
        const isEdited = editedQuestions[index] !== DEFAULT_DAILY_BOSS_QUESTIONS[index];
        element.innerHTML = `
            <span class="question-text">${editedQuestions[index]}</span>
            <span class="edit-indicator">✎</span>
        `;

        // Re-attach click handler
        element.addEventListener('click', () => editQuestion(index, element));

        // Update edit limit text
        const remaining = appData.isPro ? 'all' : Math.max(0, MAX_FREE_EDITS - editCount);
        document.getElementById('editLimitText').textContent = appData.isPro ? 'all' : remaining;

        // Refresh locked states for other questions
        refreshQuestionLockStates();
    });

    // Also save on Enter (but allow Shift+Enter for newlines)
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            input.blur();
        }
    });
}

function refreshQuestionLockStates() {
    const items = document.querySelectorAll('#questionsList .question-item');
    items.forEach((item, index) => {
        if (item.classList.contains('editing')) return; // Skip if editing

        const isEdited = item.dataset.edited === 'true';
        const canEdit = appData.isPro || isEdited || editCount < MAX_FREE_EDITS;

        if (canEdit) {
            item.classList.remove('locked');
            const indicator = item.querySelector('.edit-indicator');
            if (indicator) indicator.textContent = '✎';
        } else {
            item.classList.add('locked');
            const indicator = item.querySelector('.edit-indicator');
            if (indicator) indicator.textContent = '🔒';
        }
    });
}

function saveBossQuestions() {
    // Check if anything changed
    const hasChanges = editedQuestions.some((q, i) => q !== DEFAULT_DAILY_BOSS_QUESTIONS[i]);

    if (hasChanges) {
        appData.customDailyQuestions = [...editedQuestions];
    } else {
        appData.customDailyQuestions = null; // Use defaults
    }

    saveData();
    closeModal('bossCustomizeModal');
}

function resetBossQuestions() {
    if (confirm('Reset all questions to defaults?')) {
        appData.customDailyQuestions = null;
        editedQuestions = [...DEFAULT_DAILY_BOSS_QUESTIONS];
        editCount = 0;
        saveData();
        showBossCustomization(); // Refresh the list
    }
}
