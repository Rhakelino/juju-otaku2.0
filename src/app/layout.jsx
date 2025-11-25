import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "./components/NextAuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kaelnime",
  description: "Web Streaming Anime Sub Indo",
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
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
