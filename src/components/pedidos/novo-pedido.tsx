"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";

import { criarPedido } from "@/lib/pedidos/actions";
import {
  MAX_ITENS,
  MAX_NOME,
  MAX_NOME_ATRAS,
  TAMANHOS_CAMISA,
  TAMANHOS_SHORTS,
} from "@/lib/pedidos/constants";
import type { FieldErrors } from "@/lib/pedidos/types";
import { temErros, validarNovoPedido } from "@/lib/pedidos/validate";
import { cn } from "@/lib/utils";
import {
  CampoSelect,
  CampoTexto,
  Cartao,
  ErroCampo,
  Interruptor,
  classeCampo,
} from "@/components/pedidos/campos";
import type { AvisoSucesso } from "@/components/pedidos/feedback";

type Rascunho = {
  key: string;
  nome_pessoa: string;
  tamanho_camisa: string;
  tamanho_shorts: string;
  quer_personalizar: boolean;
  nome_atras: string;
};

function novoRascunho(): Rascunho {
  return {
    key:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
    nome_pessoa: "",
    tamanho_camisa: "",
    tamanho_shorts: "",
    quer_personalizar: false,
    nome_atras: "",
  };
}

export function NovoPedido({
  nomeInicial = "",
  onBack,
  onSuccess,
  onError,
}: {
  nomeInicial?: string;
  onBack: () => void;
  onSuccess: (aviso: AvisoSucesso) => void;
  onError: (mensagem: string) => void;
}) {
  const focoPendente = useRef<string | null>(null);
  const [nomeResponsavel, setNomeResponsavel] = useState(nomeInicial);
  const [itens, setItens] = useState<Rascunho[]>([novoRascunho()]);
  const [erros, setErros] = useState<FieldErrors>({});
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!focoPendente.current) return;
    document.getElementById(`pessoa-${focoPendente.current}`)?.focus();
    focoPendente.current = null;
  }, [itens]);

  function atualizar(key: string, patch: Partial<Rascunho>) {
    setItens((atual) =>
      atual.map((item) => (item.key === key ? { ...item, ...patch } : item)),
    );
  }

  function adicionar() {
    if (itens.length >= MAX_ITENS) return;
    const item = novoRascunho();
    focoPendente.current = item.key;
    setItens((atual) => [...atual, item]);
  }

  function remover(key: string) {
    setItens((atual) => (atual.length === 1 ? atual : atual.filter((item) => item.key !== key)));
  }

  function limpar() {
    setNomeResponsavel("");
    setItens([novoRascunho()]);
    setErros({});
  }

  async function salvar(event: FormEvent) {
    event.preventDefault();
    if (salvando) return;

    const { data, errors } = validarNovoPedido({
      nome_responsavel: nomeResponsavel,
      itens: itens.map((item) => ({
        nome_pessoa: item.nome_pessoa,
        tamanho_camisa: item.tamanho_camisa,
        tamanho_shorts: item.tamanho_shorts,
        quer_personalizar: item.quer_personalizar,
        nome_atras: item.nome_atras,
      })),
    });

    if (temErros(errors)) {
      setErros(errors);
      onError("Revise os campos destacados antes de salvar.");
      return;
    }

    setErros({});
    setSalvando(true);
    const resultado = await criarPedido(data);
    setSalvando(false);

    if (!resultado.ok) {
      setErros(resultado.fieldErrors ?? {});
      onError(resultado.message);
      return;
    }

    const pessoas = data.itens.length;
    limpar();
    onSuccess({
      titulo: "Pedido salvo",
      descricao: `${data.nome_responsavel} entrou na lista com ${pessoas} ${pessoas === 1 ? "pessoa" : "pessoas"}.`,
    });
  }

  return (
    <form onSubmit={salvar} className="grid gap-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-12 w-fit items-center gap-1 rounded-xl px-1 text-base font-semibold text-slate-700"
      >
        <ChevronLeft className="h-5 w-5" />
        Voltar
      </button>

      <Cartao>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Passo 1</p>
        <h2 className="mt-1 text-xl font-semibold text-slate-900">Quem está pedindo</h2>
        <p className="mt-2 text-base leading-relaxed text-slate-600">
          Escreva o seu nome, ou o nome de quem vai cuidar desse pedido.
        </p>
        <div className="mt-4">
          <CampoTexto
            id="nome-responsavel"
            label="Seu nome"
            value={nomeResponsavel}
            maxLength={MAX_NOME}
            placeholder="Ex.: Ana Souza"
            erro={erros.nome_responsavel}
            onChange={setNomeResponsavel}
          />
        </div>
      </Cartao>

      {erros.itens ? <p className="text-sm text-red-600">{erros.itens}</p> : null}

      {itens.map((item, index) => (
        <Cartao key={item.key}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Passo 2 · Pessoa {index + 1}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">Quem vai usar a camisa</h3>
            </div>
            {itens.length > 1 ? (
              <button
                type="button"
                onClick={() => remover(item.key)}
                className="inline-flex min-h-12 items-center gap-1 rounded-xl px-3 text-base font-medium text-slate-500 hover:bg-slate-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Remover
              </button>
            ) : null}
          </div>

          <div className="mt-4 grid gap-4">
            <CampoTexto
              id={`pessoa-${item.key}`}
              label="Nome da pessoa"
              value={item.nome_pessoa}
              maxLength={MAX_NOME}
              placeholder="Pode ser você ou alguém da família"
              autoComplete="off"
              erro={erros[`itens.${index}.nome_pessoa`]}
              onChange={(nome_pessoa) => atualizar(item.key, { nome_pessoa })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <CampoSelect
                id={`camisa-${item.key}`}
                label="Tamanho da camisa"
                value={item.tamanho_camisa}
                opcoes={TAMANHOS_CAMISA}
                placeholder="Selecione"
                erro={erros[`itens.${index}.tamanho_camisa`]}
                onChange={(tamanho_camisa) => atualizar(item.key, { tamanho_camisa })}
              />
              <CampoSelect
                id={`shorts-${item.key}`}
                label="Tamanho do shorts"
                value={item.tamanho_shorts}
                opcoes={TAMANHOS_SHORTS}
                placeholder="Selecione"
                erro={erros[`itens.${index}.tamanho_shorts`]}
                onChange={(tamanho_shorts) => atualizar(item.key, { tamanho_shorts })}
              />
            </div>
            <Interruptor
              id={`personalizar-${item.key}`}
              label="Quero o nome atrás da camisa"
              marcado={item.quer_personalizar}
              onChange={(quer_personalizar) =>
                atualizar(item.key, {
                  quer_personalizar,
                  nome_atras: quer_personalizar ? item.nome_atras : "",
                })
              }
            />
            {item.quer_personalizar ? (
              <div>
                <label
                  className="text-base font-medium text-slate-800"
                  htmlFor={`atras-${item.key}`}
                >
                  Nome que vai atrás da camisa
                </label>
                <input
                  id={`atras-${item.key}`}
                  value={item.nome_atras}
                  maxLength={MAX_NOME_ATRAS}
                  placeholder="Ex.: SOUZA"
                  aria-invalid={Boolean(erros[`itens.${index}.nome_atras`])}
                  onChange={(event) =>
                    atualizar(item.key, {
                      nome_atras: event.target.value.toLocaleUpperCase("pt-BR"),
                    })
                  }
                  className={cn(
                    classeCampo(Boolean(erros[`itens.${index}.nome_atras`])),
                    "mt-1.5 uppercase",
                  )}
                />
                <div className="mt-1.5 flex items-start justify-between gap-3">
                  <ErroCampo
                    id={`atras-${item.key}-erro`}
                    mensagem={erros[`itens.${index}.nome_atras`]}
                  />
                  <p className="ml-auto text-xs text-slate-400">
                    {item.nome_atras.trim().length}/{MAX_NOME_ATRAS}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </Cartao>
      ))}

      <button
        type="button"
        onClick={adicionar}
        disabled={itens.length >= MAX_ITENS}
        className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white text-base font-semibold text-slate-800 disabled:opacity-50"
      >
        <Plus className="h-5 w-5" />
        Adicionar outra pessoa
      </button>

      <div className="pb-[max(0.25rem,env(safe-area-inset-bottom))]">
        <button
          type="submit"
          disabled={salvando}
          className="min-h-14 w-full rounded-xl bg-slate-900 text-base font-semibold text-white shadow-sm disabled:opacity-60"
        >
          {salvando ? "Salvando..." : "Salvar meu pedido"}
        </button>
      </div>
    </form>
  );
}
