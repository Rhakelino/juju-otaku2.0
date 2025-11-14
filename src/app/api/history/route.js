// File: src/app/api/history/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/app/libs/prisma";

export async function POST(request) {
  if (!prisma) {
    return dbDisabledResponse();
  }

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
    const { animeId, episodeId, title, image } = body;

    if (!animeId || !episodeId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const historyEntry = await prisma.watchHistory.upsert({
      where: {
        userId_episodeId: {
          userId: currentUser.id,
          episodeId: episodeId,
        },
      },
      update: {
        title: title, 
        image: image,
      },
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
  if (!prisma) {
    return dbDisabledResponse();
  }
  
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
    const historyId = searchParams.get("id");

    if (!historyId) {
      return new NextResponse("History ID required", { status: 400 });
    }

    await prisma.watchHistory.delete({
      where: {
        id: historyId,
        userId: currentUser.id, 
      },
    });

    return NextResponse.json({ message: "History deleted" }, { status: 200 });
  } catch (error) {
    console.error("HISTORY_DELETE_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}