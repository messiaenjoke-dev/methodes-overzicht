/**
 * Google Apps Script voor Methodes Overzicht
 *
 * INSTALLATIE:
 * 1. Open je Google Sheet
 * 2. Ga naar Extensies > Apps Script
 * 3. Verwijder alle code en plak dit bestand
 * 4. Klik op "Opslaan"
 * 5. Klik op "Implementeren" > "Nieuwe implementatie"
 * 6. Kies "Webapp"
 * 7. Stel in: "Uitvoeren als: Ik" en "Toegang: Iedereen"
 * 8. Klik "Implementeren" en kopieer de URL
 * 9. Plak de URL in app.jsx bij SCRIPT_URL
 */

// ============================================================================
// CONFIGURATIE
// ============================================================================

const SHEET_NAMES = {
  METHODES: 'Methodes',
  UITGEVERIJEN: 'Uitgeverijen',
  LOG: 'Log'
};

// ============================================================================
// WEBAPP ENDPOINTS
// ============================================================================

/**
 * Verwerk GET requests
 */
function doGet(e) {
  const action = e.parameter.action;
  let result;

  try {
    switch(action) {
      case 'getMethodes':
        result = getMethodes();
        break;
      case 'getUitgeverijen':
        result = getUitgeverijen();
        break;
      case 'getLog':
        result = getLog();
        break;
      case 'getAll':
        result = {
          methodes: getMethodes(),
          uitgeverijen: getUitgeverijen(),
          log: getLog()
        };
        break;
      default:
        result = { error: 'Onbekende actie: ' + action };
    }
  } catch(err) {
    result = { error: err.toString() };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Verwerk POST requests
 */
function doPost(e) {
  let result;

  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    switch(action) {
      case 'saveMethodes':
        result = saveMethodes(data.school, data.jaar, data.methodes, data.user);
        break;
      case 'addUitgeverij':
        result = addUitgeverij(data.methode, data.uitgeverij, data.user);
        break;
      case 'deleteMethode':
        result = deleteMethode(data.school, data.jaar, data.vak, data.niveau, data.methode, data.user);
        break;
      default:
        result = { error: 'Onbekende actie: ' + action };
    }
  } catch(err) {
    result = { error: err.toString() };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// SHEET HELPERS
// ============================================================================

/**
 * Haal of maak een sheet
 */
function getOrCreateSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers && headers.length > 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
  }

  return sheet;
}

/**
 * Lees alle data uit een sheet als array van objecten
 */
function readSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(name);

  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  const headers = data[0];
  const rows = data.slice(1);

  return rows.map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] || '';
    });
    return obj;
  });
}

// ============================================================================
// GET FUNCTIES
// ============================================================================

/**
 * Haal alle methodes op
 */
function getMethodes() {
  return readSheet(SHEET_NAMES.METHODES);
}

/**
 * Haal alle uitgeverijen op
 */
function getUitgeverijen() {
  return readSheet(SHEET_NAMES.UITGEVERIJEN);
}

/**
 * Haal log op (laatste 100)
 */
function getLog() {
  const all = readSheet(SHEET_NAMES.LOG);
  return all.slice(-100).reverse();
}

// ============================================================================
// WRITE FUNCTIES
// ============================================================================

/**
 * Sla methodes op voor een school/jaar combinatie
 * Verwacht: { vak: { niveau: [methodes] } }
 */
function saveMethodes(school, jaar, methodes, user) {
  const headers = ['School', 'Schooljaar', 'Vak', 'Niveau', 'Methode', 'GewijzigdDoor', 'GewijzigdOp'];
  const sheet = getOrCreateSheet(SHEET_NAMES.METHODES, headers);

  // Verwijder bestaande entries voor deze school/jaar
  const data = sheet.getDataRange().getValues();
  const rowsToDelete = [];

  for (let i = data.length - 1; i > 0; i--) {
    if (data[i][0] === school && data[i][1] === jaar) {
      rowsToDelete.push(i + 1);
    }
  }

  // Verwijder van onder naar boven
  rowsToDelete.forEach(row => {
    sheet.deleteRow(row);
  });

  // Voeg nieuwe entries toe
  const timestamp = new Date().toISOString();
  const newRows = [];

  const vakLabels = {
    'wiskunde': 'Wiskunde',
    'taal': 'Taal',
    'spelling': 'Spelling',
    'schrift': 'Schrift',
    'frans': 'Frans',
    'wero': 'Wero',
    'godsdienst': 'Godsdienst',
    'begrijpend_lezen': 'Begrijpend lezen',
    'sova': 'SOVA',
    'motoriek': 'Motoriek'
  };

  const niveauLabels = {
    'p': 'P',
    'k': 'K',
    'l1': 'L1',
    'l2_6': 'L2-6',
    'l2_3': 'L2-3',
    'l4_6': 'L4-6'
  };

  Object.keys(methodes).forEach(vak => {
    Object.keys(methodes[vak]).forEach(niveau => {
      const arr = methodes[vak][niveau] || [];
      arr.forEach(methode => {
        newRows.push([
          school,
          jaar,
          vakLabels[vak] || vak,
          niveauLabels[niveau] || niveau,
          methode,
          user,
          timestamp
        ]);
      });
    });
  });

  if (newRows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, headers.length)
      .setValues(newRows);
  }

  // Log de wijziging
  addLog(user, 'Methodes bijgewerkt', school + ' (' + jaar + ')', newRows.length + ' methodes');

  return { success: true, count: newRows.length };
}

