export type Comprador = {
  id: number;
  nome_responsavel: string;
};

export type ItemPedido = {
  id: number;
  comprador_id: number;
  nome_pessoa: string;
  tamanho_camisa: string;
  tamanho_shorts: string;
  quer_personalizar: boolean;
  nome_atras: string;
};

export type ItemNovoInput = {
  nome_pessoa: string;
  tamanho_camisa: string;
  tamanho_shorts: string;
  quer_personalizar: boolean;
  nome_atras: string;
};

export type NovoPedidoInput = {
  nome_responsavel: string;
  itens: ItemNovoInput[];
};

export type ItemAtualizacaoInput = {
  id: number;
  nome_pessoa: string;
  tamanho_camisa: string;
  tamanho_shorts: string;
  quer_personalizar: boolean;
  nome_atras: string;
};

export type FieldErrors = Record<string, string>;

export type ActionFailure = {
  ok: false;
  message: string;
  fieldErrors?: FieldErrors;
};

export type ActionSuccess<T extends object = object> = { ok: true } & T;

export type ActionResult<T extends object = object> =
  | ActionSuccess<T>
  | ActionFailure;
