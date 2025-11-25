# 🔐 Admin Dashboard Guide

## Overview

Admin dashboard untuk monitoring user activity, analytics, dan platform statistics di KaelNime.

**Access URL:** `https://your-domain.com/admin/dashboard`

---

## 🚀 Setup

### 1. Environment Variable

Tambahkan email admin ke `.env`:

```env
ADMIN_EMAILS=almalikulrhakelino@gmail.com,other@admin.com
```

**Multiple admins:** Pisahkan dengan koma (comma-separated)

### 2. Vercel Deployment

Tambahkan environment variable di Vercel:

1. Go to: **Vercel Dashboard** → **Project** → **Settings** → **Environment Variables**
2. Add variable:
   - **Name:** `ADMIN_EMAILS`
   - **Value:** `almalikulrhakelino@gmail.com`
   - **Environment:** All (Production, Preview, Development)
3. Save and redeploy

---

## 📊 Features

### 1. Dashboard (`/admin/dashboard`)

**Overview Statistics:**
- 👥 Total registered users
- 🎬 Total watch records
- ⏱️ Total watch time (hours)
- 🔥 Active users today

**Top Users Leaderboard:**
- Ranked by watch time
- Shows level & badge
- Total minutes watched

**Recent Activity Feed:**
- Last 20 watch activities
- User email, anime watched, time
- Real-time updates

---

### 2. Users Management (`/admin/users`)

**User List Features:**
- Complete user information
- Watch statistics per user
- Level & badge display
- Progress to next level (visual bar)
- Last active timestamp
- Episode count
- Sortable by watch time

**Columns:**
- User (email, name, avatar)
- Level & Badge
- Total watch time
- Episodes watched
- Progress bar to next level
- Last activity date

---

### 3. Activity Monitor (`/admin/activity`)

**Activity Feed:**
- Last 100 watch activities
- Real-time monitoring
- User who watched
- Anime/episode title
- Timestamp (relative & absolute)
- Watch duration

**Activity Stats:**
- Today's activities count
- Yesterday's comparison
- This week's total

---

## 🔒 Security

### Authorization Flow:

1. User accesses `/admin/*` route
2. Server checks if user is authenticated (NextAuth session)
3. Server checks if user email is in `ADMIN_EMAILS` list
4. If not authenticated → redirect to `/api/auth/signin`
5. If not admin → redirect to `/` (home page)
6. If admin → grant access

### Protected Routes:

All routes under `/admin/*` are protected:
- `/admin/dashboard`
- `/admin/users`
- `/admin/activity`

### No Client-Side Protection:

Authorization is **server-side only** (secure):
- Checked in `AdminLayout` component
- Runs before page renders
- No way to bypass via browser dev tools

---

## 📁 File Structure

```
src/app/
├── admin/
│   ├── layout.jsx              # Admin layout with auth check
│   ├── dashboard/
│   │   └── page.jsx           # Main dashboard
│   ├── users/
│   │   └── page.jsx           # Users list
│   └── activity/
│       └── page.jsx           # Activity monitor
│
└── libs/
    └── adminAuth.js           # Admin auth helper
```

---

## 🎨 UI Design

### Color Scheme:
- Background: `neutral-900` (dark)
- Cards: `neutral-800` with `neutral-700` borders
- Accent: `pink-500/600` for important stats
- Text: `white` primary, `neutral-400` secondary

### Components:
- Stat cards with icons
- Tables with hover effects
- Progress bars
- Avatar images
- Relative time formatting
- Responsive layout

---

## 🔧 Customization

### Add More Admin Emails:

```env
# .env
ADMIN_EMAILS=admin1@email.com,admin2@email.com,admin3@email.com
```

### Add More Pages:

Create new pages under `/admin/`:

```javascript
// src/app/admin/analytics/page.jsx
export default async function AdminAnalyticsPage() {
  // Your custom analytics
}
```

Add to navigation in `layout.jsx`:

```jsx
<Link href="/admin/analytics">📈 Analytics</Link>
```

---

## 📊 Database Queries

### Key Queries Used:

```javascript
// Total users
await prisma.user.count()

// Total watch history
await prisma.watchHistory.count()

// Total watch minutes (all users)
await prisma.user.aggregate({ _sum: { totalWatchMinutes: true } })

// Top users by watch time
await prisma.user.findMany({
  orderBy: { totalWatchMinutes: 'desc' },
  take: 10
})

// Recent activity with user info
await prisma.watchHistory.findMany({
  take: 20,
  orderBy: { watchedAt: 'desc' },
  include: { user: { select: { email, name, level } } }
})
```

---

## 🚨 Troubleshooting

### Issue: "Access Denied" when accessing admin page

**Solutions:**
1. Check `.env` has `ADMIN_EMAILS` set
2. Verify your logged-in email matches `ADMIN_EMAILS`
3. Restart dev server after changing `.env`
4. For Vercel: Ensure environment variable is set and redeployed

### Issue: Stats showing 0 or empty

**Solutions:**
1. Check database has data (users, watch history)
2. Verify Prisma client is generated (`npx prisma generate`)
3. Check database connection in `.env`
4. Look at server logs for errors

### Issue: Slow loading

**Solutions:**
1. Add database indexes (userId, watchedAt columns)
2. Limit query results (already set to reasonable limits)
3. Consider caching for dashboard stats
4. Use pagination for large datasets

---

## 🎯 Future Enhancements (Ideas)

- [ ] Export data to CSV/Excel
- [ ] Charts & graphs (watch time trends)
- [ ] User search & filter
- [ ] Ban/suspend user functionality
- [ ] Email notifications for important events
- [ ] Real-time updates (WebSocket/SSE)
- [ ] Custom date range filters
- [ ] Most popular anime analytics
- [ ] User engagement metrics
- [ ] Admin action logs

---

## 📝 Usage Example

1. **Login** with admin email
2. Navigate to `/admin/dashboard`
3. View overview statistics
4. Click **"👥 Users"** to see all users
5. Click **"📜 Activity"** to monitor real-time activity
6. Use navbar to switch between pages

---

## 🔐 Best Practices

1. **Keep admin emails secret** - Don't commit to git
2. **Use strong passwords** for admin accounts
3. **Monitor admin access** - Check logs regularly
4. **Limit admin count** - Only trusted users
5. **Backup database** - Before making changes
6. **Test in staging** - Before deploying to production

---

**Version:** 1.0  
**Last Updated:** 2025-11-25
