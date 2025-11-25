import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/app/libs/prisma";

// Helper function untuk kalkulasi level
function calculateLevel(totalMinutes) {
  // Formula simple: Level = floor(totalMinutes / 60) + 1
  // Level 1: 0-59 menit, Level 2: 60-119 menit, dst
  const level = Math.floor(totalMinutes / 60) + 1;
  const nextLevelMinutes = level * 60; // Target untuk level berikutnya
  
  return { level, nextLevelMinutes };
}

// Helper function untuk get badge berdasarkan level
function getLevelBadge(level) {
  if (level >= 13) return "Ota-King👑";      // 12+ jam (720+ menit) - MAX TIER
  if (level >= 10) return "Wibu Legend";     // 9-12 jam (540-719 menit)
  if (level >= 7) return "Wibu Elite";       // 6-9 jam (360-539 menit)
  if (level >= 5) return "Wibu Master";      // 4-6 jam (240-359 menit)
  if (level >= 3) return "Wibu Veteran";     // 2-4 jam (120-239 menit)
  if (level >= 2) return "Wibu Fomo";        // 1-2 jam (60-119 menit)
  return "Wibu Pemula";                      // 0-1 jam (0-59 menit)
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Cek autentikasi
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // 2. Ambil data dari body request
    const body = await request.json();
    const { episodeId, watchDuration } = body;

    if (!episodeId || typeof watchDuration !== 'number') {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // 3. Validasi keamanan: max 30 menit per request
    if (watchDuration > 30 || watchDuration < 0) {
      return new NextResponse("Invalid watch duration", { status: 400 });
    }

    // 4. Update atau create WatchHistory
    const existingHistory = await prisma.watchHistory.findUnique({
      where: {
        userId_episodeId: {
          userId: currentUser.id,
          episodeId: episodeId,
        },
      },
    });

    let minutesToAdd = watchDuration;

    if (existingHistory) {
      // Update existing record - increment watchDuration
      await prisma.watchHistory.update({
        where: {
          id: existingHistory.id,
        },
        data: {
          watchDuration: existingHistory.watchDuration + watchDuration,
        },
      });
    } else {
      // Jika history belum ada, biarkan - nanti akan dibuat via POST /api/history
      // Kita tetap update total minutes user
      console.log("History not found yet for episode:", episodeId);
    }

    // 5. Update total watch minutes user
    const newTotalMinutes = currentUser.totalWatchMinutes + minutesToAdd;
    const { level, nextLevelMinutes } = calculateLevel(newTotalMinutes);
    const levelBadge = getLevelBadge(level);

    // 6. Cek apakah naik level
    const leveledUp = level > currentUser.level;

    // 7. Update user
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        totalWatchMinutes: newTotalMinutes,
        level: level,
        nextLevelMinutes: nextLevelMinutes,
      },
    });

    return NextResponse.json({
      success: true,
      totalWatchMinutes: updatedUser.totalWatchMinutes,
      level: updatedUser.level,
      nextLevelMinutes: updatedUser.nextLevelMinutes,
      levelBadge: levelBadge,
      leveledUp: leveledUp,
    }, { status: 200 });

  } catch (error) {
    console.error("WATCH_PROGRESS_POST_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
