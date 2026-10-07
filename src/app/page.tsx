import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Panela Futebol Clube",
  description:
    "Esse site está sendo utilizado pelo Panela Futebol Clube pra realizar a cotação de camisetas",
};

export default function Home() {
  return (
    <main
      className="home-panela min-h-dvh bg-white px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-10 text-slate-950"
      style={{ colorScheme: "light" }}
    >
      <style>{`html:has(.home-panela) { overflow-x: clip; }`}</style>
      <div className="mx-auto w-full max-w-md">
        <img
          src="/panela-futebol-clube.jpg"
          alt="escudo do Panela Futebol Clube"
          width={176}
          height={176}
          className="mx-auto h-44 w-44 rounded-full object-cover shadow-md ring-4 ring-slate-100"
        />
        <h1 className="mt-6 text-center text-xl font-semibold leading-snug sm:text-2xl">
          Esse site está sendo utilizado pelo Panela Futebol Clube pra realizar
          a cotação de camisetas
        </h1>
        <Link
          href="/personalizar"
          className="mt-8 flex min-h-14 w-full items-center justify-center rounded-2xl bg-slate-900 px-6 text-lg font-semibold text-white shadow-sm active:bg-slate-800"
        >
          Clique aqui pra iniciar
        </Link>
      </div>
    </main>
  );
}
