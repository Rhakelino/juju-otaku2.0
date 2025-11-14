// File: src/app/users/dashboard/my-history/page.jsx
// KOMPONEN INI TETAP SEBAGAI SERVER COMPONENT

import { getServerSession } from "next-auth";
import prisma from "@/app/libs/prisma";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Navigation from "@/app/components/Navigation";
import HistoryList from "./HistoryList"; 

const useDatabase = process.env.USE_DATABASE === 'true';

async function getWatchHistory(userId) {
  if (!prisma) {
    return [];
  }
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
  let session = null;
  let currentUser = null;
  let history = []; 

  if (useDatabase) {
    console.log("Mode DB aktif, memeriksa sesi...");
    session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      redirect("/signin"); 
    }

    currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      redirect("/signin"); 
    }
    history = await getWatchHistory(currentUser.id);

  } else {
    console.log("Mode DB nonaktif, mengabaikan pengecekan sesi.");
  }

  return (
    <div className="container mx-auto p-4">
      <Navigation />
      <h1 className="text-3xl font-bold mb-6">Riwayat Menonton</h1>
      {!useDatabase && (
        <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 p-4 rounded-lg mb-4">
          Riwayat Tontonan disimpan di peramban ini (cache). Fitur database sedang nonaktif.
        </div>
      )}
      <HistoryList initialHistory={history} />

    </div>
  );
}