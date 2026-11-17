/* =========================================================================
   CasaNova Immobiliare — favorites.js
   1) Archivio dei preferiti (solo ID immobili, nessun dato personale).
      Usa localStorage se disponibile, altrimenti una lista in memoria.
   2) Rendering della pagina preferiti.html.
   ========================================================================= */

(function () {
  "use strict";

  var KEY = "casanova:preferiti:v1";
  var memory = [];
  var storage = null;

  /* localStorage può essere assente, bloccato (modalità privata, file://,
     impostazioni del browser) o pieno: ogni accesso è protetto. */
  try {
    var test = "__casanova_test__";
    window.localStorage.setItem(test, "1");
    window.localStorage.removeItem(test);
    storage = window.localStorage;
  } catch (e) {
    storage = null;
  }

  function validIds(list) {
    var known = (window.SITE_DATA && window.SITE_DATA.properties) || [];
    var seen = {};
    return list.filter(function (id) {
      if (typeof id !== "string" || seen[id]) return false;
      seen[id] = true;
      return known.some(function (p) { return p.id === id; });
    });
  }

  function read() {
    if (storage) {
      try {
        var parsed = JSON.parse(storage.getItem(KEY) || "[]");
        return Array.isArray(parsed) ? validIds(parsed) : [];
      } catch (e) {
        return memory.slice();
      }
    }
    return memory.slice();
  }

  function write(list) {
    memory = list.slice();
    if (storage) {
      try {
        storage.setItem(KEY, JSON.stringify(list));
      } catch (e) {
        /* Quota piena o accesso negato: resta valida la copia in memoria. */
        storage = null;
      }
    }
    emit();
  }

  function emit() {
    var ev;
    try {
      ev = new CustomEvent("cn:favorites", { detail: { ids: read() } });
    } catch (e) {
      ev = document.createEvent("CustomEvent");
      ev.initCustomEvent("cn:favorites", false, false, { ids: read() });
    }
    document.dispatchEvent(ev);
  }

  if (storage) memory = read();

  window.CNFavorites = {
    all: read,
    has: function (id) { return read().indexOf(id) !== -1; },
    count: function () { return read().length; },
    add: function (id) { var l = read(); if (l.indexOf(id) === -1) { l.push(id); write(l); } },
    remove: function (id) { write(read().filter(function (x) { return x !== id; })); },
    toggle: function (id) {
      if (this.has(id)) { this.remove(id); return false; }
      this.add(id);
      return true;
    },
    clear: function () { write([]); },
    isPersistent: function () { return !!storage; }
  };

  /* Sincronizza le altre schede aperte dello stesso sito. */
  window.addEventListener("storage", function (e) {
    if (e.key === KEY) emit();
  });

  /* ------------------------------------------------- pagina preferiti */
  document.addEventListener("DOMContentLoaded", function () {
    var root = document.querySelector("[data-favorites-page]");
    if (!root || !window.CN) return;
    var CN = window.CN;
    var listEl = root.querySelector("[data-favorites-list]");
    var toolbar = root.querySelector("[data-favorites-toolbar]");
    var countEl = root.querySelector("[data-favorites-count]");
    var clearBtn = root.querySelector("[data-favorites-clear]");
    var notice = root.querySelector("[data-storage-notice]");

    if (notice) notice.hidden = window.CNFavorites.isPersistent();

    function render() {
      var ids = window.CNFavorites.all();
      var props = ids.map(CN.findProperty).filter(Boolean);
      if (!props.length) {
        toolbar.hidden = true;
        listEl.innerHTML =
          '<div class="empty-state">' + CN.icon("heart") +
          '<h2>Non hai ancora salvato immobili</h2>' +
          '<p>Tocca il cuore su una scheda o su un annuncio per ritrovarlo qui. Salviamo soltanto il riferimento dell\'immobile, nessun dato personale.</p>' +
          '<div class="btn-row"><a class="btn btn--primary" href="immobili.html">Esplora gli immobili</a>' +
          '<a class="btn btn--secondary" href="immobili.html?prestigio=1">Selezione Prestigio</a></div></div>';
        return;
      }
      toolbar.hidden = false;
      countEl.textContent = props.length === 1 ? "1 immobile salvato" : props.length + " immobili salvati";
      listEl.innerHTML = '<div class="cards">' + props.map(function (p) {
        return CN.renderCard(p, { removable: true, lazy: false });
      }).join("") + "</div>";
    }

    clearBtn.addEventListener("click", function () {
      CN.confirm({
        title: "Svuotare la lista dei preferiti?",
        text: "Verranno rimossi tutti gli immobili salvati in questo browser.",
        confirmLabel: "Svuota la lista",
        opener: clearBtn
      }).then(function (ok) {
        if (!ok) return;
        window.CNFavorites.clear();
        CN.announce("Lista dei preferiti svuotata.", true);
        var h = document.querySelector("h1");
        if (h) { h.setAttribute("tabindex", "-1"); h.focus(); }
      });
    });

    document.addEventListener("cn:favorites", render);
    render();
  });
})();
