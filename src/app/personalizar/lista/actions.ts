"use server";

import { concederAcessoLista, senhaConfere } from "@/lib/pedidos/acesso-lista";

export async function autorizarVisualizacao(senha: string) {
  if (!senhaConfere(senha ?? "")) {
    return { ok: false as const, message: "Senha incorreta." };
  }
  concederAcessoLista();
  return { ok: true as const };
}
