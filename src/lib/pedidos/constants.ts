export const TAMANHOS_CAMISA = [
  "Infantil 2",
  "Infantil 4",
  "Infantil 6",
  "Infantil 8",
  "Infantil 10",
  "Infantil 12",
  "Infantil 14",
  "PP",
  "P",
  "M",
  "G",
  "GG",
  "G1",
  "G2",
  "G3",
] as const;

export const SEM_SHORTS = "Apenas Camisa / Sem Shorts";

export const TAMANHOS_SHORTS = [
  "Infantil 2",
  "Infantil 4",
  "Infantil 6",
  "Infantil 8",
  "Infantil 10",
  "Infantil 12",
  "Infantil 14",
  "PP",
  "P",
  "M",
  "G",
  "GG",
  "G1",
  "G2",
  SEM_SHORTS,
] as const;

export const MAX_ITENS = 20;
export const MAX_NOME_ATRAS = 30;
export const MAX_NOME = 160;

export type TamanhoCamisa = (typeof TAMANHOS_CAMISA)[number];
export type TamanhoShorts = (typeof TAMANHOS_SHORTS)[number];
