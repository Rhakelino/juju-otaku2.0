# PWA Setup Guide - JujuOtaku

PWA (Progressive Web App) sudah terpasang dengan lengkap! 🎉

## Fitur yang Sudah Ditambahkan

### 1. **Service Worker** (`public/sw.js`)
- Caching otomatis untuk performa lebih baik
- Offline support
- Cache management otomatis

### 2. **Install Prompt Banner**
- Banner muncul otomatis di atas halaman
- User bisa install aplikasi dengan satu klik
- Auto-dismiss dan tidak muncul lagi setelah user dismiss/install
- Responsive design (mobile & desktop)

### 3. **PWA Manifest** (`public/images/favicon_io/site.webmanifest`)
- Configured dengan theme color pink (#ec4899)
- Icons untuk berbagai ukuran layar
- Nama aplikasi: "JujuOtaku"

### 4. **Offline Page** (`/offline`)
- Halaman khusus saat user offline
- Design menarik dengan icon WiFi off
- Retry button

## Cara Testing PWA

### Test di Localhost:
1. Run dev server: `npm run dev`
2. Buka Chrome/Edge (harus browser yang support PWA)
3. Buka DevTools → Application → Service Workers
4. Pastikan service worker terdaftar
5. Banner install akan muncul di desktop (Chrome/Edge)

### Test Install:
**Desktop (Chrome/Edge):**
- Banner akan muncul otomatis di atas halaman
- Atau klik icon "Install" di address bar (sebelah kanan URL)

**Mobile (Android Chrome):**
- Banner akan muncul otomatis
- Atau buka menu (⋮) → "Add to Home screen"

**iOS (Safari):**
- Klik tombol Share
- Scroll → "Add to Home Screen"
- Icon akan muncul di home screen

### Test Offline:
1. Install aplikasi terlebih dahulu
2. Buka DevTools → Network → pilih "Offline"
3. Refresh halaman
4. Halaman offline akan muncul

## File yang Dibuat/Dimodifikasi

### Baru:
- `public/sw.js` - Service worker
- `src/app/components/PWAInstallPrompt.jsx` - Install banner
- `src/app/components/PWARegister.jsx` - Service worker register
- `src/app/offline/page.jsx` - Offline page
- `PWA_SETUP.md` - Dokumentasi ini

### Modified:
- `src/app/layout.jsx` - Added PWA components & enhanced metadata
- `src/app/globals.css` - Added slide-down animation
- `public/images/favicon_io/site.webmanifest` - Updated paths & colors

## Fitur PWA yang Aktif

✅ **Installable** - Bisa diinstall di desktop & mobile  
✅ **Offline Support** - Halaman tertentu bisa diakses offline  
✅ **Fast Loading** - Caching untuk performa lebih baik  
✅ **App-like** - Fullscreen experience saat diinstall  
✅ **Auto-update** - Service worker otomatis update  
✅ **Push-ready** - Siap untuk push notifications (belum diaktifkan)

## Customization

### Ubah Warna Theme:
Edit `public/images/favicon_io/site.webmanifest`:
```json
"theme_color": "#ec4899",  // Ubah warna ini
"background_color": "#171717"
```

### Ubah Cache Strategy:
Edit `public/sw.js` untuk custom caching behavior

### Disable Banner:
Hapus `<PWAInstallPrompt />` dari `src/app/layout.jsx`

## Browser Support

- ✅ Chrome (Desktop & Mobile)
- ✅ Edge (Desktop)
- ✅ Samsung Internet
- ✅ Opera
- ⚠️ Safari (Limited - iOS hanya support basic PWA)
- ❌ Firefox (Install prompt tidak support)

## Tips

1. PWA harus diakses via HTTPS di production
2. Localhost otomatis dianggap secure untuk testing
3. Banner install hanya muncul sekali (sampai user clear localStorage)
4. Service worker akan auto-update saat ada perubahan

## Deploy ke Production

Pastikan:
1. Website menggunakan HTTPS
2. site.webmanifest accessible
3. Service worker bisa diakses di `/sw.js`
4. All icons tersedia di folder yang benar

Selesai! 🚀
