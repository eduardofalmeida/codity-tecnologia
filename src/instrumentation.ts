export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  const arquivo =
    "file:///" +
    process.cwd().replace(/\\/g, "/") +
    "/scripts/migrate.cjs";
  const { migrate } = await import(/* webpackIgnore: true */ arquivo);
  await migrate();
}
