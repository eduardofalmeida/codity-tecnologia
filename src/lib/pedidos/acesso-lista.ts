import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const SENHA_LISTA = "camisa10";
const COOKIE = "lista_pedidos";

function tokenEsperado() {
  return createHmac("sha256", "lista-pedidos")
    .update(SENHA_LISTA)
    .digest("hex");
}

function iguais(a: string, b: string) {
  const esquerda = Buffer.from(a);
  const direita = Buffer.from(b);
  if (esquerda.length !== direita.length) return false;
  return timingSafeEqual(esquerda, direita);
}

export function senhaConfere(senha: string) {
  return iguais(senha, SENHA_LISTA);
}

export function listaAutorizada() {
  const valor = cookies().get(COOKIE)?.value ?? "";
  return iguais(valor, tokenEsperado());
}

export function concederAcessoLista() {
  cookies().set(COOKIE, tokenEsperado(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
    secure: process.env.NODE_ENV === "production",
  });
}
