import {
  MAX_ITENS,
  MAX_NOME,
  MAX_NOME_ATRAS,
  TAMANHOS_CAMISA,
  TAMANHOS_SHORTS,
} from "@/lib/pedidos/constants";
import type {
  FieldErrors,
  ItemAtualizacaoInput,
  ItemNovoInput,
  NovoPedidoInput,
} from "@/lib/pedidos/types";

export function limparTexto(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function tamanhoPermitido(value: string, permitidos: readonly string[]) {
  return permitidos.includes(value);
}

export function validarNovoPedido(input: NovoPedidoInput): {
  data: NovoPedidoInput;
  errors: FieldErrors;
} {
  const errors: FieldErrors = {};
  const nomeResponsavel = limparTexto(input.nome_responsavel ?? "");

  if (nomeResponsavel.length < 3) {
    errors.nome_responsavel = "Informe o nome completo do responsável.";
  } else if (nomeResponsavel.length > MAX_NOME) {
    errors.nome_responsavel = "O nome do responsável é longo demais.";
  }

  const itensRecebidos = Array.isArray(input.itens) ? input.itens : [];

  if (itensRecebidos.length === 0) {
    errors.itens = "Adicione pelo menos uma pessoa.";
  } else if (itensRecebidos.length > MAX_ITENS) {
    errors.itens = `É possível adicionar no máximo ${MAX_ITENS} pessoas por pedido.`;
  }

  const itens: ItemNovoInput[] = itensRecebidos.map((item, index) => {
    const nomePessoa = limparTexto(item?.nome_pessoa ?? "");
    const tamanhoCamisa = (item?.tamanho_camisa ?? "").trim();
    const tamanhoShorts = (item?.tamanho_shorts ?? "").trim();
    const querPersonalizar = Boolean(item?.quer_personalizar);
    const nomeAtras = limparTexto(item?.nome_atras ?? "");

    if (nomePessoa.length < 2) {
      errors[`itens.${index}.nome_pessoa`] = "Informe o nome da pessoa.";
    } else if (nomePessoa.length > MAX_NOME) {
      errors[`itens.${index}.nome_pessoa`] = "O nome da pessoa é longo demais.";
    }

    if (!tamanhoPermitido(tamanhoCamisa, TAMANHOS_CAMISA)) {
      errors[`itens.${index}.tamanho_camisa`] = "Selecione o tamanho da camisa.";
    }

    if (!tamanhoPermitido(tamanhoShorts, TAMANHOS_SHORTS)) {
      errors[`itens.${index}.tamanho_shorts`] = "Selecione o tamanho do shorts.";
    }

    if (querPersonalizar && nomeAtras.length < 2) {
      errors[`itens.${index}.nome_atras`] =
        "Informe o nome que vai atrás da camisa.";
    } else if (querPersonalizar && nomeAtras.length > MAX_NOME_ATRAS) {
      errors[`itens.${index}.nome_atras`] =
        `Use no máximo ${MAX_NOME_ATRAS} caracteres.`;
    }

    return {
      nome_pessoa: nomePessoa,
      tamanho_camisa: tamanhoCamisa,
      tamanho_shorts: tamanhoShorts,
      quer_personalizar: querPersonalizar,
      nome_atras: querPersonalizar ? nomeAtras : "",
    };
  });

  return {
    data: { nome_responsavel: nomeResponsavel, itens },
    errors,
  };
}

export function validarAtualizacao(itens: ItemAtualizacaoInput[]): {
  data: ItemAtualizacaoInput[];
  errors: FieldErrors;
} {
  const errors: FieldErrors = {};
  const recebidos = Array.isArray(itens) ? itens : [];

  if (recebidos.length === 0) {
    errors.itens = "Não há itens para salvar.";
  } else if (recebidos.length > MAX_ITENS) {
    errors.itens = `É possível atualizar no máximo ${MAX_ITENS} itens por vez.`;
  }

  const data = recebidos.map((item, index) => {
    const id = Number(item?.id);
    const nomePessoa = limparTexto(item?.nome_pessoa ?? "");
    const tamanhoCamisa = (item?.tamanho_camisa ?? "").trim();
    const tamanhoShorts = (item?.tamanho_shorts ?? "").trim();
    const querPersonalizar = Boolean(item?.quer_personalizar);
    const nomeAtras = limparTexto(item?.nome_atras ?? "");

    if (!Number.isInteger(id) || id <= 0) {
      errors[`itens.${index}.id`] = "Item inválido.";
    }

    if (nomePessoa.length < 2) {
      errors[`itens.${index}.nome_pessoa`] = "Informe o nome da pessoa.";
    } else if (nomePessoa.length > MAX_NOME) {
      errors[`itens.${index}.nome_pessoa`] = "O nome da pessoa é longo demais.";
    }

    if (!tamanhoCamisa || tamanhoCamisa.length > 40) {
      errors[`itens.${index}.tamanho_camisa`] = "Selecione o tamanho da camisa.";
    }

    if (!tamanhoShorts || tamanhoShorts.length > 40) {
      errors[`itens.${index}.tamanho_shorts`] = "Selecione o tamanho do shorts.";
    }

    if (querPersonalizar && nomeAtras.length < 2) {
      errors[`itens.${index}.nome_atras`] =
        "Informe o nome que vai atrás da camisa.";
    } else if (querPersonalizar && nomeAtras.length > MAX_NOME_ATRAS) {
      errors[`itens.${index}.nome_atras`] =
        `Use no máximo ${MAX_NOME_ATRAS} caracteres.`;
    }

    return {
      id,
      nome_pessoa: nomePessoa,
      tamanho_camisa: tamanhoCamisa,
      tamanho_shorts: tamanhoShorts,
      quer_personalizar: querPersonalizar,
      nome_atras: querPersonalizar ? nomeAtras : "",
    };
  });

  return { data, errors };
}

export function temErros(errors: FieldErrors) {
  return Object.keys(errors).length > 0;
}
