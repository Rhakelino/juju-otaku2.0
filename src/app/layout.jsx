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
    title: "JujuOtaku",
    description: "Web Steraming Anime Sub Indo",
  };

  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`} 
        >
          <NextAuthProvider>
          {children}
          </NextAuthProvider>
        </body>
      </html>
    );
  }
