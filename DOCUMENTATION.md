# YOURPG - Gamified Self-Improvement App

## Overview
YOURPG is a Progressive Web App (PWA) that gamifies personal development through an EXP/leveling system. Users gain EXP for positive habits, lose EXP for negative behaviors, and face daily/weekly/monthly "boss battles" - accountability check-ins that reward consistency.

**Live URL:** https://jonbearhimself.github.io/yourpg/

**Repository:** https://github.com/JonBearHimself/yourpg

---

## Current Features (v1.0 - January 2026)

### Core Mechanics

#### EXP System
- **+50 EXP** (gold button) - Major positive action
- **+10 EXP** (gold button) - Minor positive action
- **-10 EXP** (purple button) - Minor negative action
- **-50 EXP** (purple button) - Major negative action
- EXP updates both daily and total counters in real-time
- Sound effects on EXP changes (can be toggled off)

#### Daily Status
- **HERO** - Positive daily EXP (gold badge)
- **WORM** - Negative daily EXP (purple badge)
- **NEUTRAL** - Zero daily EXP (gray badge)

#### Level System
30 levels with exponential thresholds:
- Level 1: 0 EXP
- Level 2: 100 EXP
- Level 5: 1,000 EXP
- Level 10: 5,200 EXP
- Level 15: 14,500 EXP
- Level 20: 36,000 EXP
- Level 25: 82,000 EXP
- Level 30: 185,000 EXP

Level-up triggers a celebratory modal.

### Boss Battle System

Boss battles are mandatory accountability check-ins. When due, they block EXP buttons until completed. Cannot be dismissed.

#### Daily Boss (10 questions)
| Question | YES | NO |
|----------|-----|-----|
| Meditation/breathwork (10 min) | +100 | -200 |
| Read 10 pages non-fiction | +100 | -200 |
| Write 5 gratitudes | +100 | -200 |
| Move towards dream | +100 | -200 |
| Exercise (weights/walk) | +100 | -200 |
| Express appreciation to someone | +100 | -200 |
| Avoided porn | +100 | -200 |
| Avoided fapping | +100 | -200 |
| Dressed well/groomed | +100 | -200 |
| Good posture/eye contact/body language | +100 | -200 |

**Max Daily Boss:** +1,000 EXP | **Min:** -2,000 EXP

#### Weekly Boss (8 questions)
| Question | YES | NO |
|----------|-----|-----|
| 7+ hours sleep 4/7 days | +500 | -1000 |
| Consistent wake time | +500 | -1000 |
| Lifted weights 3x with intensity | +500 | -1000 |
| Daily affirmations/visualization | +500 | -1000 |
| Social media <30 min/day | +500 | -1000 |
| Dressed well every day | +500 | -1000 |
| Spoke slower, deeper, with certainty | +500 | -1000 |
| Approached/talked to stranger | +500 | -1000 |

**Max Weekly Boss:** +4,000 EXP | **Min:** -8,000 EXP

#### Monthly Boss (1 question)
| Question | YES | NO |
|----------|-----|-----|
| Did you move towards your dream life? | +2,000 | -3,000 |

#### Boss Schedule (Customizable in Settings)
- **Daily Boss Time:** 6 PM, 7 PM, 8 PM, 9 PM (default), or 10 PM
- **Weekly Boss Day:** Sunday (default), Monday, Friday, or Saturday
- **Monthly Boss Day:** Last day (default), 1st, 15th, or 28th

### My Month Calendar
- Calendar view showing current month
- Gold days = HERO days (positive EXP)
- Purple days = WORM days (negative EXP)
- Today highlighted with border
- Stats displayed: Total EXP, Current Streak, Level
- Streak counts consecutive HERO days

### Settings
- Sound effects toggle
- Notification toggle + frequency (30 min / 1 hour / 2 hours)
- Notification permission button (for iOS)
- Boss battle schedule customization
- Reset Today's EXP button
- View Calendar button

### Pro Features (Placeholder - Locked)
- Monthly graphs
- Custom boss questions
- Advanced statistics
- Custom themes

### Technical Implementation

#### Tech Stack
- HTML5, CSS3, Vanilla JavaScript
- LocalStorage for data persistence
- Service Worker for offline support
- Web Audio API for sounds