/**
 * Voeg een nieuwe uitgeverij/methode combinatie toe
 */
function addUitgeverij(methode, uitgeverij, user) {
  const headers = ['Methode', 'Uitgeverij', 'ToegevoegdDoor', 'ToegevoegdOp'];
  const sheet = getOrCreateSheet(SHEET_NAMES.UITGEVERIJEN, headers);

  // Check of methode al bestaat
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === methode) {
      // Update bestaande
      sheet.getRange(i + 1, 2).setValue(uitgeverij);
      sheet.getRange(i + 1, 3).setValue(user);
      sheet.getRange(i + 1, 4).setValue(new Date().toISOString());
      addLog(user, 'Uitgeverij bijgewerkt', methode + ' -> ' + uitgeverij, '');
      return { success: true, updated: true };
    }
  }

  // Nieuwe toevoegen
  sheet.appendRow([methode, uitgeverij, user, new Date().toISOString()]);
  addLog(user, 'Methode toegevoegd', methode + ' (' + uitgeverij + ')', '');

  return { success: true, added: true };
}

/**
 * Verwijder een specifieke methode
 */
function deleteMethode(school, jaar, vak, niveau, methode, user) {
  const sheet = getOrCreateSheet(SHEET_NAMES.METHODES, []);
  const data = sheet.getDataRange().getValues();

  for (let i = data.length - 1; i > 0; i--) {
    if (data[i][0] === school &&
        data[i][1] === jaar &&
        data[i][2] === vak &&
        data[i][3] === niveau &&
        data[i][4] === methode) {
      sheet.deleteRow(i + 1);
      addLog(user, 'Methode verwijderd', methode + ' uit ' + school, vak + ' ' + niveau);
      return { success: true };
    }
  }

  return { success: false, error: 'Niet gevonden' };
}

/**
 * Voeg een log entry toe
 */
function addLog(user, action, details, extra) {
  const headers = ['Timestamp', 'User', 'Action', 'Details', 'Extra'];
  const sheet = getOrCreateSheet(SHEET_NAMES.LOG, headers);

  sheet.appendRow([
    new Date().toISOString(),
    user,
    action,
    details,
    extra || ''
  ]);
}

// ============================================================================
// INITIALISATIE (handmatig uitvoeren voor setup)
// ============================================================================

/**
 * Maak de benodigde sheets aan
 * Voer dit eenmalig uit via Apps Script editor
 */
function initializeSheets() {
  getOrCreateSheet(SHEET_NAMES.METHODES, ['School', 'Schooljaar', 'Vak', 'Niveau', 'Methode', 'GewijzigdDoor', 'GewijzigdOp']);
  getOrCreateSheet(SHEET_NAMES.UITGEVERIJEN, ['Methode', 'Uitgeverij', 'ToegevoegdDoor', 'ToegevoegdOp']);
  getOrCreateSheet(SHEET_NAMES.LOG, ['Timestamp', 'User', 'Action', 'Details', 'Extra']);

  // Voeg standaard uitgeverijen toe
  const uitgSheet = getOrCreateSheet(SHEET_NAMES.UITGEVERIJEN, []);
  const existing = readSheet(SHEET_NAMES.UITGEVERIJEN);

  if (existing.length === 0) {
    const defaults = [
      ["Reken Maar", "Van In"],
      ["Katapult", "Die Keure"],
      ["Wiskanjers", "Plantyn"],
      ["Kadet", "Die Keure"],
      ["Veilig leren lezen", "Zwijsen"],
      ["Talent", "Van In"],
      ["Confetti", "Die Keure"],
      ["Dag Jules", "Zwijsen"],
      ["Tijd voor taal accent", "Van In"],
      ["Talent+", "Van In"],
      ["Taalkanjers", "Plantyn"],
      ["Pistache", "Plantyn"],
      ["Verrekijker", "Die Keure"],
      ["Labo", "Die Keure"],
      ["Tekstduikers", "Van In"],
      ["Nieuwsbegrip", "CED-Groep"],
      ["Wouw", "Die Keure"],
      ["Wereldkanjers", "Plantyn"],
      ["Mikado", "Plantyn"],
      ["Ankers", "Van In"],
      ["Tuin van Heden", "Die Keure"],
      ["Sterren aan de hemel", "Plantyn"],
      ["Jezus leeft", "Licap"],
      ["TOV", "Licap"],
      ["Land in zicht", "Plantyn"],
      ["De Geluksvogels", "Lannoo"],
      ["Kat en Hond", "Zwijsen"],
      ["Loeloe en Pompom", "Zwijsen"],
      ["Cas en Lisa", "Die Keure"],
      ["Junglemaatjes", "Die Keure"],
      ["Cirkelen", "ABIMO"],
      ["Krullenbol", "Die Keure"],
      ["Karakter", "Van In"],
      ["Zouff", "Van In"],
      ["Ik lees met Hup", "Malmberg"],
      ["Kwartierlezen", "Malmberg"],
      ["Luna", "Die Keure"],
      ["Dag LoeLoe", "Zwijsen"],
      ["Dag Pompom", "Zwijsen"],
      ["Flonflon", "Zwijsen"],
      ["Rekensprong", "Die Keure"]
    ];

    const timestamp = new Date().toISOString();
    defaults.forEach(([m, u]) => {
      uitgSheet.appendRow([m, u, 'Systeem', timestamp]);
    });
  }

  SpreadsheetApp.getUi().alert('Sheets zijn aangemaakt en gevuld met standaard data!');
}
