// File: src/app/dashboard/history/page.js

import { getServerSession } from "next-auth";
import prisma from "@/app/libs/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Fungsi helper untuk mendapatkan data
async function getWatchHistory(userId) {
  const history = await prisma.watchHistory.findMany({
    where: {
      userId: userId,
    },
    // Urutkan berdasarkan waktu terakhir ditonton (terbaru di atas)
    orderBy: {
      watchedAt: 'desc',
    },
    take: 50, // Batasi 50 entri terbaru
  });
  return history;
}

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/signin"); // Jika tidak login, lempar ke signin
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) {
    redirect("/signin");
  }

  // Ambil data riwayat tontonan
  const history = await getWatchHistory(currentUser.id);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Riwayat Tontonan Saya</h1>
      
      {history.length === 0 ? (
        <p>Anda belum menonton apa-apa.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {history.map((item) => (
            <Link 
              href={`/watch/${item.episodeId}`} 
              key={item.id} 
              className="group"
            >
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <Image
                  src={item.image || '/placeholder.png'} // Sediakan gambar placeholder
                  alt={item.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <h3 className="text-sm font-semibold mt-2 truncate group-hover:text-pink-500">
                {item.title}
              </h3>
              <p className="text-xs text-gray-400">
                {item.episodeId.replace('-', ' ')}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}