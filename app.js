const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwFBiAcE4BnmoSCJVJdz3uTpPUQr7meNvo3Ej07UVgzYnH-9NzudbWRsX8l_rsqo62TRA/exec';
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1cji411XT14BS95ulWMjOYg0VzxATdAYt_qGhctiiXf4';

const schools = ["Ten Parke", "De Groeituin", "De Oefenschool", "De Leeuw", "De Tweesprong", "De Boomhut", "Wijnendale", "Driekoningen", "De Torretjes", "De Stapsteen", "'t Vlot", "De Fonkel", "De Revinze", "De Negensprong", "De Schatkist"];
const passwords = { "'t Vlot": "Piraat@Banaan2025", "De Boomhut": "KlimAap!Koekjes9", "De Fonkel": "Ster*Glitter88", "De Groeituin": "Wortels#Groeien7", "De Negensprong": ["Spring@Kikker11", "Huppel!Konijn22"], "De Oefenschool": "Turnen$Plezier3", "De Revinze": "Dansen@Disco99", "De Schatkist": "Goud*Diamant77", "De Stapsteen": "Wandel!Berg2025", "De Tweesprong": "Keuze@Links44", "Driekoningen": "Kroon!Geschenk6", "Ten Parke": "Picknic@Gras55", "Wijnendale": "Druif*Feest2025", "De Leeuw": "Brullen!Savanne8", "De Torretjes": "Torretje@Stip2025" };
const vakken = ['Wiskunde','Taal','Spelling','Schrift','Frans','Wero','Godsdienst','Begrijpend lezen','SOVA','Motoriek'];
const niveauOrder = {'P':0,'K':1,'L1':2,'L2-3':3,'L4-6':4,'L2-6':5};
const nivButtons = ['alle','P','K','L1','L2-3','L4-6','L2-6'];

async function fetchData(action) {
  const res = await fetch(`${SCRIPT_URL}?action=${action}`);
  const data = await res.json();
  if (!Array.isArray(data) || data.length < 2) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i] || ''; });
    return obj;
  });
}

let user = null, school = null, view = 'vak', niv = 'alle', jaar = '2025-2026';
let loading = true, error = null, methodes = [], uitgeverijen = {}, lastSync = null;

async function loadData() {
  loading = true; error = null; render();
  try {
    const [mData, uData] = await Promise.all([fetchData('getMethodes'), fetchData('getUitgeverijen')]);
    methodes = mData;
    uData.forEach(r => { if (r.Methode) uitgeverijen[r.Methode] = r.Uitgeverij; });
    lastSync = new Date();
    loading = false;
  } catch (e) {
    error = 'Kon data niet laden: ' + e.message;
    loading = false;
  }
  render();
}

function getFiltered() {
  return methodes.filter(r => {
    if (r.Schooljaar !== jaar) return false;
    if (school && r.School !== school) return false;
    if (niv !== 'alle' && r.Niveau !== niv) return false;
    return true;
  });
}

function login(s) { user = s; render(); }
function logout() { user = null; school = null; render(); }
function setSchool(s) { school = s; render(); }
function setView(v) { view = v; render(); }
function setNiv(n) { niv = n; render(); }
function setJaar(j) { jaar = j; render(); }

function render() {
  const root = document.getElementById('root');
  
  if (!user) {
    root.innerHTML = renderLogin();
    return;
  }
  
  if (loading) {
    root.innerHTML = `<div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div class="text-center"><div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-slate-600">Data laden uit Google Sheets...</p></div></div>`;
    return;
  }
  
  if (error) {
    root.innerHTML = `<div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
      <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><span class="text-red-500 text-2xl">!</span></div>
      <h2 class="text-xl font-bold text-slate-800 mb-2">Fout bij laden</h2>
      <p class="text-slate-600 mb-6">${error}</p>
      <button onclick="loadData()" class="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium">Opnieuw proberen</button></div></div>`;
    return;
  }
  
  root.innerHTML = renderApp();
}

