'use client';

// File ini diperlukan untuk membungkus aplikasi Anda dengan
// SessionProvider, agar useSession() bisa berfungsi.

import { SessionProvider } from 'next-auth/react';

export default function NextAuthProvider({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}