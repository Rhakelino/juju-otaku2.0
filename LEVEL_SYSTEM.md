# 🎮 Level System - KaelNime

## 📊 Level Progression System

**Formula:** `Level = Math.floor(totalMinutes / 60) + 1`

Setiap **60 menit (1 jam)** menonton = naik 1 level

---

## 🏆 Badge Tiers (7 Levels)

### Level 1 - Wibu Pemula 🌱
- **Waktu:** 0-59 menit (0-1 jam)
- **Episode:** ~0-3 episode
- **Deskripsi:** Baru mulai nonton anime

### Level 2 - Wibu Fomo 🔥
- **Waktu:** 60-119 menit (1-2 jam)
- **Episode:** ~3-6 episode
- **Deskripsi:** Mulai ketagihan dan FOMO sama temen

### Level 3-4 - Wibu Veteran ⚔️
- **Waktu:** 120-239 menit (2-4 jam)
- **Episode:** ~6-12 episode
- **Deskripsi:** Sudah mulai konsisten nonton

### Level 5-6 - Wibu Master 🎓
- **Waktu:** 240-359 menit (4-6 jam)
- **Episode:** ~12-18 episode
- **Deskripsi:** Master level - nonton setengah season

### Level 7-9 - Wibu Elite 💎
- **Waktu:** 360-539 menit (6-9 jam)
- **Episode:** ~18-27 episode
- **Deskripsi:** Elite tier - hampir tamat 1 season

### Level 10-12 - Wibu Legend ⭐
- **Waktu:** 540-719 menit (9-12 jam)
- **Episode:** ~27-36 episode
- **Deskripsi:** Legend status - marathoner sejati

### Level 13+ - Ota-King 👑
- **Waktu:** 720+ menit (12+ jam)
- **Episode:** ~36+ episode
- **Deskripsi:** **ULTIMATE TIER** - True Otaku King!

---

## 📈 Quick Reference Table

| Level | Badge | Waktu (Jam) | Waktu (Menit) | Episode (~20min) |
|-------|-------|-------------|---------------|------------------|
| 1 | Wibu Pemula | 0-1 | 0-59 | 0-3 |
| 2 | Wibu Fomo | 1-2 | 60-119 | 3-6 |
| 3-4 | Wibu Veteran | 2-4 | 120-239 | 6-12 |
| 5-6 | Wibu Master | 4-6 | 240-359 | 12-18 |
| 7-9 | Wibu Elite | 6-9 | 360-539 | 18-27 |
| 10-12 | Wibu Legend | 9-12 | 540-719 | 27-36 |
| 13+ | Ota-King👑 | 12+ | 720+ | 36+ |

---

## 🎯 Milestone Examples

### Anime 1 Cour (12 Episode)
- Total: ~240-288 menit (4-4.8 jam)
- Result: **Level 5-6** (Wibu Master)

### Anime 2 Cour (24 Episode)
- Total: ~480-576 menit (8-9.6 jam)
- Result: **Level 9-10** (Wibu Elite → Legend)

### Anime 1 Season Long (36 Episode)
- Total: ~720-864 menit (12-14.4 jam)
- Result: **Level 13-15** (Ota-King👑)

### One Piece Arc (50 Episode)
- Total: ~1000-1200 menit (16.7-20 jam)
- Result: **Level 17-21** (Ota-King👑 Max Tier)

---

## 🔧 Technical Details

### Tracking System
- **Interval:** Setiap 2 menit menonton
- **API Endpoint:** `POST /api/watch-progress`
- **Storage:** PostgreSQL (Prisma)
- **Real-time:** Progress bar update otomatis

### Database Fields
```prisma
model User {
  totalWatchMinutes Int @default(0)  // Total menit menonton
  level             Int @default(1)  // Level user
  nextLevelMinutes  Int @default(60) // Target menit untuk level berikutnya
}

model WatchHistory {
  watchDuration     Int @default(0)  // Durasi menonton per episode
  lastWatchPosition Int @default(0)  // Posisi terakhir (future feature)
}
```

### Level Up Notification
- Muncul otomatis saat naik level
- Animasi: bounce effect
- Duration: 5 detik
- Position: Top-right corner

---

## 💡 Tips untuk Level Up Cepat

1. **Marathon Mode:** Nonton 1 season penuh (24 ep) = Level 9-10
2. **Consistency:** Nonton 3 episode per hari = ~Level 5 dalam seminggu
3. **Weekend Grind:** Nonton 6 jam di weekend = langsung Level 7+
4. **Ultimate Challenge:** Nonton 36 episode = Ota-King👑 unlocked!

---

## 🎨 Badge Colors & UI

- **Wibu Pemula:** Gray (zinc-700)
- **Wibu Fomo:** Yellow-Orange (gradient)
- **Wibu Veteran:** Blue (gradient)
- **Wibu Master:** Purple (gradient)
- **Wibu Elite:** Pink-Purple (gradient)
- **Wibu Legend:** Gold (gradient)
- **Ota-King👑:** Rainbow gradient (animated)

---

**Last Updated:** 2025-11-25  
**Version:** 1.0 (12-Hour Max Cap)
