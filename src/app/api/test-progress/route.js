// TESTING ONLY - Hapus file ini setelah testing selesai
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/app/libs/prisma";

// Helper function untuk kalkulasi level (sama seperti di watch-progress)
function calculateLevel(totalMinutes) {
  const level = Math.floor(totalMinutes / 60) + 1;
  const nextLevelMinutes = level * 60;
  return { level, nextLevelMinutes };
}

// Helper function untuk get badge
function getLevelBadge(level) {
  if (level >= 13) return "Ota-King👑";
  if (level >= 10) return "Wibu Legend";
  if (level >= 7) return "Wibu Elite";
  if (level >= 5) return "Wibu Master";
  if (level >= 3) return "Wibu Veteran";
  if (level >= 2) return "Wibu Fomo";
  return "Wibu Pemula";
}

// POST: Tambah menit untuk testing
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const body = await request.json();
    const { minutes } = body;

    if (!minutes || typeof minutes !== 'number') {
      return new NextResponse("Missing 'minutes' field", { status: 400 });
    }

    // Langsung tambah menit
    const newTotal = currentUser.totalWatchMinutes + minutes;
    const { level, nextLevelMinutes } = calculateLevel(newTotal);
    const badge = getLevelBadge(level);

    const updated = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        totalWatchMinutes: newTotal,
        level: level,
        nextLevelMinutes: nextLevelMinutes,
      },
    });

    return NextResponse.json({
      success: true,
      totalWatchMinutes: updated.totalWatchMinutes,
      level: updated.level,
      badge: badge,
      nextLevelMinutes: updated.nextLevelMinutes,
      message: `✅ Berhasil menambahkan ${minutes} menit!\n📊 Total: ${updated.totalWatchMinutes} menit (${(updated.totalWatchMinutes / 60).toFixed(1)} jam)\n🎖️ Level: ${updated.level} - ${badge}\n🎯 Next Level: ${updated.nextLevelMinutes} menit`,
    });
  } catch (error) {
    console.error("TEST_PROGRESS_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// GET: Reset stats user ke 0
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Reset ke 0
    const updated = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        totalWatchMinutes: 0,
        level: 1,
        nextLevelMinutes: 60,
      },
    });

    return NextResponse.json({
      success: true,
      message: "♻️ Stats berhasil di-reset ke 0!",
      data: {
        totalWatchMinutes: 0,
        level: 1,
        badge: "Wibu Pemula",
        nextLevelMinutes: 60,
      },
    });
  } catch (error) {
    console.error("TEST_RESET_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE: Set stats ke level tertentu
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const targetLevel = parseInt(searchParams.get("level") || "1");

    // Kalkulasi menit untuk level tertentu
    // Level 5 = 240 menit (4 jam)
    const totalMinutes = (targetLevel - 1) * 60;
    const { level, nextLevelMinutes } = calculateLevel(totalMinutes);
    const badge = getLevelBadge(level);

    const updated = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        totalWatchMinutes: totalMinutes,
        level: level,
        nextLevelMinutes: nextLevelMinutes,
      },
    });

    return NextResponse.json({
      success: true,
      message: `🎯 Stats di-set ke Level ${level}!`,
      data: {
        totalWatchMinutes: updated.totalWatchMinutes,
        level: updated.level,
        badge: badge,
        nextLevelMinutes: updated.nextLevelMinutes,
      },
    });
  } catch (error) {
    console.error("TEST_SET_LEVEL_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
