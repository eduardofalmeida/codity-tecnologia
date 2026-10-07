-- Aplicada automaticamente na subida do servidor.
-- Crie o próximo arquivo em ordem (002_....sql) para novos ajustes ou inserts.

CREATE TABLE IF NOT EXISTS compradores (
  id SERIAL PRIMARY KEY,
  nome_responsavel VARCHAR(160) NOT NULL
);

CREATE TABLE IF NOT EXISTS itens_pedido (
  id SERIAL PRIMARY KEY,
  comprador_id INTEGER NOT NULL REFERENCES compradores (id) ON DELETE CASCADE,
  nome_pessoa VARCHAR(160) NOT NULL,
  tamanho_camisa VARCHAR(40) NOT NULL,
  tamanho_shorts VARCHAR(40) NOT NULL,
  quer_personalizar BOOLEAN NOT NULL DEFAULT FALSE,
  nome_atras VARCHAR(30),
  CONSTRAINT nome_atras_quando_personaliza CHECK (
    (quer_personalizar = FALSE AND nome_atras IS NULL)
    OR (
      quer_personalizar = TRUE
      AND nome_atras IS NOT NULL
      AND char_length(btrim(nome_atras)) BETWEEN 2 AND 30
    )
  )
);

CREATE INDEX IF NOT EXISTS idx_itens_pedido_comprador_id
  ON itens_pedido (comprador_id);

CREATE INDEX IF NOT EXISTS idx_compradores_nome_responsavel
  ON compradores (nome_responsavel);
