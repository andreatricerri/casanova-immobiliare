/* =========================================================================
   CasaNova Immobiliare — property-detail.js
   Scheda immobile: immobile.html?id=CN-101
   Gestisce ID mancanti o non validi senza errori JavaScript.
   ========================================================================= */

(function () {
  "use strict";
  var D = window.SITE_DATA;
  var CN = window.CN;

  var ENERGY = [
    ["A4", "#3C9A5F", 34], ["A3", "#58A95F", 40], ["A2", "#7DBA5E", 46], ["A1", "#A6C85A", 52], ["B", "#CBD45A", 58],
    ["C", "#EBD95C", 64], ["D", "#F2C04F", 72], ["E", "#EFA046", 80], ["F", "#E9824A", 90], ["G", "#E06A57", 100]
  ];

  function yesNo(v) { return v ? "Sì" : "No"; }
  function hash(str) { var h = 0; for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 9973; return h; }

  function notFound(root, id) {
    document.title = "Immobile non trovato | CasaNova Immobiliare";
    root.innerHTML =
      '<nav class="breadcrumb detail-top" aria-label="Percorso"><ol><li><a href="index.html">Home</a></li><li><a href="immobili.html">Immobili</a></li><li><span aria-current="page">Immobile non trovato</span></li></ol></nav>' +
      '<div class="empty-state" style="margin:2rem 0 4rem">' + CN.icon("home") +
        "<h1>Immobile non trovato</h1>" +
        "<p>" + (id ? "Il riferimento <strong>" + CN.esc(id) + "</strong> non corrisponde a nessun annuncio." : "Il link non indica quale immobile mostrare.") +
        " L'annuncio potrebbe essere stato rimosso oppure il link potrebbe essere incompleto.</p>" +
        '<div class="btn-row"><a class="btn btn--primary" href="immobili.html">Vai al catalogo</a><a class="btn btn--secondary" href="contatti.html">Contattaci</a></div>' +
      "</div>";
    var bar = document.querySelector(".mobile-bar");
    if (bar) bar.parentNode.removeChild(bar);
    document.body.classList.remove("has-mobile-bar");
  }

  function similar(p) {
    return D.properties.filter(function (x) { return x.id !== p.id && x.contract === p.contract; })
      .map(function (x) {
        var score = 0;
        if (x.comune === p.comune) score += 2;
        if (x.type === p.type) score += 2;
        if (Math.abs(CN.amount(x) - CN.amount(p)) / CN.amount(p) < 0.35) score += 1;
        if (x.prestige === p.prestige) score += 1;
        return { p: x, s: score };
      })
      .sort(function (a, b) { return b.s - a.s || CN.byDate(a.p, b.p); })
      .slice(0, 3)
      .map(function (o) { return o.p; });
  }

  function energyHTML(cls) {
    return '<ul class="energy" aria-label="Scala delle classi energetiche">' + ENERGY.map(function (e) {
      var cur = e[0] === cls;
      return "<li" + (cur ? ' aria-current="true"' : "") + '><span class="energy__bar" style="width:' + e[2] + "%;min-width:3.2rem;max-width:calc(100% - 9rem);background:" + e[1] + '">' + e[0] + "</span>" +
        (cur ? '<span class="energy__mark">' + CN.icon("chevronLeft", "icon--sm") + " classe dell'immobile</span>" : '<span class="visually-hidden">classe ' + e[0] + "</span>") + "</li>";
    }).join("") + "</ul>";
  }

  function visitForm(p) {
    return '<form class="form" data-demo-form data-success-extra="Data e fascia oraria erano solo preferenze: nessuna disponibilità è stata verificata." novalidate>' +
      '<input type="hidden" name="riferimento" value="' + p.id + '">' +
      '<div class="field"><label for="v-nome">Nome e cognome <span class="req" aria-hidden="true">*</span></label><input class="input" id="v-nome" name="nome" autocomplete="name" required data-label="nome e cognome"></div>' +
      '<div class="field"><label for="v-email">Email <span class="req" aria-hidden="true">*</span></label><input class="input" id="v-email" name="email" type="email" autocomplete="email" inputmode="email" required data-label="email"></div>' +
      '<div class="field"><label for="v-tel">Telefono <span class="optional">(facoltativo)</span></label><input class="input" id="v-tel" name="telefono" type="tel" autocomplete="tel" inputmode="tel"></div>' +
      '<div class="form-row form-row--2">' +
        '<div class="field"><label for="v-data">Data preferita <span class="optional">(facoltativa)</span></label><input class="input" id="v-data" name="data" type="date" data-min-today></div>' +
        '<div class="field"><label for="v-fascia">Fascia oraria preferita</label><select class="select" id="v-fascia" name="fascia"><option value="">Nessuna preferenza</option><option>Mattina (9–12)</option><option>Pausa pranzo (12–14)</option><option>Pomeriggio (14–18)</option><option>Tardo pomeriggio (18–19:30)</option></select></div>' +
      "</div>" +
      '<p class="field-hint">Data e fascia sono solo preferenze: non indicano una disponibilità confermata.</p>' +
      '<div class="field"><label for="v-msg">Messaggio <span class="optional">(facoltativo)</span></label><textarea class="textarea" id="v-msg" name="messaggio" rows="3"></textarea></div>' +
      '<label class="check"><input type="checkbox" name="privacy" id="v-privacy" required data-label="presa visione dell\'informativa"><span>Ho letto la <a href="privacy.html">nota sulla privacy</a> della demo <span class="req" aria-hidden="true">*</span></span></label>' +
      '<button type="submit" class="btn btn--primary btn--block">Invia richiesta (simulazione)</button>' +
      '<p class="form-note"><span aria-hidden="true">*</span> Campi obbligatori. Il modulo è dimostrativo: nessun dato viene inviato o salvato.</p>' +
    "</form>";
  }

  function render(root, p) {
    var agent = CN.agent(p.agent);
    var contractLink = "immobili.html?contratto=" + p.contract;
    document.title = p.title + " – Rif. " + p.id + " | CasaNova Immobiliare";
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", p.title + ", " + p.quartiere + " (" + p.comune + "): " + p.mq + " m², " + p.rooms + " locali. Annuncio dimostrativo.");

    var badges = '<span class="badge ' + (p.contract === "affitto" ? "badge--rent" : "badge--sale") + '">' + CN.contractLabel(p.contract) + "</span>" +
      (p.prestige ? '<span class="badge badge--prestige">Prestigio</span>' : "") +
      (p.availability === "trattativa" ? '<span class="badge badge--status">In trattativa</span>' : "") +
      '<span class="badge badge--demo">Annuncio dimostrativo</span>';

    var fav = window.CNFavorites.has(p.id);
    var facts = [
      ["area", CN.num(p.mq) + " m²", "Superficie"],
      ["rooms", p.rooms, p.rooms === 1 ? "Locale" : "Locali"],
      ["bed", p.bedrooms || "—", p.bedrooms ? (p.bedrooms === 1 ? "Camera" : "Camere") : "Zona notte nel locale"],
      ["bath", p.bathrooms, p.bathrooms === 1 ? "Bagno" : "Bagni"],
      ["stairs", /^\d+$/.test(p.floor) ? p.floor + "°" : p.floor, /^\d+$/.test(p.floor) ? "Piano su " + p.floors : "Piano"],
      ["leaf", p.energy, "Classe energetica (demo)"]
    ];
    var boxLabel = p.box === "box" ? "Box auto" : p.box === "posto-auto" ? "Posto auto" : "No";
    var furnished = { arredato: "Arredato", parzialmente: "Parzialmente arredato", "non-arredato": "Non arredato" }[p.furnished];
    var specs = [
      ["Riferimento", p.id],
      ["Contratto", CN.contractLabel(p.contract)],
      ["Tipologia", CN.typeLabel(p.type)],
      [p.contract === "affitto" ? "Canone mensile" : "Prezzo", CN.priceText(p)],
      ["Spese condominiali", p.fees && p.fees.amount ? "€ " + CN.num(p.fees.amount) + "/" + p.fees.period : "Nessuna"],
      ["Superficie", CN.num(p.mq) + " m²"],
      ["Piano", /^\d+$/.test(p.floor) ? p.floor + " di " + p.floors : p.floor],
      ["Ascensore", yesNo(p.elevator)],
      ["Balcone", yesNo(p.balcony)],
      ["Terrazzo", yesNo(p.terrace)],
      ["Giardino", yesNo(p.garden)],
      ["Box o posto auto", boxLabel],
      ["Arredamento", furnished],
      ["Stato", p.condition],
      ["Riscaldamento", p.heating],
      ["Disponibilità", p.availability === "trattativa" ? "In trattativa" : "Disponibile"],
      ["Pubblicato il", CN.dateLabel(p.published)]
    ];
    var present = [];
    if (p.elevator) present.push("Ascensore");
    if (p.balcony) present.push("Balcone");
    if (p.terrace) present.push("Terrazzo");
    if (p.garden) present.push("Giardino privato");
    if (p.box) present.push(boxLabel);
    if (p.furnished !== "non-arredato") present.push(furnished);
    present.push("Riscaldamento " + p.heating.toLowerCase());

    var px = 30 + hash(p.id) % 40, py = 30 + hash(p.id + "y") % 35;

    root.innerHTML =
      '<nav class="breadcrumb detail-top" aria-label="Percorso"><ol>' +
        '<li><a href="index.html">Home</a></li><li><a href="immobili.html">Immobili</a></li>' +
        '<li><a href="' + contractLink + '">' + (p.contract === "affitto" ? "In affitto" : "In vendita") + "</a></li>" +
        '<li><span aria-current="page">' + CN.esc(p.title) + "</span></li></ol></nav>" +

      '<header class="detail-head">' +
        "<div>" +
          '<div class="detail-head__badges">' + badges + "</div>" +
          "<h1>" + CN.esc(p.title) + "</h1>" +
          '<p class="detail-head__zone">' + CN.icon("pin") + "<span>" + CN.esc(p.quartiere) + ", " + CN.esc(p.comune) + " · " + CN.esc(p.address) + "</span></p>" +
        "</div>" +
        '<div class="detail-head__price">' +
          '<p class="price">' + CN.priceHTML(p) + "</p>" +
          '<p class="detail-head__fees">' + CN.feesText(p) + " · Rif. " + p.id + "</p>" +
          '<div class="detail-actions">' +
            '<button type="button" class="btn btn--secondary btn--sm fav-toggle" data-fav-toggle="' + p.id + '" data-fav-title="' + CN.esc(p.title) + '" aria-pressed="' + fav + '">' + CN.icon("heart") + '<span data-fav-label>' + (fav ? "Salvato nei preferiti" : "Salva nei preferiti") + "</span></button>" +
            '<button type="button" class="btn btn--secondary btn--sm" data-share>' + CN.icon("share") + "Condividi</button>" +
          "</div>" +
          '<div class="share-fallback" data-share-fallback hidden><label class="small" for="share-url">Copia il link manualmente:</label><input class="input" id="share-url" readonly></div>' +
        "</div>" +
      "</header>" +

      '<div class="detail">' +
        '<div class="detail__main">' +
          '<section aria-labelledby="h-gallery"><h2 id="h-gallery" class="visually-hidden">Galleria fotografica</h2><div data-gallery></div>' +
            '<p class="small muted" style="margin-top:.75rem">Immagini illustrative a scopo dimostrativo: non rappresentano un immobile reale.</p></section>' +
          '<section aria-labelledby="h-facts"><h2 id="h-facts">Caratteristiche principali</h2><ul class="facts">' +
            facts.map(function (f) { return "<li>" + CN.icon(f[0]) + "<strong>" + f[1] + "</strong><span>" + f[2] + "</span></li>"; }).join("") + "</ul></section>" +
          '<section aria-labelledby="h-desc"><h2 id="h-desc">Descrizione</h2>' + p.description.map(function (d) { return "<p>" + CN.esc(d) + "</p>"; }).join("") +
            "<h3>Punti di forza</h3><ul class=\"check-list\">" + p.highlights.map(function (h) { return "<li>" + CN.icon("check") + "<span>" + CN.esc(h) + "</span></li>"; }).join("") + "</ul></section>" +
          '<section aria-labelledby="h-specs"><h2 id="h-specs">Dettagli e dotazioni</h2><dl class="spec-table">' +
            specs.map(function (s) { return "<div><dt>" + s[0] + "</dt><dd>" + CN.esc(s[1]) + "</dd></div>"; }).join("") + "</dl>" +
            '<h3 style="margin-top:1.5rem">Dotazioni presenti</h3><ul class="check-list">' + present.map(function (x) { return "<li>" + CN.icon("check") + "<span>" + CN.esc(x) + "</span></li>"; }).join("") + "</ul></section>" +
          '<section aria-labelledby="h-plan"><h2 id="h-plan">Planimetria</h2><figure class="plan-box"><img src="' + p.plan + '" alt="Planimetria illustrativa di ' + CN.esc(p.title) + ' con la disposizione indicativa degli ambienti" width="900" height="640" loading="lazy">' +
            "<figcaption><strong>Planimetria dimostrativa, non in scala.</strong> Schema indicativo: non è un documento catastale né tecnico.</figcaption></figure></section>" +
          '<section aria-labelledby="h-energy"><h2 id="h-energy">Informazioni energetiche</h2><p>Classe energetica dimostrativa: <strong>' + p.energy + "</strong>. Riscaldamento: " + CN.esc(p.heating.toLowerCase()) + ".</p>" + energyHTML(p.energy) +
            '<p class="small muted" style="margin-top:1rem">Valori fittizi. In un annuncio reale andrebbero riportati i dati dell\'attestato di prestazione energetica.</p></section>' +
          '<section aria-labelledby="h-map"><h2 id="h-map">Posizione approssimativa</h2>' +
            '<div class="map-box"><img src="' + D.images.map + '" alt="Mappa illustrativa di fantasia" width="1200" height="800" loading="lazy">' +
              '<span class="map-area" style="left:' + px + "%;top:" + py + '%" aria-hidden="true"></span>' +
              '<p class="map-label">' + CN.esc(p.quartiere) + ", " + CN.esc(p.comune) + ": zona indicativa</p></div>" +
            '<p class="small muted" style="margin-top:.75rem">Mappa illustrativa e posizione fittizia e approssimativa. Non viene richiesta la tua posizione e non vengono caricate mappe esterne.</p></section>' +
        "</div>" +

        '<aside class="detail__aside" aria-label="Richiesta di visita">' +
          '<div class="card contact-box" id="richiesta-visita" tabindex="-1">' +
            '<div class="contact-box__price"><p class="price">' + CN.priceHTML(p) + '</p><span class="small muted">Rif. ' + p.id + "</span></div>" +
            (agent ? '<div class="agent-card__top"><img class="agent-card__avatar" src="' + agent.avatar + '" alt="Avatar illustrato di ' + CN.esc(agent.name) + '" width="400" height="400" loading="lazy"><div><p class="mb-0"><strong>' + CN.esc(agent.name) + '</strong></p><p class="agent-card__role">' + CN.esc(agent.role) + "</p></div></div>" : "") +
            "<h2>Richiedi una visita</h2>" + visitForm(p) +
            '<p class="small mb-0">Preferisci scrivere con calma? <a href="contatti.html?tipo=visita&amp;id=' + encodeURIComponent(p.id) + '">Apri il modulo contatti</a></p>' +
          "</div>" +
        "</aside>" +
      "</div>" +

      '<section class="section--tight" aria-labelledby="h-similar" style="padding-bottom:4rem"><div class="section-head"><div><h2 id="h-similar">Immobili simili</h2><p>Altre proposte ' + (p.contract === "affitto" ? "in affitto" : "in vendita") + " con caratteristiche affini.</p></div>" +
        '<a class="link-arrow" href="' + contractLink + '">Vedi tutti' + CN.icon("arrowRight") + "</a></div>" +
        '<div class="cards">' + similar(p).map(function (x) { return CN.renderCard(x); }).join("") + "</div></section>";

    /* barra inferiore mobile */
    var bar = document.querySelector(".mobile-bar");
    if (bar) {
      bar.hidden = false;
      bar.innerHTML = '<div><p class="price">' + CN.priceHTML(p) + "</p><small>" + CN.esc(p.title) + "</small></div>" +
        '<a class="btn btn--primary" href="#richiesta-visita">Richiedi visita</a>';
      document.body.classList.add("has-mobile-bar");
      bar.querySelector("a").addEventListener("click", function (e) {
        e.preventDefault();
        var box = document.getElementById("richiesta-visita");
        box.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
        box.focus({ preventScroll: true });
      });
    }

    window.CNGallery(root.querySelector("[data-gallery]"), p.gallery, { title: p.title });
    initShare(root, p);
    CN.syncFavorites();
  }

  function initShare(root, p) {
    var btn = root.querySelector("[data-share]");
    var box = root.querySelector("[data-share-fallback]");
    var input = box.querySelector("input");
    var url = location.href.split("#")[0];

    function manual() {
      box.hidden = false;
      input.value = url;
      input.focus();
      input.select();
      CN.announce("Copia il link dal campo di testo.");
    }
    btn.addEventListener("click", function () {
      if (navigator.share) {
        navigator.share({ title: p.title, text: p.title + " – CasaNova Immobiliare (annuncio dimostrativo)", url: url })
          .catch(function (err) { if (!err || err.name !== "AbortError") copy(); });
        return;
      }
      copy();
    });
    function copy() {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(function () {
          CN.announce("Link copiato negli appunti.", true);
        }, manual);
      } else manual();
    }
  }

  function init() {
    var root = document.getElementById("property-root");
    if (!root) return;
    var id = new URLSearchParams(location.search).get("id");
    var p = CN.findProperty(id);
    if (!p) notFound(root, id);
    else render(root, p);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
