"use client";

import { useCallback, useState } from "react";
import Link from "next/link";

import { ModalSucesso, ToastErro, type AvisoSucesso } from "@/components/pedidos/feedback";
import { NovoPedido } from "@/components/pedidos/novo-pedido";
import { PedidoExistente } from "@/components/pedidos/pedido-existente";
import { SenhaLista } from "@/components/pedidos/senha-lista";

type Modo = "inicio" | "existente" | "novo";

export function PersonalizarApp() {
  const [modo, setModo] = useState<Modo>("inicio");
  const [nomeInicial, setNomeInicial] = useState("");
  const [sucesso, setSucesso] = useState<AvisoSucesso | null>(null);
  const [erro, setErro] = useState("");

  const fecharSucesso = useCallback(() => setSucesso(null), []);
  const fecharErro = useCallback(() => setErro(""), []);

  function irParaNovo(nome = "") {
    setNomeInicial(nome.trim());
    setModo("novo");
    setErro("");
  }

  return (
    <div
      className="min-h-dvh bg-slate-50 text-slate-900"
      style={{ colorScheme: "light" }}
    >
      <div className="mx-auto w-full max-w-lg px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-5 sm:py-12">
        <header className="mb-6">
          <Link href="/" className="inline-flex min-h-11 items-center text-base font-medium text-slate-500">
            Início
          </Link>
          <div className="mt-3 flex flex-col items-center text-center">
            <img
              src="/panela-futebol-clube.jpg"
              alt="Escudo do Panela Futebol Clube"
              width={144}
              height={144}
              className={
                modo === "inicio"
                  ? "h-28 w-28 rounded-full object-cover shadow-md ring-4 ring-white sm:h-36 sm:w-36"
                  : "h-16 w-16 rounded-full object-cover shadow-md ring-4 ring-white"
              }
            />
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Panela Futebol Clube
            </h1>
            {modo === "inicio" ? (
              <p className="mt-2 max-w-sm text-base leading-relaxed text-slate-600">
                Toque em uma opção para escolher o tamanho da camisa e do shorts.
              </p>
            ) : null}
          </div>
        </header>

        {modo === "inicio" ? (
          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => {
                setModo("existente");
                setErro("");
              }}
              className="flex min-h-[5.5rem] items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm active:bg-slate-50"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-900 text-lg font-semibold text-white">
                1
              </span>
              <span>
                <span className="block text-lg font-semibold leading-snug text-slate-950">
                  Meu nome já está na lista
                </span>
                <span className="mt-1 block text-base leading-relaxed text-slate-600">
                  Toque aqui, escreva seu nome e escolha o tamanho.
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => irParaNovo()}
              className="flex min-h-[5.5rem] items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm active:bg-slate-50"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-100 text-lg font-semibold text-slate-900">
                2
              </span>
              <span>
                <span className="block text-lg font-semibold leading-snug text-slate-950">
                  Ainda não estou na lista
                </span>
                <span className="mt-1 block text-base leading-relaxed text-slate-600">
                  Toque aqui para cadastrar você e, se quiser, sua família.
                </span>
              </span>
            </button>
          </div>
        ) : null}

        {modo === "inicio" ? <SenhaLista variante="botao" /> : null}

        {modo === "existente" ? (
          <PedidoExistente
            onBack={() => setModo("inicio")}
            onNovoPedido={irParaNovo}
            onSuccess={(aviso) => {
              setErro("");
              setSucesso(aviso);
            }}
            onError={setErro}
          />
        ) : null}

        {modo === "novo" ? (
          <NovoPedido
            key={nomeInicial}
            nomeInicial={nomeInicial}
            onBack={() => setModo("inicio")}
            onSuccess={(aviso) => {
              setErro("");
              setSucesso(aviso);
            }}
            onError={setErro}
          />
        ) : null}
      </div>

      <ModalSucesso aviso={sucesso} onClose={fecharSucesso} />
      <ToastErro mensagem={erro} onClose={fecharErro} />
    </div>
  );
}
