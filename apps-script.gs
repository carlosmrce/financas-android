// ============================================================
//  FinançasVoz — Google Apps Script
//  Cole este código no editor do Apps Script e publique como
//  Web App (Execute as: Me | Who has access: Anyone)
// ============================================================

const CONFIG = {
  SHEET_ID: 'SEU_SHEET_ID_AQUI',   // ID da planilha (URL: /spreadsheets/d/<ID>/edit)
  TOKEN:    'SEU_TOKEN_SECRETO',    // Token secreto — copie o mesmo no app
  ABA_TX:   'Transações',
};

// ── ENTRY POINTS ──────────────────────────────────────────────

function doGet(e)  { return handle(e.parameter); }

function doPost(e) {
  const p = Object.assign({}, e.parameter);
  try { Object.assign(p, JSON.parse(e.postData.contents)); } catch(_) {}
  return handle(p);
}

// ── ROUTER ───────────────────────────────────────────────────

function handle(p) {
  function json(obj) {
    return ContentService
      .createTextOutput(JSON.stringify(obj))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (p.token !== CONFIG.TOKEN) return json({ status: 'error', error: 'Não autorizado' });

  try {
    if (p.action === 'inserir') return json(inserir(p));
    if (p.action === 'listar')  return json(listar(p));
    if (p.action === 'resumo')  return json(resumo(p));
    return json({ status: 'error', error: 'Ação inválida' });
  } catch (err) {
    return json({ status: 'error', error: err.message });
  }
}

// ── INSERIR ──────────────────────────────────────────────────

function inserir(p) {
  const sheet = getSheet();
  const now   = new Date();
  const tz    = 'America/Sao_Paulo';

  sheet.appendRow([
    p.data      || Utilities.formatDate(now, tz, 'dd/MM/yyyy'),
    p.hora      || Utilities.formatDate(now, tz, 'HH:mm'),
    p.usuario   || '',
    p.tipo      || '',
    parseFloat(p.valor) || 0,
    p.categoria || '',
    p.descricao || '',
  ]);

  return { status: 'ok' };
}

// ── LISTAR ───────────────────────────────────────────────────

function listar(p) {
  const sheet = getSheet();
  const rows  = sheet.getDataRange().getValues();
  if (rows.length <= 1) return { status: 'ok', transacoes: [] };

  const { start, end } = dateRange(p.periodo || 'month');

  const tz = 'America/Sao_Paulo';

  const transacoes = rows.slice(1)
    .filter(r => {
      const d = parseBRDate(r[0]);
      return d && d >= start && d < end;
    })
    .map(r => ({
      data:      r[0] instanceof Date ? Utilities.formatDate(r[0], tz, 'dd/MM/yyyy') : r[0],
      hora:      r[1] instanceof Date ? Utilities.formatDate(r[1], tz, 'HH:mm')      : r[1],
      usuario:   r[2],
      tipo:      r[3],
      valor:     r[4],
      categoria: r[5],
      descricao: r[6],
    }))
    .reverse();

  return { status: 'ok', transacoes };
}

// ── RESUMO ───────────────────────────────────────────────────

function resumo(p) {
  const sheet = getSheet();
  const rows  = sheet.getDataRange().getValues();
  if (rows.length <= 1) return { status: 'ok', entradas: 0, saidas: 0, categorias: {} };

  const { start, end } = dateRange(p.periodo || 'month');

  let entradas = 0, saidas = 0;
  const categorias = {};

  rows.slice(1).forEach(r => {
    const d = parseBRDate(r[0]);
    if (!d || d < start || d >= end) return;

    const tipo  = r[3];
    const valor = parseFloat(r[4]) || 0;
    const cat   = r[5] || 'Outros';

    if (tipo === 'Entrada') {
      entradas += valor;
    } else if (tipo === 'Saída') {
      saidas += valor;
      categorias[cat] = (categorias[cat] || 0) + valor;
    }
  });

  return { status: 'ok', entradas, saidas, categorias };
}

// ── HELPERS ──────────────────────────────────────────────────

function getSheet() {
  const ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  let sheet   = ss.getSheetByName(CONFIG.ABA_TX);

  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.ABA_TX);
    const header = ['Data', 'Hora', 'Usuário', 'Tipo', 'Valor', 'Categoria', 'Descrição'];
    sheet.appendRow(header);
    sheet.getRange(1, 1, 1, header.length).setFontWeight('bold').setBackground('#1e2430').setFontColor('#c9d1d9');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function parseBRDate(val) {
  if (val instanceof Date) {
    return new Date(val.getFullYear(), val.getMonth(), val.getDate());
  }
  const parts = String(val).split('/');
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map(Number);
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d);
}

function dateRange(periodo) {
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (periodo === 'day') {
    return { start: today, end: new Date(today.getTime() + 86400000) };
  }
  if (periodo === 'week') {
    const dow   = today.getDay(); // 0=Sun
    const start = new Date(today.getTime() - dow * 86400000);
    const end   = new Date(start.getTime() + 7 * 86400000);
    return { start, end };
  }
  // month (default)
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end:   new Date(now.getFullYear(), now.getMonth() + 1, 1),
  };
}
