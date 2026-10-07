import { createRequire } from "node:module";

import type { Border, Borders, Fill, Workbook, Worksheet } from "exceljs";

import {
  agruparFamilias,
  descreveTamanho,
  resumirQuantidades,
  tamanhoInformado,
  type ContagemTamanho,
  type LinhaCadastro,
} from "@/lib/pedidos/lista";

const { Workbook } = createRequire(import.meta.url)("exceljs") as typeof import("exceljs");

const SLATE_900 = "FF0F172A";
const SLATE_800 = "FF1E293B";
const SLATE_100 = "FFF1F5F9";
const SLATE_50 = "FFF8FAFC";
const SLATE_500 = "FF64748B";
const SLATE_400 = "FF94A3B8";
const SLATE_200 = "FFE2E8F0";
const WHITE = "FFFFFFFF";
const TEAL = "FF0F766E";

const COLUNAS = [
  { header: "Nº do responsável", width: 22 },
  { header: "Nome do responsável", width: 32 },
  { header: "Nº da peça", width: 14 },
  { header: "Nome da pessoa", width: 30 },
  { header: "Tamanho da camisa", width: 20 },
  { header: "Camisa", width: 16 },
  { header: "Tamanho do shorts", width: 20 },
  { header: "Shorts", width: 16 },
  { header: "Nome atrás", width: 16 },
  { header: "Texto do nome atrás", width: 32 },
] as const;

const ULTIMA_COLUNA = COLUNAS.length;
const LINHA_TITULO = 1;
const LINHA_SUBTITULO = 2;
const LINHA_RESUMO_ROTULO = 4;
const LINHA_RESUMO_VALOR = 5;
const LINHA_CABECALHO = 7;

function preenchimento(argb: string): Fill {
  return { type: "pattern", pattern: "solid", fgColor: { argb } };
}

function borda(argb = SLATE_200): Partial<Borders> {
  const lado: Partial<Border> = { style: "thin", color: { argb } };
  return { top: lado, left: lado, bottom: lado, right: lado };
}

function aplicarFaixa(planilha: Worksheet, linha: number, argb: string) {
  for (let coluna = 1; coluna <= ULTIMA_COLUNA; coluna += 1) {
    planilha.getCell(linha, coluna).fill = preenchimento(argb);
  }
}

