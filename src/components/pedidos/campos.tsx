"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export function classeCampo(invalido?: boolean) {
  return cn(
    "min-h-14 w-full rounded-xl border bg-white px-3.5 py-3 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-2",
    invalido
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
      : "border-slate-200 focus:border-slate-900 focus:ring-slate-900/10",
  );
}

export function ErroCampo({ id, mensagem }: { id: string; mensagem?: string }) {
  if (!mensagem) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-red-600">
      {mensagem}
    </p>
  );
}

export function CampoTexto({
  id,
  label,
  value,
  onChange,
  erro,
  placeholder,
  autoComplete = "name",
  maxLength,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  erro?: string;
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
}) {
  const erroId = `${id}-erro`;
  return (
    <label className="block" htmlFor={id}>
      <span className="text-base font-medium text-slate-800">{label}</span>
      <input
        id={id}
        value={value}
        maxLength={maxLength}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? erroId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={cn(classeCampo(Boolean(erro)), "mt-1.5")}
      />
      <ErroCampo id={erroId} mensagem={erro} />
    </label>
  );
}

export function CampoSelect({
  id,
  label,
  value,
  onChange,
  opcoes,
  erro,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  opcoes: readonly string[];
  erro?: string;
  placeholder: string;
}) {
  const erroId = `${id}-erro`;
  const lista =
    value && !opcoes.includes(value) ? [value, ...opcoes] : [...opcoes];

  return (
    <div>
      <label className="block text-base font-medium text-slate-800" htmlFor={id}>
        {label}
      </label>
      <div className="relative mt-1.5">
        <select
          id={id}
          value={value}
          aria-invalid={Boolean(erro)}
          aria-describedby={erro ? erroId : undefined}
          onChange={(event) => onChange(event.target.value)}
          className={cn(classeCampo(Boolean(erro)), "appearance-none pr-10")}
        >
          <option value="">{placeholder}</option>
          {lista.map((opcao) => (
            <option key={opcao} value={opcao}>
              {opcao === "-" ? "Sem camisa" : opcao}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        />
      </div>
      <ErroCampo id={erroId} mensagem={erro} />
    </div>
  );
}

export function Interruptor({
  id,
  marcado,
  onChange,
  label,
}: {
  id: string;
  marcado: boolean;
  onChange: (marcado: boolean) => void;
  label: string;
}) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3">
      <label htmlFor={id} className="text-base font-medium leading-snug text-slate-800">
        {label}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={marcado}
        onClick={() => onChange(!marcado)}
        className={cn(
          "relative h-8 w-14 shrink-0 rounded-full transition-colors",
          marcado ? "bg-slate-900" : "bg-slate-300",
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all",
            marcado ? "left-7" : "left-1",
          )}
        />
      </button>
    </div>
  );
}

export function Cartao({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6",
        className,
      )}
    >
      {children}
    </section>
  );
}
