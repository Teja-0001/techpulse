import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/bookmarks
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookmarks = await db.bookmark.findMany({
    where: { userId: session.user.id },
    include: { article: true },
  });

  return NextResponse.json({ bookmarks });
}

// DELETE /api/bookmarks
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await db.bookmark.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
