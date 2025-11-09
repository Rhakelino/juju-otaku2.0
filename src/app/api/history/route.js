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

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Cek Autentikasi
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // 2. Ambil ID Riwayat dari URL (cth: /api/history?id=clx...123)
    const { searchParams } = new URL(request.url);
    const historyId = searchParams.get("id");

    if (!historyId) {
      return new NextResponse("History ID required", { status: 400 });
    }

    // 3. Hapus data dari database
    // Kita tambahkan 'userId: currentUser.id' untuk keamanan,
    // memastikan pengguna hanya bisa menghapus riwayat mereka sendiri.
    await prisma.watchHistory.delete({
      where: {
        id: historyId,
        userId: currentUser.id, // <-- Cek Keamanan
      },
    });

    return NextResponse.json({ message: "History deleted" }, { status: 200 });
  } catch (error) {
    console.error("HISTORY_DELETE_ERROR", error);
    // Jika 'delete' gagal (cth: ID tidak ditemukan atau userId tidak cocok)
    // Prisma akan melempar error, yang akan ditangkap di sini.
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}