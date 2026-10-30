// FocusMatriz: sincronização entre celular e computador usando esta planilha.
// Cole este código em Extensões > Apps Script e implante como "App da Web".

const SHEET = 'Tarefas';
const COLS = ['id', 'title', 'description', 'quadrant', 'area', 'sub', 'priority', 'date', 'time', 'done', 'completedAt', 'deletedAt', 'purged', 'updatedAt'];
const HEAD = ['ID', 'Título', 'Observação', 'Quadrante', 'Área', 'Subcategoria', 'Prioridade', 'Data', 'Horário', 'Concluída', 'Concluída em', 'Excluída em', 'Removida', 'Atualizada em'];

function doGet(e) {
  return handle_((e && e.parameter) || {});
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return out_({ error: 'Pedido inválido' }); }
  return handle_(body);
}

function handle_(body) {
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    const props = PropertiesService.getScriptProperties();
    const key = String(body.key || '');
    if (key.length < 20) return out_({ error: 'Chave inválida' });
    // O primeiro aparelho que conecta define a chave; os outros entram pelo link dele.
    const saved = props.getProperty('KEY');
    if (!saved) props.setProperty('KEY', key);
    else if (saved !== key) return out_({ error: 'Chave diferente. Conecte este aparelho pelo link de um aparelho já conectado.' });

    const sheet = sheet_();
    let tasks = read_(sheet);
    if (Array.isArray(body.tasks)) {
      const merged = merge_(tasks, body.tasks);
      if (merged.changed) { tasks = merged.list; write_(sheet, tasks); }
    }

    let config = JSON.parse(props.getProperty('CONFIG') || 'null');
    if (body.config && (!config || String(body.config.updatedAt || '') > String(config.updatedAt || ''))) {
      config = body.config;
      props.setProperty('CONFIG', JSON.stringify(config));
    }
    return out_({ ok: true, tasks: tasks, config: config });
  } finally {
    lock.releaseLock();
  }
}

// Fica a versão de cada tarefa com o "updatedAt" mais recente.
function merge_(current, incoming) {
  const map = {};
  current.forEach(t => { map[t.id] = t; });
  let changed = false;
  incoming.forEach(t => {
    if (!t || !t.id) return;
    const old = map[t.id];
    if (!old || String(t.updatedAt || '') > String(old.updatedAt || '')) { map[t.id] = t; changed = true; }
  });
  return { list: Object.keys(map).map(k => map[k]), changed: changed };
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
}

function read_(sheet) {
  const values = sheet.getDataRange().getDisplayValues();
  return values.slice(1).filter(r => r[0]).map(r => {
    const t = {};
    COLS.forEach((c, i) => { t[c] = r[i] || ''; });
    t.quadrant = Number(t.quadrant) || 1;
    t.done = t.done === 'sim';
    t.purged = t.purged === 'sim';
    t.completedAt = t.completedAt || null;
    t.deletedAt = t.deletedAt || null;
    return t;
  });
}

function write_(sheet, tasks) {
  const rows = tasks.map(t => COLS.map(c => {
    if (c === 'done' || c === 'purged') return t[c] ? 'sim' : '';
    return t[c] == null ? '' : String(t[c]);
  }));
  const all = [HEAD].concat(rows);
  sheet.clearContents();
  const range = sheet.getRange(1, 1, all.length, COLS.length);
  range.setNumberFormat('@');
  range.setValues(all);
  sheet.setFrozenRows(1);
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