function renderLogin() {
  return `<div class="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-xl mb-6">
          <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Methodes Overzicht</h1>
        <p class="text-blue-100">Scholengroep Sint-Rembert</p>
      </div>
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2">🔒 Aanmelden</h2>
        <select id="schoolSelect" class="w-full p-3 border rounded-xl mb-4">
          <option value="">Kies school...</option>
          ${schools.map(s => `<option value="${s}">${s}</option>`).join('')}
        </select>
        <input type="password" id="pwInput" placeholder="Wachtwoord..." class="w-full p-3 border rounded-xl mb-4" onkeydown="if(event.key==='Enter')tryLogin()">
        <div id="loginError" class="hidden bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm mb-4"></div>
        <button onclick="tryLogin()" class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl">Inloggen</button>
      </div>
    </div>
  </div>`;
}

function tryLogin() {
  const sel = document.getElementById('schoolSelect').value;
  const pw = document.getElementById('pwInput').value;
  const errDiv = document.getElementById('loginError');
  
  if (!sel || !pw) {
    errDiv.textContent = 'Vul alles in';
    errDiv.classList.remove('hidden');
    return;
  }
  
  const correct = passwords[sel];
  const valid = Array.isArray(correct) ? correct.includes(pw) : correct === pw;
  
  if (valid) {
    login(sel);
    loadData();
  } else {
    errDiv.textContent = 'Onjuist wachtwoord';
    errDiv.classList.remove('hidden');
  }
}

function renderApp() {
  const filtered = getFiltered();
  const viewButtons = school 
    ? [['vak','Per vak'],['uitgeverij','Per uitgeverij'],['methode','Per methode']]
    : [['vak','Per vak'],['cards','Per school'],['uitgeverij','Per uitgeverij'],['methode','Per methode'],['table','Tabel']];

  let content = '';
  if (view === 'vak') content = renderPerVak(filtered);
  else if (view === 'cards') content = renderCards(filtered);
  else if (view === 'table') content = renderTable(filtered);
  else if (view === 'uitgeverij') content = renderPerUitgeverij(filtered);
  else if (view === 'methode') content = renderPerMethode();

  return `<div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <header class="bg-white border-b sticky top-0 z-40 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between flex-wrap gap-2">
        <div class="flex items-center gap-4">
          ${school ? `<button onclick="setSchool(null)" class="p-2 hover:bg-slate-100 rounded-lg">←</button>` : ''}
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">📚</div>
          <div><h1 class="text-xl font-bold">${school || 'Methodes'}</h1>${school ? '<p class="text-sm text-slate-500">Sint-Rembert</p>' : ''}</div>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <button onclick="loadData()" class="p-2 hover:bg-slate-100 rounded-lg" title="Vernieuwen">🔄</button>
          <div class="px-2 py-1 rounded text-xs bg-green-100 text-green-700">☁️ ${lastSync ? lastSync.toLocaleTimeString('nl-BE',{hour:'2-digit',minute:'2-digit'}) : ''}</div>
          <div class="flex border rounded-xl p-1">
            ${['2025-2026','2026-2027'].map(j => `<button onclick="setJaar('${j}')" class="px-3 py-1.5 rounded-lg text-sm font-bold ${jaar===j?'bg-indigo-600 text-white':'text-slate-500'}">${j}</button>`).join('')}
          </div>
          <button onclick="setSchool(user)" class="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">${user}</button>
          <button onclick="logout()" class="p-2 hover:bg-red-50 rounded-lg">🚪</button>
        </div>
      </div>
      <div class="border-t bg-slate-50/50">
        <div class="max-w-7xl mx-auto px-6 py-2 flex flex-wrap gap-2 justify-between">
          <div class="flex gap-1 bg-white border rounded-lg p-1">
            ${viewButtons.map(([v,label]) => `<button onclick="setView('${v}')" class="px-3 py-1.5 rounded text-sm ${view===v?'bg-blue-600 text-white':'text-slate-600'}">${label}</button>`).join('')}
          </div>
          <div class="flex gap-1 bg-white border rounded-lg p-1">
            ${nivButtons.map(n => `<button onclick="setNiv('${n}')" class="px-3 py-1.5 rounded text-sm ${niv===n?'bg-slate-800 text-white':'text-slate-600'}">${n==='alle'?'Alle':n}</button>`).join('')}
          </div>
        </div>
      </div>
    </header>
    <main class="max-w-7xl mx-auto px-6 py-6">
      <div class="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
        <p class="text-blue-800 text-sm"><strong>Data uit Google Sheets</strong> — <a href="${SHEET_URL}" target="_blank" class="underline">Open Sheet</a> om te bewerken, klik dan op 🔄</p>
      </div>
      ${content}
    </main>
  </div>`;
}

