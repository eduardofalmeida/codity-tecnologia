"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { ChevronLeft, Search } from "lucide-react";

import {
  buscarItensComprador,
  atualizarItens,
  excluirItem,
  excluirPedido,
  listarResponsaveis,
} from "@/lib/pedidos/actions";
import {
  TAMANHOS_CAMISA,
  TAMANHOS_SHORTS,
  SEM_SHORTS,
  MAX_NOME,
  MAX_NOME_ATRAS,
} from "@/lib/pedidos/constants";
import type { Comprador, FieldErrors, ItemPedido } from "@/lib/pedidos/types";
import { temErros, validarAtualizacao } from "@/lib/pedidos/validate";
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

export function PedidoExistente({
  onBack,
  onNovoPedido,
  onSuccess,
  onError,
}: {
  onBack: () => void;
  onNovoPedido: (nome: string) => void;
  onSuccess: (aviso: AvisoSucesso) => void;
  onError: (mensagem: string) => void;
}) {
  const listaId = useId();
  const caixaRef = useRef<HTMLDivElement>(null);
  const [termo, setTermo] = useState("");
  const [aberto, setAberto] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [opcoes, setOpcoes] = useState<Comprador[]>([]);
  const [indiceAtivo, setIndiceAtivo] = useState(0);
  const [erroLista, setErroLista] = useState("");
  const [jaBuscou, setJaBuscou] = useState(false);
  const [selecionado, setSelecionado] = useState<Comprador | null>(null);
  const [itens, setItens] = useState<ItemPedido[]>([]);
  const [carregandoItens, setCarregandoItens] = useState(false);
  const [erroItens, setErroItens] = useState("");
  const [erros, setErros] = useState<FieldErrors>({});
  const [salvando, setSalvando] = useState(false);
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [apagando, setApagando] = useState(false);
  const [confirmar, setConfirmar] = useState<
    { tipo: "pessoa"; id: number } | { tipo: "pedido" } | null
  >(null);

  useEffect(() => {
    let ativo = true;
    const timer = setTimeout(() => {
      void (async () => {
        setBuscando(true);
        const resultado = await listarResponsaveis(termo);
        if (!ativo) return;
        setBuscando(false);
        if (!resultado.ok) {
          setErroLista(resultado.message);
          setOpcoes([]);
          setJaBuscou(true);
          return;
        }
        setErroLista("");
        setOpcoes(resultado.compradores);
        setIndiceAtivo(0);
        setJaBuscou(true);
      })();
    }, 250);

    return () => {
      ativo = false;
      clearTimeout(timer);
    };
  }, [termo]);

  useEffect(() => {
    function fechar(event: MouseEvent) {
      if (!caixaRef.current?.contains(event.target as Node)) setAberto(false);
    }
    document.addEventListener("mousedown", fechar);
    return () => document.removeEventListener("mousedown", fechar);
  }, []);

  useEffect(() => {
    if (!selecionado) {
      setItens([]);
      return;
    }

    let ativo = true;
    setCarregandoItens(true);
    setErroItens("");
    void (async () => {
      const resultado = await buscarItensComprador(selecionado.id);
      if (!ativo) return;
      setCarregandoItens(false);
      if (!resultado.ok) {
        setErroItens(resultado.message);
        setItens([]);
        return;
      }
      setItens(
        resultado.itens.map((item) => ({
          ...item,
          tamanho_shorts: item.tamanho_shorts.trim() === "-" ? SEM_SHORTS : item.tamanho_shorts,
        })),
      );
      setErros({});
    })();

    return () => {
      ativo = false;
    };
  }, [selecionado]);

  function escolher(comprador: Comprador) {
    setSelecionado(comprador);
    setNomeResponsavel(comprador.nome_responsavel);
    setTermo(comprador.nome_responsavel);
    setAberto(false);
    setErros({});
    setConfirmar(null);
  }

  function aoDigitar(valor: string) {
    setTermo(valor);
    setAberto(true);
    if (selecionado && valor !== selecionado.nome_responsavel) {
      setSelecionado(null);
      setErros({});
    }
  }

  function atualizarItem(id: number, patch: Partial<ItemPedido>) {
    setItens((atual) =>
      atual.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  async function salvar(event: FormEvent) {
    event.preventDefault();
    if (!selecionado || salvando) return;

    const { data, errors } = validarAtualizacao(
      itens.map((item) => ({
        id: item.id,
        nome_pessoa: item.nome_pessoa,
        tamanho_camisa: item.tamanho_camisa,
        tamanho_shorts: item.tamanho_shorts,
        quer_personalizar: item.quer_personalizar,
        nome_atras: item.nome_atras,
      })),
    );

    if (temErros(errors)) {
      setErros(errors);
      onError("Revise os campos destacados antes de salvar.");
      return;
    }

    setErros({});
    setSalvando(true);
    const resultado = await atualizarItens(selecionado.id, nomeResponsavel, data);
    setSalvando(false);

    if (!resultado.ok) {
      setErros(resultado.fieldErrors ?? {});
      onError(resultado.message);
      return;
    }

    const nomeSalvo = nomeResponsavel.trim().replace(/\s+/g, " ");
    setSelecionado({ ...selecionado, nome_responsavel: nomeSalvo });
    setTermo(nomeSalvo);
    setNomeResponsavel(nomeSalvo);
    setErros({});
    onSuccess({
      titulo: "Alterações salvas",
      descricao: `O pedido de ${nomeSalvo} foi atualizado.`,
    });
  }

  async function apagarPessoa(itemId: number) {
    if (!selecionado || apagando) return;
    setApagando(true);
    const resultado = await excluirItem(selecionado.id, itemId);
    setApagando(false);
    setConfirmar(null);
    if (!resultado.ok) {
      onError(resultado.message);
      return;
    }
    setItens((atual) => atual.filter((item) => item.id !== itemId));
    onSuccess({
      titulo: "Pessoa apagada",
      descricao: "Essa pessoa saiu do pedido.",
    });
  }

  async function apagarPedido() {
    if (!selecionado || apagando) return;
    const nome = selecionado.nome_responsavel;
    setApagando(true);
    const resultado = await excluirPedido(selecionado.id);
    setApagando(false);
    setConfirmar(null);
    if (!resultado.ok) {
      onError(resultado.message);
      return;
    }
    setSelecionado(null);
    setItens([]);
    setTermo("");
    setNomeResponsavel("");
    onSuccess({
      titulo: "Pedido apagado",
      descricao: `O pedido de ${nome} foi excluído da lista.`,
    });
  }

  const nomesRepetidos = opcoes.reduce<Record<string, number>>((acc, item) => {
    const chave = item.nome_responsavel.toLocaleLowerCase("pt-BR");
    acc[chave] = (acc[chave] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid gap-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-12 w-fit items-center gap-1 rounded-xl px-1 text-base font-semibold text-slate-700"
      >
        <ChevronLeft className="h-5 w-5" />
        Voltar
      </button>

      <Cartao>
        <h2 className="text-xl font-semibold text-slate-900">Procure seu nome</h2>
        <p className="mt-2 text-base leading-relaxed text-slate-600">
          Escreva o nome do responsável. Quando ele aparecer, toque nele.
        </p>
        <div ref={caixaRef} className="relative mt-4">
          <label className="text-base font-medium text-slate-800" htmlFor="busca-responsavel">
            Nome do responsável
          </label>
          <div className="relative mt-1.5">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="busca-responsavel"
              role="combobox"
              aria-expanded={aberto && !erroLista}
              aria-controls={listaId}
              aria-autocomplete="list"
              value={termo}
              placeholder="Ex.: Maria"
              autoComplete="off"
              onFocus={() => setAberto(true)}
              onChange={(event) => aoDigitar(event.target.value)}
              onKeyDown={(event) => {
                if (!aberto || opcoes.length === 0) return;
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setIndiceAtivo((atual) => Math.min(atual + 1, opcoes.length - 1));
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setIndiceAtivo((atual) => Math.max(atual - 1, 0));
                } else if (event.key === "Enter" && opcoes[indiceAtivo]) {
                  event.preventDefault();
                  escolher(opcoes[indiceAtivo]);
                } else if (event.key === "Escape") {
                  setAberto(false);
                }
              }}
              className={cn(classeCampo(Boolean(erroLista)), "pl-10")}
            />
          </div>
          {erroLista ? (
            <p className="mt-2 text-sm text-red-600">{erroLista}</p>
          ) : null}
          {aberto && !erroLista ? (
            <ul
              id={listaId}
              role="listbox"
              data-lenis-prevent
              className="z-20 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
            >
              {(!jaBuscou || buscando) && opcoes.length === 0 ? (
                <li className="px-3.5 py-3 text-sm text-slate-500">Buscando...</li>
              ) : null}
              {jaBuscou && !buscando && !erroLista && opcoes.length === 0 ? (
                <li className="px-3.5 py-3 text-base text-slate-700">
                  <p>Não achamos esse nome na lista.</p>
                  <button
                    type="button"
                    onClick={() => onNovoPedido(termo)}
                    className="mt-3 flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-4 text-base font-semibold text-white"
                  >
                    Cadastrar esse nome
                  </button>
                </li>
              ) : null}
              {opcoes.map((opcao, index) => {
                const repetido =
                  (nomesRepetidos[opcao.nome_responsavel.toLocaleLowerCase("pt-BR")] ?? 0) > 1;
                return (
                  <li key={opcao.id} role="option" aria-selected={selecionado?.id === opcao.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setIndiceAtivo(index)}
                      onClick={() => escolher(opcao)}
                      className={cn(
                        "flex min-h-14 w-full items-center justify-between px-3.5 py-3 text-left text-base",
                        index === indiceAtivo ? "bg-slate-100" : "bg-white",
                      )}
                    >
                      <span className="font-medium text-slate-900">{opcao.nome_responsavel}</span>
                      {repetido ? (
                        <span className="text-xs text-slate-400">#{opcao.id}</span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </Cartao>

      {selecionado ? (
        <form onSubmit={salvar} className="grid gap-4">
          <Cartao>
            <h2 className="text-xl font-semibold text-slate-900">Alterar o pedido</h2>
            <p className="mt-2 text-base leading-relaxed text-slate-600">
              Você pode corrigir o nome, o tamanho e o nome atrás. Para tirar alguém da lista,
              toque em Apagar esta pessoa. No final, toque em Salvar.
            </p>
            <p className="mt-3 text-base text-slate-500">
              {carregandoItens
                ? "Carregando..."
                : `${itens.length} ${itens.length === 1 ? "pessoa" : "pessoas"}`}
            </p>
            <div className="mt-4">
              <CampoTexto
                id="nome-responsavel-edicao"
                label="Nome do responsável"
                value={nomeResponsavel}
                maxLength={MAX_NOME}
                placeholder="Nome de quem fez o pedido"
                erro={erros.nome_responsavel}
                onChange={setNomeResponsavel}
              />
            </div>
          </Cartao>

          {erroItens ? <p className="text-sm text-red-600">{erroItens}</p> : null}
          {erros.itens ? <p className="text-sm text-red-600">{erros.itens}</p> : null}

          {carregandoItens ? (
            <Cartao>
              <div className="grid gap-3">
                <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
                <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
              </div>
            </Cartao>
          ) : null}

          {!carregandoItens && itens.length === 0 && !erroItens ? (
            <Cartao>
              <p className="text-sm text-slate-600">
                Este responsável ainda não tem peças cadastradas.
              </p>
            </Cartao>
          ) : null}

          {itens.map((item, index) => (
            <Cartao key={item.id}>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Pessoa {index + 1}
              </p>
              {confirmar?.tipo === "pessoa" && confirmar.id === item.id ? (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
                  <p className="text-base text-slate-700">
                    Apagar {item.nome_pessoa || "esta pessoa"} deste pedido?
                  </p>
                  <div className="mt-3 grid gap-2">
                    <button
                      type="button"
                      disabled={apagando}
                      onClick={() => void apagarPessoa(item.id)}
                      className="min-h-12 rounded-xl bg-red-600 px-3 text-base font-semibold text-white disabled:opacity-60"
                    >
                      {apagando ? "Apagando..." : "Sim, apagar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmar(null)}
                      className="min-h-12 rounded-xl border border-slate-200 bg-white px-3 text-base font-semibold text-slate-700"
                    >
                      Não
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmar({ tipo: "pessoa", id: item.id })}
                  className="mt-2 min-h-12 rounded-xl px-1 text-base font-semibold text-red-600"
                >
                  Apagar esta pessoa
                </button>
              )}
              <div className="mt-3">
                <CampoTexto
                  id={`pessoa-${item.id}`}
                  label="Nome da pessoa"
                  value={item.nome_pessoa}
                  maxLength={MAX_NOME}
                  placeholder="Nome de quem vai usar a camisa"
                  autoComplete="off"
                  erro={erros[`itens.${index}.nome_pessoa`]}
                  onChange={(nome_pessoa) => atualizarItem(item.id, { nome_pessoa })}
                />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <CampoSelect
                  id={`camisa-${item.id}`}
                  label="Tamanho da camisa"
                  value={item.tamanho_camisa}
                  opcoes={TAMANHOS_CAMISA}
                  placeholder="Selecione"
                  erro={erros[`itens.${index}.tamanho_camisa`]}
                  onChange={(tamanho_camisa) => atualizarItem(item.id, { tamanho_camisa })}
                />
                <CampoSelect
                  id={`shorts-${item.id}`}
                  label="Tamanho do shorts"
                  value={item.tamanho_shorts}
                  opcoes={TAMANHOS_SHORTS}
                  placeholder="Selecione"
                  erro={erros[`itens.${index}.tamanho_shorts`]}
                  onChange={(tamanho_shorts) => atualizarItem(item.id, { tamanho_shorts })}
                />
              </div>
              <div className="mt-4">
                <Interruptor
                  id={`personalizar-${item.id}`}
                  label="Quero o nome atrás da camisa"
                  marcado={item.quer_personalizar}
                  onChange={(quer_personalizar) =>
                    atualizarItem(item.id, {
                      quer_personalizar,
                      nome_atras: quer_personalizar ? item.nome_atras : "",
                    })
                  }
                />
              </div>
              {item.quer_personalizar ? (
                <div className="mt-4">
                  <label className="text-base font-medium text-slate-800" htmlFor={`atras-${item.id}`}>
                    Nome que vai atrás da camisa
                  </label>
                  <input
                    id={`atras-${item.id}`}
                    value={item.nome_atras}
                    maxLength={MAX_NOME_ATRAS}
                    placeholder="Ex.: SILVA"
                    aria-invalid={Boolean(erros[`itens.${index}.nome_atras`])}
                    onChange={(event) =>
                      atualizarItem(item.id, {
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
                      id={`atras-${item.id}-erro`}
                      mensagem={erros[`itens.${index}.nome_atras`]}
                    />
                    <p className="ml-auto text-xs text-slate-400">
                      {item.nome_atras.trim().length}/{MAX_NOME_ATRAS}
                    </p>
                  </div>
                </div>
              ) : null}
            </Cartao>
          ))}

          <div className="grid gap-3 pb-[max(0.25rem,env(safe-area-inset-bottom))]">
            {itens.length > 0 ? (
              <button
                type="submit"
                disabled={salvando || carregandoItens || apagando}
                className="min-h-14 w-full rounded-xl bg-slate-900 text-base font-semibold text-white disabled:opacity-60"
              >
                {salvando ? "Salvando..." : "Salvar alterações"}
              </button>
            ) : null}
            {confirmar?.tipo === "pedido" ? (
              <div className="rounded-2xl border border-red-200 bg-white p-4">
                <p className="text-base leading-relaxed text-slate-700">
                  Apagar o pedido inteiro de {nomeResponsavel || selecionado.nome_responsavel}? Isso
                  tira todo mundo desse cadastro.
                </p>
                <div className="mt-3 grid gap-2">
                  <button
                    type="button"
                    disabled={apagando}
                    onClick={() => void apagarPedido()}
                    className="min-h-14 rounded-xl bg-red-600 text-base font-semibold text-white disabled:opacity-60"
                  >
                    {apagando ? "Apagando..." : "Sim, apagar o pedido"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmar(null)}
                    className="min-h-14 rounded-xl border border-slate-200 text-base font-semibold text-slate-700"
                  >
                    Não, manter
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmar({ tipo: "pedido" })}
                className="min-h-14 w-full rounded-xl border border-red-200 text-base font-semibold text-red-700"
              >
                Apagar este pedido
              </button>
            )}
          </div>
        </form>
      ) : null}
    </div>
  );
}
