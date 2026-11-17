/* =========================================================================
   CasaNova Immobiliare — main.js
   Utilità condivise, menu, modali, preferiti, card immobile, contenuti
   dinamici delle pagine (home, team, servizi, FAQ) e chat demo.
   ========================================================================= */

(function () {
  "use strict";

  var D = window.SITE_DATA;
  var CN = (window.CN = window.CN || {});
  document.documentElement.classList.add("js");

  /* --------------------------------------------------------- icone SVG */
  CN.ICONS = {
    heart: "M19.5 12.6 12 20l-7.5-7.4A4.9 4.9 0 0 1 12 6.3a4.9 4.9 0 0 1 7.5 6.3z",
    menu: "M4 7h16M4 12h16M4 17h16",
    close: "M6 6l12 12M18 6 6 18",
    chevronDown: "m6 9 6 6 6-6",
    chevronLeft: "m15 6-6 6 6 6",
    chevronRight: "m9 6 6 6-6 6",
    arrowRight: "M5 12h14M13 6l6 6-6 6",
    search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
    pin: "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
    area: "M4 4h16v16H4zM4 9h4M4 14h2.5M9 4v4M14 4v2.5",
    rooms: "M3 21V4h18v17M3 12h9v9M12 4v4M3 21h18",
    bath: "M4 12h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-3zM6 12V6a2 2 0 0 1 4 0M7 20l-1 2M17 20l1 2",
    bed: "M3 19V6M3 14h18v5M21 14v-1a3 3 0 0 0-3-3h-7v4M7 12.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
    stairs: "M4 20h4v-4h4v-4h4V8h4",
    leaf: "M5 19c0-8 6-14 15-14 0 9-6 15-14 15M5 19l7-7",
    filter: "M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1M15 4v4M9 10v4M17 16v4",
    share: "M12 15V3M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7",
    expand: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",
    phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
    mail: "M3 6h18v12H3zM3 7l9 6 9-6",
    clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
    check: "m5 12 5 5 9-10",
    info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6M12 7.5v.01",
    chat: "M20 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.2A8 8 0 1 1 20 12z",
    key: "M15.5 13a4.5 4.5 0 1 0-4.3-3.2L4 17v3h3v-2h2v-2h2l1.3-1.3a4.5 4.5 0 0 0 3.2 1.3zM16 8h.01",
    door: "M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17M3 21h18M15 12h.01",
    chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
    camera: "M4 8h3l2-3h6l2 3h3v11H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    calendar: "M4 6h16v15H4zM4 10h16M8 3v4M16 3v4",
    file: "M6 3h8l5 5v13H6zM14 3v5h5M9 13h6M9 17h6",
    home: "M3 11 12 4l9 7M5 10v10h14V10",
    trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
    car: "M5 16v3M19 16v3M3 16h18v-4l-2-5H5l-2 5zM7 13h.01M17 13h.01",
    users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M16 3.5a4 4 0 0 1 0 7.5M22 21a7 7 0 0 0-4-6.3",
    copy: "M8 8h12v12H8zM4 16V4h12"
  };

  CN.icon = function (name, cls) {
    return '<svg class="icon ' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' + (CN.ICONS[name] || "") + '"/></svg>';
  };

  /* --------------------------------------------------------- formattazione */
  CN.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var nf;
  try { nf = new Intl.NumberFormat("it-IT"); } catch (e) { nf = { format: function (n) { return String(n); } }; }
  CN.num = function (n) { return nf.format(n); };
  CN.norm = function (s) {
    s = String(s || "").toLowerCase();
    try { s = s.normalize("NFD").replace(/[̀-ͯ]/g, ""); } catch (e) { /* browser datati */ }
    return s.replace(/\s+/g, " ").trim();
  };
  CN.amount = function (p) { return p.contract === "affitto" ? p.rent : p.price; };
  CN.priceHTML = function (p) {
    return p.contract === "affitto"
      ? "€ " + CN.num(p.rent) + ' <span class="price__unit">/mese</span>'
      : "€ " + CN.num(p.price);
  };
  CN.priceText = function (p) {
    return p.contract === "affitto" ? "€ " + CN.num(p.rent) + "/mese" : "€ " + CN.num(p.price);
  };
  CN.feesText = function (p) {
    if (!p.fees || !p.fees.amount) return "Nessuna spesa condominiale";
    return "Spese condominiali € " + CN.num(p.fees.amount) + "/" + (p.fees.period || "mese");
  };
  CN.typeLabel = function (id) {
    var t = D.types.filter(function (x) { return x.id === id; })[0];
    return t ? t.label : id;
  };
  CN.contractLabel = function (c) { return c === "affitto" ? "Affitto" : "Vendita"; };
  CN.dateLabel = function (iso) {
    var parts = String(iso).split("-");
    var months = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
    return parseInt(parts[2], 10) + " " + months[parseInt(parts[1], 10) - 1] + " " + parts[0];
  };
  CN.findProperty = function (id) {
    if (!id) return null;
    var key = String(id).trim().toUpperCase();
    return D.properties.filter(function (p) { return p.id === key; })[0] || null;
  };
  CN.agent = function (id) { return D.agents.filter(function (a) { return a.id === id; })[0] || null; };
  CN.propertyUrl = function (p) { return "immobile.html?id=" + encodeURIComponent(p.id); };
  CN.floorLabel = function (p) {
    if (/^\d+$/.test(p.floor)) return p.floor + "° piano";
    return p.floor;
  };
  CN.features = function (p) {
    var f = [];
    if (p.terrace) f.push("Terrazzo");
    if (p.garden) f.push("Giardino");
    if (p.box === "box") f.push("Box");
    if (p.box === "posto-auto") f.push("Posto auto");
    if (p.elevator) f.push("Ascensore");
    if (p.furnished === "arredato") f.push("Arredato");
    if (p.furnished === "parzialmente") f.push("Parzialmente arredato");
    if (p.balcony) f.push("Balcone");
    return f;
  };
  CN.byDate = function (a, b) { return a.published < b.published ? 1 : a.published > b.published ? -1 : 0; };

  /* --------------------------------------------------------- card immobile */
  CN.renderCard = function (p, opts) {
    opts = opts || {};
    var h = opts.heading || "h3";
    var img = p.gallery[0];
    var fav = window.CNFavorites && window.CNFavorites.has(p.id);
    var badges = '<span class="badge ' + (p.contract === "affitto" ? "badge--rent" : "badge--sale") + '">' + CN.contractLabel(p.contract) + "</span>";
    if (p.prestige) badges += '<span class="badge badge--prestige">Prestigio</span>';
    if (p.availability === "trattativa") badges += '<span class="badge badge--status">In trattativa</span>';
    var rooms = p.rooms === 1 ? "1 locale" : p.rooms + " locali";
    var baths = p.bathrooms === 1 ? "1 bagno" : p.bathrooms + " bagni";
    var tags = CN.features(p).slice(0, 2).map(function (t) { return "<li>" + t + "</li>"; }).join("");
    return (
      '<article class="card-property">' +
        '<div class="card-property__media">' +
          '<img src="' + CN.esc(img.src) + '" alt="' + CN.esc(img.alt) + '" width="' + img.width + '" height="' + img.height + '"' +
            (opts.lazy === false ? "" : ' loading="lazy"') + ' decoding="async">' +
          '<div class="card-property__badges">' + badges + "</div>" +
          '<button type="button" class="fav-btn" data-fav-toggle="' + p.id + '" aria-pressed="' + (fav ? "true" : "false") + '" aria-label="' +
            (fav ? "Rimuovi dai preferiti: " : "Salva nei preferiti: ") + CN.esc(p.title) + '" data-fav-title="' + CN.esc(p.title) + '">' + CN.icon("heart") + "</button>" +
        "</div>" +
        '<div class="card-property__body">' +
          '<p class="price">' + CN.priceHTML(p) + "</p>" +
          "<" + h + ' class="card-property__title"><a href="' + CN.propertyUrl(p) + '">' + CN.esc(p.title) + "</a></" + h + ">" +
          '<p class="card-property__zone">' + CN.icon("pin", "icon--sm") + "<span>" + CN.esc(p.quartiere) + ", " + CN.esc(p.comune) + "</span></p>" +
          '<ul class="specs" aria-label="Caratteristiche principali">' +
            "<li>" + CN.icon("area", "icon--sm") + CN.num(p.mq) + " m²</li>" +
            "<li>" + CN.icon("rooms", "icon--sm") + rooms + "</li>" +
            "<li>" + CN.icon("bath", "icon--sm") + baths + "</li>" +
          "</ul>" +
          (tags ? '<ul class="tags" aria-label="Dotazioni">' + tags + "</ul>" : "") +
          '<p class="card-property__ref">Rif. ' + p.id + "</p>" +
          (opts.removable ? '<button type="button" class="btn btn--ghost btn--sm card-property__remove" data-fav-remove="' + p.id + '">' + CN.icon("trash") + 'Rimuovi<span class="visually-hidden"> ' + CN.esc(p.title) + " dai preferiti</span></button>" : "") +
        "</div>" +
      "</article>"
    );
  };

  /* --------------------------------------------------------- annunci e toast */
  var live, toast, toastTimer;
  function ensureLive() {
    if (live) return;
    live = document.createElement("div");
    live.className = "visually-hidden";
    live.setAttribute("aria-live", "polite");
    live.setAttribute("aria-atomic", "true");
    document.body.appendChild(live);
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("aria-hidden", "true");
    toast.hidden = true;
    document.body.appendChild(toast);
  }
  CN.announce = function (msg, visible) {
    ensureLive();
    live.textContent = "";
    setTimeout(function () { live.textContent = msg; }, 60);
    if (visible) {
      toast.textContent = msg;
      toast.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toast.hidden = true; }, 3200);
    }
  };

  /* --------------------------------------------------------- focus e scroll */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  CN.focusables = function (root) {
    return Array.prototype.filter.call(root.querySelectorAll(FOCUSABLE), function (el) {
      return el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden";
    });
  };
  CN.trapFocus = function (root) {
    function onKey(e) {
      if (e.key !== "Tab") return;
      var f = CN.focusables(root);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    root.addEventListener("keydown", onKey);
    return function () { root.removeEventListener("keydown", onKey); };
  };
  var locks = 0;
  CN.lockScroll = function (on) {
    locks = Math.max(0, locks + (on ? 1 : -1));
    document.body.classList.toggle("is-locked", locks > 0);
  };

  /* --------------------------------------------------------- modali */
  var openModals = [];
  CN.openModal = function (modal, opener) {
    if (!modal || !modal.hidden) return;
    modal.hidden = false;
    CN.lockScroll(true);
    var release = CN.trapFocus(modal);
    var entry = { el: modal, opener: opener || document.activeElement, release: release };
    openModals.push(entry);
    var target = modal.querySelector("[data-autofocus]") || modal.querySelector(".modal__dialog");
    if (target) { if (!target.hasAttribute("tabindex") && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) target.setAttribute("tabindex", "-1"); target.focus(); }
  };
  CN.closeModal = function (modal) {
    var idx = -1;
    openModals.forEach(function (m, i) { if (m.el === modal) idx = i; });
    if (idx === -1) return;
    var entry = openModals.splice(idx, 1)[0];
    modal.hidden = true;
    entry.release();
    CN.lockScroll(false);
    if (entry.opener && document.contains(entry.opener)) entry.opener.focus();
    var ev = document.createEvent("CustomEvent");
    ev.initCustomEvent("cn:modal-close", false, false, null);
    modal.dispatchEvent(ev);
  };
  document.addEventListener("click", function (e) {
    var openBtn = e.target.closest("[data-modal-open]");
    if (openBtn) {
      var m = document.getElementById(openBtn.getAttribute("data-modal-open"));
      if (m) { e.preventDefault(); CN.openModal(m, openBtn); }
      return;
    }
    var closeBtn = e.target.closest("[data-modal-close]");
    if (closeBtn) {
      var modal = closeBtn.closest(".modal");
      if (modal) CN.closeModal(modal);
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && openModals.length) {
      CN.closeModal(openModals[openModals.length - 1].el);
    }
  });

  CN.createModal = function (id, title, bodyHTML) {
    var wrap = document.createElement("div");
    wrap.className = "modal";
    wrap.id = id;
    wrap.hidden = true;
    wrap.innerHTML =
      '<div class="modal__backdrop" data-modal-close></div>' +
      '<div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="' + id + '-title">' +
        '<button type="button" class="icon-btn modal__close" data-modal-close aria-label="Chiudi finestra">' + CN.icon("close") + "</button>" +
        '<h2 id="' + id + '-title">' + title + "</h2>" + bodyHTML +
      "</div>";
    document.body.appendChild(wrap);
    return wrap;
  };

  CN.confirm = function (o) {
    return new Promise(function (resolve) {
      var id = "cn-confirm";
      var old = document.getElementById(id);
      if (old) old.parentNode.removeChild(old);
      var m = CN.createModal(id, CN.esc(o.title),
        "<p>" + CN.esc(o.text) + '</p><div class="btn-row"><button type="button" class="btn btn--primary" data-confirm>' + CN.esc(o.confirmLabel || "Conferma") +
        '</button><button type="button" class="btn btn--secondary" data-modal-close data-autofocus>Annulla</button></div>');
      var result = false;
      m.querySelector("[data-confirm]").addEventListener("click", function () { result = true; CN.closeModal(m); });
      m.addEventListener("cn:modal-close", function () { resolve(result); setTimeout(function () { if (m.parentNode) m.parentNode.removeChild(m); }, 0); });
      CN.openModal(m, o.opener);
    });
  };

  /* --------------------------------------------------------- menu principale */
  function initNav() {
    var panel = document.getElementById("nav-panel");
    var toggle = document.querySelector(".menu-toggle");
    var backdrop = document.querySelector(".nav-backdrop");
    if (!panel || !toggle) return;
    var closeBtn = panel.querySelector(".nav-close");
    var desktop = window.matchMedia("(min-width: 1120px)");
    var release = null;

    function open() {
      panel.classList.add("is-open");
      if (backdrop) { backdrop.hidden = false; requestAnimationFrame(function () { backdrop.classList.add("is-visible"); }); }
      toggle.setAttribute("aria-expanded", "true");
      CN.lockScroll(true);
      release = CN.trapFocus(panel);
      setTimeout(function () { (closeBtn || panel).focus(); }, 30);
    }
    function close(restore) {
      if (!panel.classList.contains("is-open")) return;
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      if (backdrop) { backdrop.classList.remove("is-visible"); setTimeout(function () { backdrop.hidden = true; }, 260); }
      CN.lockScroll(false);
      if (release) { release(); release = null; }
      if (restore !== false) toggle.focus();
    }
    toggle.addEventListener("click", function () {
      if (panel.classList.contains("is-open")) close(); else open();
    });
    if (closeBtn) closeBtn.addEventListener("click", function () { close(); });
    if (backdrop) backdrop.addEventListener("click", function () { close(); });
    panel.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("is-open")) { e.stopPropagation(); close(); }
    });
    var onMq = function (e) { if (e.matches) close(false); };
    if (desktop.addEventListener) desktop.addEventListener("change", onMq); else if (desktop.addListener) desktop.addListener(onMq);

    /* Chiudi il pannello quando si segue un'ancora interna alla stessa pagina */
    panel.addEventListener("click", function (e) {
      var a = e.target.closest("a[href]");
      if (a && a.getAttribute("href").indexOf("#") !== -1 && !desktop.matches) close(false);
    });

    /* Sottomenu: click, tastiera e touch (nessuna dipendenza da hover) */
    var subToggles = Array.prototype.slice.call(panel.querySelectorAll(".sub-toggle"));
    function setSub(btn, openIt) {
      btn.setAttribute("aria-expanded", openIt ? "true" : "false");
      var sub = document.getElementById(btn.getAttribute("aria-controls"));
      if (sub) sub.hidden = !openIt;
    }
    subToggles.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var willOpen = btn.getAttribute("aria-expanded") !== "true";
        if (desktop.matches) subToggles.forEach(function (b) { if (b !== btn) setSub(b, false); });
        setSub(btn, willOpen);
      });
      var li = btn.closest("li");
      li.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
          e.stopPropagation();
          setSub(btn, false);
          btn.focus();
        }
      });
      li.addEventListener("focusout", function (e) {
        if (desktop.matches && e.relatedTarget && !li.contains(e.relatedTarget)) setSub(btn, false);
      });
    });
    document.addEventListener("click", function (e) {
      if (!desktop.matches) return;
      subToggles.forEach(function (btn) {
        if (!btn.closest("li").contains(e.target)) setSub(btn, false);
      });
    });
  }

  /* --------------------------------------------------------- preferiti (UI) */
  function syncFavorites() {
    var F = window.CNFavorites;
    if (!F) return;
    var n = F.count();
    Array.prototype.forEach.call(document.querySelectorAll("[data-fav-count]"), function (el) {
      el.textContent = n;
      el.setAttribute("data-count", n);
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-fav-link]"), function (el) {
      el.setAttribute("aria-label", "Preferiti: " + (n === 1 ? "1 immobile salvato" : n + " immobili salvati"));
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-fav-toggle]"), function (btn) {
      var id = btn.getAttribute("data-fav-toggle");
      var on = F.has(id);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      var title = btn.getAttribute("data-fav-title") || "";
      var label = btn.querySelector("[data-fav-label]");
      if (label) label.textContent = on ? "Salvato nei preferiti" : "Salva nei preferiti";
      else btn.setAttribute("aria-label", (on ? "Rimuovi dai preferiti: " : "Salva nei preferiti: ") + title);
    });
  }
  CN.syncFavorites = syncFavorites;

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-fav-toggle], [data-fav-remove]");
    if (!btn || !window.CNFavorites) return;
    e.preventDefault();
    e.stopPropagation();
    var id = btn.getAttribute("data-fav-toggle") || btn.getAttribute("data-fav-remove");
    var p = CN.findProperty(id);
    var added = btn.hasAttribute("data-fav-remove") ? (window.CNFavorites.remove(id), false) : window.CNFavorites.toggle(id);
    var msg = (added ? "Aggiunto ai preferiti: " : "Rimosso dai preferiti: ") + (p ? p.title : id);
    if (!window.CNFavorites.isPersistent()) msg += " (salvataggio non disponibile in questo browser: la lista vale solo per questa pagina)";
    CN.announce(msg, true);
    if (!document.contains(btn)) {
      var fallback = document.querySelector("[data-favorites-count]:not([hidden])") || document.querySelector("h1");
      if (fallback) { fallback.setAttribute("tabindex", "-1"); fallback.focus(); }
    }
  });
  document.addEventListener("cn:favorites", syncFavorites);

  /* --------------------------------------------------------- immagini: fallback */
  function useFallback(img) {
    if (img.getAttribute("data-fallback")) return;
    img.setAttribute("data-fallback", "1");
    img.src = D.images.fallback;
    img.alt = img.alt ? img.alt + " (immagine non disponibile)" : "Immagine non disponibile";
  }
  document.addEventListener("error", function (e) {
    if (e.target && e.target.tagName === "IMG") useFallback(e.target);
  }, true);

  /* --------------------------------------------------------- dati agenzia */
  function bindAgency() {
    var a = D.agency;
    Array.prototype.forEach.call(document.querySelectorAll("[data-agency]"), function (el) {
      var key = el.getAttribute("data-agency");
      if (a[key] != null && a[key] !== "") el.textContent = a[key];
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-hours]"), function (el) {
      el.innerHTML = D.hours.map(function (h) {
        return "<div><dt>" + CN.esc(h.days) + "</dt><dd>" + CN.esc(h.time) + "</dd></div>";
      }).join("");
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-year]"), function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* --------------------------------------------------------- accordion */
  CN.accordionHTML = function (items, prefix, level) {
    level = level || 3;
    return '<div class="accordion">' + items.map(function (it, i) {
      var id = prefix + "-" + i;
      var cat = it.catLabel ? '<span class="accordion__cat">' + CN.esc(it.catLabel) + "</span>" : "";
      return '<div class="accordion__item">' +
        '<h' + level + ' class="accordion__heading"><button type="button" class="accordion__trigger" aria-expanded="false" aria-controls="' + id + '-panel" id="' + id + '-btn">' +
        "<span>" + CN.esc(it.q) + '</span><span class="accordion__icon" aria-hidden="true"></span></button></h' + level + ">" +
        '<div class="accordion__panel" id="' + id + '-panel" role="region" aria-labelledby="' + id + '-btn" hidden>' + cat + "<p>" + CN.esc(it.a) + "</p></div></div>";
    }).join("") + "</div>";
  };
  document.addEventListener("click", function (e) {
    var t = e.target.closest(".accordion__trigger");
    if (!t) return;
    var open = t.getAttribute("aria-expanded") === "true";
    t.setAttribute("aria-expanded", open ? "false" : "true");
    var panel = document.getElementById(t.getAttribute("aria-controls"));
    if (panel) panel.hidden = open;
  });

  /* --------------------------------------------------------- componenti dati */
  function agentCard(a, compact) {
    var props = D.properties.filter(function (p) { return p.agent === a.id; });
    var html = '<article class="card agent-card' + (compact ? "" : " team-card") + '">' +
      '<div class="agent-card__top"><img class="agent-card__avatar" src="' + a.avatar + '" alt="Avatar illustrato di ' + CN.esc(a.name) + '" width="400" height="400" loading="lazy">' +
      "<div><h3>" + CN.esc(a.name) + '</h3><p class="agent-card__role">' + CN.esc(a.role) + "</p></div></div>";
    if (!compact) html += "<p>" + CN.esc(a.bio) + "</p>";
    html += '<dl><div class="dl-row"><dt>Zone: </dt><dd>' + CN.esc(a.zones.join(", ")) + '</dd></div><div class="dl-row"><dt>Lingue: </dt><dd>' + CN.esc(a.languages.join(", ")) + "</dd></div></dl>";
    if (!compact) {
      html += "<div><h4>Immobili seguiti (" + props.length + ")</h4><ul class=\"team-card__props\">" + props.map(function (p) {
        return '<li><a href="' + CN.propertyUrl(p) + '">' + CN.esc(p.title) + "</a> <span class=\"muted small\">· " + CN.contractLabel(p.contract) + "</span></li>";
      }).join("") + "</ul></div>";
      html += '<a class="btn btn--secondary btn--sm" href="contatti.html?agente=' + a.id + '">Contatta ' + CN.esc(a.name.split(" ")[0]) + "<span class=\"visually-hidden\"> (modulo dimostrativo)</span></a>";
    }
    return html + "</article>";
  }

  var renderers = {
    featured: function () {
      return D.properties.filter(function (p) { return p.featured && !p.prestige; }).sort(CN.byDate);
    },
    latest: function () {
      return D.properties.filter(function (p) { return !p.prestige && !p.featured; }).sort(CN.byDate);
    },
    rentals: function () {
      return D.properties.filter(function (p) { return p.contract === "affitto"; }).sort(CN.byDate);
    },
    prestige: function () {
      return D.properties.filter(function (p) { return p.prestige; }).sort(CN.byDate);
    }
  };

  function renderBlocks() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-render]"), function (el) {
      var kind = el.getAttribute("data-render");
      var limit = parseInt(el.getAttribute("data-limit"), 10) || 99;
      var html = "";
      if (renderers[kind]) {
        html = '<div class="cards">' + renderers[kind]().slice(0, limit).map(function (p) { return CN.renderCard(p); }).join("") + "</div>";
      } else if (kind === "services") {
        var full = el.hasAttribute("data-full");
        html = '<div class="grid grid--3">' + D.services.slice(0, limit).map(function (s) {
          return '<article class="card"><span class="card__icon">' + CN.icon(s.icon) + "</span><h3>" + CN.esc(s.title) + "</h3><p>" + CN.esc(full ? s.text : s.short) + "</p></article>";
        }).join("") + "</div>";
      } else if (kind === "steps") {
        html = '<ol class="steps">' + D.steps.map(function (s) { return "<li><h3>" + CN.esc(s.title) + "</h3><p>" + CN.esc(s.text) + "</p></li>"; }).join("") + "</ol>";
      } else if (kind === "neighborhoods") {
        html = '<div class="hood-grid">' + D.neighborhoods.map(function (n) {
          var q = CN.norm(n.query);
          var count = D.properties.filter(function (p) { return CN.norm(p.quartiere) === q || CN.norm(p.comune) === q; }).length;
          return '<a class="hood-card" href="immobili.html?q=' + encodeURIComponent(n.query) + '"><div class="hood-card__media"><img src="' + n.image + '" alt="" width="1200" height="800" loading="lazy"></div>' +
            '<div class="hood-card__body"><h3>' + CN.esc(n.name) + "</h3><p>" + CN.esc(n.text) + '</p><span class="hood-card__count">' + (count === 1 ? "1 immobile" : count + " immobili") + " in catalogo</span></div></a>";
        }).join("") + "</div>";
      } else if (kind === "team") {
        var compact = el.hasAttribute("data-compact");
        html = '<div class="grid ' + (compact ? "grid--4" : "grid--2") + '">' + D.agents.map(function (a) { return agentCard(a, compact); }).join("") + "</div>";
      } else if (kind === "reviews") {
        html = '<div class="grid grid--3">' + D.reviews.map(function (r) {
          return '<figure class="card review"><blockquote><p>' + CN.esc(r.text) + '</p></blockquote><figcaption><strong>' + CN.esc(r.author) + "</strong>" + CN.esc(r.context) + ' · <span class="badge badge--demo">Recensione dimostrativa</span></figcaption></figure>';
        }).join("") + "</div>";
      } else if (kind === "faq") {
        var cat = el.getAttribute("data-cat");
        var items = D.faq.filter(function (f) { return !cat || cat.split(",").indexOf(f.cat) !== -1; }).slice(0, limit);
        html = CN.accordionHTML(items, "faq-" + (cat || "all").replace(/,/g, "-"), parseInt(el.getAttribute("data-level"), 10) || 3);
      } else if (kind === "agency-photos") {
        html = '<div class="photo-grid">' + D.images.agency.map(function (im) {
          return '<figure><img src="' + im.src + '" alt="' + CN.esc(im.alt) + '" width="1200" height="800" loading="lazy"><figcaption>Illustrazione dimostrativa</figcaption></figure>';
        }).join("") + "</div>";
      } else if (kind === "zones") {
        var zones = {};
        D.properties.forEach(function (p) { zones[p.quartiere + "|" + p.comune] = p; });
        html = '<ul class="zone-list">' + Object.keys(zones).sort().map(function (k) {
          var p = zones[k];
          return '<li><a href="immobili.html?comune=' + encodeURIComponent(p.comune) + "&amp;quartiere=" + encodeURIComponent(p.quartiere) + '">' + CN.esc(p.quartiere) + (p.comune !== "Milano" ? " (" + CN.esc(p.comune) + ")" : "") + "</a></li>";
        }).join("") + "</ul>";
      }
      if (html) el.innerHTML = html;
    });
  }

  /* --------------------------------------------------------- pagina FAQ */
  function initFaqPage() {
    var root = document.querySelector("[data-faq-page]");
    if (!root) return;
    var input = root.querySelector("#faq-search");
    var pills = root.querySelector("[data-faq-cats]");
    var list = root.querySelector("[data-faq-list]");
    var status = root.querySelector("[data-faq-status]");
    var current = "";
    var labels = {};
    D.faqCategories.forEach(function (c) { labels[c.id] = c.label; });

    pills.innerHTML = '<button type="button" aria-pressed="true" data-cat="">Tutte</button>' +
      D.faqCategories.map(function (c) { return '<button type="button" aria-pressed="false" data-cat="' + c.id + '">' + CN.esc(c.label) + "</button>"; }).join("");

    function render() {
      var q = CN.norm(input.value);
      var items = D.faq.filter(function (f) {
        if (current && f.cat !== current) return false;
        return !q || CN.norm(f.q + " " + f.a).indexOf(q) !== -1;
      }).map(function (f) { return { q: f.q, a: f.a, catLabel: labels[f.cat] }; });
      if (!items.length) {
        list.innerHTML = '<div class="empty-state">' + CN.icon("search") + "<h2>Nessuna domanda trovata</h2><p>Prova con parole diverse o scegli un'altra categoria. Se non trovi la risposta, scrivici dalla pagina contatti.</p>" +
          '<div class="btn-row"><button type="button" class="btn btn--secondary" data-faq-reset>Mostra tutte le domande</button><a class="btn btn--primary" href="contatti.html">Contattaci</a></div></div>';
      } else {
        list.innerHTML = CN.accordionHTML(items, "faq", 2);
      }
      status.textContent = items.length === 1 ? "1 domanda trovata" : items.length + " domande trovate";
    }
    input.addEventListener("input", render);
    root.querySelector("form").addEventListener("submit", function (e) { e.preventDefault(); render(); });
    pills.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-cat]");
      if (!b) return;
      current = b.getAttribute("data-cat");
      Array.prototype.forEach.call(pills.querySelectorAll("button"), function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      render();
    });
    list.addEventListener("click", function (e) {
      if (!e.target.closest("[data-faq-reset]")) return;
      input.value = "";
      current = "";
      Array.prototype.forEach.call(pills.querySelectorAll("button"), function (x) { x.setAttribute("aria-pressed", x.getAttribute("data-cat") === "" ? "true" : "false"); });
      render();
      input.focus();
    });
    render();
  }

  /* --------------------------------------------------------- chat demo
     WhatsApp NON è collegato: nessun numero reale è configurato.
     Per una futura configurazione autorizzata: inserire il numero in
     SITE_DATA.agency.whatsappNumber (formato internazionale, solo cifre)
     e sostituire l'apertura della modale con un link a
     "https://wa.me/" + numero, dopo aver verificato consenso e informativa. */
  function initChatDemo() {
    if (document.body.hasAttribute("data-no-chat")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chat-float";
    btn.setAttribute("data-modal-open", "chat-demo");
    btn.innerHTML = CN.icon("chat") + '<span class="chat-float__label">WhatsApp (demo)</span>';
    btn.setAttribute("aria-label", "Chat WhatsApp dimostrativa: apre una finestra informativa");
    document.body.appendChild(btn);
    CN.createModal("chat-demo", "Chat WhatsApp (dimostrativa)",
      "<p>Questo pulsante fa parte di una demo: non apre nessuna chat e non è collegato ad alcun numero di telefono.</p>" +
      '<p class="muted small">In un sito reale qui si aprirebbe la conversazione con il numero ufficiale dell\'agenzia, configurato e autorizzato dal titolare.</p>' +
      '<div class="btn-row"><a class="btn btn--primary" href="contatti.html">Vai al modulo contatti</a><button type="button" class="btn btn--secondary" data-modal-close data-autofocus>Chiudi</button></div>');
  }

  /* --------------------------------------------------------- avvio */
  function init() {
    ensureLive();
    bindAgency();
    initNav();
    renderBlocks();
    initFaqPage();
    initChatDemo();
    syncFavorites();
    /* immagini che avevano già fallito prima del caricamento dello script */
    Array.prototype.forEach.call(document.images, function (img) {
      if (img.complete && img.getAttribute("src") && img.naturalWidth === 0 && !img.getAttribute("data-fallback")) useFallback(img);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