#### File Structure
```
/YOURPG/
├── index.html          # Main app (all screens/modals)
├── styles.css          # Mobile-first responsive CSS
├── app.js              # Core logic (~900 lines)
├── sw.js               # Service worker
├── manifest.json       # PWA manifest
├── audio/
│   ├── sfx_expup.ogg   # Positive sound
│   └── sfx_expdown.ogg # Negative sound
└── icons/
    ├── icon-192.png    # PWA icon
    └── icon-512.png    # PWA icon
```

#### Data Model (LocalStorage)
```javascript
{
  currentDayExp: 0,
  totalExp: 0,
  level: 1,
  history: [{ date, exp, rating }],
  dailyBossCompleted: false,
  weeklyBossCompleted: false,
  monthlyBossCompleted: false,
  lastDailyBoss: "2026-01-21",
  lastWeeklyBoss: "2026-W04",
  lastMonthlyBoss: "2026-01",
  lastActiveDate: "2026-01-21",
  settings: {
    soundEnabled: true,
    notificationsEnabled: true,
    notificationFrequency: 60,
    dailyBossTime: 21,
    weeklyBossDay: 0,
    monthlyBossDay: "last"
  },
  isPro: false
}
```

---

## Known Limitations

### Notifications
- iOS PWAs cannot send true background notifications
- Notifications only work while app is open in foreground
- Workaround: Use iOS Shortcuts app to create scheduled automations that open YOURPG

### Day Reset
- Day resets when app is opened on a new day, not at midnight automatically
- Requires user to open app for reset to trigger

---

## Boss Battle Critique & Suggestions

### Current Issues

1. **Too Many Questions (Daily)**
   - 10 questions daily may feel tedious over time
   - Consider reducing to 5-7 core questions

2. **Binary Yes/No Limitation**
   - No partial credit (e.g., read 5 pages instead of 10)
   - Could add "Partial" option worth 50% EXP

3. **NoFap/NoPorn Specificity**
   - Two separate questions for related behaviors
   - Could combine into one "Avoided PMO" question

4. **Vague Questions**
   - "Move towards dream" is subjective
   - Could be more specific: "Worked on side project for 30+ min"

5. **Missing Categories**
   - No nutrition/diet questions
   - No hydration tracking
   - No screen time beyond social media
   - No learning/skill development

### Suggested Alternative Daily Boss (7 Questions)

| Question | YES | NO |
|----------|-----|-----|
| Morning routine complete (meditation, gratitude, movement) | +150 | -300 |
| Read/learned for 30+ minutes | +100 | -200 |
| Exercised with intention | +150 | -300 |
| Worked towards a meaningful goal | +150 | -300 |
| Avoided PMO | +100 | -200 |
| Presented myself well (grooming, posture, confidence) | +100 | -200 |
| Connected meaningfully with someone | +100 | -200 |

**Max:** +850 EXP | **Min:** -1,700 EXP

### Suggested Weekly Boss Improvements

| Question | YES | NO |
|----------|-----|-----|
| Averaged 7+ hours sleep | +500 | -1000 |
| Exercised 4+ days | +500 | -1000 |
| Zero social media doom-scrolling days: 5+ | +500 | -1000 |
| Completed a meaningful project milestone | +750 | -1500 |
| Had a social interaction outside comfort zone | +500 | -1000 |
| Meal prepped / ate clean 5+ days | +500 | -1000 |

### Suggested Monthly Boss Improvements

Instead of 1 vague question, consider 3 specific ones:

| Question | YES | NO |
|----------|-----|-----|
| Made measurable progress on main goal | +1000 | -1500 |
| Maintained or improved key relationships | +500 | -1000 |
| Learned a new skill or deepened existing one | +500 | -1000 |

### Pro Feature: Custom Boss Battles
- Allow users to create/edit their own questions
- Set custom EXP values per question
- Enable/disable individual questions
- Create question categories/tags
- Import/export question sets

---

## Roadmap to App Store Release (Target: Mid-March 2026)

### Phase 1: Testing & Refinement (Jan 21 - Feb 7)
**Week 1-2: Personal Testing**
- [ ] Daily usage testing
- [ ] Document friction points
- [ ] Track which boss questions feel useful vs tedious
- [ ] Monitor EXP balance (too easy/hard to level?)
- [ ] Note any bugs or UX issues

