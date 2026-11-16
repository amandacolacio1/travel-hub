import { NextResponse } from "next/server";
import { listarDestinos } from "@/server/destinos/catalogo";

/** `GET /api/destinos` — catálogo completo; o ranking é calculado por quem consome. */
export async function GET() {
  return NextResponse.json(listarDestinos());
}
