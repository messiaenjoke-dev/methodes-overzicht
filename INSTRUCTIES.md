# Methodes Overzicht - Setup Instructies

Deze handleiding helpt je om de app te configureren zodat collega's data kunnen delen en synchroniseren.

## Overzicht

De app bestaat uit 3 onderdelen:
1. **Google Sheet** - Database voor alle methodes
2. **Google Apps Script** - API die de app verbindt met de Sheet
3. **Website** - De React app (gehost op GitHub Pages)

---

## Stap 1: Google Sheet voorbereiden

Je hebt al een Google Sheet:
`https://docs.google.com/spreadsheets/d/1cji411XT14BS95ulWMjOYg0VzxATdAYt_qGhctiiXf4`

Zorg dat je **bewerkrechten** hebt op deze sheet.

---

## Stap 2: Google Apps Script installeren

### 2.1 Open Apps Script
1. Open je Google Sheet
2. Ga naar **Extensies** > **Apps Script**
3. Er opent een nieuwe tab met de Apps Script editor

### 2.2 Code toevoegen
1. Verwijder alle bestaande code in het editor venster
2. Open het bestand `google-apps-script/Code.gs` uit deze repository
3. Kopieer de volledige inhoud
4. Plak het in de Apps Script editor
5. Klik op **Opslaan** (of Ctrl+S)

### 2.3 Sheets initialiseren
1. Selecteer in de dropdown bovenaan de functie `initializeSheets`
2. Klik op **Uitvoeren** (play knop)
3. Je krijgt een autorisatieverzoek - klik op **Toestaan**
4. Wacht tot je een melding krijgt dat de sheets zijn aangemaakt

### 2.4 Web App deployen
1. Klik op **Implementeren** > **Nieuwe implementatie**
2. Klik op het tandwiel bij "Type selecteren" en kies **Webapp**
3. Vul in:
   - **Beschrijving**: `Methodes API`
   - **Uitvoeren als**: `Ik`
   - **Wie heeft toegang**: `Iedereen`
4. Klik op **Implementeren**
5. **BELANGRIJK**: Kopieer de URL die getoond wordt (begint met `https://script.google.com/macros/...`)

---

## Stap 3: App configureren

### 3.1 Script URL invoeren
1. Open `app.jsx` in een teksteditor
2. Zoek regel 15:
   ```javascript
   const SCRIPT_URL = 'PLAK_HIER_JE_GOOGLE_APPS_SCRIPT_URL';
   ```
3. Vervang `PLAK_HIER_JE_GOOGLE_APPS_SCRIPT_URL` door de URL die je in stap 2.4 hebt gekopieerd
4. Sla het bestand op

---

## Stap 4: Website hosten op GitHub Pages

### 4.1 Repository maken (als je dat nog niet hebt)
1. Ga naar [github.com](https://github.com) en log in
2. Klik op **New repository**
3. Naam: `methodes-overzicht`
4. Zet op **Public**
5. Klik **Create repository**

### 4.2 Bestanden uploaden
1. In je nieuwe repository, klik op **uploading an existing file**
2. Sleep deze bestanden naar het upload venster:
   - `index.html`
   - `app.jsx`
3. Klik op **Commit changes**

### 4.3 GitHub Pages activeren
1. Ga naar **Settings** (tandwiel icoon)
2. Scroll naar **Pages** in het linker menu
3. Onder "Source", selecteer **main** branch
4. Klik **Save**
5. Wacht 1-2 minuten
6. Je site is nu live op: `https://[jouw-username].github.io/methodes-overzicht`

---

## Stap 5: Delen met collega's

Stuur je collega's:
1. De **website URL** (van GitHub Pages)
2. Het **wachtwoord** voor hun school

Dat is alles! Ze kunnen nu:
- Inloggen met hun school en wachtwoord
- Methodes bekijken van alle scholen
- Hun eigen methodes bewerken
- Wijzigingen worden automatisch gesynchroniseerd

---

## Problemen oplossen

### "Offline modus" melding
- Controleer of de SCRIPT_URL correct is ingevuld in `app.jsx`
- Controleer of de Web App is gedeployed met "Iedereen" toegang

### Wijzigingen worden niet opgeslagen
- Open de Google Sheet en controleer of er data in de "Methodes" sheet staat
- Controleer de Apps Script logs: Apps Script > Uitvoeringen

### CORS fout in browser console
- Zorg dat de Web App is gedeployed als "Uitvoeren als: Ik" en "Toegang: Iedereen"
- Maak een nieuwe deployment als je wijzigingen hebt gemaakt aan de code

---

## Updates doorvoeren

Als je de code wijzigt:

### Bij wijzigingen aan app.jsx of index.html:
1. Upload de nieuwe bestanden naar GitHub
2. GitHub Pages update automatisch binnen enkele minuten

### Bij wijzigingen aan Code.gs:
1. Open Apps Script
2. Pas de code aan
3. Klik op **Implementeren** > **Implementaties beheren**
4. Klik op het potlood icoon bij je actieve deployment
5. Wijzig de versie naar "Nieuwe versie"
6. Klik **Implementeren**

---

## Structuur van de Google Sheet

Na initialisatie heb je 3 sheets:

### Methodes
| School | Schooljaar | Vak | Niveau | Methode | GewijzigdDoor | GewijzigdOp |
|--------|------------|-----|--------|---------|---------------|-------------|

### Uitgeverijen
| Methode | Uitgeverij | ToegevoegdDoor | ToegevoegdOp |
|---------|------------|----------------|--------------|

### Log
| Timestamp | User | Action | Details | Extra |
|-----------|------|--------|---------|-------|

---

## Contact

Bij vragen of problemen, neem contact op met de beheerder van de scholengroep.
