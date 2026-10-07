"use server";

import { mensagemErroBanco, getPool, withTransaction } from "@/lib/db";
import { MAX_NOME, TAMANHOS_CAMISA, TAMANHOS_SHORTS } from "@/lib/pedidos/constants";
import type {
  ActionFailure,
  ActionResult,
  Comprador,
  ItemAtualizacaoInput,
  ItemPedido,
  NovoPedidoInput,
} from "@/lib/pedidos/types";
import {
  limparTexto,
  temErros,
  validarAtualizacao,
  validarNovoPedido,
} from "@/lib/pedidos/validate";

function escaparLike(valor: string) {
  return valor.replace(/[\\%_]/g, (char) => `\\${char}`);
}

function falha(error: unknown): ActionFailure {
  return { ok: false, message: mensagemErroBanco(error) };
}

export async function listarResponsaveis(
  termo: string,
): Promise<ActionResult<{ compradores: Comprador[] }>> {
  const busca = limparTexto(termo ?? "").slice(0, 80);

  try {
    const { rows } = await getPool().query<{
      id: number;
      nome_responsavel: string;
    }>(
      `SELECT id, nome_responsavel
       FROM compradores
       WHERE ($1 = '' OR nome_responsavel ILIKE $2 ESCAPE '\\')
       ORDER BY nome_responsavel ASC
       LIMIT 30`,
      [busca, `%${escaparLike(busca)}%`],
    );

    return {
      ok: true,
      compradores: rows.map((row) => ({
        id: Number(row.id),
        nome_responsavel: row.nome_responsavel,
      })),
    };
  } catch (error) {
    return falha(error);
  }
}

export async function buscarItensComprador(
  compradorId: number,
): Promise<ActionResult<{ itens: ItemPedido[] }>> {
  const id = Number(compradorId);
  if (!Number.isInteger(id) || id <= 0) {
    return { ok: false, message: "Responsável inválido." };
  }

  try {
    const { rows } = await getPool().query<{
      id: number;
      comprador_id: number;
      nome_pessoa: string;
      tamanho_camisa: string;
      tamanho_shorts: string;
      quer_personalizar: boolean;
      nome_atras: string | null;
    }>(
      `SELECT id, comprador_id, nome_pessoa, tamanho_camisa, tamanho_shorts,
              quer_personalizar, nome_atras
       FROM itens_pedido
       WHERE comprador_id = $1
       ORDER BY id ASC`,
      [id],
    );

    return {
      ok: true,
      itens: rows.map((row) => ({
        id: Number(row.id),
        comprador_id: Number(row.comprador_id),
        nome_pessoa: row.nome_pessoa,
        tamanho_camisa: row.tamanho_camisa,
        tamanho_shorts: row.tamanho_shorts,
        quer_personalizar: Boolean(row.quer_personalizar),
        nome_atras: row.nome_atras ?? "",
      })),
    };
  } catch (error) {
    return falha(error);
  }
}

export async function atualizarItens(
  compradorId: number,
  nomeResponsavel: string,
  itens: ItemAtualizacaoInput[],
): Promise<ActionResult> {
  const idComprador = Number(compradorId);
  if (!Number.isInteger(idComprador) || idComprador <= 0) {
    return { ok: false, message: "Responsável inválido." };
  }

  const nome = limparTexto(nomeResponsavel ?? "");
  const errorsNome: Record<string, string> = {};
  if (nome.length < 3) {
    errorsNome.nome_responsavel = "Informe o nome completo do responsável.";
  } else if (nome.length > MAX_NOME) {
    errorsNome.nome_responsavel = "O nome do responsável é longo demais.";
  }

  const { data, errors } = validarAtualizacao(itens);
  const fieldErrors = { ...errorsNome, ...errors };
  if (temErros(fieldErrors)) {
    return {
      ok: false,
      message: "Revise os campos destacados antes de salvar.",
      fieldErrors,
    };
  }

  try {
    await withTransaction(async (client) => {
      const repetido = await client.query(
        `SELECT id
         FROM compradores
         WHERE lower(btrim(nome_responsavel)) = lower($1)
           AND id <> $2
         LIMIT 1`,
        [nome, idComprador],
      );
      if (repetido.rowCount) {
        throw new Error("RESPONSAVEL_EXISTE");
      }

      await client.query(
        `UPDATE compradores
         SET nome_responsavel = $1
         WHERE id = $2`,
        [nome, idComprador],
      );

      const atuais = await client.query<{
        id: number;
        tamanho_camisa: string;
        tamanho_shorts: string;
      }>(
        `SELECT id, tamanho_camisa, tamanho_shorts
         FROM itens_pedido
         WHERE comprador_id = $1`,
        [idComprador],
      );

      const porId = new Map(
        atuais.rows.map((row) => [Number(row.id), row] as const),
      );

      for (const item of data) {
        const atual = porId.get(item.id);
        if (!atual) {
          throw new Error("ITEM_FORA_DO_PEDIDO");
        }

        const camisaOk =
          TAMANHOS_CAMISA.includes(
            item.tamanho_camisa as (typeof TAMANHOS_CAMISA)[number],
          ) || item.tamanho_camisa === atual.tamanho_camisa;
        const shortsOk =
          TAMANHOS_SHORTS.includes(
            item.tamanho_shorts as (typeof TAMANHOS_SHORTS)[number],
          ) || item.tamanho_shorts === atual.tamanho_shorts;

        if (!camisaOk || !shortsOk) {
          throw new Error("TAMANHO_INVALIDO");
        }

        const atualizado = await client.query(
          `UPDATE itens_pedido
           SET nome_pessoa = $1,
               tamanho_camisa = $2,
               tamanho_shorts = $3,
               quer_personalizar = $4,
               nome_atras = $5
           WHERE id = $6 AND comprador_id = $7`,
          [
            item.nome_pessoa,
            item.tamanho_camisa,
            item.tamanho_shorts,
            item.quer_personalizar,
            item.quer_personalizar ? item.nome_atras : null,
            item.id,
            idComprador,
          ],
        );

        if (atualizado.rowCount !== 1) {
          throw new Error("ITEM_FORA_DO_PEDIDO");
        }
      }
    });

    return { ok: true };
  } catch (error) {
    if (error instanceof Error && error.message === "ITEM_FORA_DO_PEDIDO") {
      return {
        ok: false,
        message: "Um dos itens não pertence a este responsável.",
      };
    }
    if (error instanceof Error && error.message === "TAMANHO_INVALIDO") {
      return { ok: false, message: "Selecione um tamanho válido." };
    }
    if (error instanceof Error && error.message === "RESPONSAVEL_EXISTE") {
      return {
        ok: false,
        message: "Já existe outro responsável com esse nome.",
        fieldErrors: {
          nome_responsavel: "Este nome já está cadastrado.",
        },
      };
    }
    return falha(error);
  }
}

