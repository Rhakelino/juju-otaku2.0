import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "./components/NextAuthProvider";
import PWARegister from "./components/PWARegister";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ec4899",
};

export const metadata = {
  title: "JujuOtaku - Web Streaming Anime Sub Indo",
  description: "Nonton anime subtitle Indonesia gratis! Streaming anime terbaru, ongoing, complete, dan movie dengan kualitas HD. Install aplikasi untuk akses lebih cepat.",
  keywords: "anime, streaming anime, anime sub indo, nonton anime, anime gratis, anime online",
  authors: [{ name: "JujuOtaku" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "JujuOtaku",
  },
  icons: {
    icon: [
      { url: '/images/favicon_io/favicon.ico' },
      { url: '/images/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/images/favicon_io/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/images/favicon_io/site.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PWARegister />
        <NextAuthProvider>
          <PWAInstallPrompt />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
