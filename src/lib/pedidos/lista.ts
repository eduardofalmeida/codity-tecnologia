import { getPool } from "@/lib/db";
import { SEM_SHORTS, TAMANHOS_CAMISA, TAMANHOS_SHORTS } from "@/lib/pedidos/constants";

export type LinhaCadastro = {
  compradorId: number;
  nomeResponsavel: string;
  itemId: number | null;
  nomePessoa: string;
  tamanhoCamisa: string;
  tamanhoShorts: string;
  querPersonalizar: boolean;
  nomeAtras: string;
};

export type FamiliaCadastro = {
  compradorId: number;
  nomeResponsavel: string;
  itens: LinhaCadastro[];
};

function pediu(tamanho: string) {
  const valor = tamanho.trim();
  return valor !== "" && valor !== "-";
}

export function descreveTamanho(tamanho: string, peca: "camisa" | "shorts") {
  if (!pediu(tamanho)) {
    return peca === "camisa" ? "Sem camisa" : "Sem shorts";
  }
  return tamanho.trim();
}

export async function listarCadastros(): Promise<LinhaCadastro[]> {
  const { rows } = await getPool().query<{
    comprador_id: number;
    nome_responsavel: string;
    item_id: number | null;
    nome_pessoa: string | null;
    tamanho_camisa: string | null;
    tamanho_shorts: string | null;
    quer_personalizar: boolean | null;
    nome_atras: string | null;
  }>(
    `SELECT c.id AS comprador_id,
            c.nome_responsavel,
            i.id AS item_id,
            i.nome_pessoa,
            i.tamanho_camisa,
            i.tamanho_shorts,
            i.quer_personalizar,
            i.nome_atras
     FROM compradores c
     LEFT JOIN itens_pedido i ON i.comprador_id = c.id
     ORDER BY c.nome_responsavel ASC, c.id ASC, i.id ASC`,
  );

  return rows.map((row) => ({
    compradorId: Number(row.comprador_id),
    nomeResponsavel: row.nome_responsavel,
    itemId: row.item_id == null ? null : Number(row.item_id),
    nomePessoa: row.nome_pessoa ?? "",
    tamanhoCamisa: row.tamanho_camisa ?? "",
    tamanhoShorts: row.tamanho_shorts ?? "",
    querPersonalizar: Boolean(row.quer_personalizar),
    nomeAtras: row.nome_atras ?? "",
  }));
}

export function agruparFamilias(linhas: LinhaCadastro[]): FamiliaCadastro[] {
  const familias = new Map<number, FamiliaCadastro>();
  for (const linha of linhas) {
    const atual = familias.get(linha.compradorId) ?? {
      compradorId: linha.compradorId,
      nomeResponsavel: linha.nomeResponsavel,
      itens: [],
    };
    if (linha.itemId != null) atual.itens.push(linha);
    familias.set(linha.compradorId, atual);
  }
  return [...familias.values()];
}

export function tamanhoInformado(tamanho: string) {
  return pediu(tamanho) ? tamanho.trim() : "";
}

export type ContagemTamanho = {
  tamanho: string;
  quantidade: number;
};

export type ResumoQuantidades = {
  camisetas: number;
  semCamisa: number;
  tamanhosCamisa: ContagemTamanho[];
  shorts: number;
  semShorts: number;
  tamanhosShorts: ContagemTamanho[];
};

function semPeca(tamanho: string, peca: "camisa" | "shorts") {
  const valor = tamanho.trim();
  if (!pediu(valor)) return true;
  return peca === "shorts" && valor === SEM_SHORTS;
}

function ordenarContagem(contagens: Map<string, number>, ordem: readonly string[]) {
  const indice = new Map(ordem.map((tamanho, posicao) => [tamanho, posicao]));
  return [...contagens.entries()]
    .filter(([, quantidade]) => quantidade > 0)
    .sort((esquerda, direita) => {
      const a = indice.get(esquerda[0]) ?? 1000;
      const b = indice.get(direita[0]) ?? 1000;
      if (a !== b) return a - b;
      return esquerda[0].localeCompare(direita[0], "pt-BR");
    })
    .map(([tamanho, quantidade]) => ({ tamanho, quantidade }));
}

export function resumirQuantidades(linhas: LinhaCadastro[]): ResumoQuantidades {
  const camisa = new Map<string, number>();
  const shorts = new Map<string, number>();
  let semCamisa = 0;
  let semShorts = 0;

  for (const linha of linhas) {
    if (linha.itemId == null) continue;

    if (semPeca(linha.tamanhoCamisa, "camisa")) {
      semCamisa += 1;
    } else {
      const tamanho = linha.tamanhoCamisa.trim();
      camisa.set(tamanho, (camisa.get(tamanho) ?? 0) + 1);
    }

    if (semPeca(linha.tamanhoShorts, "shorts")) {
      semShorts += 1;
    } else {
      const tamanho = linha.tamanhoShorts.trim();
      shorts.set(tamanho, (shorts.get(tamanho) ?? 0) + 1);
    }
  }

  const tamanhosCamisa = ordenarContagem(camisa, TAMANHOS_CAMISA);
  const tamanhosShorts = ordenarContagem(shorts, TAMANHOS_SHORTS);

  return {
    camisetas: tamanhosCamisa.reduce((total, item) => total + item.quantidade, 0),
    semCamisa,
    tamanhosCamisa,
    shorts: tamanhosShorts.reduce((total, item) => total + item.quantidade, 0),
    semShorts,
    tamanhosShorts,
  };
}
