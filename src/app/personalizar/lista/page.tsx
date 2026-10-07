import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";

import { SenhaLista } from "@/components/pedidos/senha-lista";
import { listaAutorizada } from "@/lib/pedidos/acesso-lista";
import {
  agruparFamilias,
  descreveTamanho,
  listarCadastros,
  resumirQuantidades,
  type ContagemTamanho,
} from "@/lib/pedidos/lista";

export const metadata: Metadata = {
  title: "Todos os cadastros",
  description: "Lista detalhada dos pedidos de camisa e shorts.",
};

export const dynamic = "force-dynamic";

function QuadroTamanhos({
  titulo,
  total,
  rotuloTotal,
  itens,
  semPeca,
  rotuloSem,
}: {
  titulo: string;
  total: number;
  rotuloTotal: string;
  itens: ContagemTamanho[];
  semPeca: number;
  rotuloSem: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-950">{titulo}</h2>
        <p className="text-right">
          <span className="block text-2xl font-semibold leading-none text-slate-950">{total}</span>
          <span className="mt-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
            {rotuloTotal}
          </span>
        </p>
      </div>
      {itens.length === 0 ? (
        <p className="mt-4 text-base text-slate-500">Nenhum tamanho pedido.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {itens.map((item) => (
            <li
              key={item.tamanho}
              className="flex min-h-14 items-center justify-between gap-2 rounded-xl bg-slate-50 px-3"
            >
              <span className="text-base font-medium text-slate-700">{item.tamanho}</span>
              <span className="text-xl font-semibold text-slate-950">{item.quantidade}</span>
            </li>
          ))}
        </ul>
      )}
      {semPeca > 0 ? (
        <p className="mt-3 text-sm text-slate-500">
          {semPeca} {rotuloSem}
        </p>
      ) : null}
    </section>
  );
}

export default async function ListaCadastrosPage() {
  if (!listaAutorizada()) {
    return (
      <div className="min-h-dvh bg-slate-50 text-slate-900" style={{ colorScheme: "light" }}>
        <SenhaLista variante="pagina" />
      </div>
    );
  }

  const linhas = await listarCadastros();
  const familias = agruparFamilias(linhas);
  const pecas = linhas.filter((linha) => linha.itemId != null);
  const comNome = pecas.filter((linha) => linha.querPersonalizar).length;
  const quantidades = resumirQuantidades(linhas);

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900" style={{ colorScheme: "light" }}>
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
        <Link href="/personalizar" className="text-sm font-medium text-slate-500">
          Voltar à personalização
        </Link>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Camisas e shorts</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Todos os cadastros
            </h1>
          </div>
          <a
            href="/personalizar/lista/excel"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white"
          >
            <Download className="h-4 w-4" />
            Baixar Excel
          </a>
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Responsáveis
            </dt>
            <dd className="mt-1 text-2xl font-semibold">{familias.length}</dd>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Peças</dt>
            <dd className="mt-1 text-2xl font-semibold">{pecas.length}</dd>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Nome atrás
            </dt>
            <dd className="mt-1 text-2xl font-semibold">{comNome}</dd>
          </div>
        </dl>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <QuadroTamanhos
            titulo="Camisetas"
            total={quantidades.camisetas}
            rotuloTotal={quantidades.camisetas === 1 ? "camisa" : "camisas"}
            itens={quantidades.tamanhosCamisa}
            semPeca={quantidades.semCamisa}
            rotuloSem={quantidades.semCamisa === 1 ? "cadastro sem camisa" : "cadastros sem camisa"}
          />
          <QuadroTamanhos
            titulo="Shorts"
            total={quantidades.shorts}
            rotuloTotal={quantidades.shorts === 1 ? "shorts" : "shorts"}
            itens={quantidades.tamanhosShorts}
            semPeca={quantidades.semShorts}
            rotuloSem={quantidades.semShorts === 1 ? "cadastro sem shorts" : "cadastros sem shorts"}
          />
        </div>

        <div className="mt-6 grid gap-4">
          {familias.map((familia) => (
            <article
              key={familia.compradorId}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Responsável #{familia.compradorId}
                  </p>
                  <h2 className="text-lg font-semibold text-slate-950">
                    {familia.nomeResponsavel}
                  </h2>
                </div>
                <p className="text-sm text-slate-500">
                  {familia.itens.length} {familia.itens.length === 1 ? "peça" : "peças"}
                </p>
              </header>
              {familia.itens.length === 0 ? (
                <p className="px-4 py-4 text-sm text-slate-500 sm:px-5">
                  Nenhuma peça cadastrada.
                </p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {familia.itens.map((item) => (
                    <li key={item.itemId} className="grid gap-3 px-4 py-4 sm:grid-cols-4 sm:px-5">
                      <div className="sm:col-span-1">
                        <p className="text-xs text-slate-400">Pessoa</p>
                        <p className="font-medium text-slate-900">{item.nomePessoa}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Camisa</p>
                        <p className="text-slate-800">
                          {descreveTamanho(item.tamanhoCamisa, "camisa")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Shorts</p>
                        <p className="text-slate-800">
                          {descreveTamanho(item.tamanhoShorts, "shorts")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Nome atrás</p>
                        <p className="text-slate-800">
                          {item.querPersonalizar ? item.nomeAtras || "Sim" : "Não"}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
