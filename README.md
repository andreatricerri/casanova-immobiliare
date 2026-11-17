# CasaNova Immobiliare — sito dimostrativo

Sito multipagina per un'agenzia immobiliare **fittizia** di Milano, realizzato come progetto portfolio.
Agenzia, annunci, prezzi, recensioni e professionisti sono inventati.

HTML5, CSS custom (Grid e Flexbox) e JavaScript vanilla. Nessun framework, nessuna dipendenza da installare.

## Struttura

```
casanova-immobiliare/
├── index.html          Home con ricerca rapida
├── immobili.html       Catalogo con filtri, ordinamento e paginazione
├── immobile.html       Scheda immobile (immobile.html?id=CN-101)
├── preferiti.html      Immobili salvati
├── vendi.html          Pagina proprietari + richiesta valutazione
├── affitta.html        Chi cerca casa / chi vuole affittare
├── servizi.html  agenzia.html  team.html  faq.html
├── contatti.html       Recapiti demo + modulo (precompilabile da una scheda)
├── privacy.html  404.html
├── netlify.toml        Configurazione per la pubblicazione su Netlify
├── css/  base.css · components.css · pages.css
├── js/   data.js · favorites.js · main.js · search.js · gallery.js · forms.js · property-detail.js
└── assets/images/      Illustrazioni SVG locali (immobili, planimetrie, quartieri, team, agenzia)
```

Ordine degli script (tutti `defer`): `data.js` → `favorites.js` → `main.js` → script della pagina.

## Come aprire il sito

**Consigliato — server locale** (preferiti condivisi tra pagine e URL dei filtri aggiornati):

```bash
cd casanova-immobiliare
python3 -m http.server 8000
# poi apri http://localhost:8000
```

**Su smartphone e tablet della stessa rete Wi-Fi**: avvia il server come sopra, trova l'indirizzo IP del computer
(es. `192.168.1.20`) e apri `http://192.168.1.20:8000` da iPhone, Android o iPad.

