# 🧪 Quick Testing Guide - Level System

## 📋 Testing API Endpoints

API testing tersedia di: **`/api/test-progress`**

---

## 🚀 Copy-Paste Commands (Browser Console)

### 1️⃣ Reset ke Level 1
```javascript
fetch('/api/test-progress', { method: 'GET' })
  .then(r => r.json())
  .then(data => {
    console.log(data.message);
    alert(`${data.message}\n\nRefresh dashboard untuk melihat perubahan!`);
  });
```

### 2️⃣ Test Semua Level Badge (Satu per Satu)

#### Level 2 - Wibu Fomo (1 jam)
```javascript
fetch('/api/test-progress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ minutes: 60 })
}).then(r => r.json()).then(data => alert(data.message));
```

#### Level 3 - Wibu Veteran (2 jam)
```javascript
fetch('/api/test-progress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ minutes: 120 })
}).then(r => r.json()).then(data => alert(data.message));
```

#### Level 5 - Wibu Master (4 jam)
```javascript
fetch('/api/test-progress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ minutes: 240 })
}).then(r => r.json()).then(data => alert(data.message));
```

#### Level 7 - Wibu Elite (6 jam)
```javascript
fetch('/api/test-progress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ minutes: 360 })
}).then(r => r.json()).then(data => alert(data.message));
```

#### Level 10 - Wibu Legend (9 jam)
```javascript
fetch('/api/test-progress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ minutes: 540 })
}).then(r => r.json()).then(data => alert(data.message));
```

#### Level 13 - Ota-King👑 (12 jam) - MAX TIER!
```javascript
fetch('/api/test-progress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ minutes: 720 })
}).then(r => r.json()).then(data => alert(data.message));
```

---

### 3️⃣ Set Langsung ke Level Tertentu

#### Set ke Level 5
```javascript
fetch('/api/test-progress?level=5', { method: 'DELETE' })
  .then(r => r.json())
  .then(data => alert(data.message + '\n\nBadge: ' + data.data.badge));
```

#### Set ke Level 10
```javascript
fetch('/api/test-progress?level=10', { method: 'DELETE' })
  .then(r => r.json())
  .then(data => alert(data.message + '\n\nBadge: ' + data.data.badge));
```

#### Set ke Level 13 (Ota-King👑)
```javascript
fetch('/api/test-progress?level=13', { method: 'DELETE' })
  .then(r => r.json())
  .then(data => alert(data.message + '\n\nBadge: ' + data.data.badge));
```

---

## 🎯 Testing Scenario: Test Semua Badge

### Quick Test (Copy semua sekaligus)
```javascript
// 1. Reset
await fetch('/api/test-progress', { method: 'GET' }).then(r => r.json()).then(console.log);
await new Promise(r => setTimeout(r, 500));

// 2. Level 2 - Wibu Fomo
await fetch('/api/test-progress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ minutes: 60 })
}).then(r => r.json()).then(data => console.log('Level 2:', data.badge));
await new Promise(r => setTimeout(r, 500));

// 3. Level 3 - Wibu Veteran
await fetch('/api/test-progress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ minutes: 60 })
}).then(r => r.json()).then(data => console.log('Level 3:', data.badge));
await new Promise(r => setTimeout(r, 500));

// 4. Level 5 - Wibu Master
await fetch('/api/test-progress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ minutes: 120 })
}).then(r => r.json()).then(data => console.log('Level 5:', data.badge));
await new Promise(r => setTimeout(r, 500));

// 5. Level 7 - Wibu Elite
await fetch('/api/test-progress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ minutes: 120 })
}).then(r => r.json()).then(data => console.log('Level 7:', data.badge));
await new Promise(r => setTimeout(r, 500));

// 6. Level 10 - Wibu Legend
await fetch('/api/test-progress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ minutes: 180 })
}).then(r => r.json()).then(data => console.log('Level 10:', data.badge));
await new Promise(r => setTimeout(r, 500));

// 7. Level 13 - Ota-King👑
await fetch('/api/test-progress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ minutes: 180 })
}).then(r => r.json()).then(data => console.log('Level 13:', data.badge));

console.log('✅ Testing selesai! Refresh dashboard untuk melihat badge terakhir.');
```

---

## 📊 Level Reference (Quick Copy)

```
Level 1:  0 menit    (0 jam)     - Wibu Pemula
Level 2:  60 menit   (1 jam)     - Wibu Fomo
Level 3:  120 menit  (2 jam)     - Wibu Veteran
Level 5:  240 menit  (4 jam)     - Wibu Master
Level 7:  360 menit  (6 jam)     - Wibu Elite
Level 10: 540 menit  (9 jam)     - Wibu Legend
Level 13: 720 menit  (12 jam)    - Ota-King👑
```

---

## 🎮 Realistic Testing (Marathon Scenarios)

### Scenario 1: Nonton 1 Cour (12 episode = 240 menit)
```javascript
fetch('/api/test-progress', { method: 'GET' }).then(() => {
  return fetch('/api/test-progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ minutes: 240 })
  });
}).then(r => r.json()).then(data => {
  alert(`Setelah nonton 12 episode:\n${data.message}`);
});
```

### Scenario 2: Nonton 2 Cour (24 episode = 480 menit)
```javascript
fetch('/api/test-progress', { method: 'GET' }).then(() => {
  return fetch('/api/test-progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ minutes: 480 })
  });
}).then(r => r.json()).then(data => {
  alert(`Setelah nonton 24 episode:\n${data.message}`);
});
```

### Scenario 3: Marathon Weekend (36 episode = 720 menit)
```javascript
fetch('/api/test-progress', { method: 'GET' }).then(() => {
  return fetch('/api/test-progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ minutes: 720 })
  });
}).then(r => r.json()).then(data => {
  alert(`Setelah marathon 36 episode:\n${data.message}`);
});
```

---

## ⚠️ IMPORTANT: Cleanup Setelah Testing

Jangan lupa hapus testing API sebelum push ke production:

```bash
# Hapus folder testing API
rm -rf src/app/api/test-progress

# Atau via Windows
Remove-Item -Path "src\app\api\test-progress" -Recurse -Force
```

---

## 💡 Tips Testing

1. **Buka 2 tab**: Satu untuk console commands, satu untuk dashboard
2. **Refresh dashboard** setelah run command untuk lihat perubahan
3. **Check console** untuk lihat response lengkap
4. **Test badge transition** dengan increment kecil (60 menit = 1 level)

**Happy Testing! 🎉**
