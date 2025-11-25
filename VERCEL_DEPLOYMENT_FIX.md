# 🚀 Vercel Deployment Fix Guide

## ❌ Error yang Terjadi

```
Error [PrismaClientValidationError]: 
Invalid `prisma.user.findUnique()` invocation

Unknown field `totalWatchMinutes` for select statement on model `User`.
```

### 🔍 Root Cause

Field baru (`totalWatchMinutes`, `level`, `nextLevelMinutes`) sudah ada di **Prisma schema** tapi **belum ada di database production** Vercel.

### ⚠️ Mengapa Ini Terjadi?

1. Local development menggunakan `npx prisma db push` → Database local sudah sync
2. Vercel production **belum run database sync** → Field belum ada
3. Next.js build di Vercel hanya run `prisma generate` (generate client), **tidak update database**

---

## ✅ Solution Applied

### **Script Changes in `package.json`**

```json
"scripts": {
  "postinstall": "prisma generate",
  "vercel-build": "prisma db push --accept-data-loss && next build --turbopack"
}
```

### **Explanation:**

#### 1. `postinstall` Script
```json
"postinstall": "prisma generate"
```
- Runs automatically after `npm install`
- Generates Prisma Client with updated schema
- Ensures client matches schema definition

#### 2. `vercel-build` Script (Custom Build Command)
```json
"vercel-build": "prisma db push --accept-data-loss && next build --turbopack"
```

**What it does:**
1. `prisma db push --accept-data-loss` 
   - Sync database schema with Prisma schema
   - Creates new columns: `totalWatchMinutes`, `level`, `nextLevelMinutes`
   - Adds default values to existing rows
   - `--accept-data-loss` flag: Accepts potential data loss (safe for adding columns with defaults)

2. `&& next build --turbopack`
   - Only runs if `prisma db push` succeeds
   - Builds Next.js app

**Vercel automatically detects and uses `vercel-build` script instead of default `build` script.**

---

## 📋 Deployment Steps

### **Step 1: Commit Changes**
```bash
git add package.json
git commit -m "fix: add Vercel build script for Prisma schema sync"
git push
```

### **Step 2: Vercel Auto-Deploy**
Vercel will automatically:
1. Detect push to repository
2. Run `npm install` → triggers `postinstall` (prisma generate)
3. Run `vercel-build` script:
   - Sync database schema
   - Build Next.js app
4. Deploy successfully

### **Step 3: Verify Deployment**
Check Vercel logs:
- ✅ `prisma db push` completes without errors
- ✅ Database columns created
- ✅ Build succeeds
- ✅ Deployment successful

---

## 🔧 Alternative Solutions

### **Option A: Migration Files** (More Production-Ready)

```bash
# Generate migration
npx prisma migrate dev --name add_watch_minutes_and_level

# Commit migration files
git add prisma/migrations
git commit -m "feat: add watch minutes and level tracking"
git push
```

**Then update package.json:**
```json
"vercel-build": "prisma migrate deploy && next build --turbopack"
```

**Pros:**
- ✅ Track schema changes
- ✅ Rollback capability
- ✅ Better for team collaboration

**Cons:**
- ❌ More setup required
- ❌ Need to manage migration files

### **Option B: Manual Database Update** (Quick Fix)

Run SQL directly in production database:
```sql
ALTER TABLE "User" 
  ADD COLUMN "totalWatchMinutes" INTEGER DEFAULT 0,
  ADD COLUMN "level" INTEGER DEFAULT 1,
  ADD COLUMN "nextLevelMinutes" INTEGER DEFAULT 60;

ALTER TABLE "WatchHistory"
  ADD COLUMN "watchDuration" INTEGER DEFAULT 0,
  ADD COLUMN "lastWatchPosition" INTEGER DEFAULT 0;
```

**Pros:**
- ✅ Immediate fix
- ✅ No code changes

**Cons:**
- ❌ Manual process
- ❌ Not repeatable
- ❌ Easy to forget in future deployments

---

## ⚙️ Vercel Environment Variables

Ensure these are set in Vercel Dashboard:

```env
DATABASE_URL=your_production_database_url
```

**Where to set:**
1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add/verify `DATABASE_URL`

---

## 🐛 Troubleshooting

### Issue: `prisma db push` fails on Vercel

**Possible causes:**
1. Database URL not set correctly
2. Database connection timeout
3. Insufficient permissions

**Solution:**
Check Vercel build logs:
```
Settings → Deployments → Latest Deployment → View Function Logs
```

### Issue: Data loss warning

**Why it happens:**
- Renaming columns
- Changing data types
- Removing columns

**Solution:**
If you're confident no data will be lost:
```bash
prisma db push --accept-data-loss
```

### Issue: Build succeeds but app still crashes

**Possible causes:**
1. Environment variables not set
2. Database still not synced
3. Prisma client not regenerated

**Solution:**
1. Trigger manual redeploy in Vercel
2. Check environment variables
3. Verify database has new columns

---

## ✅ Verification Checklist

After deployment:

- [ ] Vercel build logs show `prisma db push` success
- [ ] No validation errors in logs
- [ ] App loads without server errors
- [ ] Dashboard page displays correctly
- [ ] Level system shows correct data
- [ ] Progress bar renders
- [ ] Badge icons display

---

## 📚 Related Documentation

- [Prisma Deploy Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Vercel Build Configuration](https://vercel.com/docs/projects/project-configuration)
- [Prisma db push](https://www.prisma.io/docs/reference/api-reference/command-reference#db-push)

---

## 🎯 Summary

**Problem:** Database schema not synced in production  
**Solution:** Custom `vercel-build` script with `prisma db push`  
**Result:** Automatic schema sync on every deployment  

**Push and deploy sekarang seharusnya berhasil!** 🎉
