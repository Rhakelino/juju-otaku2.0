// app/dashboard/page.jsx
import Image from "next/image";
import { AuthUserSession } from "@/app/libs/auth-libs";
import { redirect } from "next/navigation";
import Link from "next/link";
import BreadcrumbNavigation from "@/app/components/BreadcrumbNavigation";
import prisma from "@/app/libs/prisma";

// Helper function untuk get badge berdasarkan level
function getLevelBadge(level) {
  if (level >= 13) return "Ota-King";        // 12+ jam (720+ menit) - MAX TIER
  if (level >= 10) return "Wibu Legend";     // 9-12 jam (540-719 menit)
  if (level >= 7) return "Wibu Elite";       // 6-9 jam (360-539 menit)
  if (level >= 5) return "Wibu Master";      // 4-6 jam (240-359 menit)
  if (level >= 3) return "Wibu Veteran";     // 2-4 jam (120-239 menit)
  if (level >= 2) return "Wibu Fomo";        // 1-2 jam (60-119 menit)
  return "Wibu Pemula";                      // 0-1 jam (0-59 menit)
}

// Helper function untuk get badge icon
function getBadgeIcon(level) {
  const icons = {
    13: "\u{1F451}", // 👑
    10: "\u{2B50}",  // ⭐
    7: "\u{1F48E}",  // 💎
    5: "\u{1F393}",  // 🎓
    3: "\u{2694}\u{FE0F}",   // ⚔️
    2: "\u{1F440}",  // 👀
    1: "\u{1F331}"   // 🌱
  };
  
  if (level >= 13) return icons[13];
  if (level >= 10) return icons[10];
  if (level >= 7) return icons[7];
  if (level >= 5) return icons[5];
  if (level >= 3) return icons[3];
  if (level >= 2) return icons[2];
  return icons[1];
}

// Helper function untuk get avatar frame class
function getAvatarFrameClass(level) {
  if (level >= 13) return "border-4 animate-pulse";
  if (level >= 10) return "border-4 border-yellow-500 shadow-lg shadow-yellow-500/50";
  if (level >= 7) return "border-4 border-cyan-400 shadow-lg shadow-cyan-400/50";
  if (level >= 5) return "border-4 border-purple-600 shadow-md";
  if (level >= 3) return "border-4 border-blue-500";
  if (level >= 2) return "border-4 border-yellow-400";
  return "border-4 border-zinc-800";
}

// Helper function untuk get avatar aura class
function getAvatarAuraClass(level) {
  if (level >= 13) return "bg-gradient-to-r from-yellow-400 via-purple-600 to-yellow-400";
  if (level >= 10) return "bg-yellow-400";
  return "";
}

// Helper function untuk get badge color class
function getBadgeColorClass(level) {
  if (level >= 13) return "bg-gradient-to-r from-yellow-400 via-purple-600 to-yellow-400";
  if (level >= 10) return "bg-gradient-to-r from-yellow-500 to-orange-500";
  if (level >= 7) return "bg-gradient-to-r from-cyan-400 to-blue-600";
  if (level >= 5) return "bg-gradient-to-r from-purple-600 to-purple-800";
  if (level >= 3) return "bg-gradient-to-r from-blue-500 to-blue-700";
  if (level >= 2) return "bg-gradient-to-r from-yellow-400 to-orange-500";
  return "bg-zinc-700";
}

// Helper function untuk get progress bar class
function getProgressBarClass(level) {
  if (level >= 13) return "bg-gradient-to-r from-yellow-400 via-purple-600 to-yellow-400";
  if (level >= 10) return "bg-gradient-to-r from-yellow-500 to-orange-500";
  if (level >= 7) return "bg-gradient-to-r from-cyan-400 to-blue-600";
  if (level >= 5) return "bg-gradient-to-r from-purple-600 to-purple-800";
  return "bg-gradient-to-r from-pink-600 to-purple-600";
}

