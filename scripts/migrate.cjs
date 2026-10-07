const { readdir, readFile } = require("fs/promises");
const path = require("path");
const { Pool } = require("pg");

const LOCK_KEY = "804271";

function urlDaMigration() {
  return process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "";
}

function sslConfig(connectionString) {
  if (/localhost|127\.0\.0\.1/.test(connectionString)) return undefined;
  return { rejectUnauthorized: false };
}

async function migrate() {
  const connectionString = urlDaMigration();
  if (!connectionString) {
    console.warn("Migrations ignoradas: DATABASE_URL ausente.");
    return;
  }

  const pool = new Pool({
    connectionString,
    max: 1,
    ssl: sslConfig(connectionString),
  });
  const client = await pool.connect();

  try {
    await client.query("SELECT pg_advisory_lock($1::bigint)", [LOCK_KEY]);
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    const dir = path.join(process.cwd(), "migrations");
    const arquivos = (await readdir(dir))
      .filter((nome) => nome.endsWith(".sql"))
      .sort();
    const aplicadas = await client.query("SELECT name FROM schema_migrations");
    const feitas = new Set(aplicadas.rows.map((row) => row.name));

    for (const arquivo of arquivos) {
      if (feitas.has(arquivo)) continue;
      const sql = (await readFile(path.join(dir, arquivo), "utf8")).trim();
      if (!sql) continue;

      try {
        await client.query("BEGIN");
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [
          arquivo,
        ]);
        await client.query("COMMIT");
        console.info(`Migration aplicada: ${arquivo}`);
      } catch (error) {
        try {
          await client.query("ROLLBACK");
        } catch {
          // O erro da migration é o que importa.
        }
        throw error;
      }
    }
  } finally {
    try {
      await client.query("SELECT pg_advisory_unlock($1::bigint)", [LOCK_KEY]);
    } catch {
      // A conexão fecha em seguida e solta o lock.
    }
    client.release();
    await pool.end();
  }
}

module.exports = { migrate };

if (require.main === module) {
  migrate().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
