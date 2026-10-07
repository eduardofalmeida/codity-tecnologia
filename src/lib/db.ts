import { Pool, type PoolClient } from "pg";

const globalForPg = globalThis as unknown as { pgPool?: Pool };

function sslConfig(connectionString: string) {
  const semSsl = /localhost|127\.0\.0\.1/.test(connectionString);
  if (semSsl) return undefined;
  return { rejectUnauthorized: false };
}

export function getPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL_AUSENTE");
  }

  if (!globalForPg.pgPool) {
    globalForPg.pgPool = new Pool({
      connectionString,
      max: 10,
      ssl: sslConfig(connectionString),
    });
  }

  return globalForPg.pgPool;
}

export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // O erro original é o que importa para a ação.
    }
    throw error;
  } finally {
    client.release();
  }
}

export function mensagemErroBanco(error: unknown) {
  if (error instanceof Error && error.message === "DATABASE_URL_AUSENTE") {
    return "Banco de dados não configurado. Defina a variável DATABASE_URL.";
  }

  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code?: string }).code ?? "")
      : "";

  if (code === "42P01") {
    return "As tabelas ainda não existem. Reinicie a aplicação para aplicar as migrations.";
  }

  if (code === "23514") {
    return "O nome atrás da camisa não passou na validação do banco.";
  }

  if (
    code === "ECONNREFUSED" ||
    code === "ENOTFOUND" ||
    code === "28P01" ||
    code === "3D000" ||
    code === "ETIMEDOUT"
  ) {
    return "Não foi possível conectar ao PostgreSQL. Verifique a DATABASE_URL.";
  }

  console.error(error);
  return "Não foi possível concluir a operação. Tente novamente.";
}
