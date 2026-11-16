import { NextResponse } from "next/server";
import { encerrarSessao } from "@/server/auth/sessao";

export async function POST() {
  await encerrarSessao();

  return new NextResponse(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
}