export async function excluirItem(
  compradorId: number,
  itemId: number,
): Promise<ActionResult> {
  const idComprador = Number(compradorId);
  const idItem = Number(itemId);
  if (!Number.isInteger(idComprador) || idComprador <= 0 || !Number.isInteger(idItem) || idItem <= 0) {
    return { ok: false, message: "Não foi possível apagar esta pessoa." };
  }

  try {
    const apagado = await getPool().query(
      `DELETE FROM itens_pedido
       WHERE id = $1 AND comprador_id = $2`,
      [idItem, idComprador],
    );
    if (apagado.rowCount !== 1) {
      return { ok: false, message: "Esta pessoa não está neste pedido." };
    }
    return { ok: true };
  } catch (error) {
    return falha(error);
  }
}

export async function excluirPedido(compradorId: number): Promise<ActionResult> {
  const idComprador = Number(compradorId);
  if (!Number.isInteger(idComprador) || idComprador <= 0) {
    return { ok: false, message: "Não foi possível apagar este pedido." };
  }

  try {
    const apagado = await getPool().query(`DELETE FROM compradores WHERE id = $1`, [idComprador]);
    if (apagado.rowCount !== 1) {
      return { ok: false, message: "Este pedido não foi encontrado." };
    }
    return { ok: true };
  } catch (error) {
    return falha(error);
  }
}

export async function criarPedido(
  input: NovoPedidoInput,
): Promise<ActionResult<{ compradorId: number }>> {
  const { data, errors } = validarNovoPedido(input);
  if (temErros(errors)) {
    return {
      ok: false,
      message: "Revise os campos destacados antes de salvar.",
      fieldErrors: errors,
    };
  }

  try {
    const compradorId = await withTransaction(async (client) => {
      const existente = await client.query<{ id: number }>(
        `SELECT id
         FROM compradores
         WHERE lower(btrim(nome_responsavel)) = lower($1)
         LIMIT 1`,
        [data.nome_responsavel],
      );

      if (existente.rowCount) {
        throw new Error("RESPONSAVEL_EXISTE");
      }

      const inserido = await client.query<{ id: number }>(
        `INSERT INTO compradores (nome_responsavel)
         VALUES ($1)
         RETURNING id`,
        [data.nome_responsavel],
      );

      const id = Number(inserido.rows[0]?.id);
      if (!id) throw new Error("INSERT_SEM_ID");

      const valores: unknown[] = [];
      const grupos = data.itens.map((item, index) => {
        const base = index * 6;
        valores.push(
          id,
          item.nome_pessoa,
          item.tamanho_camisa,
          item.tamanho_shorts,
          item.quer_personalizar,
          item.quer_personalizar ? item.nome_atras : null,
        );
        return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6})`;
      });

      await client.query(
        `INSERT INTO itens_pedido (
           comprador_id, nome_pessoa, tamanho_camisa, tamanho_shorts,
           quer_personalizar, nome_atras
         ) VALUES ${grupos.join(", ")}`,
        valores,
      );

      return id;
    });

    return { ok: true, compradorId };
  } catch (error) {
    if (error instanceof Error && error.message === "RESPONSAVEL_EXISTE") {
      return {
        ok: false,
        message:
          "Este responsável já está na lista. Use a busca pelo nome para editar o pedido.",
        fieldErrors: {
          nome_responsavel: "Este nome já está cadastrado.",
        },
      };
    }
    return falha(error);
  }
}
