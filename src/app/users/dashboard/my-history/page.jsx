// File: src/app/dashboard/history/page.js
// KOMPONEN INI TETAP SEBAGAI SERVER COMPONENT

import { getServerSession } from "next-auth";
import prisma from "@/app/libs/prisma"; // Pastikan path ini benar
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Navigation from "@/app/components/Navigation";
import BreadcrumbNavigation from "@/app/components/BreadcrumbNavigation";

// 1. Impor komponen client baru
import HistoryList from "./HistoryList"; 

// (Fungsi formatEpisodeId tidak diperlukan di sini lagi, 
//  karena sudah dipindahkan ke HistoryList.js)

// Fungsi helper untuk mendapatkan data (Tetap di sini)
async function getWatchHistory(userId) {
  const history = await prisma.watchHistory.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      watchedAt: 'desc',
    },
    take: 50,
  });
  return history;
}

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/signin");
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) {
    redirect("/signin");
  }

  // 2. Ambil data di server
  const history = await getWatchHistory(currentUser.id);

  const breadcrumbs = [
    { title: 'Dashboard', href: '/users/dashboard' },
    { title: 'My History', href: '/users/dashboard/my-history' }
  ];

  return (
    <div className="container mx-auto p-4">
      <BreadcrumbNavigation crumbs={breadcrumbs} />
      <h1 className="text-3xl font-bold mb-6">Riwayat Menonton</h1>
      
      {/* 3. Render Komponen Client dan teruskan data sebagai prop.
           Semua logika 'map', 'state', dan 'event' sekarang 
           ditangani di dalam HistoryList.
      */}
      <HistoryList initialHistory={history} />

    </div>
  );
}