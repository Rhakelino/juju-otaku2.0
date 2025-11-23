# Cara Test PWA di Localhost (Development)

## ✅ Ya, PWA Bisa Ditest di Localhost!

Browser modern (Chrome, Edge) menganggap `localhost` sebagai "secure context", jadi semua fitur PWA bisa jalan normal tanpa perlu HTTPS atau deploy ke server.

## Step-by-Step Testing:

### 1. Jalankan Dev Server
```bash
npm run dev
```
Server akan jalan di `http://localhost:3000` atau `3001`

### 2. Buka di Chrome/Edge
- Buka `http://localhost:3000` (atau port yang muncul)
- **PENTING**: Harus Chrome atau Edge (Firefox tidak support install prompt)

### 3. Cek Service Worker (Developer Tools)

**Cara 1 - Application Tab:**
1. Tekan `F12` (atau `Ctrl+Shift+I`) untuk buka DevTools
2. Klik tab **"Application"**
3. Di sidebar kiri, klik **"Service Workers"**
4. Anda harus lihat: `sw.js` dengan status **"activated and is running"**

**Screenshot ekspektasi:**
```
Service Workers
└─ http://localhost:3000
   └─ sw.js
      Status: activated and is running ✓
      Source: /sw.js
```

**Troubleshooting:**
- Jika tidak muncul, refresh halaman beberapa kali
- Pastikan tidak ada error di Console
- Coba hard refresh: `Ctrl+Shift+R`

---

### 4. Test Install Banner

**Install Banner akan muncul otomatis IF:**
- ✅ Service worker terdaftar
- ✅ Manifest valid
- ✅ Website belum pernah diinstall
- ✅ User belum dismiss banner sebelumnya

**Jika Banner TIDAK Muncul:**

**Opsi A - Clear Storage:**
1. DevTools → Application → Storage
2. Klik "Clear site data"
3. Refresh halaman (`F5`)
4. Banner seharusnya muncul

**Opsi B - Reset localStorage:**
1. DevTools → Console
2. Ketik: `localStorage.removeItem('pwa-prompt-dismissed')`
3. Enter
4. Refresh halaman

**Opsi C - Manual Install (Tanpa Banner):**
1. Lihat di address bar (kanan atas URL)
2. Klik icon **"Install"** (⊕ atau icon aplikasi)
3. Klik "Install"

---

### 5. Test Install Aplikasi

**Setelah Install:**
- Aplikasi akan terbuka di window baru (seperti native app)
- Tidak ada address bar
- Icon muncul di:
  - Windows: Start Menu / Desktop
  - Mac: Applications folder / Dock
  - Linux: Application menu

**Cara Uninstall (untuk test ulang):**
1. Buka aplikasi yang sudah diinstall
2. Klik menu (⋮) di kanan atas
3. Klik "Uninstall [App Name]"

---

### 6. Test Offline Support

1. **Buka DevTools** (`F12`)
2. **Tab Network**
3. **Pilih "Offline"** dari dropdown (biasanya "No throttling")
4. **Refresh halaman** (`F5`)
5. Seharusnya muncul halaman `/offline` (bukan dinosaur game Chrome)

**Note:** Karena service worker masih sederhana, hanya halaman yang sudah pernah dibuka yang bisa offline. Untuk offline penuh, perlu enhance cache strategy di `sw.js`.

---

### 7. Test di Mobile (Real Device)

**Android Chrome:**
1. Pastikan laptop dan HP di WiFi yang sama
2. Dev server akan show: `Network: http://192.168.x.x:3000`
3. Buka URL itu di HP
4. Banner install akan muncul otomatis
5. Atau: Menu (⋮) → "Add to Home screen"

**iOS Safari:**
1. Sama seperti Android, buka Network URL
2. Klik tombol **Share** (kotak dengan panah ke atas)
3. Scroll → **"Add to Home Screen"**
4. Edit nama, klik "Add"

**Note iOS:**
- iOS Safari support PWA tapi limited
- Service worker support terbatas
- Manifest support parsial
- Install prompt (banner) TIDAK muncul di iOS, harus manual via Share button

---

## Debugging Tips

### Console Errors?
Buka DevTools → Console, cek ada error atau tidak:
- Error service worker → cek `public/sw.js`
- Error manifest → cek `site.webmanifest` path
- Error component → cek import di `layout.jsx`

### Service Worker Tidak Update?
```javascript
// Di DevTools → Application → Service Workers
// Klik "Unregister"
// Refresh halaman
```

Atau:
```javascript
// Di Console
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister()
  }
})
```

### Force Update Service Worker:
1. DevTools → Application → Service Workers
2. Centang **"Update on reload"**
3. Refresh halaman

---

## Perbedaan Development vs Production

| Fitur | Development (localhost) | Production (Vercel/HTTPS) |
|-------|------------------------|---------------------------|
| Service Worker | ✅ Jalan | ✅ Jalan |
| Install Prompt | ✅ Jalan | ✅ Jalan |
| Offline Support | ✅ Jalan | ✅ Jalan |
| Push Notifications | ⚠️ Limited | ✅ Full support |
| Background Sync | ⚠️ Limited | ✅ Full support |
| SSL/HTTPS | ➖ Tidak perlu | ✅ Required |

**Kesimpulan:** 95% fitur PWA bisa ditest di localhost!

---

## Checklist Testing:

- [ ] Dev server jalan
- [ ] Buka di Chrome/Edge (bukan Firefox)
- [ ] Service worker terdaftar (cek DevTools → Application)
- [ ] Banner install muncul (atau bisa install manual)
- [ ] Berhasil install aplikasi
- [ ] Aplikasi buka di window terpisah
- [ ] Test offline mode (Network → Offline)
- [ ] Halaman offline muncul
- [ ] Test di mobile (opsional)

---

## FAQ

**Q: Banner tidak muncul?**
A: Clear localStorage: `localStorage.removeItem('pwa-prompt-dismissed')` lalu refresh

**Q: Service worker tidak terdaftar?**
A: Hard refresh (`Ctrl+Shift+R`) atau cek Console ada error atau tidak

**Q: Bisa test push notification?**
A: Bisa, tapi perlu setup backend. Di localhost limited.

**Q: Harus deploy ke production dulu?**
A: TIDAK! Localhost sudah cukup untuk test 95% fitur PWA

**Q: Firefox tidak bisa install?**
A: Firefox belum support install prompt. Gunakan Chrome/Edge untuk test.

---

Selamat testing! 🚀

Jika ada masalah, cek:
1. Console ada error?
2. Service worker terdaftar?
3. Sudah clear localStorage?
4. Pakai Chrome/Edge?
