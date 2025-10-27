// File: src/app/dashboard/history/page.js

import { getServerSession } from "next-auth";
import prisma from "@/app/libs/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Navigation from "@/app/components/Navigation";

// --- FUNGSI BARU DIMULAI ---
/**
 * Mengubah slug episode menjadi format yang mudah dibaca.
 * contoh: "sxf-s3-episode-1-sub-indo" akan menjadi "Episode 1"
 * @param {string} slug - Slug episode dari database (item.episodeId)
 * @returns {string} - String yang sudah diformat
 */
function formatEpisodeId(slug) {
  if (!slug) return "";

  // 1. Gunakan Regex untuk mencari pola "episode-ANGKA"
  const match = slug.match(/episode-(\d+)/);

  // 2. Jika ditemukan (cth: "episode-1"), ambil angkanya (cth: "1")
  if (match && match[1]) {
    const episodeNumber = match[1];
    return `Episode ${episodeNumber}`;
  }

  // 3. Fallback jika pola tidak ditemukan
  // (Mengubah "slug-aneh-lain" menjadi "Slug Aneh Lain")
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
// --- FUNGSI BARU SELESAI ---


// Fungsi helper untuk mendapatkan data
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

  const history = await getWatchHistory(currentUser.id);

  return (
    <div className="container mx-auto p-4">
        <Navigation/>
      <h1 className="text-3xl font-bold mb-6">Riwayat Menonton</h1>
      
      {history.length === 0 ? (
        <p>Kamu belum menonton. nonton dulu ya kids</p>
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
                  src={item.image || 'https://placehold.co/600x400/252736/FFFFFF/png?text=No+Image'} // Placeholder lebih baik
                  alt={item.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <h3 className="text-sm font-semibold mt-2 group-hover:text-pink-500">
                {item.title}
              </h3>
              
              {/* --- INI PERUBAHANNYA --- */}
              <p className="text-xs text-gray-400 capitalize">
                {formatEpisodeId(item.episodeId)}
              </p>

            </Link>
          ))}
        </div>
      )}
    </div>
  );
}