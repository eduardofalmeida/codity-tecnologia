"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

import { autorizarVisualizacao } from "@/app/personalizar/lista/actions";

export function SenhaLista({
  variante,
}: {
  variante: "botao" | "pagina";
}) {
  const router = useRouter();
  const [aberto, setAberto] = useState(variante === "pagina");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar(event: FormEvent) {
    event.preventDefault();
    if (enviando) return;
    setEnviando(true);
    setErro("");
    const resultado = await autorizarVisualizacao(senha);
    setEnviando(false);
    if (!resultado.ok) {
      setErro(resultado.message);
      return;
    }
    setSenha("");
    if (variante === "pagina") {
      router.refresh();
      return;
    }
    router.push("/personalizar/lista");
  }

  return (
    <>
      {variante === "botao" ? (
        <button
          type="button"
          onClick={() => {
            setAberto(true);
            setErro("");
          }}
          className="mt-6 flex min-h-14 w-full items-center gap-3 rounded-2xl px-2 py-3 text-left text-slate-500"
        >
          <Lock className="h-5 w-5 shrink-0" />
          <span>
            <span className="block text-base font-medium text-slate-600">
              Ver a lista completa
            </span>
            <span className="mt-0.5 block text-sm leading-relaxed">
              Só para quem organiza os pedidos. Vai pedir uma senha.
            </span>
          </span>
        </button>
      ) : null}

      {aberto ? (
        <div className="fixed inset-0 z-50 grid place-items-end bg-slate-900/40 p-4 sm:place-items-center">
          <form
            onSubmit={entrar}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-800">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              Senha para ver a lista
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Digite a senha para abrir todos os cadastros.
            </p>
            <label className="mt-5 block text-sm font-medium text-slate-700" htmlFor="senha-lista">
              Senha
            </label>
            <input
              id="senha-lista"
              type="password"
              autoFocus
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-base text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />
            {erro ? <p className="mt-2 text-sm text-red-600">{erro}</p> : null}
            <div className="mt-6 grid gap-2">
              {variante === "botao" ? (
                <button
                  type="button"
                  onClick={() => setAberto(false)}
                  className="min-h-14 rounded-xl border border-slate-200 text-base font-semibold text-slate-700"
                >
                  Cancelar
                </button>
              ) : (
                <a
                  href="/personalizar"
                  className="grid min-h-14 place-items-center rounded-xl border border-slate-200 text-base font-semibold text-slate-700"
                >
                  Voltar
                </a>
              )}
              <button
                type="submit"
                disabled={enviando || senha.length === 0}
                className="min-h-14 rounded-xl bg-slate-900 text-base font-semibold text-white disabled:opacity-60"
              >
                {enviando ? "Verificando..." : "Entrar"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
