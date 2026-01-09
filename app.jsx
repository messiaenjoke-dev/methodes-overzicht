// Google Apps Script URL voor synchronisatie
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwuZXP1wkPHfJ3fkJ3y4-7Dzm5lWgaoIEnoVuJlYsKZGVoK_TQLeA62AGcPsOmhYsWVmQ/exec';

// React hooks via global React object
const { useState, useMemo, useEffect } = React;

// Lucide icons helper
function createIcon(name) {
  return function Icon({ className = "w-5 h-5" }) {
    const ref = React.useRef(null);
    React.useEffect(() => {
      if (ref.current && lucide.icons[name]) {
        ref.current.innerHTML = '';
        const svg = lucide.icons[name].toSvg({ class: className });
        ref.current.innerHTML = svg;
      }
    }, [className]);
    return <span ref={ref} className="inline-flex" />;
  };
}

// Icon componenten
const BookOpen = createIcon('book-open');
const School = createIcon('school');
const X = createIcon('x');
const Calculator = createIcon('calculator');
const Languages = createIcon('languages');
const FileText = createIcon('file-text');
const Globe = createIcon('globe');
const Brain = createIcon('brain');
const Users = createIcon('users');
const Activity = createIcon('activity');
const Check = createIcon('check');
const AlertCircle = createIcon('alert-circle');
const Cloud = createIcon('cloud');
const CloudOff = createIcon('cloud-off');
const Plus = createIcon('plus');
const Lock = createIcon('lock');
const LogOut = createIcon('log-out');
const Download = createIcon('download');
const FileDown = createIcon('file-down');
const CheckCircle2 = createIcon('check-circle-2');
const XCircle = createIcon('x-circle');
const Eye = createIcon('eye');
const EyeOff = createIcon('eye-off');
const Flag = createIcon('flag');
const ArrowLeft = createIcon('arrow-left');
const Edit3 = createIcon('edit-3');
const Info = createIcon('info');
const History = createIcon('history');
const RefreshCw = createIcon('refresh-cw');
const Loader2 = createIcon('loader-2');

const schools = ["Ten Parke", "De Groeituin", "De Oefenschool", "De Leeuw", "De Tweesprong", "De Boomhut", "Wijnendale", "Driekoningen", "De Torretjes", "De Stapsteen", "'t Vlot", "De Fonkel", "De Revinze", "De Negensprong", "De Schatkist"];
const passwords = { "'t Vlot": "Piraat@Banaan2025", "De Boomhut": "KlimAap!Koekjes9", "De Fonkel": "Ster*Glitter88", "De Groeituin": "Wortels#Groeien7", "De Negensprong": ["Spring@Kikker11", "Huppel!Konijn22"], "De Oefenschool": "Turnen$Plezier3", "De Revinze": "Dansen@Disco99", "De Schatkist": "Goud*Diamant77", "De Stapsteen": "Wandel!Berg2025", "De Tweesprong": "Keuze@Links44", "Driekoningen": "Kroon!Geschenk6", "Ten Parke": "Picknic@Gras55", "Wijnendale": "Druif*Feest2025", "De Leeuw": "Brullen!Savanne8", "De Torretjes": "Torretje@Stip2025" };
const vakken = ['Wiskunde','Taal','Spelling','Schrift','Frans','Wero','Godsdienst','Begrijpend lezen','SOVA','Motoriek'];
const vakBases = ['wiskunde','taal','spelling','schrift','frans','wero','godsdienst','begrijpend_lezen','sova','motoriek'];
const niveauLabels = {p:'P',k:'K',l1:'L1',l2_6:'L2-6',l2_3:'L2-3',l4_6:'L4-6'};
const niveauFromLabel = {'P':'p','K':'k','L1':'l1','L2-6':'l2_6','L2-3':'l2_3','L4-6':'l4_6'};
const vakFromLabel = {'Wiskunde':'wiskunde','Taal':'taal','Spelling':'spelling','Schrift':'schrift','Frans':'frans','Wero':'wero','Godsdienst':'godsdienst','Begrijpend lezen':'begrijpend_lezen','SOVA':'sova','Motoriek':'motoriek'};
const getNiveaus = function(v) { return v==='schrift' ? ['l1','l2_3','l4_6'] : ['p','k','l1','l2_6']; };
const niveauOrder = {p:0,k:1,l1:2,l2_3:3,l4_6:4,l2_6:5};
const vakIcons = {Wiskunde:Calculator,Taal:Languages,Spelling:FileText,Schrift:Edit3,Frans:Flag,Wero:Globe,Godsdienst:BookOpen,'Begrijpend lezen':Brain,SOVA:Users,Motoriek:Activity};
const vakKleuren = {Wiskunde:['bg-blue-50','border-blue-200','text-blue-700','bg-blue-600'],Taal:['bg-emerald-50','border-emerald-200','text-emerald-700','bg-emerald-600'],Spelling:['bg-amber-50','border-amber-200','text-amber-700','bg-amber-500'],Schrift:['bg-teal-50','border-teal-200','text-teal-700','bg-teal-600'],Frans:['bg-pink-50','border-pink-200','text-pink-700','bg-pink-500'],Wero:['bg-purple-50','border-purple-200','text-purple-700','bg-purple-600'],Godsdienst:['bg-rose-50','border-rose-200','text-rose-700','bg-rose-500'],'Begrijpend lezen':['bg-cyan-50','border-cyan-200','text-cyan-700','bg-cyan-600'],SOVA:['bg-orange-50','border-orange-200','text-orange-700','bg-orange-500'],Motoriek:['bg-lime-50','border-lime-200','text-lime-700','bg-lime-600']};
const niveauKleuren = {p:['bg-pink-100','text-pink-700'],k:['bg-orange-100','text-orange-700'],l1:['bg-violet-100','text-violet-700'],l2_6:['bg-indigo-100','text-indigo-700'],l2_3:['bg-sky-100','text-sky-700'],l4_6:['bg-slate-100','text-slate-700']};
const uitgKleuren = {'Van In':['bg-blue-50','border-blue-200','text-blue-700','bg-blue-600'],'Die Keure':['bg-emerald-50','border-emerald-200','text-emerald-700','bg-emerald-600'],Plantyn:['bg-purple-50','border-purple-200','text-purple-700','bg-purple-600'],Zwijsen:['bg-orange-50','border-orange-200','text-orange-700','bg-orange-500'],Onbekend:['bg-slate-50','border-slate-200','text-slate-700','bg-slate-500']};
const defMU = {"Reken Maar":"Van In",Katapult:"Die Keure",Wiskanjers:"Plantyn",Kadet:"Die Keure","Veilig leren lezen":"Zwijsen",Talent:"Van In",Confetti:"Die Keure","Dag Jules":"Zwijsen","Tijd voor taal accent":"Van In","Talent+":"Van In",Taalkanjers:"Plantyn",Pistache:"Plantyn",Verrekijker:"Die Keure",Labo:"Die Keure",Tekstduikers:"Van In",Nieuwsbegrip:"CED-Groep",Wouw:"Die Keure",Wereldkanjers:"Plantyn",Mikado:"Plantyn",Ankers:"Van In","Tuin van Heden":"Die Keure","Sterren aan de hemel":"Plantyn","Jezus leeft":"Licap",TOV:"Licap","Land in zicht":"Plantyn","De Geluksvogels":"Lannoo","Kat en Hond":"Zwijsen","Loeloe en Pompom":"Zwijsen","Cas en Lisa":"Die Keure",Junglemaatjes:"Die Keure",Cirkelen:"ABIMO",Krullenbol:"Die Keure",Karakter:"Van In",Zouff:"Van In","Ik lees met Hup":"Malmberg",Kwartierlezen:"Malmberg",Luna:"Die Keure","Dag LoeLoe":"Zwijsen","Dag Pompom":"Zwijsen",Flonflon:"Zwijsen",Rekensprong:"Die Keure"};

