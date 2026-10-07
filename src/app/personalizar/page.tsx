import type { Metadata } from "next";

import { PersonalizarApp } from "@/components/pedidos/personalizar-app";

export const metadata: Metadata = {
  title: "Panela Futebol Clube",
  description:
    "Busque um responsável na lista ou cadastre um novo pedido com várias pessoas.",
};

export default function PersonalizarPage() {
  return <PersonalizarApp />;
}
