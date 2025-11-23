# Auth Fix Guide - JujuOtaku

## ✅ Masalah Yang Sudah Diperbaiki

### 1. **File NextAuth Route Hilang**
File `src/app/api/auth/[...nextauth]/route.js` tidak ada, menyebabkan seluruh sistem autentikasi tidak berfungsi.

**✅ FIXED:** File sudah dibuat dengan konfigurasi lengkap:
- Google OAuth Provider
- GitHub OAuth Provider  
- Prisma Database Adapter
- Session callbacks
- Custom sign-in page

### 2. **Database Schema**
Database sudah sync dengan Prisma schema dan siap digunakan.

---

## 🧪 Cara Testing Auth (PENTING!)

### **STEP 1: Clear Browser Data (WAJIB!)**

Karena sebelumnya auth tidak berfungsi, browser Anda mungkin menyimpan session/cookies yang corrupt. **WAJIB clear terlebih dahulu:**

**Chrome/Edge:**
1. Tekan `F12` → Tab **Application**
2. Di sidebar kiri, expand **Cookies** → pilih `http://localhost:3000`
3. Klik kanan → **Clear**
4. Di sidebar, klik **Session Storage** → klik kanan → **Clear**
5. Di sidebar, klik **Local Storage** → klik kanan → **Clear**
6. Tutup DevTools

**Atau cara cepat:**
1. `Ctrl + Shift + Delete`
2. Pilih **Cookies** dan **Site data**
3. Time range: **All time**
4. Klik **Clear data**

---

### **STEP 2: Restart Dev Server**

```bash
# Stop server (Ctrl+C)
# Restart
npm run dev
```

---

### **STEP 3: Test Login Flow**

#### A. Test Halaman Sign In

1. Buka browser (Chrome/Edge)
2. Akses: `http://localhost:3000/signin`
3. **Expected:** Muncul 2 tombol:
   - ✅ "Sign in with Google"
   - ✅ "Sign in with GitHub"

#### B. Test Login dengan Google

1. Klik **"Sign in with Google"**
2. Pilih akun Google Anda
3. **Expected:** Redirect ke Google OAuth
4. Setelah authorize, redirect ke `/users/dashboard`
5. **Expected:** Muncul halaman dashboard dengan:
   - Avatar Anda
   - Nama Anda
   - Email Anda
   - Tombol "Logout"
   - 2 tombol navigasi (Riwayat Tontonan, Riwayat Komentar)

#### C. Test Protected Route

1. **Tanpa Login**, coba akses: `http://localhost:3000/users/dashboard`
2. **Expected:** Otomatis redirect ke sign-in page

#### D. Test Logout

1. Di dashboard, klik tombol **"Logout"**
2. **Expected:** Redirect ke sign-out page
3. Confirm sign out
4. **Expected:** Session cleared, tidak bisa akses dashboard lagi

---

## 🔧 Troubleshooting

### ❌ Error: "Cannot read properties of undefined (reading 'user')"

**Penyebab:** Session tidak terbuat dengan benar.

**Solusi:**
1. Clear browser cookies/storage (lihat STEP 1)
2. Logout paksa: Akses `http://localhost:3000/api/auth/signout`
3. Clear lagi browser data
4. Login ulang

---

### ❌ Error: "Configuration mismatch" atau "Invalid callback URL"

**Penyebab:** Google/GitHub OAuth credentials tidak sesuai.

**Solusi:**

**Google Cloud Console:**
1. Buka: https://console.cloud.google.com/apis/credentials
2. Pilih OAuth Client ID yang Anda gunakan
3. Di **Authorized redirect URIs**, pastikan ada:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
4. Save

**GitHub Settings:**
1. Buka: https://github.com/settings/developers
2. Pilih OAuth App yang Anda gunakan
3. Di **Authorization callback URL**, pastikan ada:
   ```
   http://localhost:3000/api/auth/callback/github
   ```
4. Update application

---

### ❌ Error: "Database connection failed"

**Penyebab:** Database URL tidak valid atau Prisma Client belum di-generate.

**Solusi:**
```bash
# Regenerate Prisma Client
npx prisma generate

# Push schema ke database
npx prisma db push

# Restart server
npm run dev
```

---

### ❌ Error: "NEXTAUTH_SECRET is not set"

**Penyebab:** Environment variable tidak terbaca.

**Solusi:**
1. Pastikan file `.env` ada di root project
2. Pastikan ada line: `NEXT_AUTH_SECRET=juju123`
3. Restart dev server

**Untuk production**, generate secret yang lebih aman:
```bash
openssl rand -base64 32
```
Ganti `juju123` dengan hasil generate.

---

### ❌ Session masih tidak terbuat setelah login

**Cek di Database:**
```bash
npx prisma studio
```

1. Buka Prisma Studio
2. Cek tabel **User** → apakah user terbuat setelah login?
3. Cek tabel **Session** → apakah session ada?
4. Cek tabel **Account** → apakah account terhubung ke user?

**Jika tabel kosong:**
- Berarti login tidak sampai ke database
- Cek console browser (`F12` → Console) ada error?
- Cek terminal server ada error?

---

### ❌ "Redirect URI mismatch" di OAuth page

**Solusi:**
Pastikan di `.env`:
```env
NEXTAUTH_URL=http://localhost:3000
```

**JANGAN** pakai `https://` di localhost (kecuali Anda setup SSL custom).

---

## 📝 File Yang Sudah Dibuat/Diperbaiki

### Baru:
- ✅ `src/app/api/auth/[...nextauth]/route.js` - **NextAuth configuration (INI YANG HILANG!)**
- ✅ `AUTH_FIX_GUIDE.md` - Dokumentasi ini

### Existing (tidak diubah):
- `src/app/libs/auth-libs.js` - Helper untuk get session
- `src/app/components/NextAuthProvider.jsx` - Session provider
- `src/app/signin/page.jsx` - Sign in page
- `src/app/users/dashboard/page.jsx` - Protected dashboard
- `prisma/schema.prisma` - Database schema
- `.env` - Environment variables

---

## 🔐 Auth Flow Yang Benar

```
1. User klik "Sign in with Google/GitHub"
   ↓
2. Redirect ke OAuth provider (Google/GitHub)
   ↓
3. User authorize aplikasi
   ↓
4. OAuth provider redirect ke: /api/auth/callback/{provider}
   ↓
5. NextAuth process callback:
   - Create/update User di database
   - Create Account (link provider ke user)
   - Create Session
   ↓
6. Redirect ke callbackUrl (/users/dashboard)
   ↓
7. Dashboard page call AuthUserSession()
   ↓
8. Session valid → show dashboard
   Session invalid → redirect to sign in
```

---

## 🚀 Production Checklist

Sebelum deploy ke Vercel/production:

- [ ] Generate NEXTAUTH_SECRET yang aman:
  ```bash
  openssl rand -base64 32
  ```
  
- [ ] Update `.env.production` atau Vercel environment variables:
  ```env
  NEXTAUTH_URL=https://your-domain.com
  NEXT_AUTH_SECRET=<generated-secret>
  ```

- [ ] Update OAuth callback URLs:
  - Google: `https://your-domain.com/api/auth/callback/google`
  - GitHub: `https://your-domain.com/api/auth/callback/github`

- [ ] Test login di production

---

## 📞 Support

Jika masih ada masalah:

1. Cek Console browser (`F12` → Console)
2. Cek Terminal server (ada error messages?)
3. Cek `.env` semua credentials lengkap?
4. Clear browser data dan coba lagi
5. Restart dev server

---

**Auth sudah fix! Selamat mencoba! 🎉**