export async function montarPlanilha(linhas: LinhaCadastro[]) {
  const familias = agruparFamilias(linhas);
  const pecas = linhas.filter((linha) => linha.itemId != null);
  const comNome = pecas.filter((linha) => linha.querPersonalizar).length;
  const quantidades = resumirQuantidades(linhas);
  const emitido = new Date();

  const pasta = new Workbook();
  pasta.creator = "Codity";
  pasta.created = emitido;
  pasta.title = "Cadastros de camisas e shorts";

  const planilha = pasta.addWorksheet("Cadastros", {
    views: [
      {
        state: "frozen",
        ySplit: LINHA_CABECALHO,
        showGridLines: false,
        activeCell: "A8",
      },
    ],
    pageSetup: {
      paperSize: 9,
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      horizontalCentered: true,
      printTitlesRow: `${LINHA_CABECALHO}:${LINHA_CABECALHO}`,
    },
    headerFooter: {
      oddFooter: "&LCadastros de camisas e shorts&RPágina &P de &N",
    },
    properties: { tabColor: { argb: SLATE_900 } },
  });

  planilha.columns = COLUNAS.map((coluna) => ({ width: coluna.width }));

  planilha.mergeCells(LINHA_TITULO, 1, LINHA_TITULO, ULTIMA_COLUNA);
  const titulo = planilha.getCell(LINHA_TITULO, 1);
  titulo.value = "Cadastros de camisas e shorts";
  titulo.font = { name: "Calibri", size: 18, bold: true, color: { argb: WHITE } };
  titulo.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  planilha.getRow(LINHA_TITULO).height = 36;
  aplicarFaixa(planilha, LINHA_TITULO, SLATE_900);

  planilha.mergeCells(LINHA_SUBTITULO, 1, LINHA_SUBTITULO, ULTIMA_COLUNA);
  const subtitulo = planilha.getCell(LINHA_SUBTITULO, 1);
  subtitulo.value = "Lista detalhada · uma linha por peça";
  subtitulo.font = { name: "Calibri", size: 11, color: { argb: "FFCBD5E1" } };
  subtitulo.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  planilha.getRow(LINHA_SUBTITULO).height = 20;
  aplicarFaixa(planilha, LINHA_SUBTITULO, SLATE_900);

  planilha.getRow(3).height = 12;

  const resumo: Array<{ coluna: number; rotulo: string; valor: Date | number | string; formato?: string }> = [
    { coluna: 1, rotulo: "Emitido em", valor: emitido, formato: "dd/mm/yyyy hh:mm" },
    { coluna: 3, rotulo: "Responsáveis", valor: familias.length },
    { coluna: 5, rotulo: "Camisetas", valor: quantidades.camisetas },
    { coluna: 7, rotulo: "Shorts", valor: quantidades.shorts },
    { coluna: 9, rotulo: "Nomes atrás", valor: comNome },
  ];

  aplicarFaixa(planilha, LINHA_RESUMO_ROTULO, SLATE_50);
  aplicarFaixa(planilha, LINHA_RESUMO_VALOR, SLATE_50);
  planilha.getRow(LINHA_RESUMO_ROTULO).height = 18;
  planilha.getRow(LINHA_RESUMO_VALOR).height = 24;

  for (const item of resumo) {
    const fim = item.coluna + 1;
    planilha.mergeCells(LINHA_RESUMO_ROTULO, item.coluna, LINHA_RESUMO_ROTULO, fim);
    planilha.mergeCells(LINHA_RESUMO_VALOR, item.coluna, LINHA_RESUMO_VALOR, fim);

    const rotulo = planilha.getCell(LINHA_RESUMO_ROTULO, item.coluna);
    rotulo.value = item.rotulo;
    rotulo.font = { name: "Calibri", size: 9, bold: true, color: { argb: SLATE_500 } };
    rotulo.alignment = { vertical: "bottom", horizontal: "left", indent: 1 };

    const valor = planilha.getCell(LINHA_RESUMO_VALOR, item.coluna);
    valor.value = item.valor;
    valor.font = { name: "Calibri", size: 14, bold: true, color: { argb: SLATE_900 } };
    valor.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    if (item.formato) valor.numFmt = item.formato;
  }

  planilha.getRow(6).height = 12;

  const cabecalho = planilha.getRow(LINHA_CABECALHO);
  cabecalho.height = 28;
  COLUNAS.forEach((coluna, indice) => {
    const celula = cabecalho.getCell(indice + 1);
    celula.value = coluna.header;
    celula.font = { name: "Calibri", size: 11, bold: true, color: { argb: WHITE } };
    celula.fill = preenchimento(SLATE_800);
    celula.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    celula.border = borda(SLATE_800);
  });

  if (pecas.length === 0) {
    const linhaVazia = LINHA_CABECALHO + 1;
    planilha.mergeCells(linhaVazia, 1, linhaVazia, ULTIMA_COLUNA);
    const aviso = planilha.getCell(linhaVazia, 1);
    aviso.value = "Nenhuma peça cadastrada.";
    aviso.font = { name: "Calibri", size: 11, italic: true, color: { argb: SLATE_500 } };
    aviso.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    planilha.getRow(linhaVazia).height = 24;
    aplicarFaixa(planilha, linhaVazia, WHITE);
  } else {
    pecas.forEach((linha, indice) => {
      const numero = indice + 1;
      const linhaPlanilha = LINHA_CABECALHO + numero;
      const camisa = descreveTamanho(linha.tamanhoCamisa, "camisa");
      const shorts = descreveTamanho(linha.tamanhoShorts, "shorts");
      const nomeAtras = linha.querPersonalizar ? "Sim" : "Não";
      const textoNome = linha.querPersonalizar ? linha.nomeAtras : "";
      const valores: Array<string | number> = [
        linha.compradorId,
        linha.nomeResponsavel,
        numero,
        linha.nomePessoa,
        tamanhoInformado(linha.tamanhoCamisa),
        camisa,
        tamanhoInformado(linha.tamanhoShorts),
        shorts,
        nomeAtras,
        textoNome,
      ];

      const faixa = numero % 2 === 0 ? SLATE_50 : WHITE;
      const registro = planilha.getRow(linhaPlanilha);
      registro.height = 22;

      valores.forEach((valor, colunaIndice) => {
        const celula = registro.getCell(colunaIndice + 1);
        celula.value = valor;
        celula.fill = preenchimento(faixa);
        celula.border = borda();
        celula.font = { name: "Calibri", size: 11, color: { argb: SLATE_900 } };
        celula.alignment = {
          vertical: "middle",
          horizontal: colunaIndice === 1 || colunaIndice === 3 || colunaIndice === 9 ? "left" : "center",
          indent: colunaIndice === 1 || colunaIndice === 3 || colunaIndice === 9 ? 1 : 0,
        };

        if (valor === "Sem camisa" || valor === "Sem shorts") {
          celula.font = { name: "Calibri", size: 11, italic: true, color: { argb: SLATE_400 } };
        }
        if (colunaIndice === 8 && valor === "Sim") {
          celula.font = { name: "Calibri", size: 11, bold: true, color: { argb: TEAL } };
        }
        if (colunaIndice === 8 && valor === "Não") {
          celula.font = { name: "Calibri", size: 11, color: { argb: SLATE_400 } };
        }
      });
    });

    planilha.autoFilter = {
      from: { row: LINHA_CABECALHO, column: 1 },
      to: { row: LINHA_CABECALHO + pecas.length, column: ULTIMA_COLUNA },
    };
  }

  preencherQuantidades(pasta, quantidades);

  const bruto = await pasta.xlsx.writeBuffer();
  return Buffer.from(bruto);
}

