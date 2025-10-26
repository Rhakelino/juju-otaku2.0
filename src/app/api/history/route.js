// File: src/app/api/history/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/app/libs/prisma";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Cek apakah user sudah login
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
    const { animeId, episodeId, title, image } = body;

    if (!animeId || !episodeId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // 3. Gunakan 'upsert' (update or insert)
    // Ini adalah inti logikanya:
    // - JIKA user + episodeId sudah ada, UPDATE 'watchedAt'
    // - JIKA tidak ada, BUAT (create) data baru
    const historyEntry = await prisma.watchHistory.upsert({
      where: {
        userId_episodeId: { // Ini berdasarkan @@unique di skema
          userId: currentUser.id,
          episodeId: episodeId,
        },
      },
      // Jika sudah ada, update (timestamp akan otomatis di-update oleh @updatedAt)
      update: {
        title: title, // Update judul/gambar jika berubah
        image: image,
      },
      // Jika belum ada, buat baru
      create: {
        userId: currentUser.id,
        animeId: animeId,
        episodeId: episodeId,
        title: title,
        image: image,
      },
    });

    return NextResponse.json(historyEntry, { status: 200 });
  } catch (error) {
    console.error("HISTORY_POST_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}