async function DashboardPage() {
  const session = await AuthUserSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  // Ambil data user lengkap dari database (termasuk stats)
  const userData = await prisma.user.findUnique({
    where: { email: session.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      totalWatchMinutes: true,
      level: true,
      nextLevelMinutes: true,
    },
  });

  if (!userData) {
    redirect("/api/auth/signin");
  }

  // Ambil count watch history secara terpisah
  const watchHistoryCount = await prisma.watchHistory.count({
    where: { userId: userData.id },
  });

  const { name, email, image, totalWatchMinutes, level, nextLevelMinutes } = userData;

  const breadcrumbs = [
    { title: 'Dashboard', href: '/users/dashboard' }
  ];

  return (
    // 1. Latar belakang diubah ke zinc-900
    <section className="font-sans min-h-screen text-gray-100">
      <div className="flex items-center justify-between py-8 px-4">
        <BreadcrumbNavigation crumbs={breadcrumbs} />
        <Link
          href="/api/auth/signout"
          className="border border-red-500 text-red-500 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-500/10 transition-colors"
        >
          Logout
        </Link>
      </div>

      {/* 3. Info Profil: Avatar, Nama, dan Badge */}
      <div className="flex flex-col items-center px-4 pt-4">
        {/* Avatar dengan frame dan aura dinamis */}
        <div className="relative">
          {/* Aura effect untuk level tinggi */}
          {level >= 10 && (
            <div 
              className={`absolute inset-0 rounded-full blur-xl opacity-60 animate-pulse ${getAvatarAuraClass(level)}`}
            />
          )}
          
          {/* Avatar dengan frame dinamis */}
          <Image
            src={image}
            alt="Foto Profil"
            width={100}
            height={100}
            className={`rounded-full relative z-10 ${getAvatarFrameClass(level)}`}
            priority
          />
          
          {/* Icon badge di pojok avatar */}
          <div className="absolute -bottom-2 -right-2 z-20 bg-black rounded-full p-2 border-2 border-white shadow-lg">
            <span className="text-2xl">{getBadgeIcon(level)}</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mt-6">
          {name}
        </h1>

        {/* Badge dengan gradient dan icon */}
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          <span className={`text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg relative overflow-hidden ${getBadgeColorClass(level)}`}>
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-lg">{getBadgeIcon(level)}</span>
              {getLevelBadge(level)}
            </span>
            {/* Sparkle effect untuk level tinggi */}
            {level >= 7 && (
              <div className="absolute inset-0">
                <div className="absolute top-1 right-2 w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"></div>
                <div className="absolute bottom-1 left-2 w-1 h-1 bg-white rounded-full opacity-70 animate-pulse [animation-delay:500ms]"></div>
              </div>
            )}
          </span>

          <span className="bg-zinc-700 text-neutral-300 text-sm font-medium px-4 py-2 rounded-full">
            Level {level}
          </span>
          <span className="bg-zinc-700 text-neutral-300 text-sm font-medium px-4 py-2 rounded-full break-all">
            {email}
          </span>
        </div>
      </div>

      {/* 4. Statistik (Ditambah garis pemisah & warna) */}
      <div className="w-full max-w-md mx-auto mt-8 px-4 pt-8 border-t border-zinc-700">
        {/* Progress Bar menuju Level Berikutnya */}
        <div className="mb-6 bg-zinc-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-neutral-300">Progress ke Level {level + 1}</span>
            <span className="text-sm font-bold text-pink-500">
              {totalWatchMinutes} / {nextLevelMinutes} menit
            </span>
          </div>
          <div className="w-full bg-zinc-700 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getProgressBarClass(level)}`}
              style={{ width: `${Math.min((totalWatchMinutes / nextLevelMinutes) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-around">
          <div className="text-center">
            {/* Angka diberi warna pink */}
            <p className="text-2xl font-bold text-pink-500">{totalWatchMinutes}</p>
            <p className="text-sm text-neutral-400">menit menonton</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-500">{watchHistoryCount}</p>
            <p className="text-sm text-neutral-400">episode ditonton</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-500">{level}</p>
            <p className="text-sm text-neutral-400">level saat ini</p>
          </div>
        </div>
      </div>

      {/* 5. Navigasi Tombol (Menggantikan Tab) */}
      <div className="w-full max-w-md mx-auto mt-8 px-4 flex flex-col sm:flex-row gap-4">
        <Link
          href="/users/dashboard/my-history"
          className="flex-1 text-center py-3 px-6 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors"
        >
          Riwayat Tontonan
        </Link>
        <Link
          href="/users/dashboard/my-comment"
          className="flex-1 text-center py-3 px-6 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors"
        >
          Riwayat Komentar
        </Link>
      </div>
    </section>
  );
}

export default DashboardPage;