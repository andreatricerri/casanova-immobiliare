/* =========================================================================
   CasaNova Immobiliare — dati centralizzati (demo)
   -------------------------------------------------------------------------
   Tutti i contenuti modificabili del sito si trovano in SITE_DATA.
   Agenzia, annunci, prezzi e professionisti sono FITTIZI.
   Per aggiungere un immobile copia un oggetto dentro "properties",
   assegna un id nuovo e univoco e aggiorna i campi (vedi README.md).
   ========================================================================= */

(function () {
  "use strict";

  var IMG = "assets/images/";

  /* Etichette delle scene usate nelle gallerie (servono anche per l'alt). */
  var SCENES = {
    living: "Soggiorno",
    kitchen: "Cucina",
    bedroom: "Camera da letto",
    bathroom: "Bagno",
    terrace: "Terrazzo",
    facade: "Esterno dell'edificio",
    villa: "Esterno della casa",
    garden: "Giardino",
    loft: "Open space",
    studio: "Locale unico con zona notte",
    detail: "Dettaglio degli interni"
  };

  /* Le immagini "detail" sono verticali, tutte le altre orizzontali 3:2. */
  function gallery(id, scenes) {
    return scenes.map(function (scene, i) {
      var portrait = scene === "detail";
      return {
        src: IMG + "immobili/" + id.toLowerCase() + "-" + (i + 1) + "-" + scene + ".svg",
        scene: scene,
        label: SCENES[scene] || "Immagine",
        width: portrait ? 800 : 1200,
        height: portrait ? 1100 : 800
      };
    });
  }

  function plan(type) {
    return IMG + "planimetrie/" + type + ".svg";
  }

  var SITE_DATA = {
    agency: {
      name: "CasaNova Immobiliare",
      tagline: "Case da vivere, progetti da realizzare.",
      area: "Milano e dintorni",
      address: "Via dell'Esempio 12, Milano",
      addressNote: "Indirizzo di fantasia, a solo scopo dimostrativo",
      email: "info@casanova-immobiliare.example",
      phone: "02 0000 0000",
      phoneNote: "Numero dimostrativo, non attivo",
      demoNote: "Progetto dimostrativo per portfolio. Agenzia, annunci, prezzi e professionisti sono fittizi.",
      /* WhatsApp: lasciare vuoto finché non esiste un numero reale e autorizzato. */
      whatsappNumber: ""
    },

    hours: [
      { days: "Lunedì – Venerdì", time: "9:30 – 13:00 · 14:30 – 19:00" },
      { days: "Sabato", time: "10:00 – 13:00, su appuntamento" },
      { days: "Domenica", time: "Chiuso" }
    ],

    images: {
      fallback: IMG + "fallback.svg",
      hero: IMG + "hero.svg",
      heroVendi: IMG + "vendi-hero.svg",
      heroAffitta: IMG + "affitta-hero.svg",
      map: IMG + "mappa.svg",
      agency: [
        { src: IMG + "agenzia/agenzia-1.svg", alt: "Illustrazione della sala d'accoglienza dell'agenzia" },
        { src: IMG + "agenzia/agenzia-2.svg", alt: "Illustrazione della sala riunioni con tavolo e schermo" },
        { src: IMG + "agenzia/agenzia-3.svg", alt: "Illustrazione della vetrina dell'agenzia su strada" }
      ]
    },

    neighborhoods: [
      { name: "Isola", comune: "Milano", query: "Isola", image: IMG + "quartieri/isola.svg", text: "Vie vivaci, nuovi spazi verdi e collegamenti rapidi con il centro." },
      { name: "Porta Romana", comune: "Milano", query: "Porta Romana", image: IMG + "quartieri/porta-romana.svg", text: "Palazzi d'epoca, servizi di quartiere e un ritmo residenziale." },
      { name: "Navigli", comune: "Milano", query: "Navigli", image: IMG + "quartieri/navigli.svg", text: "Case di ringhiera, cortili e la vita lungo l'acqua." },
      { name: "Città Studi", comune: "Milano", query: "Città Studi", image: IMG + "quartieri/citta-studi.svg", text: "Zona universitaria, parchi e soluzioni adatte a studenti e famiglie." },
      { name: "Brera", comune: "Milano", query: "Brera", image: IMG + "quartieri/brera.svg", text: "Il cuore storico tra gallerie, cortili nascosti e piani nobili." },
      { name: "Monza", comune: "Monza", query: "Monza", image: IMG + "quartieri/monza.svg", text: "Centro raccolto, il grande parco e case con più spazio esterno." }
    ],

    agents: [
      {
        id: "giulia-ferri",
        name: "Giulia Ferri",
        role: "Consulente vendite residenziali",
        zones: ["Brera", "Porta Venezia", "Isola"],
        languages: ["Italiano", "Inglese"],
        bio: "Segue compravendite nelle zone centrali e nord di Milano. Ama preparare visite ben organizzate e spiegare con calma ogni passaggio a chi compra la prima casa.",
        avatar: IMG + "team/giulia-ferri.svg"
      },
      {
        id: "marco-bellini",
        name: "Marco Bellini",
        role: "Consulente locazioni",
        zones: ["Città Studi", "Lambrate", "NoLo", "Bicocca"],
        languages: ["Italiano", "Inglese", "Spagnolo"],
        bio: "Si occupa di affitti per studenti, giovani professionisti e famiglie. Aiuta i proprietari a presentare l'immobile in modo chiaro e a organizzare le visite.",
        avatar: IMG + "team/marco-bellini.svg"
      },
      {
        id: "sara-colombo",
        name: "Sara Colombo",
        role: "Consulente selezione Prestigio",
        zones: ["CityLife", "Porta Romana", "Navigli"],
        languages: ["Italiano", "Inglese", "Francese"],
        bio: "Cura gli immobili della selezione Prestigio, dalla presentazione fotografica alle visite riservate, con attenzione alla discrezione dei proprietari.",
        avatar: IMG + "team/sara-colombo.svg"
      },
      {
        id: "luca-moretti",
        name: "Luca Moretti",
        role: "Consulente Milano e hinterland",
        zones: ["Monza", "Sesto San Giovanni", "Segrate", "Cernusco sul Naviglio", "Rho"],
        languages: ["Italiano", "Inglese", "Tedesco"],
        bio: "Conosce bene l'area metropolitana: ville, villette e appartamenti con spazi esterni per chi cerca più metri quadri a pochi minuti dalla città.",
        avatar: IMG + "team/luca-moretti.svg"
      }
    ],

    services: [
      { id: "vendita", icon: "key", title: "Vendita", short: "Accompagniamo il proprietario dalla prima visita conoscitiva fino al rogito.", text: "Analizziamo con il proprietario le caratteristiche dell'immobile, definiamo insieme la strategia di presentazione e seguiamo trattativa e passaggi successivi, coordinandoci con il notaio scelto dalle parti." },
      { id: "locazione", icon: "door", title: "Locazione", short: "Supporto a chi affitta e a chi cerca casa, con informazioni chiare sul percorso.", text: "Prepariamo l'annuncio, organizziamo le visite e raccogliamo le candidature, lasciando sempre al proprietario la scelta finale. A chi cerca casa forniamo informazioni trasparenti su canone, spese e tempi." },
      { id: "valutazione", icon: "chart", title: "Valutazione su appuntamento", short: "Un sopralluogo per capire l'immobile prima di parlare di prezzo.", text: "La valutazione si basa su un sopralluogo, sullo stato dell'immobile e sul confronto con proposte simili della zona. Non forniamo stime automatiche: ogni casa merita di essere vista." },
      { id: "foto", icon: "camera", title: "Presentazione fotografica", short: "Fotografie curate, planimetria leggibile e testi onesti.", text: "Organizziamo lo shooting fotografico, prepariamo una planimetria illustrativa e scriviamo descrizioni che raccontano l'immobile senza esagerazioni." },
      { id: "visite", icon: "calendar", title: "Organizzazione visite", short: "Visite programmate, con informazioni preparate in anticipo.", text: "Coordiniamo agenda e disponibilità di proprietario e visitatori, prepariamo le informazioni essenziali e raccogliamo i riscontri dopo ogni visita." },
      { id: "documenti", icon: "file", title: "Supporto documentale", short: "Ti indichiamo quali documenti servono e a chi rivolgerti.", text: "Ti aiutiamo a capire quali documenti preparare e, quando serve, ti mettiamo in contatto con professionisti competenti come notai, tecnici o consulenti. Le valutazioni legali e fiscali restano di loro competenza." }
    ],

    steps: [
      { title: "Ci conosciamo", text: "Una prima conversazione per capire cosa cerchi o cosa desideri fare con il tuo immobile." },
      { title: "Definiamo il percorso", text: "Concordiamo tempi, priorità e modalità di comunicazione, senza promesse irrealistiche." },
      { title: "Visite e confronto", text: "Organizziamo le visite e ti teniamo aggiornato con riscontri concreti." },
      { title: "Fino alla firma", text: "Ti accompagniamo nella trattativa e nei passaggi con i professionisti coinvolti." }
    ],

    reviews: [
      { text: "Cercavamo la prima casa e avevamo molti dubbi. Ci hanno spiegato ogni passaggio senza fretta e le visite erano sempre ben preparate.", author: "Cliente fittizio", context: "Acquisto di un bilocale a Isola" },
      { text: "Ho affittato il mio appartamento per la prima volta: annuncio chiaro, visite organizzate e aggiornamenti regolari.", author: "Cliente fittizio", context: "Locazione di un trilocale a Monza" },
      { text: "Mi è piaciuta la trasparenza sulla valutazione: niente cifre buttate lì, ma un ragionamento basato sul sopralluogo.", author: "Cliente fittizio", context: "Vendita di un quadrilocale a Sesto San Giovanni" }
    ],

    faq: [
      { cat: "acquisto", q: "Da dove conviene partire per acquistare casa?", a: "In genere è utile chiarire prima il budget complessivo, includendo eventuali spese accessorie, e le priorità irrinunciabili: zona, metratura, piano, spazi esterni. Se pensi a un mutuo, può essere utile confrontarti presto con la tua banca o con un consulente del credito." },
      { cat: "acquisto", q: "Quali costi oltre al prezzo devo considerare?", a: "Oltre al prezzo possono esserci, ad esempio, imposte, onorario del notaio, eventuali costi del mutuo e compenso dell'agenzia. Gli importi dipendono dalla situazione specifica: per un quadro preciso rivolgiti al notaio o a un consulente fiscale." },
      { cat: "acquisto", q: "Cosa significa che un immobile è \"in trattativa\"?", a: "Significa che è in corso una negoziazione con un potenziale acquirente o inquilino. Puoi comunque chiedere informazioni: ti diremo se è possibile programmare una visita." },
      { cat: "vendita", q: "Come si svolge la valutazione del mio immobile?", a: "Fissiamo un sopralluogo, osserviamo stato, esposizione, contesto e documenti disponibili, e confrontiamo l'immobile con proposte simili della zona. Al termine condividiamo un ragionamento motivato, non una cifra generata automaticamente." },
      { cat: "vendita", q: "Quanto tempo serve per vendere casa?", a: "Dipende da molti fattori: zona, prezzo richiesto, stato dell'immobile e andamento del mercato. Preferiamo non promettere tempi garantiti, ma definire insieme un piano realistico e aggiornarlo con i riscontri delle visite." },
      { cat: "vendita", q: "Quali documenti servono per mettere in vendita un immobile?", a: "Di solito servono atto di provenienza, planimetria catastale e attestato di prestazione energetica, ma l'elenco può variare. Ti indichiamo cosa preparare e, se necessario, ti mettiamo in contatto con un tecnico o con il notaio." },
      { cat: "affitto", q: "Quali informazioni chiedete a chi vuole prendere in affitto?", a: "Durante il primo contatto bastano nome, recapito e qualche informazione sulle tue esigenze. Eventuali documenti vengono richiesti solo nelle fasi successive e sempre con indicazioni chiare sul loro utilizzo." },
      { cat: "affitto", q: "Le spese condominiali sono incluse nel canone?", a: "Negli annunci indichiamo canone e spese separatamente. Cosa sia incluso dipende dal singolo contratto: verifica sempre le condizioni specifiche prima di firmare." },
      { cat: "affitto", q: "Potete garantire inquilini affidabili?", a: "Nessuno può garantirlo in assoluto. Possiamo aiutarti a raccogliere informazioni utili sulle candidature e a organizzare le visite, ma la scelta finale resta al proprietario." },
      { cat: "visite", q: "Come prenoto una visita?", a: "Dalla scheda dell'immobile o dalla pagina Contatti puoi indicare una data e una fascia oraria preferite. Ti ricontattiamo per confermare una disponibilità effettiva: la preferenza non è una prenotazione." },
      { cat: "visite", q: "Posso visitare più immobili nella stessa giornata?", a: "Sì, quando possibile organizziamo visite consecutive in zone vicine. Segnalacelo nel messaggio della richiesta." },
      { cat: "servizi", q: "Offrite consulenza legale o fiscale?", a: "No. Ti forniamo informazioni generali e, se serve, ti indichiamo professionisti competenti come notai, avvocati o commercialisti, che restano i riferimenti per le valutazioni specifiche." },
      { cat: "servizi", q: "Come vengono realizzate foto e planimetrie degli annunci?", a: "Organizziamo uno shooting fotografico e prepariamo una planimetria illustrativa. Le planimetrie degli annunci non sostituiscono i documenti catastali o tecnici." },
      { cat: "servizi", q: "Quanto costa il servizio dell'agenzia?", a: "Le condizioni economiche vengono concordate per iscritto prima dell'incarico e possono variare in base al servizio richiesto. Chiedi sempre un preventivo chiaro." }
    ],

    faqCategories: [
      { id: "acquisto", label: "Acquisto" },
      { id: "vendita", label: "Vendita" },
      { id: "affitto", label: "Affitto" },
      { id: "visite", label: "Visite" },
      { id: "servizi", label: "Servizi dell'agenzia" }
    ],

    types: [
      { id: "monolocale", label: "Monolocale" },
      { id: "bilocale", label: "Bilocale" },
      { id: "trilocale", label: "Trilocale" },
      { id: "quadrilocale", label: "Appartamento 4+ locali" },
      { id: "attico", label: "Attico" },
      { id: "loft", label: "Loft" },
      { id: "villa", label: "Villa" },
      { id: "villetta", label: "Villetta" }
    ],

    /* ---------------------------------------------------------------------
       IMMOBILI (fittizi). price = prezzo di vendita; rent = canone mensile.
       fees.amount = spese condominiali (0 = nessuna), fees.period = "mese" | "anno"
       box: "box" | "posto-auto" | null
       furnished: "arredato" | "parzialmente" | "non-arredato"
       availability: "disponibile" | "trattativa"
       --------------------------------------------------------------------- */
    properties: [
      {
        id: "CN-101", slug: "bilocale-luminoso-isola",
        title: "Bilocale luminoso in Isola",
        contract: "vendita", type: "bilocale",
        comune: "Milano", quartiere: "Isola",
        address: "Zona Via Borsieri (indicativa)",
        price: 395000, rent: null, fees: { amount: 120, period: "mese" },
        mq: 62, rooms: 2, bedrooms: 1, bathrooms: 1, floor: "4", floors: 6,
        elevator: true, balcony: true, terrace: false, garden: false, box: null,
        furnished: "non-arredato", condition: "Ristrutturato", heating: "Autonomo", energy: "B",
        description: [
          "Al quarto piano di un edificio anni Sessanta con ascensore, un bilocale ristrutturato con soggiorno ampio, cucina a vista e una camera matrimoniale affacciata sul cortile interno.",
          "Il balcone su strada riceve luce nelle ore pomeridiane. La posizione permette di raggiungere a piedi metropolitana, negozi di quartiere e i nuovi parchi della zona."
        ],
        highlights: ["Ristrutturazione recente", "Balcone esposto a ovest", "Metropolitana a pochi minuti a piedi"],
        gallery: gallery("CN-101", ["living", "kitchen", "bedroom", "bathroom", "facade"]),
        plan: plan("bilocale"), agent: "giulia-ferri",
        published: "2026-10-28", availability: "disponibile", featured: true, prestige: false
      },
      {
        id: "CN-102", slug: "trilocale-terrazzo-porta-romana",
        title: "Trilocale con terrazzo a Porta Romana",
        contract: "vendita", type: "trilocale",
        comune: "Milano", quartiere: "Porta Romana",
        address: "Zona Corso Lodi (indicativa)",
        price: 720000, rent: null, fees: { amount: 260, period: "mese" },
        mq: 105, rooms: 3, bedrooms: 2, bathrooms: 2, floor: "5", floors: 6,
        elevator: true, balcony: false, terrace: true, garden: false, box: "box",
        furnished: "non-arredato", condition: "Ottimo", heating: "Centralizzato", energy: "C",
        description: [
          "Un trilocale dalla pianta regolare con zona giorno affacciata su un terrazzo abitabile di circa 25 m², ideale per pranzi all'aperto.",
          "La zona notte comprende due camere e due bagni finestrati. Completa la proprietà un box al piano interrato."
        ],
        highlights: ["Terrazzo abitabile", "Doppi servizi", "Box incluso nel prezzo"],
        gallery: gallery("CN-102", ["living", "terrace", "kitchen", "bedroom", "bathroom", "detail"]),
        plan: plan("trilocale"), agent: "sara-colombo",
        published: "2026-10-15", availability: "disponibile", featured: true, prestige: false
      },
      {
        id: "CN-103", slug: "attico-panoramico-citylife",
        title: "Attico panoramico a CityLife",
        contract: "vendita", type: "attico",
        comune: "Milano", quartiere: "CityLife",
        address: "Zona Piazza Tre Torri (indicativa)",
        price: 1850000, rent: null, fees: { amount: 650, period: "mese" },
        mq: 180, rooms: 5, bedrooms: 3, bathrooms: 3, floor: "12", floors: 12,
        elevator: true, balcony: false, terrace: true, garden: false, box: "box",
        furnished: "non-arredato", condition: "Nuova costruzione", heating: "Autonomo a pavimento", energy: "A4",
        description: [
          "All'ultimo piano di un complesso residenziale recente, un attico con vetrate a tutta altezza e un terrazzo che gira su due lati con vista sullo skyline.",
          "Il soggiorno si apre sulla cucina con isola; la zona notte è composta da tre camere, ciascuna con il proprio bagno. Servizio di portineria nel complesso."
        ],
        highlights: ["Terrazzo su due lati", "Tre camere con bagno privato", "Classe energetica A4 (dimostrativa)"],
        gallery: gallery("CN-103", ["terrace", "living", "kitchen", "bedroom", "bathroom", "facade"]),
        plan: plan("attico"), agent: "sara-colombo",
        published: "2026-11-05", availability: "disponibile", featured: false, prestige: true
      },
      {
        id: "CN-104", slug: "monolocale-arredato-citta-studi",
        title: "Monolocale arredato in Città Studi",
        contract: "affitto", type: "monolocale",
        comune: "Milano", quartiere: "Città Studi",
        address: "Zona Piazza Leonardo da Vinci (indicativa)",
        price: null, rent: 850, fees: { amount: 80, period: "mese" },
        mq: 32, rooms: 1, bedrooms: 0, bathrooms: 1, floor: "2", floors: 5,
        elevator: true, balcony: false, terrace: false, garden: false, box: null,
        furnished: "arredato", condition: "Buono", heating: "Centralizzato", energy: "D",
        description: [
          "Monolocale completamente arredato con angolo cottura, divano letto e ampio armadio. Una soluzione pratica per studenti o giovani professionisti.",
          "Il palazzo è dotato di ascensore e si trova vicino a facoltà universitarie, linee di superficie e supermercati."
        ],
        highlights: ["Arredato e pronto da abitare", "Vicino alle università", "Ascensore"],
        gallery: gallery("CN-104", ["studio", "kitchen", "bathroom", "facade"]),
        plan: plan("monolocale"), agent: "marco-bellini",
        published: "2026-11-10", availability: "disponibile", featured: false, prestige: false
      },
      {
        id: "CN-105", slug: "bilocale-arredato-nolo",
        title: "Bilocale arredato a NoLo",
        contract: "affitto", type: "bilocale",
        comune: "Milano", quartiere: "NoLo",
        address: "Zona Via Padova, primo tratto (indicativa)",
        price: null, rent: 1150, fees: { amount: 100, period: "mese" },
        mq: 55, rooms: 2, bedrooms: 1, bathrooms: 1, floor: "1", floors: 4,
        elevator: false, balcony: true, terrace: false, garden: false, box: null,
        furnished: "arredato", condition: "Ristrutturato", heating: "Autonomo", energy: "C",
        description: [
          "Bilocale arredato con gusto in un palazzo d'epoca senza ascensore: soggiorno con cucina a vista, camera matrimoniale e bagno con doccia.",
          "Il balcone affaccia su una via tranquilla. Il quartiere offre locali, mercati rionali e collegamenti con la metropolitana."
        ],
        highlights: ["Riscaldamento autonomo", "Balcone", "Arredamento recente"],
        gallery: gallery("CN-105", ["living", "kitchen", "bedroom", "bathroom"]),
        plan: plan("bilocale"), agent: "marco-bellini",
        published: "2026-11-02", availability: "disponibile", featured: false, prestige: false
      },
      {
        id: "CN-106", slug: "loft-ex-laboratorio-navigli",
        title: "Loft in ex laboratorio ai Navigli",
        contract: "vendita", type: "loft",
        comune: "Milano", quartiere: "Navigli",
        address: "Zona Alzaia Naviglio Pavese (indicativa)",
        price: 640000, rent: null, fees: { amount: 150, period: "mese" },
        mq: 110, rooms: 2, bedrooms: 1, bathrooms: 2, floor: "Terra", floors: 2,
        elevator: false, balcony: false, terrace: false, garden: false, box: null,
        furnished: "non-arredato", condition: "Ristrutturato", heating: "Autonomo", energy: "C",
        description: [
          "Un ex laboratorio artigiano trasformato in loft, con soffitti alti oltre quattro metri, grandi vetrate in ferro e un soppalco che ospita la zona notte.",
          "Accesso da un cortile condiviso e silenzioso. Due bagni, uno al piano e uno sul soppalco."
        ],
        highlights: ["Soffitti oltre 4 metri", "Soppalco con zona notte", "Cortile tranquillo"],
        gallery: gallery("CN-106", ["loft", "kitchen", "bedroom", "bathroom", "detail"]),
        plan: plan("loft"), agent: "sara-colombo",
        published: "2026-09-30", availability: "disponibile", featured: true, prestige: false
      },
      {
        id: "CN-107", slug: "villa-giardino-monza-parco",
        title: "Villa con giardino a Monza, zona Parco",
        contract: "vendita", type: "villa",
        comune: "Monza", quartiere: "Zona Parco",
        address: "Zona Viale Cesare Battisti (indicativa)",
        price: 1490000, rent: null, fees: { amount: 0, period: "mese" },
        mq: 320, rooms: 7, bedrooms: 4, bathrooms: 4, floor: "Su tre livelli", floors: 3,
        elevator: false, balcony: true, terrace: true, garden: true, box: "box",
        furnished: "non-arredato", condition: "Ottimo", heating: "Autonomo", energy: "A2",
        description: [
          "Villa indipendente su tre livelli circondata da un giardino piantumato di circa 900 m². La zona giorno si apre sul portico e sul prato.",
          "Al primo piano quattro camere e tre bagni; al piano seminterrato taverna, lavanderia e box doppio. A breve distanza dal grande parco cittadino."
        ],
        highlights: ["Giardino privato di circa 900 m²", "Box doppio", "Portico e terrazzo"],
        gallery: gallery("CN-107", ["villa", "garden", "living", "kitchen", "bedroom", "bathroom"]),
        plan: plan("villa"), agent: "luca-moretti",
        published: "2026-10-20", availability: "disponibile", featured: false, prestige: true
      },
      {
        id: "CN-108", slug: "villetta-schiera-cernusco",
        title: "Villetta a schiera a Cernusco sul Naviglio",
        contract: "vendita", type: "villetta",
        comune: "Cernusco sul Naviglio", quartiere: "Centro",
        address: "Zona centro storico (indicativa)",
        price: 520000, rent: null, fees: { amount: 60, period: "mese" },
        mq: 150, rooms: 4, bedrooms: 3, bathrooms: 2, floor: "Su due livelli", floors: 2,
        elevator: false, balcony: true, terrace: false, garden: true, box: "box",
        furnished: "non-arredato", condition: "Buono", heating: "Autonomo", energy: "C",
        description: [
          "Villetta a schiera di testa con giardino su due lati, soggiorno luminoso con camino e cucina abitabile.",
          "Al piano superiore tre camere e un bagno con vasca; box e cantina al piano interrato. Comoda alla metropolitana e alla pista ciclabile lungo il Naviglio."
        ],
        highlights: ["Giardino su due lati", "Tre camere", "Box e cantina"],
        gallery: gallery("CN-108", ["villa", "garden", "living", "kitchen", "bedroom"]),
        plan: plan("villetta"), agent: "luca-moretti",
        published: "2026-10-05", availability: "disponibile", featured: false, prestige: false
      },
      {
        id: "CN-109", slug: "quadrilocale-famiglie-sesto",
        title: "Quadrilocale per famiglie a Sesto San Giovanni",
        contract: "vendita", type: "quadrilocale",
        comune: "Sesto San Giovanni", quartiere: "Rondò",
        address: "Zona Piazza IV Novembre (indicativa)",
        price: 410000, rent: null, fees: { amount: 210, period: "mese" },
        mq: 120, rooms: 4, bedrooms: 3, bathrooms: 2, floor: "3", floors: 8,
        elevator: true, balcony: true, terrace: false, garden: false, box: "box",
        furnished: "non-arredato", condition: "Buono", heating: "Centralizzato", energy: "D",
        description: [
          "Ampio quadrilocale con doppia esposizione: soggiorno, cucina abitabile, tre camere e due bagni, oltre a due balconi.",
          "Scuole, servizi e capolinea della metropolitana sono raggiungibili a piedi. Box auto nello stesso stabile."
        ],
        highlights: ["Doppia esposizione", "Tre camere", "Metropolitana raggiungibile a piedi"],
        gallery: gallery("CN-109", ["living", "kitchen", "bedroom", "bathroom", "facade"]),
        plan: plan("quadrilocale"), agent: "luca-moretti",
        published: "2026-09-18", availability: "disponibile", featured: true, prestige: false
      },
      {
        id: "CN-110", slug: "trilocale-affitto-bicocca",
        title: "Trilocale in affitto a Bicocca",
        contract: "affitto", type: "trilocale",
        comune: "Milano", quartiere: "Bicocca",
        address: "Zona Viale Sarca (indicativa)",
        price: null, rent: 1650, fees: { amount: 150, period: "mese" },
        mq: 85, rooms: 3, bedrooms: 2, bathrooms: 2, floor: "6", floors: 9,
        elevator: true, balcony: true, terrace: false, garden: false, box: null,
        furnished: "parzialmente", condition: "Ottimo", heating: "Centralizzato", energy: "B",
        description: [
          "Trilocale in un edificio recente con portineria: soggiorno con cucina attrezzata, due camere e due bagni.",
          "Parzialmente arredato (cucina e armadi). Vicino all'università, a uffici e ai collegamenti tranviari."
        ],
        highlights: ["Cucina attrezzata", "Doppi servizi", "Portineria"],
        gallery: gallery("CN-110", ["living", "kitchen", "bedroom", "bathroom", "facade"]),
        plan: plan("trilocale"), agent: "marco-bellini",
        published: "2026-11-08", availability: "disponibile", featured: false, prestige: false
      },
      {
        id: "CN-111", slug: "bilocale-terrazzo-porta-venezia",
        title: "Bilocale con terrazzo a Porta Venezia",
        contract: "vendita", type: "bilocale",
        comune: "Milano", quartiere: "Porta Venezia",
        address: "Zona Via Lazzaretto (indicativa)",
        price: 560000, rent: null, fees: { amount: 180, period: "mese" },
        mq: 70, rooms: 2, bedrooms: 1, bathrooms: 1, floor: "7", floors: 7,
        elevator: true, balcony: false, terrace: true, garden: false, box: null,
        furnished: "non-arredato", condition: "Ristrutturato", heating: "Centralizzato", energy: "C",
        description: [
          "All'ultimo piano, un bilocale ristrutturato con un terrazzo di circa 18 m² affacciato sui tetti.",
          "Soggiorno con cucina a vista, camera e bagno con doccia walk-in. Zona ricca di locali, servizi e mezzi pubblici."
        ],
        highlights: ["Ultimo piano", "Terrazzo sui tetti", "Ascensore"],
        gallery: gallery("CN-111", ["living", "terrace", "kitchen", "bedroom", "bathroom"]),
        plan: plan("bilocale"), agent: "giulia-ferri",
        published: "2026-11-12", availability: "trattativa", featured: false, prestige: false
      },
      {
        id: "CN-112", slug: "piano-nobile-brera",
        title: "Appartamento al piano nobile in Brera",
        contract: "vendita", type: "quadrilocale",
        comune: "Milano", quartiere: "Brera",
        address: "Zona Via Solferino (indicativa)",
        price: 2650000, rent: null, fees: { amount: 700, period: "mese" },
        mq: 210, rooms: 5, bedrooms: 3, bathrooms: 3, floor: "2", floors: 4,
        elevator: true, balcony: true, terrace: false, garden: false, box: null,
        furnished: "non-arredato", condition: "Ristrutturato", heating: "Centralizzato", energy: "D",
        description: [
          "In un palazzo storico con cortile interno, un appartamento al piano nobile con soffitti decorati, parquet a spina e grandi finestre.",
          "Salone doppio, sala da pranzo, cucina abitabile, tre camere e tre bagni. Una casa di rappresentanza nel cuore di Brera."
        ],
        highlights: ["Soffitti decorati", "Salone doppio", "Palazzo storico con portineria"],
        gallery: gallery("CN-112", ["living", "detail", "kitchen", "bedroom", "bathroom", "facade"]),
        plan: plan("quadrilocale"), agent: "giulia-ferri",
        published: "2026-10-25", availability: "disponibile", featured: false, prestige: true
      },
      {
        id: "CN-113", slug: "attico-arredato-porta-romana",
        title: "Attico arredato con terrazzo a Porta Romana",
        contract: "affitto", type: "attico",
        comune: "Milano", quartiere: "Porta Romana",
        address: "Zona Viale Sabotino (indicativa)",
        price: null, rent: 4200, fees: { amount: 350, period: "mese" },
        mq: 140, rooms: 4, bedrooms: 2, bathrooms: 2, floor: "8", floors: 8,
        elevator: true, balcony: false, terrace: true, garden: false, box: "box",
        furnished: "arredato", condition: "Ottimo", heating: "Autonomo", energy: "B",
        description: [
          "Attico finemente arredato con un ampio terrazzo attrezzato, soggiorno con camino e cucina separata.",
          "Due camere con cabina armadio e due bagni. Box incluso nel canone, spese condominiali a parte."
        ],
        highlights: ["Terrazzo attrezzato", "Arredamento di design", "Box incluso"],
        gallery: gallery("CN-113", ["terrace", "living", "kitchen", "bedroom", "bathroom"]),
        plan: plan("attico"), agent: "sara-colombo",
        published: "2026-11-14", availability: "disponibile", featured: true, prestige: true
      },
      {
        id: "CN-114", slug: "monolocale-ristrutturare-lambrate",
        title: "Monolocale da ristrutturare a Lambrate",
        contract: "vendita", type: "monolocale",
        comune: "Milano", quartiere: "Lambrate",
        address: "Zona Via Conte Rosso (indicativa)",
        price: 165000, rent: null, fees: { amount: 70, period: "mese" },
        mq: 38, rooms: 1, bedrooms: 0, bathrooms: 1, floor: "1", floors: 4,
        elevator: false, balcony: true, terrace: false, garden: false, box: null,
        furnished: "non-arredato", condition: "Da ristrutturare", heating: "Centralizzato", energy: "F",
        description: [
          "Monolocale da ristrutturare con balcone, adatto a chi desidera personalizzare gli spazi o a un investimento da valutare con attenzione.",
          "Edificio senza ascensore in una zona in trasformazione, vicina alla stazione e al polo universitario."
        ],
        highlights: ["Da personalizzare", "Balcone", "Vicino alla stazione"],
        gallery: gallery("CN-114", ["studio", "bathroom", "facade"]),
        plan: plan("monolocale"), agent: "marco-bellini",
        published: "2026-09-05", availability: "disponibile", featured: false, prestige: false
      },
      {
        id: "CN-115", slug: "bilocale-giardino-segrate",
        title: "Bilocale con giardino a Segrate",
        contract: "vendita", type: "bilocale",
        comune: "Segrate", quartiere: "Redecesio",
        address: "Zona Via Redecesio (indicativa)",
        price: 285000, rent: null, fees: { amount: 140, period: "mese" },
        mq: 65, rooms: 2, bedrooms: 1, bathrooms: 1, floor: "Terra", floors: 4,
        elevator: true, balcony: false, terrace: false, garden: true, box: "posto-auto",
        furnished: "non-arredato", condition: "Buono", heating: "Centralizzato", energy: "C",
        description: [
          "Bilocale al piano terra con giardino privato di circa 60 m², accessibile direttamente dal soggiorno.",
          "Camera matrimoniale, bagno finestrato e posto auto coperto nel cortile condominiale."
        ],
        highlights: ["Giardino privato", "Posto auto coperto", "Contesto residenziale tranquillo"],
        gallery: gallery("CN-115", ["living", "garden", "kitchen", "bedroom", "bathroom"]),
        plan: plan("bilocale"), agent: "luca-moretti",
        published: "2026-10-10", availability: "disponibile", featured: false, prestige: false
      },
      {
        id: "CN-116", slug: "trilocale-arredato-monza-centro",
        title: "Trilocale arredato a Monza centro",
        contract: "affitto", type: "trilocale",
        comune: "Monza", quartiere: "Centro",
        address: "Zona Via Italia (indicativa)",
        price: null, rent: 1350, fees: { amount: 130, period: "mese" },
        mq: 90, rooms: 3, bedrooms: 2, bathrooms: 1, floor: "2", floors: 3,
        elevator: false, balcony: true, terrace: false, garden: false, box: "box",
        furnished: "arredato", condition: "Ristrutturato", heating: "Autonomo", energy: "C",
        description: [
          "Trilocale arredato in una piccola palazzina del centro: soggiorno, cucina abitabile, due camere e bagno.",
          "Balcone sul cortile interno e box auto. Negozi, stazione e servizi a pochi passi."
        ],
        highlights: ["Centro città", "Box auto", "Riscaldamento autonomo"],
        gallery: gallery("CN-116", ["living", "kitchen", "bedroom", "bathroom", "facade"]),
        plan: plan("trilocale"), agent: "luca-moretti",
        published: "2026-10-30", availability: "disponibile", featured: false, prestige: false
      },
      {
        id: "CN-117", slug: "loft-affitto-isola",
        title: "Loft in affitto a Isola",
        contract: "affitto", type: "loft",
        comune: "Milano", quartiere: "Isola",
        address: "Zona Via Pastrengo (indicativa)",
        price: null, rent: 1900, fees: { amount: 120, period: "mese" },
        mq: 75, rooms: 2, bedrooms: 1, bathrooms: 1, floor: "Rialzato", floors: 3,
        elevator: false, balcony: false, terrace: false, garden: false, box: null,
        furnished: "parzialmente", condition: "Ristrutturato", heating: "Autonomo", energy: "B",
        description: [
          "Loft con grande open space, cucina a vista e camera soppalcata. Parzialmente arredato.",
          "Si affaccia su un cortile verde condiviso. Zona servita da metropolitana e linee tranviarie."
        ],
        highlights: ["Open space luminoso", "Camera soppalcata", "Cortile verde"],
        gallery: gallery("CN-117", ["loft", "kitchen", "bedroom", "bathroom"]),
        plan: plan("loft"), agent: "giulia-ferri",
        published: "2026-11-06", availability: "disponibile", featured: false, prestige: false
      },
      {
        id: "CN-118", slug: "villetta-affitto-rho",
        title: "Villetta indipendente in affitto a Rho",
        contract: "affitto", type: "villetta",
        comune: "Rho", quartiere: "Mazzo",
        address: "Zona Mazzo (indicativa)",
        price: null, rent: 2100, fees: { amount: 0, period: "mese" },
        mq: 130, rooms: 4, bedrooms: 3, bathrooms: 2, floor: "Su due livelli", floors: 2,
        elevator: false, balcony: true, terrace: false, garden: true, box: "box",
        furnished: "non-arredato", condition: "Buono", heating: "Autonomo", energy: "B",
        description: [
          "Villetta indipendente con giardino, ideale per una famiglia: soggiorno, cucina abitabile, tre camere e due bagni.",
          "Box auto e cantina. Comoda alla stazione e alle principali arterie stradali."
        ],
        highlights: ["Indipendente", "Giardino", "Nessuna spesa condominiale"],
        gallery: gallery("CN-118", ["villa", "garden", "living", "kitchen", "bedroom"]),
        plan: plan("villetta"), agent: "luca-moretti",
        published: "2026-10-12", availability: "disponibile", featured: false, prestige: false
      },
      {
        id: "CN-119", slug: "quadrilocale-citta-studi",
        title: "Quadrilocale con box in Città Studi",
        contract: "vendita", type: "quadrilocale",
        comune: "Milano", quartiere: "Città Studi",
        address: "Zona Via Pascoli (indicativa)",
        price: 780000, rent: null, fees: { amount: 300, period: "mese" },
        mq: 135, rooms: 4, bedrooms: 3, bathrooms: 2, floor: "4", floors: 7,
        elevator: true, balcony: true, terrace: false, garden: false, box: "box",
        furnished: "non-arredato", condition: "Ottimo", heating: "Centralizzato", energy: "C",
        description: [
          "Quadrilocale signorile con ingresso, salone, cucina abitabile, tre camere e due bagni. Balconi su entrambi i lati.",
          "Box al piano interrato. Zona residenziale con parchi, scuole e università nelle vicinanze."
        ],
        highlights: ["Balconi su due lati", "Box", "Portineria"],
        gallery: gallery("CN-119", ["living", "kitchen", "bedroom", "bathroom", "detail"]),
        plan: plan("quadrilocale"), agent: "marco-bellini",
        published: "2026-10-02", availability: "disponibile", featured: false, prestige: false
      },
      {
        id: "CN-120", slug: "bilocale-ringhiera-navigli",
        title: "Bilocale in casa di ringhiera ai Navigli",
        contract: "affitto", type: "bilocale",
        comune: "Milano", quartiere: "Navigli",
        address: "Zona Ripa di Porta Ticinese (indicativa)",
        price: null, rent: 1400, fees: { amount: 90, period: "mese" },
        mq: 50, rooms: 2, bedrooms: 1, bathrooms: 1, floor: "3", floors: 4,
        elevator: false, balcony: true, terrace: false, garden: false, box: null,
        furnished: "arredato", condition: "Ristrutturato", heating: "Autonomo", energy: "D",
        description: [
          "Bilocale arredato in una tipica casa di ringhiera, con affaccio sul ballatoio e sul cortile.",
          "Soggiorno con angolo cottura, camera e bagno con doccia. A pochi passi dall'alzaia e dai locali della zona."
        ],
        highlights: ["Casa di ringhiera", "Arredato", "Vicino all'alzaia"],
        gallery: gallery("CN-120", ["living", "kitchen", "bedroom", "bathroom", "facade"]),
        plan: plan("bilocale"), agent: "sara-colombo",
        published: "2026-11-11", availability: "trattativa", featured: false, prestige: false
      },
      {
        id: "CN-121", slug: "quadrilocale-affitto-citylife",
        title: "Quadrilocale in affitto a CityLife",
        contract: "affitto", type: "quadrilocale",
        comune: "Milano", quartiere: "CityLife",
        address: "Zona Via Senofonte (indicativa)",
        price: null, rent: 3300, fees: { amount: 280, period: "mese" },
        mq: 125, rooms: 4, bedrooms: 3, bathrooms: 2, floor: "9", floors: 18,
        elevator: true, balcony: true, terrace: false, garden: false, box: "box",
        furnished: "non-arredato", condition: "Nuova costruzione", heating: "Autonomo a pavimento", energy: "A3",
        description: [
          "In una torre residenziale di nuova costruzione, un quadrilocale con loggia, soggiorno affacciato sul parco e cucina abitabile.",
          "Tre camere, due bagni e box. Il complesso offre portineria e aree verdi condivise."
        ],
        highlights: ["Vista sul parco", "Nuova costruzione", "Box e portineria"],
        gallery: gallery("CN-121", ["living", "kitchen", "bedroom", "bathroom", "facade"]),
        plan: plan("quadrilocale"), agent: "sara-colombo",
        published: "2026-10-18", availability: "disponibile", featured: false, prestige: false
      }
    ]
  };

  /* Alt text generato in modo coerente per ogni immagine di galleria. */
  SITE_DATA.properties.forEach(function (p) {
    p.gallery.forEach(function (img, i) {
      img.alt = img.label + " – " + p.title + " (illustrazione dimostrativa " + (i + 1) + " di " + p.gallery.length + ")";
    });
  });

  window.SITE_DATA = SITE_DATA;
})();
