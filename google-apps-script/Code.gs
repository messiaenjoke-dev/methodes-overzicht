/**
 * Google Apps Script voor Methodes Overzicht
 * Geoptimaliseerde versie
 */

const SHEET_NAMES = {
  METHODES: 'Methodes',
  UITGEVERIJEN: 'Uitgeverijen',
  LOG: 'Log'
};

function doGet(e) {
  const action = e.parameter.action;
  let result;
  try {
    switch(action) {
      case 'getMethodes': result = getMethodes(); break;
      case 'getUitgeverijen': result = getUitgeverijen(); break;
      case 'getLog': result = getLog(); break;
      case 'getAll': result = { methodes: getMethodes(), uitgeverijen: getUitgeverijen(), log: getLog() }; break;
      default: result = { error: 'Onbekende actie: ' + action };
    }
  } catch(err) { result = { error: err.toString() }; }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let result;
  try {
    const data = JSON.parse(e.postData.contents);
    switch(data.action) {
      case 'saveMethodes': result = saveMethodes(data.school, data.jaar, data.methodes, data.user); break;
      case 'addUitgeverij': result = addUitgeverij(data.methode, data.uitgeverij, data.user); break;
      default: result = { error: 'Onbekende actie' };
    }
  } catch(err) { result = { error: err.toString() }; }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers && headers.length > 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

function readSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(name);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i] || ''; });
    return obj;
  });
}

function getMethodes() { return readSheet(SHEET_NAMES.METHODES); }
function getUitgeverijen() { return readSheet(SHEET_NAMES.UITGEVERIJEN); }
function getLog() { return readSheet(SHEET_NAMES.LOG).slice(-100).reverse(); }

function saveMethodes(school, jaar, methodes, user) {
  const headers = ['School', 'Schooljaar', 'Vak', 'Niveau', 'Methode', 'GewijzigdDoor', 'GewijzigdOp'];
  const sheet = getOrCreateSheet(SHEET_NAMES.METHODES, headers);
  const data = sheet.getDataRange().getValues();

  for (let i = data.length - 1; i > 0; i--) {
    if (data[i][0] === school && data[i][1] === jaar) sheet.deleteRow(i + 1);
  }

  const timestamp = new Date().toISOString();
  const vakLabels = {'wiskunde':'Wiskunde','taal':'Taal','spelling':'Spelling','schrift':'Schrift','frans':'Frans','wero':'Wero','godsdienst':'Godsdienst','begrijpend_lezen':'Begrijpend lezen','sova':'SOVA','motoriek':'Motoriek'};
  const nivLabels = {'p':'P','k':'K','l1':'L1','l2_6':'L2-6','l2_3':'L2-3','l4_6':'L4-6'};
  const newRows = [];

  Object.keys(methodes).forEach(vak => {
    Object.keys(methodes[vak]).forEach(niveau => {
      (methodes[vak][niveau] || []).forEach(m => {
        newRows.push([school, jaar, vakLabels[vak]||vak, nivLabels[niveau]||niveau, m, user, timestamp]);
      });
    });
  });

  if (newRows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, 7).setValues(newRows);
  }
  addLog(user, 'Methodes bijgewerkt', school + ' (' + jaar + ')');
  return { success: true, count: newRows.length };
}

function addUitgeverij(methode, uitgeverij, user) {
  const headers = ['Methode', 'Uitgeverij', 'ToegevoegdDoor', 'ToegevoegdOp'];
  const sheet = getOrCreateSheet(SHEET_NAMES.UITGEVERIJEN, headers);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === methode) {
      sheet.getRange(i + 1, 2, 1, 3).setValues([[uitgeverij, user, new Date().toISOString()]]);
      return { success: true, updated: true };
    }
  }
  sheet.appendRow([methode, uitgeverij, user, new Date().toISOString()]);
  addLog(user, 'Methode toegevoegd', methode);
  return { success: true, added: true };
}

function addLog(user, action, details) {
  const sheet = getOrCreateSheet(SHEET_NAMES.LOG, ['Timestamp', 'User', 'Action', 'Details', 'Extra']);
  sheet.appendRow([new Date().toISOString(), user, action, details, '']);
}

function initializeSheets() {
  getOrCreateSheet(SHEET_NAMES.METHODES, ['School', 'Schooljaar', 'Vak', 'Niveau', 'Methode', 'GewijzigdDoor', 'GewijzigdOp']);
  getOrCreateSheet(SHEET_NAMES.LOG, ['Timestamp', 'User', 'Action', 'Details', 'Extra']);

  const sheet = getOrCreateSheet(SHEET_NAMES.UITGEVERIJEN, ['Methode', 'Uitgeverij', 'ToegevoegdDoor', 'ToegevoegdOp']);
  if (sheet.getLastRow() > 1) {
    SpreadsheetApp.getUi().alert('Sheets bestaan al!');
    return;
  }

  const ts = new Date().toISOString();
  const rows = [
    ["Reken Maar","Van In","Systeem",ts],["Katapult","Die Keure","Systeem",ts],["Wiskanjers","Plantyn","Systeem",ts],
    ["Kadet","Die Keure","Systeem",ts],["Veilig leren lezen","Zwijsen","Systeem",ts],["Talent","Van In","Systeem",ts],
    ["Confetti","Die Keure","Systeem",ts],["Dag Jules","Zwijsen","Systeem",ts],["Tijd voor taal accent","Van In","Systeem",ts],
    ["Talent+","Van In","Systeem",ts],["Taalkanjers","Plantyn","Systeem",ts],["Pistache","Plantyn","Systeem",ts],
    ["Verrekijker","Die Keure","Systeem",ts],["Labo","Die Keure","Systeem",ts],["Tekstduikers","Van In","Systeem",ts],
    ["Wouw","Die Keure","Systeem",ts],["Wereldkanjers","Plantyn","Systeem",ts],["Sterren aan de hemel","Plantyn","Systeem",ts],
    ["Jezus leeft","Licap","Systeem",ts],["TOV","Licap","Systeem",ts],["De Geluksvogels","Lannoo","Systeem",ts],
    ["Krullenbol","Die Keure","Systeem",ts],["Karakter","Van In","Systeem",ts],["Zouff","Van In","Systeem",ts],["Luna","Die Keure","Systeem",ts]
  ];
  sheet.getRange(2, 1, rows.length, 4).setValues(rows);
  SpreadsheetApp.getUi().alert('Klaar! Sheets zijn aangemaakt met ' + rows.length + ' methodes.');
}