**Deliverables:**
- Testing feedback document
- List of balance adjustments needed
- Priority bug fixes

### Phase 2: Beta Polish (Feb 8 - Feb 21)
**Week 3-4: Refinements**
- [ ] Implement balance changes from testing
- [ ] Refine boss battle questions based on feedback
- [ ] Add onboarding/tutorial flow
- [ ] Improve visual design (better icons, animations)
- [ ] Add data export feature
- [ ] Implement proper error handling

**New Features to Add:**
- [ ] Onboarding tutorial (first-time user experience)
- [ ] Data backup/restore (JSON export)
- [ ] Share progress feature
- [ ] Haptic feedback on iOS
- [ ] Better level-up celebrations

### Phase 3: Native App Wrapper (Feb 22 - Mar 7)
**Week 5-6: App Store Preparation**

**Option A: Capacitor/Ionic (Recommended)**
- Wrap PWA in native container
- Access native features (true push notifications, haptics)
- Single codebase for iOS + Android
- Estimated setup: 2-3 days

**Option B: React Native Rewrite**
- Full native rewrite
- Better performance
- More work: 2-3 weeks
- Not recommended for March deadline

**Tasks:**
- [ ] Set up Capacitor project
- [ ] Configure iOS build (requires Mac + Xcode)
- [ ] Configure Android build
- [ ] Implement native push notifications
- [ ] Add in-app purchase for Pro features
- [ ] Test on physical devices

### Phase 4: Pro Features Implementation (Mar 1 - Mar 10)
**Week 6-7: Monetization**
- [ ] Custom boss battle editor (Pro)
- [ ] Monthly/weekly graphs (Pro)
- [ ] Advanced statistics (Pro)
- [ ] Theme customization (Pro)
- [ ] Implement in-app purchase flow
- [ ] Add restore purchases functionality

**Pricing Strategy:**
- Free tier: Core app functionality
- Pro: $4.99 one-time purchase
- Consider: $1.99/month subscription alternative

### Phase 5: App Store Submission (Mar 10 - Mar 15)
**Week 7-8: Launch**

**iOS App Store Requirements:**
- [ ] Apple Developer Account ($99/year)
- [ ] App Store screenshots (6.5" and 5.5" iPhone)
- [ ] App icon (1024x1024)
- [ ] Privacy policy URL
- [ ] App description and keywords
- [ ] Age rating questionnaire
- [ ] Build uploaded via Xcode/Transporter

**Google Play Store Requirements:**
- [ ] Google Play Developer Account ($25 one-time)
- [ ] Feature graphic (1024x500)
- [ ] Screenshots (phone + tablet)
- [ ] Privacy policy URL
- [ ] Content rating questionnaire
- [ ] AAB file upload

**Timeline:**
- iOS review: 1-3 days typically
- Android review: Few hours to 1 day
- Buffer for rejection/resubmission: 3-5 days

### Phase 6: Launch & Marketing (Mar 15+)
- [ ] Soft launch to friends/family
- [ ] Collect initial reviews
- [ ] Social media announcement
- [ ] Reddit posts (r/getdisciplined, r/selfimprovement, r/productivity)
- [ ] Product Hunt launch
- [ ] Consider YouTube demo video

---

## Technical Debt & Future Improvements

### Code Quality
- Add TypeScript for type safety
- Implement unit tests
- Add error boundary/logging
- Refactor to component-based architecture

### Features Backlog
- Cloud sync (Firebase/Supabase)
- Social features (friends, leaderboards)
- Widgets (iOS/Android home screen)
- Apple Watch companion
- AI-generated personalized boss questions
- Integration with health apps (Apple Health, Google Fit)
- Habit templates (fitness focus, productivity focus, etc.)

### Accessibility
- VoiceOver/TalkBack support
- High contrast mode
- Larger text options
- Reduce motion option

---

## Version History

### v1.0 (January 21, 2026)
- Initial PWA release
- Core EXP system with 4 buttons
- Daily/Weekly/Monthly boss battles
- Level system (30 levels)
- My Month calendar view with streak
- Customizable boss battle schedule
- Sound effects
- Offline support
- Settings panel
- Pro features placeholder

---

## Contact & Support

**Developer:** JonBearHimself
**Repository Issues:** https://github.com/JonBearHimself/yourpg/issues

---

*Document last updated: January 21, 2026*
