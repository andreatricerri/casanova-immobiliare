/* =========================================================================
   CasaNova Immobiliare — search.js
   - Ricerca rapida della home (apre immobili.html con i parametri URL)
   - Catalogo: filtri combinabili, chip, ordinamento, paginazione,
     sincronizzazione con l'URL e con indietro/avanti del browser.
   ========================================================================= */

(function () {
  "use strict";

  var D = window.SITE_DATA;
  var CN = window.CN;
  var PER_PAGE = 9;

  var BUDGET = {
    vendita: [200000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000, 3000000],
    affitto: [800, 1000, 1250, 1500, 2000, 2500, 3000, 4000, 5000]
  };
  var SORTS = {
    recenti: "Più recenti",
    "prezzo-asc": "Prezzo crescente",
    "prezzo-desc": "Prezzo decrescente",
    "mq-asc": "Metratura crescente",
    "mq-desc": "Metratura decrescente"
  };
  var FLAGS = [
    { key: "terrazzo", label: "Terrazzo", test: function (p) { return p.terrace; } },
    { key: "giardino", label: "Giardino", test: function (p) { return p.garden; } },
    { key: "ascensore", label: "Ascensore", test: function (p) { return p.elevator; } },
    { key: "box", label: "Box o posto auto", test: function (p) { return !!p.box; } },
    { key: "arredato", label: "Arredato", test: function (p) { return p.furnished === "arredato"; } },
    { key: "prestigio", label: "Prestigio", test: function (p) { return p.prestige; } }
  ];

  function unique(arr) { return arr.filter(function (v, i) { return arr.indexOf(v) === i; }); }
  var COMUNI = unique(D.properties.map(function (p) { return p.comune; })).sort(function (a, b) { return a.localeCompare(b, "it"); });
  function quartieriOf(comune) {
    return unique(D.properties.filter(function (p) { return !comune || p.comune === comune; }).map(function (p) { return p.quartiere; }))
      .sort(function (a, b) { return a.localeCompare(b, "it"); });
  }
  function comuneOfQuartiere(q) {
    var p = D.properties.filter(function (x) { return x.quartiere === q; })[0];
    return p ? p.comune : "";
  }

  function budgetOptions(contract, selected) {
    var list = BUDGET[contract] || BUDGET.vendita;
    return '<option value="">Qualsiasi</option>' + list.map(function (v) {
      return '<option value="' + v + '"' + (String(selected) === String(v) ? " selected" : "") + ">fino a € " + CN.num(v) + (contract === "affitto" ? "/mese" : "") + "</option>";
    }).join("");
  }

  /* ===================================================== HOME: ricerca rapida */
  function initHomeSearch() {
    var form = document.querySelector("[data-home-search]");
    if (!form) return;
    var budget = form.querySelector("[name=prezzoMax]");
    var dl = document.getElementById("zone-list");
    if (dl) {
      var opts = COMUNI.concat(quartieriOf(""));
      dl.innerHTML = unique(opts).map(function (o) { return '<option value="' + CN.esc(o) + '"></option>'; }).join("");
    }
    function contract() {
      var r = form.querySelector("[name=contratto]:checked");
      return r ? r.value : "vendita";
    }
    function updateBudget() { budget.innerHTML = budgetOptions(contract(), ""); }
    Array.prototype.forEach.call(form.querySelectorAll("[name=contratto]"), function (r) { r.addEventListener("change", updateBudget); });
    updateBudget();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var params = new URLSearchParams();
      params.set("contratto", contract());
      var q = form.querySelector("[name=q]").value.trim();
      if (q) params.set("q", q);
      var t = form.querySelector("[name=tipologia]").value;
      if (t) params.set("tipologia", t);
      if (budget.value) params.set("prezzoMax", budget.value);
      window.location.href = "immobili.html?" + params.toString();
    });
  }

  /* ===================================================== CATALOGO */
  function defaults() {
    var s = { contratto: "", q: "", comune: "", quartiere: "", tipologia: "", prezzoMin: "", prezzoMax: "", mqMin: "", mqMax: "", locali: "", bagni: "", ordina: "recenti", pagina: 1 };
    FLAGS.forEach(function (f) { s[f.key] = false; });
    return s;
  }
  function intOrEmpty(v) {
    if (v == null || v === "") return "";
    var n = parseInt(String(v).replace(/[.\s€]/g, ""), 10);
    return isNaN(n) || n < 0 ? "" : n;
  }

  function parse(search) {
    var sp = new URLSearchParams(search);
    var s = defaults();
    var c = sp.get("contratto");
    s.contratto = c === "vendita" || c === "affitto" ? c : "";
    var comune = sp.get("comune") || "";
    s.comune = COMUNI.indexOf(comune) !== -1 ? comune : "";
    var quart = sp.get("quartiere") || "";
    if (quartieriOf(s.comune).indexOf(quart) !== -1) s.quartiere = quart;
    var t = sp.get("tipologia");
    s.tipologia = D.types.some(function (x) { return x.id === t; }) ? t : "";
    s.prezzoMin = intOrEmpty(sp.get("prezzoMin"));
    s.prezzoMax = intOrEmpty(sp.get("prezzoMax"));
    s.mqMin = intOrEmpty(sp.get("mqMin"));
    s.mqMax = intOrEmpty(sp.get("mqMax"));
    if (!s.contratto) { s.prezzoMin = ""; s.prezzoMax = ""; }
    if (s.prezzoMin !== "" && s.prezzoMax !== "" && s.prezzoMin > s.prezzoMax) { var x = s.prezzoMin; s.prezzoMin = s.prezzoMax; s.prezzoMax = x; }
    if (s.mqMin !== "" && s.mqMax !== "" && s.mqMin > s.mqMax) { var y = s.mqMin; s.mqMin = s.mqMax; s.mqMax = y; }
    var l = sp.get("locali");
    s.locali = ["1", "2", "3", "4"].indexOf(l) !== -1 ? l : "";
    var b = sp.get("bagni");
    s.bagni = ["1", "2", "3"].indexOf(b) !== -1 ? b : "";
    FLAGS.forEach(function (f) { s[f.key] = sp.get(f.key) === "1"; });
    var o = sp.get("ordina");
    s.ordina = SORTS[o] ? o : "recenti";
    var pg = parseInt(sp.get("pagina"), 10);
    s.pagina = pg > 0 ? pg : 1;

    /* Testo libero dalla home: se corrisponde a un comune o quartiere lo trasformo in filtro */
    var q = (sp.get("q") || "").trim().slice(0, 60);
    if (q) {
      var nq = CN.norm(q);
      var com = COMUNI.filter(function (x) { return CN.norm(x) === nq; })[0];
      var qua = quartieriOf("").filter(function (x) { return CN.norm(x) === nq; })[0];
      if (com) { s.comune = com; }
      else if (qua) { s.quartiere = qua; s.comune = comuneOfQuartiere(qua); }
      else s.q = q;
    }
    return s;
  }

  function toQuery(s) {
    var sp = new URLSearchParams();
    ["contratto", "q", "comune", "quartiere", "tipologia", "prezzoMin", "prezzoMax", "mqMin", "mqMax", "locali", "bagni"].forEach(function (k) {
      if (s[k] !== "" && s[k] != null) sp.set(k, s[k]);
    });
    FLAGS.forEach(function (f) { if (s[f.key]) sp.set(f.key, "1"); });
    if (s.ordina !== "recenti") sp.set("ordina", s.ordina);
    if (s.pagina > 1) sp.set("pagina", s.pagina);
    var str = sp.toString();
    return str ? "?" + str : location.pathname.split("/").pop() || "immobili.html";
  }

  /* Alcuni browser bloccano la cronologia dinamica sui file aperti in locale
     (file://): in quel caso i filtri funzionano ma l'URL non viene aggiornato. */
  function safeHistory(mode, url) {
    try {
      if (mode === "push") history.pushState(null, "", url);
      else history.replaceState(null, "", url);
    } catch (e) { /* cronologia non disponibile */ }
  }

  function matches(p, s) {
    if (s.contratto && p.contract !== s.contratto) return false;
    if (s.comune && p.comune !== s.comune) return false;
    if (s.quartiere && p.quartiere !== s.quartiere) return false;
    if (s.q && CN.norm([p.comune, p.quartiere, p.title, p.address].join(" ")).indexOf(CN.norm(s.q)) === -1) return false;
    if (s.tipologia && p.type !== s.tipologia) return false;
    if (s.contratto) {
      var a = CN.amount(p);
      if (s.prezzoMin !== "" && a < s.prezzoMin) return false;
      if (s.prezzoMax !== "" && a > s.prezzoMax) return false;
    }
    if (s.mqMin !== "" && p.mq < s.mqMin) return false;
    if (s.mqMax !== "" && p.mq > s.mqMax) return false;
    if (s.locali) {
      var n = parseInt(s.locali, 10);
      if (n === 4 ? p.rooms < 4 : p.rooms !== n) return false;
    }
    if (s.bagni && p.bathrooms < parseInt(s.bagni, 10)) return false;
    for (var i = 0; i < FLAGS.length; i++) {
      if (s[FLAGS[i].key] && !FLAGS[i].test(p)) return false;
    }
    return true;
  }

  function sortList(list, s) {
    var o = s.ordina;
    var mixed = !s.contratto;
    return list.slice().sort(function (a, b) {
      var r = 0;
      if (o === "prezzo-asc" || o === "prezzo-desc") {
        /* Prezzi di vendita e canoni non sono confrontabili: con risultati misti
           si ordinano prima le vendite e poi gli affitti, ciascun gruppo per importo. */
        if (mixed && a.contract !== b.contract) return a.contract === "vendita" ? -1 : 1;
        r = CN.amount(a) - CN.amount(b);
        if (o === "prezzo-desc") r = -r;
      } else if (o === "mq-asc") r = a.mq - b.mq;
      else if (o === "mq-desc") r = b.mq - a.mq;
      else r = CN.byDate(a, b);
      return r || (a.id < b.id ? -1 : 1);
    });
  }

  function activeCount(s) {
    var n = 0;
    ["contratto", "q", "comune", "quartiere", "tipologia", "prezzoMin", "prezzoMax", "mqMin", "mqMax", "locali", "bagni"].forEach(function (k) { if (s[k] !== "") n++; });
    FLAGS.forEach(function (f) { if (s[f.key]) n++; });
    return n;
  }

  function initCatalog() {
    var root = document.querySelector("[data-catalog]");
    if (!root) return;
    var form = document.getElementById("filters-form");
    var panel = document.getElementById("filters");
    var openBtn = document.querySelector(".filters__open");
    var closeBtn = panel.querySelector(".filters__close");
    var titleEl = document.querySelector("[data-catalog-title]");
    var countEl = root.querySelector("[data-results-count]");
    var chipsEl = root.querySelector("[data-active-filters]");
    var noteEl = root.querySelector("[data-results-note]");
    var gridEl = root.querySelector("[data-results]");
    var pagEl = root.querySelector("[data-pagination]");
    var sortEl = document.getElementById("sort");
    var applyLabel = form.querySelector("[data-apply-count]");
    var resultsHeading = root.querySelector("#results-heading");
    var desktop = window.matchMedia("(min-width: 1024px)");
    var releaseTrap = null;

    var f = function (name) { return form.elements[name]; };

    /* popolamento select */
    f("comune").innerHTML = '<option value="">Tutti i comuni</option>' + COMUNI.map(function (c) { return '<option value="' + CN.esc(c) + '">' + CN.esc(c) + "</option>"; }).join("");
    f("tipologia").innerHTML = '<option value="">Tutte le tipologie</option>' + D.types.map(function (t) { return '<option value="' + t.id + '">' + CN.esc(t.label) + "</option>"; }).join("");
    sortEl.innerHTML = Object.keys(SORTS).map(function (k) { return '<option value="' + k + '">' + SORTS[k] + "</option>"; }).join("");

    function fillQuartieri(comune, selected) {
      var list = quartieriOf(comune);
      f("quartiere").innerHTML = '<option value="">' + (comune ? "Tutti i quartieri di " + CN.esc(comune) : "Tutti i quartieri") + "</option>" +
        list.map(function (q) { return '<option value="' + CN.esc(q) + '"' + (q === selected ? " selected" : "") + ">" + CN.esc(q) + (comune ? "" : " (" + CN.esc(comuneOfQuartiere(q)) + ")") + "</option>"; }).join("");
    }

    function updatePriceFields(contract) {
      var on = contract === "vendita" || contract === "affitto";
      ["prezzoMin", "prezzoMax"].forEach(function (n) {
        f(n).disabled = !on;
        f(n).placeholder = on ? (n === "prezzoMin" ? "Min" : "Max") : "—";
      });
      var lbl = form.querySelector("[data-price-legend]");
      var hint = form.querySelector("[data-price-hint]");
      lbl.textContent = contract === "affitto" ? "Canone mensile (€)" : contract === "vendita" ? "Prezzo di vendita (€)" : "Prezzo (€)";
      hint.textContent = on ? (contract === "affitto" ? "Importi mensili, spese condominiali escluse." : "Prezzo richiesto, spese escluse.") : "Scegli Vendita o Affitto per filtrare per prezzo: prezzi e canoni non sono confrontabili.";
    }

    function setForm(s) {
      Array.prototype.forEach.call(form.querySelectorAll("[name=contratto]"), function (r) { r.checked = r.value === s.contratto; });
      f("comune").value = s.comune;
      fillQuartieri(s.comune, s.quartiere);
      f("quartiere").value = s.quartiere;
      f("tipologia").value = s.tipologia;
      ["prezzoMin", "prezzoMax", "mqMin", "mqMax"].forEach(function (k) { f(k).value = s[k]; });
      f("locali").value = s.locali;
      f("bagni").value = s.bagni;
      f("q").value = s.q;
      FLAGS.forEach(function (fl) { f(fl.key).checked = !!s[fl.key]; });
      sortEl.value = s.ordina;
      updatePriceFields(s.contratto);
      clearErrors();
    }

    function readForm() {
      var s = defaults();
      var c = form.querySelector("[name=contratto]:checked");
      s.contratto = c ? c.value : "";
      s.comune = f("comune").value;
      s.quartiere = f("quartiere").value;
      s.tipologia = f("tipologia").value;
      s.q = f("q").value;
      ["prezzoMin", "prezzoMax", "mqMin", "mqMax"].forEach(function (k) { s[k] = intOrEmpty(f(k).value); });
      if (!s.contratto) { s.prezzoMin = ""; s.prezzoMax = ""; }
      s.locali = f("locali").value;
      s.bagni = f("bagni").value;
      FLAGS.forEach(function (fl) { s[fl.key] = f(fl.key).checked; });
      s.ordina = sortEl.value;
      return s;
    }

    /* ---- validazione intervalli */
    function rangeError(a, b, kind) {
      var va = f(a).value.trim(), vb = f(b).value.trim();
      var bad = /[^0-9.\s]/;
      if ((va && bad.test(va)) || (vb && bad.test(vb))) return "Usa solo numeri interi positivi.";
      var na = intOrEmpty(va), nb = intOrEmpty(vb);
      if (na !== "" && nb !== "" && na > nb) return kind === "mq" ? "La metratura minima non può superare la massima." : "Il valore minimo non può superare il massimo.";
      return "";
    }
    function showError(groupId, msg, fields) {
      var el = document.getElementById(groupId + "-error");
      el.textContent = msg;
      el.hidden = !msg;
      fields.forEach(function (n) {
        if (msg) { f(n).setAttribute("aria-invalid", "true"); f(n).setAttribute("aria-describedby", groupId + "-error"); }
        else { f(n).removeAttribute("aria-invalid"); f(n).removeAttribute("aria-describedby"); }
      });
    }
    function clearErrors() { showError("price", "", ["prezzoMin", "prezzoMax"]); showError("mq", "", ["mqMin", "mqMax"]); }
    function validate() {
      var p = f("prezzoMin").disabled ? "" : rangeError("prezzoMin", "prezzoMax", "price");
      var m = rangeError("mqMin", "mqMax", "mq");
      showError("price", p, ["prezzoMin", "prezzoMax"]);
      showError("mq", m, ["mqMin", "mqMax"]);
      if (p) return f("prezzoMin");
      if (m) return f("mqMin");
      return null;
    }

    /* ---- rendering risultati */
    var state = parse(location.search);

    function titleFor(s) {
      var t;
      if (s.prestigio) t = s.contratto ? "Immobili di prestigio " + (s.contratto === "vendita" ? "in vendita" : "in affitto") : "Selezione Prestigio";
      else t = s.contratto === "vendita" ? "Immobili in vendita" : s.contratto === "affitto" ? "Immobili in affitto" : "Tutti gli immobili";
      if (s.quartiere) t += " in zona " + s.quartiere;
      else if (s.comune) t += " a " + s.comune;
      return t;
    }

    function chipsFor(s) {
      var chips = [];
      var add = function (keys, label) { chips.push({ keys: keys, label: label }); };
      if (s.contratto) add(["contratto", "prezzoMin", "prezzoMax"], "Contratto: " + CN.contractLabel(s.contratto));
      if (s.q) add(["q"], "Ricerca: " + s.q);
      if (s.comune) add(["comune", "quartiere"], "Comune: " + s.comune);
      if (s.quartiere) add(["quartiere"], "Quartiere: " + s.quartiere);
      if (s.tipologia) add(["tipologia"], "Tipologia: " + CN.typeLabel(s.tipologia));
      var unit = s.contratto === "affitto" ? "/mese" : "";
      if (s.prezzoMin !== "") add(["prezzoMin"], "Da € " + CN.num(s.prezzoMin) + unit);
      if (s.prezzoMax !== "") add(["prezzoMax"], "Fino a € " + CN.num(s.prezzoMax) + unit);
      if (s.mqMin !== "") add(["mqMin"], "Da " + s.mqMin + " m²");
      if (s.mqMax !== "") add(["mqMax"], "Fino a " + s.mqMax + " m²");
      if (s.locali) add(["locali"], s.locali === "4" ? "4 o più locali" : s.locali === "1" ? "1 locale" : s.locali + " locali");
      if (s.bagni) add(["bagni"], "Almeno " + s.bagni + (s.bagni === "1" ? " bagno" : " bagni"));
      FLAGS.forEach(function (fl) { if (s[fl.key]) add([fl.key], fl.label); });
      return chips;
    }

    function pageButtons(page, total) {
      if (total <= 1) return "";
      var items = [];
      var btn = function (n, label, extra) {
        return '<li><button type="button" data-page="' + n + '"' + (extra || "") + ">" + label + "</button></li>";
      };
      items.push(btn(page - 1, CN.icon("chevronLeft") + '<span class="visually-hidden">Pagina precedente</span>', page === 1 ? " disabled" : ""));
      for (var i = 1; i <= total; i++) {
        if (i === 1 || i === total || Math.abs(i - page) <= 1) {
          items.push(btn(i, '<span class="visually-hidden">Pagina </span>' + i, i === page ? ' aria-current="page"' : ""));
        } else if (Math.abs(i - page) === 2) {
          items.push('<li class="gap" aria-hidden="true">…</li>');
        }
      }
      items.push(btn(page + 1, CN.icon("chevronRight") + '<span class="visually-hidden">Pagina successiva</span>', page === total ? " disabled" : ""));
      return '<ul>' + items.join("") + "</ul>";
    }

    function render(opts) {
      opts = opts || {};
      var s = state;
      var list = sortList(D.properties.filter(function (p) { return matches(p, s); }), s);
      var total = Math.max(1, Math.ceil(list.length / PER_PAGE));
      if (s.pagina > total) { s.pagina = total; safeHistory("replace", toQuery(s)); }
      var start = (s.pagina - 1) * PER_PAGE;
      var pageItems = list.slice(start, start + PER_PAGE);

      var title = titleFor(s);
      titleEl.textContent = title;
      document.title = title + " | CasaNova Immobiliare";

      var n = list.length;
      countEl.textContent = n === 0 ? "Nessun immobile trovato" :
        (n === 1 ? "1 immobile trovato" : n + " immobili trovati") +
        (total > 1 ? " · pagina " + s.pagina + " di " + total : "");

      var chips = chipsFor(s);
      chipsEl.hidden = !chips.length;
      chipsEl.innerHTML = chips.length ? '<h2 class="visually-hidden">Filtri attivi</h2><ul class="chips">' + chips.map(function (c, i) {
        return '<li><button type="button" class="chip" data-chip="' + i + '" aria-label="Rimuovi filtro ' + CN.esc(c.label) + '"><span>' + CN.esc(c.label) + "</span>" + CN.icon("close") + "</button></li>";
      }).join("") + (chips.length > 1 ? '<li><button type="button" class="chip chip--clear" data-chip-clear>Azzera tutti</button></li>' : "") + "</ul>" : "";
      chipsEl._chips = chips;

      var mixedPrice = !s.contratto && (s.ordina === "prezzo-asc" || s.ordina === "prezzo-desc");
      noteEl.hidden = !mixedPrice;

      var fc = activeCount(s);
      if (openBtn) openBtn.querySelector("[data-filter-count]").textContent = fc ? " (" + fc + ")" : "";

      if (!n) {
        gridEl.innerHTML = '<div class="empty-state">' + CN.icon("search") + "<h2>Nessun immobile corrisponde ai filtri</h2>" +
          "<p>Prova ad allargare l'area di ricerca, aumentare il budget o rimuovere alcune caratteristiche. Puoi anche lasciarci una richiesta: ti segnaleremo le nuove proposte (simulazione).</p>" +
          '<div class="btn-row"><button type="button" class="btn btn--primary" data-reset-all>Azzera i filtri</button><a class="btn btn--secondary" href="contatti.html">Scrivici cosa cerchi</a></div></div>';
      } else {
        gridEl.innerHTML = '<div class="cards">' + pageItems.map(function (p) { return CN.renderCard(p); }).join("") + "</div>";
      }
      pagEl.innerHTML = pageButtons(s.pagina, total);
      pagEl.hidden = total <= 1;
      if (applyLabel) applyLabel.textContent = "Mostra " + n + (n === 1 ? " risultato" : " risultati");
      if (opts.focusResults) {
        resultsHeading.focus({ preventScroll: true });
        var y = resultsHeading.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo(0, Math.max(0, y));
      }
    }

    function commit(newState, opts) {
      state = newState;
      safeHistory("push", toQuery(state));
      render(opts);
    }

    /* anteprima del numero di risultati mentre si modificano i filtri */
    function preview() {
      if (!applyLabel) return;
      var draft = readForm();
      var invalid = !!(rangeError("prezzoMin", "prezzoMax", "price") && !f("prezzoMin").disabled) || !!rangeError("mqMin", "mqMax", "mq");
      if (invalid) { applyLabel.textContent = "Correggi i filtri"; return; }
      var n = D.properties.filter(function (p) { return matches(p, draft); }).length;
      applyLabel.textContent = "Mostra " + n + (n === 1 ? " risultato" : " risultati");
    }

    /* ---- pannello filtri mobile */
    function openPanel() {
      panel.classList.add("is-open");
      openBtn.setAttribute("aria-expanded", "true");
      CN.lockScroll(true);
      releaseTrap = CN.trapFocus(panel);
      setTimeout(function () { closeBtn.focus(); }, 30);
      preview();
    }
    function closePanel(restore, discard) {
      if (!panel.classList.contains("is-open")) return;
      panel.classList.remove("is-open");
      openBtn.setAttribute("aria-expanded", "false");
      CN.lockScroll(false);
      if (releaseTrap) { releaseTrap(); releaseTrap = null; }
      if (discard) setForm(state);
      if (restore !== false) openBtn.focus();
    }
    if (openBtn) openBtn.addEventListener("click", openPanel);
    closeBtn.addEventListener("click", function () { closePanel(true, true); });
    panel.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("is-open")) closePanel(true, true);
    });
    var onMq = function (e) { if (e.matches) closePanel(false, false); };
    if (desktop.addEventListener) desktop.addEventListener("change", onMq); else if (desktop.addListener) desktop.addListener(onMq);

    /* ---- eventi form */
    form.addEventListener("change", function (e) {
      var t = e.target;
      if (t.name === "contratto") {
        f("prezzoMin").value = "";
        f("prezzoMax").value = "";
        updatePriceFields(t.value);
        showError("price", "", ["prezzoMin", "prezzoMax"]);
      }
      if (t.name === "comune") fillQuartieri(t.value, "");
      preview();
    });
    form.addEventListener("input", function (e) {
      if (/^(prezzo|mq)/.test(e.target.name) && e.target.getAttribute("aria-invalid")) validate();
      preview();
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = validate();
      if (bad) { bad.focus(); CN.announce("Controlla gli intervalli inseriti nei filtri."); return; }
      var s = readForm();
      s.pagina = 1;
      var wasOpen = panel.classList.contains("is-open");
      commit(s);
      CN.announce(countEl.textContent);
      if (wasOpen) { closePanel(false, false); resultsHeading.focus(); }
    });
    form.addEventListener("reset", function (e) {
      e.preventDefault();
      var s = defaults();
      s.ordina = state.ordina;
      setForm(s);
      commit(s);
      preview();
      CN.announce("Filtri azzerati. " + countEl.textContent);
    });

    sortEl.addEventListener("change", function () {
      var s = Object.assign({}, state, { ordina: sortEl.value, pagina: 1 });
      commit(s);
      CN.announce("Ordinamento: " + SORTS[sortEl.value] + ". " + countEl.textContent);
    });

    chipsEl.addEventListener("click", function (e) {
      var clear = e.target.closest("[data-chip-clear]");
      var chip = e.target.closest("[data-chip]");
      if (!clear && !chip) return;
      var s = Object.assign({}, state);
      if (clear) { s = defaults(); s.ordina = state.ordina; }
      else {
        chipsEl._chips[parseInt(chip.getAttribute("data-chip"), 10)].keys.forEach(function (k) {
          var d = defaults();
          s[k] = d[k];
        });
      }
      s.pagina = 1;
      setForm(s);
      commit(s);
      CN.announce("Filtro rimosso. " + countEl.textContent);
      resultsHeading.focus();
    });

    gridEl.addEventListener("click", function (e) {
      if (!e.target.closest("[data-reset-all]")) return;
      var s = defaults();
      s.ordina = state.ordina;
      setForm(s);
      commit(s);
      resultsHeading.focus();
    });

    pagEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-page]");
      if (!b || b.disabled) return;
      var s = Object.assign({}, state, { pagina: parseInt(b.getAttribute("data-page"), 10) });
      commit(s, { focusResults: true });
    });

    window.addEventListener("popstate", function () {
      state = parse(location.search);
      setForm(state);
      render();
    });

    /* stato iniziale: URL canonico (es. q=Isola → quartiere=Isola) */
    setForm(state);
    safeHistory("replace", toQuery(state));
    render();
  }

  function init() {
    initHomeSearch();
    initCatalog();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