function escreverTabelaTamanhos(
  planilha: Worksheet,
  titulo: string,
  total: number,
  itens: ContagemTamanho[],
  semQuantidade: number,
  rotuloSem: string,
  linhaInicial: number,
) {
  planilha.mergeCells(linhaInicial, 1, linhaInicial, 2);
  const tituloCelula = planilha.getCell(linhaInicial, 1);
  tituloCelula.value = titulo;
  tituloCelula.font = { name: "Calibri", size: 16, bold: true, color: { argb: WHITE } };
  tituloCelula.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  tituloCelula.fill = preenchimento(SLATE_900);
  planilha.getCell(linhaInicial, 2).fill = preenchimento(SLATE_900);
  planilha.getRow(linhaInicial).height = 28;

  const linhaTotal = linhaInicial + 1;
  planilha.getCell(linhaTotal, 1).value = "Total";
  planilha.getCell(linhaTotal, 1).font = { name: "Calibri", size: 12, bold: true, color: { argb: SLATE_900 } };
  planilha.getCell(linhaTotal, 1).fill = preenchimento(SLATE_100);
  planilha.getCell(linhaTotal, 1).border = borda();
  planilha.getCell(linhaTotal, 2).value = total;
  planilha.getCell(linhaTotal, 2).font = { name: "Calibri", size: 14, bold: true, color: { argb: SLATE_900 } };
  planilha.getCell(linhaTotal, 2).fill = preenchimento(SLATE_100);
  planilha.getCell(linhaTotal, 2).alignment = { horizontal: "center" };
  planilha.getCell(linhaTotal, 2).border = borda();
  planilha.getRow(linhaTotal).height = 24;

  const linhaCabecalho = linhaInicial + 2;
  for (const [coluna, texto] of [
    [1, "Tamanho"],
    [2, "Quantidade"],
  ] as const) {
    const celula = planilha.getCell(linhaCabecalho, coluna);
    celula.value = texto;
    celula.font = { name: "Calibri", size: 11, bold: true, color: { argb: WHITE } };
    celula.fill = preenchimento(SLATE_800);
    celula.alignment = { vertical: "middle", horizontal: "center" };
    celula.border = borda(SLATE_800);
  }
  planilha.getRow(linhaCabecalho).height = 22;

  const linhas = itens.length > 0 ? itens : [];
  if (linhas.length === 0) {
    const vazia = linhaCabecalho + 1;
    planilha.mergeCells(vazia, 1, vazia, 2);
    const aviso = planilha.getCell(vazia, 1);
    aviso.value = "Nenhum tamanho pedido.";
    aviso.font = { name: "Calibri", size: 11, italic: true, color: { argb: SLATE_500 } };
    aviso.alignment = { vertical: "middle", indent: 1 };
    planilha.getRow(vazia).height = 22;
    return vazia + 2;
  }

  linhas.forEach((item, indice) => {
    const linha = linhaCabecalho + 1 + indice;
    const faixa = indice % 2 === 0 ? WHITE : SLATE_50;
    const tamanho = planilha.getCell(linha, 1);
    tamanho.value = item.tamanho;
    tamanho.font = { name: "Calibri", size: 12, color: { argb: SLATE_900 } };
    tamanho.fill = preenchimento(faixa);
    tamanho.alignment = { vertical: "middle", indent: 1 };
    tamanho.border = borda();

    const quantidade = planilha.getCell(linha, 2);
    quantidade.value = item.quantidade;
    quantidade.font = { name: "Calibri", size: 12, bold: true, color: { argb: SLATE_900 } };
    quantidade.fill = preenchimento(faixa);
    quantidade.alignment = { vertical: "middle", horizontal: "center" };
    quantidade.border = borda();
    planilha.getRow(linha).height = 22;
  });

  let proxima = linhaCabecalho + linhas.length + 2;
  if (semQuantidade > 0) {
    const linhaSem = linhaCabecalho + linhas.length + 1;
    planilha.getCell(linhaSem, 1).value = rotuloSem;
    planilha.getCell(linhaSem, 1).font = { name: "Calibri", size: 11, italic: true, color: { argb: SLATE_500 } };
    planilha.getCell(linhaSem, 2).value = semQuantidade;
    planilha.getCell(linhaSem, 2).font = { name: "Calibri", size: 11, color: { argb: SLATE_500 } };
    planilha.getCell(linhaSem, 2).alignment = { horizontal: "center" };
    proxima = linhaSem + 2;
  }

  return proxima;
}

function preencherQuantidades(
  pasta: Workbook,
  quantidades: ReturnType<typeof resumirQuantidades>,
) {
  const planilha = pasta.addWorksheet("Quantidades", {
    views: [{ showGridLines: false }],
    properties: { tabColor: { argb: TEAL } },
    pageSetup: {
      paperSize: 9,
      orientation: "portrait",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
    },
  });

  planilha.getColumn(1).width = 28;
  planilha.getColumn(2).width = 16;

  const depoisCamisa = escreverTabelaTamanhos(
    planilha,
    "Camisetas por tamanho",
    quantidades.camisetas,
    quantidades.tamanhosCamisa,
    quantidades.semCamisa,
    "Sem camisa",
    1,
  );

  escreverTabelaTamanhos(
    planilha,
    "Shorts por tamanho",
    quantidades.shorts,
    quantidades.tamanhosShorts,
    quantidades.semShorts,
    "Sem shorts",
    depoisCamisa + 1,
  );
}