function emptyV() {
  var o = {};
  vakBases.forEach(function(v) {
    o[v] = v==='schrift' ? {l1:[],l2_3:[],l4_6:[]} : {p:[],k:[],l1:[],l2_6:[]};
  });
  return o;
}

var initData = {
  "De Boomhut": Object.assign({}, emptyV(), {schrift:{l1:["Luna"],l2_3:["Luna"],l4_6:[]}}),
  "Ten Parke": {wiskunde:{p:[],k:[],l1:[],l2_6:["Reken Maar"]},taal:{p:["Dag Jules"],k:["Confetti"],l1:["Veilig leren lezen"],l2_6:["Talent"]},spelling:{p:[],k:[],l1:["Tijd voor taal accent"],l2_6:["Tijd voor taal accent"]},schrift:{l1:[],l2_3:[],l4_6:[]},frans:{p:[],k:[],l1:[],l2_6:["Zouff"]},wero:{p:[],k:[],l1:["Wouw"],l2_6:["Wouw"]},godsdienst:{p:["Sterren aan de hemel"],k:["Sterren aan de hemel"],l1:["Sterren aan de hemel"],l2_6:["Sterren aan de hemel"]},begrijpend_lezen:{p:[],k:[],l1:[],l2_6:["Talent+","Tekstduikers"]},sova:{p:[],k:["Kat en Hond"],l1:[],l2_6:["De Geluksvogels"]},motoriek:{p:[],k:["Krullenbol"],l1:["Karakter"],l2_6:["Karakter"]}},
  "De Leeuw": {wiskunde:{p:[],k:[],l1:[],l2_6:["Katapult"]},taal:{p:[],k:[],l1:[],l2_6:["Talent"]},spelling:{p:[],k:[],l1:[],l2_6:["Tijd voor taal accent"]},schrift:{l1:[],l2_3:[],l4_6:[]},frans:{p:[],k:[],l1:[],l2_6:[]},wero:{p:[],k:[],l1:[],l2_6:["Wereldkanjers"]},godsdienst:{p:[],k:[],l1:[],l2_6:["Sterren aan de hemel"]},begrijpend_lezen:{p:[],k:[],l1:[],l2_6:[]},sova:{p:[],k:[],l1:[],l2_6:[]},motoriek:{p:[],k:["Krullenbol"],l1:[],l2_6:[]}},
  "De Tweesprong": {wiskunde:{p:[],k:[],l1:[],l2_6:["Katapult"]},taal:{p:["Dag Jules"],k:["Pistache"],l1:["Taalkanjers"],l2_6:["Taalkanjers"]},spelling:{p:[],k:[],l1:["Taalkanjers"],l2_6:["Taalkanjers"]},schrift:{l1:[],l2_3:[],l4_6:[]},frans:{p:[],k:[],l1:[],l2_6:[]},wero:{p:[],k:[],l1:[],l2_6:["Wereldkanjers"]},godsdienst:{p:[],k:["TOV"],l1:["Jezus leeft","Sterren aan de hemel"],l2_6:["Jezus leeft","Sterren aan de hemel"]},begrijpend_lezen:{p:[],k:[],l1:[],l2_6:[]},sova:{p:[],k:[],l1:[],l2_6:[]},motoriek:{p:[],k:["Krullenbol"],l1:["Karakter"],l2_6:["Karakter"]}},
  "'t Vlot": {wiskunde:{p:[],k:[],l1:[],l2_6:["Katapult","Wiskanjers"]},taal:{p:[],k:[],l1:["Veilig leren lezen"],l2_6:["Taalkanjers"]},spelling:{p:[],k:[],l1:["Taalkanjers"],l2_6:["Taalkanjers"]},schrift:{l1:[],l2_3:[],l4_6:[]},frans:{p:[],k:[],l1:[],l2_6:[]},wero:{p:[],k:[],l1:[],l2_6:["Wereldkanjers"]},godsdienst:{p:[],k:[],l1:[],l2_6:["TOV"]},begrijpend_lezen:{p:[],k:[],l1:[],l2_6:[]},sova:{p:[],k:[],l1:[],l2_6:[]},motoriek:{p:[],k:["Krullenbol"],l1:[],l2_6:["Karakter"]}},
  "De Schatkist": {wiskunde:{p:[],k:[],l1:[],l2_6:["Kadet"]},taal:{p:[],k:[],l1:["Ik lees met Hup"],l2_6:["Verrekijker","Labo","Kwartierlezen"]},spelling:{p:[],k:[],l1:[],l2_6:["Verrekijker","Labo"]},schrift:{l1:[],l2_3:[],l4_6:[]},frans:{p:[],k:[],l1:[],l2_6:[]},wero:{p:[],k:[],l1:["Wereldkanjers","Labo"],l2_6:["Wereldkanjers"]},godsdienst:{p:[],k:["Sterren aan de hemel"],l1:[],l2_6:["Sterren aan de hemel"]},begrijpend_lezen:{p:[],k:[],l1:[],l2_6:["Verrekijker","Tekstduikers"]},sova:{p:[],k:["Cas en Lisa"],l1:["Cirkelen"],l2_6:["Cirkelen"]},motoriek:{p:[],k:["Krullenbol"],l1:["Karakter"],l2_6:["Karakter"]}}
};

