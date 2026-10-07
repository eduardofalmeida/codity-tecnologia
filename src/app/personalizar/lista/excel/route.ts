import { NextResponse } from "next/server";

import { listaAutorizada } from "@/lib/pedidos/acesso-lista";
import { listarCadastros } from "@/lib/pedidos/lista";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!listaAutorizada()) {
    return new NextResponse("Não autorizado", { status: 401 });
  }

  const { montarPlanilha } = await import("@/lib/pedidos/planilha");
  const arquivo = await montarPlanilha(await listarCadastros());
  return new NextResponse(new Uint8Array(arquivo), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="cadastros-camisas.xlsx"',
      "Content-Length": String(arquivo.length),
      "Cache-Control": "no-store",
    },
  });
}
