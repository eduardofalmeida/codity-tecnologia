"use client";

import { useEffect, useRef } from "react";
import { Check, X } from "lucide-react";

export type AvisoSucesso = {
  titulo: string;
  descricao: string;
};

export function ModalSucesso({
  aviso,
  onClose,
}: {
  aviso: AvisoSucesso | null;
  onClose: () => void;
}) {
  const botaoRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!aviso) return;
    botaoRef.current?.focus();
    function noTeclado(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", noTeclado);
    return () => document.removeEventListener("keydown", noTeclado);
  }, [aviso, onClose]);

  if (!aviso) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-900/40 p-4 sm:place-items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sucesso-titulo"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-700">
          <Check className="h-6 w-6" />
        </div>
        <h2 id="sucesso-titulo" className="mt-4 text-xl font-semibold text-slate-900">
          {aviso.titulo}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{aviso.descricao}</p>
        <button
          ref={botaoRef}
          type="button"
          onClick={onClose}
          className="mt-6 min-h-14 w-full rounded-xl bg-slate-900 text-base font-semibold text-white"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

export function ToastErro({
  mensagem,
  onClose,
}: {
  mensagem: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!mensagem) return;
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [mensagem, onClose]);

  if (!mensagem) return null;

  return (
    <div className="fixed inset-x-4 top-4 z-40 sm:inset-x-auto sm:right-4 sm:w-full sm:max-w-sm">
      <div
        role="status"
        className="flex items-start gap-3 rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm text-red-700 shadow-lg"
      >
        <p className="flex-1 leading-relaxed">{mensagem}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar aviso"
          className="rounded-lg p-1 text-red-500 hover:bg-red-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