function createData() {
  var d = Object.assign({}, initData);
  schools.forEach(function(s) { if(!d[s]) d[s] = emptyV(); });
  return d;
}

function createEmpty() {
  var d = {};
  schools.forEach(function(s) { d[s] = emptyV(); });
  return d;
}

// Converteer Google Sheets data naar app formaat
function convertSheetsData(methodes) {
  var data = {'2025-2026': createEmpty(), '2026-2027': createEmpty()};
  if(!methodes || !Array.isArray(methodes)) return data;

  methodes.forEach(function(row) {
    var school = row.School;
    var jaar = row.Schooljaar;
    var vak = vakFromLabel[row.Vak] || row.Vak;
    var niveau = niveauFromLabel[row.Niveau] || row.Niveau;
    var methode = row.Methode;

    if(school && jaar && vak && niveau && methode && data[jaar] && data[jaar][school]) {
      if(!data[jaar][school][vak]) data[jaar][school][vak] = {};
      if(!data[jaar][school][vak][niveau]) data[jaar][school][vak][niveau] = [];
      if(!data[jaar][school][vak][niveau].includes(methode)) {
        data[jaar][school][vak][niveau].push(methode);
      }
    }
  });

  return data;
}

// Converteer uitgeverijen data naar app formaat
function convertUitgeverijen(uitg) {
  var mu = Object.assign({}, defMU);
  if(!uitg || !Array.isArray(uitg)) return mu;

  uitg.forEach(function(row) {
    if(row.Methode && row.Uitgeverij) {
      mu[row.Methode] = row.Uitgeverij;
    }
  });

  return mu;
}

