# 🎨 Visual Design Guide - Badge System

## Overview

Sistem badge visual yang memberikan feedback visual berbeda untuk setiap level user, membuat progression lebih engaging dan rewarding.

---

## 🎭 Badge Icons & Themes

### Level 1 - Wibu Pemula 🌱
**Theme:** Newbie / Fresh Start
- **Icon:** 🌱 (daun muda - baru tumbuh)
- **Avatar Frame:** Border tipis abu-abu (`border-zinc-800`)
- **Badge Color:** Abu-abu netral (`bg-zinc-700`)
- **Progress Bar:** Pink-Purple gradient (default)
- **Special Effects:** None

**Visual Identity:** Simple, clean, no special effects

---

### Level 2 - Wibu Fomo 👀
**Theme:** Getting Hooked / FOMO Vibes
- **Icon:** 👀 (mata - takut ketinggalan)
- **Avatar Frame:** Border kuning (`border-yellow-400`)
- **Badge Color:** Yellow-Orange gradient
- **Progress Bar:** Pink-Purple gradient (default)
- **Special Effects:** None

**Visual Identity:** Warm colors, subtle excitement

---

### Level 3-4 - Wibu Veteran ⚔️
**Theme:** Experienced / Battle-Tested
- **Icon:** ⚔️ (pedang - veteran anime watcher)
- **Avatar Frame:** Border biru steel (`border-blue-500`)
- **Badge Color:** Blue gradient (`from-blue-500 to-blue-700`)
- **Progress Bar:** Pink-Purple gradient (default)
- **Special Effects:** None

**Visual Identity:** Cool, solid, reliable

---

### Level 5-6 - Wibu Master 🎓
**Theme:** Master Level / Scholar
- **Icon:** 🎓 (topi wisuda - master degree in anime)
- **Avatar Frame:** Border purple dengan shadow (`border-purple-600 shadow-md`)
- **Badge Color:** Purple royal gradient (`from-purple-600 to-purple-800`)
- **Progress Bar:** Purple gradient
- **Special Effects:** Subtle shadow

**Visual Identity:** Prestigious, educated, refined

---

### Level 7-9 - Wibu Elite 💎
**Theme:** Elite Tier / Diamond Rank
- **Icon:** 💎 (diamond - rare and valuable)
- **Avatar Frame:** Border cyan dengan glow (`border-cyan-400 shadow-lg shadow-cyan-400/50`)
- **Badge Color:** Cyan-Blue gradient (`from-cyan-400 to-blue-600`)
- **Progress Bar:** Cyan-Blue gradient
- **Special Effects:** 
  - **Glowing shadow** around avatar
  - **Sparkle effects** pada badge (2 dots pulsing)

**Visual Identity:** Luxurious, shiny, premium

---

### Level 10-12 - Wibu Legend ⭐
**Theme:** Legendary / Hall of Fame
- **Icon:** ⭐ (bintang - legendary status)
- **Avatar Frame:** Border gold dengan strong glow (`border-yellow-500 shadow-lg shadow-yellow-500/50`)
- **Badge Color:** Gold gradient (`from-yellow-500 to-orange-500`)
- **Progress Bar:** Gold gradient
- **Special Effects:**
  - **Golden aura** behind avatar (blur-xl dengan pulse)
  - **Sparkle effects** pada badge
  - **Glow shadow** yang lebih kuat

**Visual Identity:** Golden, prestigious, iconic

---

### Level 13+ - Ota-King 👑
**Theme:** Ultimate / Royal / Endgame
- **Icon:** 👑 (mahkota raja - king of otaku)
- **Avatar Frame:** Border dengan pulse animation (`animate-pulse`)
- **Badge Color:** Rainbow gradient (`from-yellow-400 via-purple-600 to-yellow-400`)
- **Progress Bar:** Rainbow gradient (sama dengan badge)
- **Special Effects:**
  - **Rainbow aura** pulsing behind avatar (`linear-gradient(45deg, #fbbf24, #9333ea, #fbbf24)`)
  - **Sparkle effects** pada badge
  - **Animate pulse** pada border
  - **Crown glow** di notification

**Visual Identity:** Royal, majestic, ultimate achievement

---

## 🎨 Color Palette Reference

### Primary Colors
```css
/* Wibu Pemula */
--gray: #71717a (zinc-700)

/* Wibu Fomo */
--yellow: #fbbf24 (yellow-400)
--orange: #fb923c (orange-400)

/* Wibu Veteran */
--blue: #3b82f6 (blue-500)
--blue-dark: #1d4ed8 (blue-700)

/* Wibu Master */
--purple: #9333ea (purple-600)
--purple-dark: #6b21a8 (purple-800)

/* Wibu Elite */
--cyan: #22d3ee (cyan-400)
--blue-electric: #2563eb (blue-600)

/* Wibu Legend */
--gold: #fbbf24 (yellow-400)
--gold-dark: #f59e0b (orange-500)

/* Ota-King */
--rainbow: linear-gradient(yellow-400 → purple-600 → yellow-400)
```