function renderPerVak(filtered) {
  const vakStyles = {
    Wiskunde: {bg:'bg-blue-50',border:'border-blue-200',icon:'bg-blue-600',title:'text-blue-700'},
    Taal: {bg:'bg-emerald-50',border:'border-emerald-200',icon:'bg-emerald-600',title:'text-emerald-700'},
    Spelling: {bg:'bg-amber-50',border:'border-amber-200',icon:'bg-amber-600',title:'text-amber-700'},
    Schrift: {bg:'bg-teal-50',border:'border-teal-200',icon:'bg-teal-600',title:'text-teal-700'},
    Frans: {bg:'bg-pink-50',border:'border-pink-200',icon:'bg-pink-600',title:'text-pink-700'},
    Wero: {bg:'bg-purple-50',border:'border-purple-200',icon:'bg-purple-600',title:'text-purple-700'},
    Godsdienst: {bg:'bg-rose-50',border:'border-rose-200',icon:'bg-rose-600',title:'text-rose-700'},
    'Begrijpend lezen': {bg:'bg-cyan-50',border:'border-cyan-200',icon:'bg-cyan-600',title:'text-cyan-700'},
    SOVA: {bg:'bg-orange-50',border:'border-orange-200',icon:'bg-orange-600',title:'text-orange-700'},
    Motoriek: {bg:'bg-lime-50',border:'border-lime-200',icon:'bg-lime-600',title:'text-lime-700'}
  };
  const defaultStyle = {bg:'bg-slate-50',border:'border-slate-200',icon:'bg-slate-600',title:'text-slate-700'};

  return vakken.map(vak => {
    const items = {};
    filtered.filter(r => r.Vak === vak).forEach(r => {
      const k = `${r.Methode}|${r.Niveau}`;
      if (!items[k]) items[k] = {m:r.Methode, n:r.Niveau, s:[]};
      if (!items[k].s.includes(r.School)) items[k].s.push(r.School);
    });
    const list = Object.values(items).sort((a,b) => (niveauOrder[a.n]||0)-(niveauOrder[b.n]||0) || a.m.localeCompare(b.m));
    const style = vakStyles[vak] || defaultStyle;

    return `<div class="${style.bg} border ${style.border} rounded-2xl mb-6">
      <div class="p-5 border-b border-white/50 flex items-center gap-3">
        <div class="w-10 h-10 ${style.icon} rounded-xl flex items-center justify-center text-white font-bold">${vak[0]}</div>
        <div><h3 class="text-lg font-bold ${style.title}">${vak}</h3><p class="text-sm text-slate-500">${list.length} methode(s)</p></div>
      </div>
      <div class="p-5">
        ${list.length === 0 ? '<p class="text-slate-500 text-center py-4">Geen methodes</p>' :
        `<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">${list.map(x => renderCard(x.m, x.n, null, uitgeverijen[x.m], x.s.length, !school)).join('')}</div>`}
      </div>
    </div>`;
  }).join('');
}

function renderCards(filtered) {
  return `<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    ${schools.map(s => {
      const tot = filtered.filter(r => r.School === s).length;
      return `<div class="bg-white rounded-2xl border hover:shadow-lg transition-all">
        <button onclick="setSchool('${s}')" class="w-full text-left p-5 flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">🏫</div>
          <div><h3 class="font-bold">${s}</h3><p class="text-sm text-slate-500">${tot} methode(s)</p></div>
        </button>
      </div>`;
    }).join('')}
  </div>`;
}

function renderTable(filtered) {
  return `<div class="bg-white rounded-2xl border shadow-sm overflow-hidden"><div class="overflow-x-auto">
    <table class="w-full">
      <thead><tr class="bg-slate-100">
        <th class="px-4 py-3 text-left text-sm font-bold sticky left-0 bg-slate-100">School</th>
        ${vakken.map(v => `<th class="px-3 py-3 text-left text-sm font-bold whitespace-nowrap">${v}</th>`).join('')}
      </tr></thead>
      <tbody>
        ${schools.map((s, idx) => `<tr class="${idx%2?'bg-slate-50/50':'bg-white'} hover:bg-blue-50/50">
          <td onclick="setSchool('${s}')" class="px-4 py-3 font-semibold sticky left-0 cursor-pointer ${idx%2?'bg-slate-50':'bg-white'}">🏫 ${s}</td>
          ${vakken.map(v => {
            const ms = [...new Set(filtered.filter(r => r.School === s && r.Vak === v).map(r => r.Methode))];
            return `<td class="px-3 py-2">${ms.length > 0 ? ms.slice(0,2).map(m => `<span class="inline-block text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full mr-1">${m}</span>`).join('') + (ms.length > 2 ? `<span class="text-xs text-slate-400">+${ms.length-2}</span>` : '') : '<span class="text-slate-300">—</span>'}</td>`;
          }).join('')}
        </tr>`).join('')}
      </tbody>
    </table>
  </div></div>`;
}

function renderPerUitgeverij(filtered) {
  const map = {};
  filtered.forEach(r => {
    const u = uitgeverijen[r.Methode] || 'Onbekend';
    if (!map[u]) map[u] = {};
    const k = `${r.Methode}|${r.Vak}|${r.Niveau}`;
    if (!map[u][k]) map[u][k] = {m:r.Methode, v:r.Vak, n:r.Niveau, s:[]};
    if (!map[u][k].s.includes(r.School)) map[u][k].s.push(r.School);
  });
  
  return Object.keys(map).sort().map(u => {
    const items = Object.values(map[u]).sort((a,b) => (niveauOrder[a.n]||0)-(niveauOrder[b.n]||0) || a.m.localeCompare(b.m));
    return `<div class="bg-slate-50 border border-slate-200 rounded-2xl mb-6">
      <div class="p-5 border-b flex items-center gap-3">
        <div class="w-10 h-10 bg-slate-600 rounded-xl flex items-center justify-center text-white">📖</div>
        <div><h3 class="text-lg font-bold text-slate-700">${u}</h3><p class="text-sm text-slate-500">${items.length} methode(s)</p></div>
      </div>
      <div class="p-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        ${items.map(x => renderCard(x.m, x.n, x.v, u, x.s.length, !school)).join('')}
      </div>
    </div>`;
  }).join('');
}

function renderPerMethode() {
  const list = Object.keys(uitgeverijen).sort();
  return `<div class="bg-white rounded-2xl border">
    <div class="p-5 border-b flex items-center gap-3">
      <div class="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">📚</div>
      <div><h3 class="text-lg font-bold">Alle methodes (A-Z)</h3><p class="text-sm text-slate-500">${list.length} methode(s)</p></div>
    </div>
    <div class="p-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      ${list.map(m => `<div class="bg-slate-50 border rounded-xl p-4"><h4 class="font-semibold mb-1">${m}</h4><p class="text-xs text-slate-500">${uitgeverijen[m]}</p></div>`).join('')}
    </div>
  </div>`;
}

function renderCard(methode, niveau, vak, uitgeverij, aantal, showAantal) {
  const nivStyles = {
    'P': 'bg-pink-100 text-pink-700',
    'K': 'bg-orange-100 text-orange-700',
    'L1': 'bg-violet-100 text-violet-700',
    'L2-6': 'bg-indigo-100 text-indigo-700',
    'L2-3': 'bg-sky-100 text-sky-700',
    'L4-6': 'bg-slate-100 text-slate-700'
  };
  const nivStyle = nivStyles[niveau] || 'bg-gray-100 text-gray-700';
  return `<div class="bg-white rounded-xl p-4 shadow-sm">
    <div class="flex justify-between mb-2">
      <h4 class="font-semibold text-slate-800">${methode}</h4>
      <span class="${nivStyle} text-xs px-2 py-0.5 rounded-full">${niveau}</span>
    </div>
    ${vak ? `<p class="text-xs text-slate-600 mb-1">${vak}</p>` : ''}
    ${uitgeverij ? `<p class="text-xs text-slate-500 mb-2">${uitgeverij}</p>` : ''}
    ${showAantal ? `<div class="text-sm text-slate-500">🏫 ${aantal} school${aantal !== 1 ? 'en' : ''}</div>` : ''}
  </div>`;
}

// Start
render();