function Login(props) {
  const [sel, setSel] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');

  function go() {
    if(!sel || !pw) { setErr('Vul alles in'); return; }
    var c = passwords[sel];
    if(Array.isArray(c) ? c.includes(pw) : c === pw) { props.onLogin(sel); }
    else { setErr('Onjuist wachtwoord'); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-xl mb-6">
            <BookOpen className="w-10 h-10 text-blue-600"/>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Methodes Overzicht</h1>
          <p className="text-blue-100">Scholengroep Sint-Rembert</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600"/>Aanmelden
          </h2>
          <select value={sel} onChange={function(e){setSel(e.target.value);setErr('');}} className="w-full p-3 border rounded-xl">
            <option value="">Kies school...</option>
            {schools.map(function(s){ return <option key={s} value={s}>{s}</option>; })}
          </select>
          <div className="relative">
            <input type={show?'text':'password'} value={pw} onChange={function(e){setPw(e.target.value);setErr('');}} onKeyDown={function(e){if(e.key==='Enter')go();}} placeholder="Wachtwoord..." className="w-full p-3 pr-12 border rounded-xl"/>
            <button onClick={function(){setShow(!show);}} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {show ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
            </button>
          </div>
          {err && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4"/>{err}</div>}
          <button onClick={go} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2">
            <Lock className="w-4 h-4"/>Inloggen
          </button>
        </div>
      </div>
    </div>
  );
}

function Card(props) {
  var m = props.m, n = props.n, v = props.v, u = props.u, cnt = props.cnt, mu = props.mu, showCnt = props.showCnt;
  var nkl = niveauKleuren[n] || ['bg-gray-100','text-gray-700'];
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex justify-between mb-2">
        <h4 className="font-semibold text-slate-800">{m}</h4>
        <span className={nkl[0]+' '+nkl[1]+' text-xs px-2 py-0.5 rounded-full'}>{niveauLabels[n]}</span>
      </div>
      {v && <p className="text-xs text-slate-600 mb-1">{v}</p>}
      <p className="text-xs text-slate-500 mb-2">{u || mu[m] || '?'}</p>
      {showCnt && <div className="text-sm text-slate-500 flex items-center gap-1"><School className="w-3.5 h-3.5"/>{cnt} school{cnt!==1?'en':''}</div>}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [school, setSchool] = useState(null);
  const [edit, setEdit] = useState(false);
  const [view, setView] = useState('vak');
  const [niv, setNiv] = useState('alle');
  const [jaar, setJaar] = useState('2025-2026');
  const [toast, setToast] = useState(null);
  const [data, setData] = useState({'2025-2026': createData(), '2026-2027': createEmpty()});
  const [mu, setMu] = useState(defMU);
  const [modal, setModal] = useState(null);
  const [hist, setHist] = useState([]);
  const [online, setOnline] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addNaam, setAddNaam] = useState('');
  const [addUitg, setAddUitg] = useState('');
  const [addErr, setAddErr] = useState('');
  const [form, setForm] = useState(null);
  const [formChanged, setFormChanged] = useState(false);

  var cur = data[jaar];
  var mList = useMemo(function(){ return Object.keys(mu).sort(); }, [mu]);
  var uList = useMemo(function(){ return [...new Set(Object.values(mu))].sort(); }, [mu]);

  // Laad data van Google Sheets
  async function loadFromCloud() {
    try {
      setSyncing(true);
      var response = await fetch(SCRIPT_URL + '?action=getAll');
      var result = await response.json();

      if(result.error) {
        throw new Error(result.error);
      }

      // Converteer en sla op
      var newData = convertSheetsData(result.methodes);
      var newMu = convertUitgeverijen(result.uitgeverijen);
      var newHist = (result.log || []).map(function(l, i) {
        return {
          id: i,
          timestamp: l.Timestamp,
          school: l.User,
          action: l.Action,
          details: l.Details
        };
      }).reverse().slice(0, 50);

      // Merge met initData als er geen cloud data is
      schools.forEach(function(s) {
        if(!newData['2025-2026'][s] || Object.keys(newData['2025-2026'][s]).every(function(k) {
          return Object.keys(newData['2025-2026'][s][k]).every(function(n) {
            return newData['2025-2026'][s][k][n].length === 0;
          });
        })) {
          if(initData[s]) {
            newData['2025-2026'][s] = JSON.parse(JSON.stringify(initData[s]));
          }
        }
      });

      setData(newData);
      setMu(newMu);
      setHist(newHist);
      setOnline(true);

      return true;
    } catch(e) {
      console.error('Fout bij laden van cloud:', e);
      setOnline(false);
      return false;
    } finally {
      setSyncing(false);
      setLoading(false);
    }
  }

  // Sla methodes op naar Google Sheets
  async function saveToCloud(schoolName, jaarStr, methodes) {
    try {
      setSyncing(true);
      var response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'saveMethodes',
          school: schoolName,
          jaar: jaarStr,
          methodes: methodes,
          user: user
        })
      });

      var result = await response.json();
      if(result.error) {
        throw new Error(result.error);
      }

      setOnline(true);
      return true;
    } catch(e) {
      console.error('Fout bij opslaan naar cloud:', e);
      setOnline(false);
      return false;
    } finally {
      setSyncing(false);
    }
  }

  // Voeg uitgeverij toe aan Google Sheets
  async function addUitgeverijToCloud(methode, uitgeverij) {
    try {
      setSyncing(true);
      var response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'addUitgeverij',
          methode: methode,
          uitgeverij: uitgeverij,
          user: user
        })
      });

      var result = await response.json();
      if(result.error) {
        throw new Error(result.error);
      }

      setOnline(true);
      return true;
    } catch(e) {
      console.error('Fout bij toevoegen uitgeverij:', e);
      setOnline(false);
      return false;
    } finally {
      setSyncing(false);
    }
  }

  // Laad data bij opstarten
  useEffect(function(){
    loadFromCloud();
  }, []);

  useEffect(function(){
    if(toast) {
      var t = setTimeout(function(){ setToast(null); }, 3000);
      return function(){ clearTimeout(t); };
    }
  }, [toast]);

  useEffect(function(){
    if(edit && school) {
      setForm(JSON.parse(JSON.stringify(cur[school] || emptyV())));
      setFormChanged(false);
    }
  }, [edit, school, cur]);

  var mCnt = useMemo(function(){
    var c = {};
    schools.forEach(function(s){
      vakBases.forEach(function(vb){
        getNiveaus(vb).forEach(function(n){
          (cur[s] && cur[s][vb] && cur[s][vb][n] ? cur[s][vb][n] : []).forEach(function(m){
            c[vb+'|'+m] = (c[vb+'|'+m]||0) + 1;
          });
        });
      });
    });
    return c;
  }, [cur]);

  var perVak = useMemo(function(){
    var r = {};
    var ts = school ? [school] : schools;
    vakken.forEach(function(v, i){
      var map = {};
      var vn = getNiveaus(vakBases[i]);
      var fn = niv==='alle' ? vn : (vn.includes(niv) ? [niv] : []);
      ts.forEach(function(s){
        fn.forEach(function(n){
          (cur[s] && cur[s][vakBases[i]] && cur[s][vakBases[i]][n] ? cur[s][vakBases[i]][n] : []).forEach(function(m){
            var k = m+'|'+n;
            if(!map[k]) map[k] = {m:m, n:n, s:[]};
            if(!map[k].s.includes(s)) map[k].s.push(s);
          });
        });
      });
      r[v] = map;
    });
    return r;
  }, [cur, niv, school]);

  var perUitg = useMemo(function(){
    var map = {};
    var ts = school ? [school] : schools;
    ts.forEach(function(s){
      vakBases.forEach(function(vb, i){
        var vn = getNiveaus(vb);
        var fn = niv==='alle' ? vn : (vn.includes(niv) ? [niv] : []);
        fn.forEach(function(n){
          (cur[s] && cur[s][vb] && cur[s][vb][n] ? cur[s][vb][n] : []).forEach(function(m){
            var u = mu[m] || 'Onbekend';
            if(!map[u]) map[u] = {};
            var k = m+'|'+vakken[i]+'|'+n;
            if(!map[u][k]) map[u][k] = {m:m, v:vakken[i], n:n, s:[]};
            if(!map[u][k].s.includes(s)) map[u][k].s.push(s);
          });
        });
      });
    });
    return map;
  }, [cur, niv, school, mu]);

  // Handmatige sync
  async function handleSync() {
    var success = await loadFromCloud();
    if(success) {
      setToast({m:'Gesynchroniseerd!',t:'s'});
    } else {
      setToast({m:'Synchronisatie mislukt',t:'e'});
    }
  }

  // Loading screen
  if(loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Data laden...</p>
        </div>
      </div>
    );
  }

  if(!user) return <Login onLogin={setUser}/>;

  function addMethode(vb, n, val) {
    if(!val || !form) return;
    var arr = form[vb] && form[vb][n] ? form[vb][n] : [];
    if(arr.includes(val)) return;
    var newForm = JSON.parse(JSON.stringify(form));
    if(!newForm[vb]) newForm[vb] = {};
    if(!newForm[vb][n]) newForm[vb][n] = [];
    newForm[vb][n].push(val);
    setForm(newForm);
    setFormChanged(true);
  }

  function rmMethode(vb, n, val) {
    if(!form) return;
    var newForm = JSON.parse(JSON.stringify(form));
    if(newForm[vb] && newForm[vb][n]) {
      newForm[vb][n] = newForm[vb][n].filter(function(x){ return x !== val; });
    }
    setForm(newForm);
    setFormChanged(true);
  }

  async function saveForm() {
    // Update lokale state
    var newData = JSON.parse(JSON.stringify(data));
    newData[jaar][school] = form;
    setData(newData);

    // Sla op naar cloud
    var success = await saveToCloud(school, jaar, form);

    if(success) {
      setFormChanged(false);
      setToast({m:'Opgeslagen!',t:'s'});
      // Herlaad data van cloud
      await loadFromCloud();
    } else {
      setToast({m:'Opslaan mislukt',t:'e'});
    }
  }

  async function addNewMethode() {
    var tn = addNaam.trim();
    if(!tn) { setAddErr('Vul naam in'); return; }
    if(!addUitg) { setAddErr('Kies uitgeverij'); return; }
    if(mu[tn]) { setAddErr('Bestaat al'); return; }

    // Update lokale state
    var newMu = Object.assign({}, mu);
    newMu[tn] = addUitg;
    setMu(newMu);

    // Sla op naar cloud
    var success = await addUitgeverijToCloud(tn, addUitg);

    if(success) {
      setModal(null);
      setAddNaam('');
      setAddUitg('');
      setAddErr('');
      setToast({m:'Toegevoegd!',t:'s'});
    } else {
      setToast({m:'Toevoegen mislukt',t:'e'});
    }
  }

  function downloadCSV(all) {
    var ts = all ? schools : [user];
    var csv = 'School;Vak;Niveau;Methode;Uitgeverij\n';
    ts.forEach(function(s){
      vakBases.forEach(function(vb, i){
        getNiveaus(vb).forEach(function(n){
          (cur[s] && cur[s][vb] && cur[s][vb][n] ? cur[s][vb][n] : []).forEach(function(m){
            csv += '"'+s+'";"'+vakken[i]+'";"'+niveauLabels[n]+'";"'+m+'";"'+(mu[m]||'')+'"\n';
          });
        });
      });
    });
    var blob = new Blob(['\ufeff'+csv], {type:'text/csv'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'methodes-'+jaar+'.csv';
    a.click();
    setModal(null);
    setToast({m:'Gedownload!',t:'s'});
  }

  var viewButtons = school
    ? [['vak','Per vak'],['uitgeverij','Per uitgeverij'],['methode','Per methode']]
    : [['vak','Per vak'],['cards','Per school'],['uitgeverij','Per uitgeverij'],['methode','Per methode'],['table','Tabel']];

  var nivButtons = ['alle','p','k','l1','l2_3','l4_6','l2_6'];

  return (
    <div>
      {toast && (
        <div className={(toast.t==='s'?'bg-green-600':'bg-red-600')+' fixed top-4 right-4 z-50 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3'}>
          {toast.t==='s' ? <CheckCircle2 className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
          {toast.m}
          <button onClick={function(){setToast(null);}} className="ml-2"><X className="w-4 h-4"/></button>
        </div>
      )}

      {modal==='add' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={function(){setModal(null);}}>
          <div className="absolute inset-0 bg-black/50"/>
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6" onClick={function(e){e.stopPropagation();}}>
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2"><Plus className="w-5 h-5 text-green-600"/>Nieuwe methode</h2>
              <button onClick={function(){setModal(null);}} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5"/></button>
            </div>
            <div className="space-y-4">
              <input value={addNaam} onChange={function(e){setAddNaam(e.target.value);setAddErr('');}} placeholder="Naam methode" className="w-full p-3 border rounded-xl"/>
              <select value={addUitg} onChange={function(e){setAddUitg(e.target.value);setAddErr('');}} className="w-full p-3 border rounded-xl">
                <option value="">Kies uitgeverij...</option>
                {uList.map(function(u){ return <option key={u} value={u}>{u}</option>; })}
              </select>
              {addErr && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4"/>{addErr}</div>}
              <button onClick={addNewMethode} disabled={syncing} className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                {syncing ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> : <Plus className="w-5 h-5"/>}
                Toevoegen
              </button>
            </div>
          </div>
        </div>
      )}

      {modal==='exp' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={function(){setModal(null);}}>
          <div className="absolute inset-0 bg-black/50"/>
          <div className="relative w-full max-w-md bg-white rounded-2xl" onClick={function(e){e.stopPropagation();}}>
            <div className="flex justify-between p-6 border-b">
              <h3 className="text-lg font-bold">Exporteren</h3>
              <button onClick={function(){setModal(null);}} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <button onClick={function(){downloadCSV(true);}} className="w-full border-2 rounded-xl p-5 text-left hover:bg-blue-50 flex items-center gap-4">
                <School className="w-8 h-8 text-blue-600"/><div><h4 className="font-bold">Alle scholen</h4></div>
              </button>
              <button onClick={function(){downloadCSV(false);}} className="w-full border-2 rounded-xl p-5 text-left hover:bg-green-50 flex items-center gap-4">
                <FileDown className="w-8 h-8 text-green-600"/><div><h4 className="font-bold">Alleen {user}</h4></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {modal==='hist' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={function(){setModal(null);}}>
          <div className="absolute inset-0 bg-black/50"/>
          <div className="relative w-full max-w-lg bg-white rounded-2xl max-h-[80vh] flex flex-col" onClick={function(e){e.stopPropagation();}}>
            <div className="flex justify-between p-6 border-b">
              <h3 className="text-lg font-bold flex items-center gap-2"><History className="w-5 h-5 text-blue-600"/>Geschiedenis</h3>
              <button onClick={function(){setModal(null);}} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5"/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {hist.length===0 ? <p className="text-center py-12 text-slate-500">Nog geen wijzigingen</p> : (
                <div className="space-y-3">
                  {hist.map(function(h, idx){
                    return (
                      <div key={h.id || idx} className="bg-slate-50 rounded-xl p-4">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{h.school}</span>
                          <span className="text-xs text-slate-500">{h.timestamp ? new Date(h.timestamp).toLocaleDateString('nl-BE') : ''}</span>
                        </div>
                        <p className="text-sm">{h.action}</p>
                        {h.details && <p className="text-xs text-slate-500">{h.details}</p>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-4">
              {school && <button onClick={function(){setSchool(null);setEdit(false);}} className="p-2 hover:bg-slate-100 rounded-lg"><ArrowLeft className="w-5 h-5"/></button>}
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><BookOpen className="w-5 h-5 text-blue-600"/></div>
              <div>
                <h1 className="text-xl font-bold">{school || 'Methodes'}</h1>
                {school && <p className="text-sm text-slate-500">Sint-Rembert</p>}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={handleSync} disabled={syncing} className={'p-2 hover:bg-slate-100 rounded-lg '+(syncing?'animate-spin':'')} title="Synchroniseren">
                <RefreshCw className="w-5 h-5 text-slate-500"/>
              </button>
              <button onClick={function(){setModal('hist');}} className="p-2 hover:bg-slate-100 rounded-lg"><History className="w-5 h-5 text-slate-500"/></button>
              <button onClick={function(){setModal('exp');}} className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"><Download className="w-4 h-4"/>CSV</button>
              <div className={'px-2 py-1 rounded text-xs flex items-center gap-1 '+(online?'bg-green-100 text-green-700':'bg-red-100 text-red-700')}>
                {online ? <Cloud className="w-3 h-3"/> : <CloudOff className="w-3 h-3"/>}
                {online ? 'Online' : 'Offline'}
              </div>
              <div className="flex border rounded-xl p-1">
                {['2025-2026','2026-2027'].map(function(j){
                  return <button key={j} onClick={function(){setJaar(j);}} className={'px-3 py-1.5 rounded-lg text-sm font-bold '+(jaar===j?'bg-indigo-600 text-white':'text-slate-500')}>{j}</button>;
                })}
              </div>
              <button onClick={function(){setSchool(user);setEdit(false);}} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{user}</button>
              <button onClick={function(){setUser(null);setSchool(null);setEdit(false);}} className="p-2 hover:bg-red-50 rounded-lg text-slate-500"><LogOut className="w-4 h-4"/></button>
            </div>
          </div>

          {!edit && (
            <div className="border-t bg-slate-50/50">
              <div className="max-w-7xl mx-auto px-6 py-2 flex flex-wrap gap-2 justify-between">
                <div className="flex gap-1 bg-white border rounded-lg p-1">
                  {viewButtons.map(function(item){
                    return <button key={item[0]} onClick={function(){setView(item[0]);}} className={'px-3 py-1.5 rounded text-sm '+(view===item[0]?'bg-blue-600 text-white':'text-slate-600')}>{item[1]}</button>;
                  })}
                </div>
                <div className="flex gap-1 bg-white border rounded-lg p-1">
                  {nivButtons.map(function(n){
                    return <button key={n} onClick={function(){setNiv(n);}} className={'px-3 py-1.5 rounded text-sm '+(niv===n?'bg-slate-800 text-white':'text-slate-600')}>{n==='alle'?'Alle':niveauLabels[n]}</button>;
                  })}
                </div>
                {school===user && <button onClick={function(){setEdit(true);}} className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm flex items-center gap-2"><Edit3 className="w-4 h-4"/>Bewerken</button>}
              </div>
            </div>
          )}

          {edit && (
            <div className="border-t bg-green-50">
              <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between">
                <span className="font-medium text-green-700 flex items-center gap-2"><Edit3 className="w-5 h-5"/>Bewerken: {school}</span>
                <button onClick={function(){setEdit(false);}} className="px-4 py-1.5 bg-white border rounded-lg text-sm">Klaar</button>
              </div>
            </div>
          )}
        </header>

        <main className="max-w-7xl mx-auto px-6 py-6">
          {edit && form ? (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-3">
                <Info className="w-6 h-6 text-blue-600"/>
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">Methode niet in de lijst?</h3>
                  <button onClick={function(){setModal('add');}} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2"><Plus className="w-4 h-4"/>Nieuwe methode</button>
                </div>
              </div>
              {vakken.map(function(v, i){
                var vb = vakBases[i];
                var vn = getNiveaus(vb);
                var kl = vakKleuren[v];
                var Icon = vakIcons[v];
                return (
                  <div key={v} className={kl[0]+' '+kl[1]+' border rounded-2xl'}>
                    <div className="p-4 border-b border-white/50 flex items-center gap-3">
                      <div className={'w-10 h-10 '+kl[3]+' rounded-xl flex items-center justify-center'}><Icon className="w-5 h-5 text-white"/></div>
                      <h3 className={'text-lg font-bold '+kl[2]}>{v}</h3>
                    </div>
                    <div className={'p-4 grid gap-4 sm:grid-cols-2 '+(vn.length===3?'lg:grid-cols-3':'lg:grid-cols-4')}>
                      {vn.map(function(n){
                        var nkl = niveauKleuren[n] || ['bg-gray-100','text-gray-700'];
                        var arr = form[vb] && form[vb][n] ? form[vb][n] : [];
                        return (
                          <div key={n} className="bg-white rounded-xl p-4">
                            <span className={nkl[0]+' '+nkl[1]+' inline-block text-xs px-2 py-0.5 rounded-full mb-3'}>{niveauLabels[n]}</span>
                            <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
                              {arr.map(function(m){
                                return (
                                  <span key={m} className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full text-sm">
                                    {m}
                                    <button onClick={function(){rmMethode(vb,n,m);}} className="hover:text-red-500"><X className="w-3 h-3"/></button>
                                  </span>
                                );
                              })}
                            </div>
                            <select onChange={function(e){addMethode(vb,n,e.target.value);e.target.value='';}} defaultValue="" className="w-full p-2 border rounded-lg text-sm">
                              <option value="">+ Toevoegen...</option>
                              {mList.filter(function(m){return !arr.includes(m);}).map(function(m){return <option key={m} value={m}>{m}</option>;})}
                            </select>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {formChanged && (
                <div className="sticky bottom-4">
                  <button onClick={saveForm} disabled={syncing} className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
                    {syncing ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> : <Check className="w-5 h-5"/>}
                    Opslaan
                  </button>
                </div>
              )}
            </div>
          ) : view==='vak' ? (
            <div>
              {vakken.map(function(v, i){
                var vn = getNiveaus(vakBases[i]);
                var items = Object.values(perVak[v]||{}).filter(function(x){return vn.includes(x.n);}).sort(function(a,b){return niveauOrder[a.n]-niveauOrder[b.n]||a.m.localeCompare(b.m);});
                var kl = vakKleuren[v];
                var Icon = vakIcons[v];
                return (
                  <div key={v} className={kl[0]+' '+kl[1]+' border rounded-2xl mb-6'}>
                    <div className="p-5 border-b border-white/50 flex items-center gap-3">
                      <div className={'w-10 h-10 '+kl[3]+' rounded-xl flex items-center justify-center'}><Icon className="w-5 h-5 text-white"/></div>
                      <div><h3 className={'text-lg font-bold '+kl[2]}>{v}</h3><p className="text-sm text-slate-500">{items.length} methode(s)</p></div>
                    </div>
                    <div className="p-5">
                      {items.length===0 ? <p className="text-slate-500 text-center py-4">Geen methodes</p> : (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {items.map(function(x){return <Card key={x.m+'|'+x.n} m={x.m} n={x.n} cnt={x.s.length} mu={mu} showCnt={!school}/>;} )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : view==='cards' ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {schools.map(function(s){
                var tot = 0;
                vakBases.forEach(function(vb){
                  var fn = niv==='alle' ? getNiveaus(vb) : (getNiveaus(vb).includes(niv)?[niv]:[]);
                  fn.forEach(function(n){ tot += (cur[s]&&cur[s][vb]&&cur[s][vb][n]?cur[s][vb][n]:[]).length; });
                });
                return (
                  <div key={s} className="bg-white rounded-2xl border hover:shadow-lg transition-all">
                    <button onClick={function(){setSchool(s);}} className="w-full text-left p-5 flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><School className="w-5 h-5 text-blue-600"/></div>
                      <div><h3 className="font-bold">{s}</h3><p className="text-sm text-slate-500">{tot} methode(s)</p></div>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : view==='table' ? (
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="px-4 py-3 text-left text-sm font-bold sticky left-0 bg-slate-100 border-b-2">School</th>
                      {vakken.map(function(v){return <th key={v} className="px-3 py-3 text-left text-sm font-bold border-b-2 whitespace-nowrap">{v}</th>;})}
                    </tr>
                  </thead>
                  <tbody>
                    {schools.map(function(s,idx){
                      return (
                        <tr key={s} className={(idx%2?'bg-slate-50/50':'bg-white')+' hover:bg-blue-50/50'}>
                          <td onClick={function(){setSchool(s);}} className={'px-4 py-3 font-semibold sticky left-0 cursor-pointer border-r '+(idx%2?'bg-slate-50':'bg-white')}>
                            <div className="flex items-center gap-2"><School className="w-4 h-4 text-blue-500"/>{s}</div>
                          </td>
                          {vakBases.map(function(vb){
                            var fn = niv==='alle' ? getNiveaus(vb) : (getNiveaus(vb).includes(niv)?[niv]:[]);
                            var msArr = [];
                            fn.forEach(function(n){ (cur[s]&&cur[s][vb]&&cur[s][vb][n]?cur[s][vb][n]:[]).forEach(function(m){if(!msArr.includes(m))msArr.push(m);}); });
                            return (
                              <td key={vb} className="px-3 py-2">
                                {msArr.length>0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {msArr.slice(0,2).map(function(m){
                                      var cnt = mCnt[vb+'|'+m]||0;
                                      return <span key={m} className="inline-flex items-center text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{m}<span className="bg-blue-600 text-white px-1 rounded-full ml-1">{cnt}</span></span>;
                                    })}
                                    {msArr.length>2 && <span className="text-xs px-2 py-1 bg-slate-200 rounded-full">+{msArr.length-2}</span>}
                                  </div>
                                ) : <span className="text-slate-300">—</span>}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : view==='uitgeverij' ? (
            <div>
              {Object.keys(perUitg).sort().map(function(u){
                var items = Object.values(perUitg[u]).sort(function(a,b){return niveauOrder[a.n]-niveauOrder[b.n]||a.m.localeCompare(b.m);});
                var kl = uitgKleuren[u] || uitgKleuren.Onbekend;
                return (
                  <div key={u} className={kl[0]+' '+kl[1]+' border rounded-2xl mb-6'}>
                    <div className="p-5 border-b border-white/50 flex items-center gap-3">
                      <div className={'w-10 h-10 '+kl[3]+' rounded-xl flex items-center justify-center'}><BookOpen className="w-5 h-5 text-white"/></div>
                      <div><h3 className={'text-lg font-bold '+kl[2]}>{u}</h3><p className="text-sm text-slate-500">{items.length} methode(s)</p></div>
                    </div>
                    <div className="p-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map(function(x){return <Card key={x.m+'|'+x.v+'|'+x.n} m={x.m} n={x.n} v={x.v} u={u} cnt={x.s.length} mu={mu} showCnt={!school}/>;})}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : view==='methode' ? (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button onClick={function(){setModal('add');}} className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium flex items-center gap-2"><Plus className="w-4 h-4"/>Nieuwe methode</button>
              </div>
              <div className="bg-white rounded-2xl border">
                <div className="p-5 border-b flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center"><BookOpen className="w-5 h-5 text-indigo-600"/></div>
                  <div><h3 className="text-lg font-bold">Alle methodes (A-Z)</h3><p className="text-sm text-slate-500">{mList.length} methode(s)</p></div>
                </div>
                <div className="p-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {mList.map(function(m){
                    return (
                      <div key={m} className="bg-slate-50 border rounded-xl p-4">
                        <h4 className="font-semibold mb-1">{m}</h4>
                        <p className="text-xs text-slate-500">{mu[m]}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}

// Render de app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