---

## 💫 Animation Effects

### 1. Avatar Aura (Level 10+)
```jsx
<div className="absolute inset-0 rounded-full blur-xl opacity-60 animate-pulse"
     style={{background: level >= 13 
       ? 'linear-gradient(45deg, #fbbf24, #9333ea, #fbbf24)' 
       : '#fbbf24'
     }}
/>
```
- **Effect:** Glowing background di belakang avatar
- **Animation:** Pulse (fade in/out)
- **Colors:** Gold (Level 10-12), Rainbow (Level 13+)

### 2. Badge Sparkles (Level 7+)
```jsx
<div className="absolute top-1 right-2 w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"></div>
<div className="absolute bottom-1 left-2 w-1 h-1 bg-white rounded-full opacity-70 animate-pulse" 
     style={{animationDelay: '0.5s'}}></div>
```
- **Effect:** Small white dots pulsing
- **Animation:** Alternating pulse (offset by 0.5s)
- **Purpose:** Adds "sparkle" effect to high-level badges

### 3. Border Pulse (Level 13)
```jsx
className="animate-pulse"
```
- **Effect:** Border fades in/out rhythmically
- **Purpose:** Draws attention to ultimate tier

### 4. Level-Up Notification
```jsx
<div className="animate-bounce">
  {/* Notification content */}
</div>
```
- **Effect:** Bouncing animation
- **Duration:** 5 seconds
- **Icon:** Shows tier icon (👑, ⭐, 💎, 🎓)

---

## 📐 Layout Structure

### Dashboard Avatar Section
```
┌─────────────────────────────┐
│                             │
│      ┌──────────────┐       │
│      │              │       │  ← Aura (Level 10+)
│      │   ┌──────┐   │       │
│      │   │Avatar│   │       │
│      │   │      │   │       │
│      │   └──────┘   │       │
│      │        [Icon]│       │  ← Badge Icon
│      └──────────────┘       │
│                             │
│         User Name           │
│                             │
│  [🌱 Badge] [Level X] [Email]  │
│                             │
└─────────────────────────────┘
```

### Level-Up Notification
```
┌──────────────────────────┐
│ 🎉  Level Up! 👑         │
│     Sekarang kamu Level 13│
└──────────────────────────┘
```

---

## 🎯 Visual Progression Example

### User Journey (0 → 13 Level)

**Level 1 → 2:** 
- Frame: Gray → Yellow
- Badge: Gray → Yellow gradient
- No special effects

**Level 2 → 5:**
- Colors transition: Yellow → Blue → Purple
- Frame gets slightly thicker
- Shadows start appearing (Level 5)

**Level 5 → 7:**
- Purple → Cyan
- **Sparkles appear!** ✨
- Shadow glow intensifies

**Level 7 → 10:**
- Cyan glow gets stronger
- Sparkles continue
- Preparing for aura...

**Level 10 → 13:**
- **Golden aura appears!** 🌟
- Frame: Gold → Rainbow
- Progress bar: Gold → Rainbow
- Badge: Gold → Rainbow gradient

**Level 13:**
- **ULTIMATE FORM** 👑
- Rainbow aura pulsing
- Border pulsing
- Crown in all notifications
- Peak visual impact!

---

## 🔧 Technical Implementation

### Helper Functions Location
- **Dashboard:** `src/app/users/dashboard/page.jsx`
- **API:** `src/app/api/watch-progress/route.js` (badge names only)

### Functions
```javascript
getBadgeIcon(level)         // Returns emoji icon
getAvatarFrameClass(level)  // Returns Tailwind classes for frame
getAvatarAuraStyle(level)   // Returns inline style for aura
getBadgeColorClass(level)   // Returns Tailwind classes for badge
getProgressBarClass(level)  // Returns Tailwind classes for progress bar
```

### Dependencies
- **Tailwind CSS** - For all styling
- **Next.js Image** - For optimized avatar
- **React** - For conditional rendering

---

## 📱 Responsive Behavior

All visual effects are responsive and work on:
- ✅ Desktop (full effects)
- ✅ Tablet (full effects, adjusted spacing)
- ✅ Mobile (full effects, touch-friendly)

---

## 💡 Design Philosophy

1. **Progressive Enhancement:** Visual rewards increase gradually
2. **Clear Hierarchy:** Higher level = More visual impact
3. **Non-Intrusive:** Effects enhance, don't distract
4. **Performance:** CSS-only animations (no JS animation loops)
5. **Accessibility:** Effects are visual bonuses, not required for function

---

## 🎨 Future Enhancements (Ideas)

- [ ] Animated particles floating around Ota-King avatar
- [ ] Holographic effect on Level 13+ badge
- [ ] Custom avatar frames (unlockable)
- [ ] Profile background themes per level
- [ ] Badge showcase page
- [ ] Level history timeline

---

**Version:** 1.0  
**Last Updated:** 2025-11-25