**Doppio clic su `index.html` (file://)**: il sito funziona, con alcune limitazioni dipendenti dal browser:
- Firefox tratta ogni file come origine separata e Safari può bloccare `localStorage`: i preferiti potrebbero non passare da una pagina all'altra (la pagina Preferiti mostra un avviso e la lista resta in memoria).
- Alcuni browser bloccano l'aggiornamento dell'URL dei filtri: la ricerca funziona comunque, ma il link non si aggiorna.

**Pubblicazione**: carica la cartella su GitHub e collegala a Netlify (nessun comando di build, cartella di pubblicazione = radice). `netlify.toml` imposta la pagina 404 e alcune intestazioni di sicurezza di base.

## Modificare colori e font

In `css/base.css`, blocco `:root`: le variabili `--bg-*`, `--text-*`, `--brand-*`, `--accent-gold*` controllano tutta la palette.
I font sono in `--font-heading` (Manrope) e `--font-body` (Inter); il caricamento da Google Fonts è nel `<head>` di ogni pagina.
Per non usare risorse esterne, elimina le righe `fonts.googleapis.com` / `fonts.gstatic.com`: il sito userà i font di sistema.

## Aggiungere un immobile

In `js/data.js`, dentro `properties`, copia un oggetto esistente e modifica:
- `id` univoco (es. `CN-122`) e `slug`;
- `contract`: `"vendita"` (usa `price`, `rent: null`) oppure `"affitto"` (usa `rent` mensile, `price: null`);
- `fees: { amount, period }` per le spese (0 = nessuna);
- caratteristiche (`elevator`, `balcony`, `terrace`, `garden`, `box`, `furnished`…): le dotazioni mostrate nella scheda derivano da questi valori, quindi un elemento impostato a `false` non comparirà mai tra quelle presenti;
- `gallery: gallery("CN-122", ["living", "kitchen", ...])` e `plan: plan("bilocale")`;
- `agent` con l'id di un agente; `featured` / `prestige` per le sezioni della home.

Comuni e quartieri dei filtri vengono ricavati automaticamente dagli annunci.

## Sostituire le foto

La funzione `gallery()` in `data.js` genera i percorsi `assets/images/immobili/<id>-<n>-<scena>.svg`.
Per usare fotografie reali puoi: salvare le foto con gli stessi nomi (cambiando l'estensione nella funzione), oppure scrivere direttamente l'array `gallery` con oggetti `{ src, label, width, height }`.
Altre immagini (hero, quartieri, agenzia, mappa, fallback) sono in `SITE_DATA.images` e `SITE_DATA.neighborhoods`.
Le foto devono avere licenza d'uso verificata; non associare nomi fittizi a fotografie di persone reali.

## Agenti e recapiti

- Agenti: `SITE_DATA.agents` (nome, ruolo, zone, lingue, presentazione, avatar).
- Recapiti e orari: `SITE_DATA.agency` e `SITE_DATA.hours`; footer e pagina contatti si aggiornano da qui.
- WhatsApp: oggi apre solo una finestra dimostrativa. Le istruzioni per un futuro collegamento autorizzato sono commentate in `js/main.js` (`initChatDemo`).

## Preferiti

`js/favorites.js` salva in `localStorage` (chiave `casanova:preferiti:v1`) **solo gli ID** degli immobili.
Se `localStorage` è bloccato o non disponibile, usa una lista in memoria valida finché la pagina resta aperta.
Il contatore nell'header e i pulsanti cuore si aggiornano su tutte le pagine e tra schede aperte.

## Azioni simulate

- Tutti i moduli (visita, contatti, valutazione, affitto): validazione nel browser, nessun invio di rete, nessun salvataggio; alla conferma il modulo viene svuotato e compare il messaggio di simulazione.
- Nessuna stima automatica di valore, nessuna prenotazione reale, nessun account, nessun pagamento.
- Mappe illustrative, posizione approssimativa e fittizia; nessuna geolocalizzazione.
- Recensioni etichettate come dimostrative.

## Risorse esterne

Solo Google Fonts (Manrope e Inter). Immagini, icone e mappe sono locali. Nessun analytics, tracciamento o widget di terze parti.

## Test eseguiti

**Eseguiti in Chrome headless (motore Chromium)** con server locale:
- tutte le 13 pagine caricate senza errori JavaScript;
- un solo `h1` per pagina; nessuno scroll orizzontale alle larghezze 320, 375, 390, 430, 768, 820, 1024, 1280, 1440 px (viewport simulate, con touch attivo sotto i 1024 px);
- ricerca dalla home → catalogo con filtri applicati e parametri URL corretti;
- filtri combinati, errore su intervallo min > max, chip rimovibili, ordinamento, paginazione, indietro/avanti del browser, stato "nessun risultato";
- preferiti: aggiunta dalla card senza aprire la scheda, contatore, pagina preferiti, svuotamento con conferma;
- scheda immobile: ID valido, ID non valido, ID mancante; galleria con frecce, lightbox con tastiera ed Escape e ritorno del focus;
- modulo visita: errori sui campi obbligatori e messaggio finale di simulazione; precompilazione della pagina contatti da un annuncio;
- FAQ: ricerca, filtro per categoria, stato vuoto; sottomenu da tastiera (Invio / Escape);
- menu mobile a pannello e pannello filtri mobile (verifica visiva tramite screenshot).

**Non ancora verificati su dispositivi fisici** — da fare prima di considerarlo definitivo:
- Safari su iPhone (safe area, barra inferiore della scheda, tastiera virtuale aperta sui moduli, campi data);
- Chrome su Android reale;
- iPad in verticale e orizzontale con touch;
- Firefox, Edge e Safari desktop;
- lettori di schermo (VoiceOver, TalkBack, NVDA).

## Prima di un utilizzo reale

Servirebbero: dati, foto e recapiti verificati; un sistema di invio dei moduli con informativa privacy redatta da un professionista; eventuali dati obbligatori dell'agenzia; valutazione dei servizi esterni (font, mappe, chat); test su dispositivi reali e verifica di accessibilità.
