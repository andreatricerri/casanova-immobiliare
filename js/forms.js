/* =========================================================================
   CasaNova Immobiliare — forms.js
   Validazione dei moduli dimostrativi. Nessun invio di rete, nessun
   salvataggio dei dati personali: alla conferma il modulo viene svuotato.
   ========================================================================= */

(function () {
  "use strict";
  var CN = window.CN;
  var D = window.SITE_DATA;

  var SUCCESS = "Simulazione completata. Nessuna richiesta è stata inviata e nessuna visita è stata prenotata.";
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE = /^\+?[0-9\s().\/-]{6,20}$/;

  function today() {
    var d = new Date();
    var m = String(d.getMonth() + 1), day = String(d.getDate());
    return d.getFullYear() + "-" + (m.length < 2 ? "0" + m : m) + "-" + (day.length < 2 ? "0" + day : day);
  }
  function setMinDates(root) {
    Array.prototype.forEach.call((root || document).querySelectorAll("input[type=date][data-min-today]"), function (el) {
      el.min = today();
    });
  }

  function labelOf(field) {
    if (field.getAttribute("data-label")) return field.getAttribute("data-label");
    var l = field.id && document.querySelector('label[for="' + field.id + '"]');
    return l ? l.textContent.replace(/\*|\(facoltativ[oa]\)/g, "").trim().toLowerCase() : "questo campo";
  }

  function fieldsOf(form) {
    return Array.prototype.filter.call(form.querySelectorAll("input, select, textarea"), function (el) {
      if (el.disabled || el.type === "hidden" || el.type === "submit" || el.readOnly) return false;
      return !el.closest("[hidden]");
    });
  }

  function check(field) {
    var v = field.type === "checkbox" ? field.checked : String(field.value || "").trim();
    var name = labelOf(field);
    var required = field.required;
    var when = field.getAttribute("data-required-when");
    if (when && field.form) {
      var parts = when.split("=");
      var other = field.form.elements[parts[0]];
      if (other && other.value === parts[1]) required = true;
    }
    if (required && !v) {
      if (field.type === "checkbox") return "Per proseguire conferma la " + name + ".";
      if (field.tagName === "SELECT") return "Seleziona " + name + ".";
      return "Inserisci " + name + ".";
    }
    if (!v || field.type === "checkbox") return "";
    if (field.type === "email" && !EMAIL.test(v)) return "Inserisci un indirizzo email valido, ad esempio nome@esempio.it.";
    if (field.type === "tel" && !PHONE.test(v)) return "Inserisci un numero di telefono valido: solo cifre, spazi e l'eventuale prefisso +.";
    if (field.type === "date") {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return "Inserisci una data valida.";
      if (field.min && v < field.min) return "Scegli una data a partire da oggi.";
    }
    if (field.type === "number" && field.value !== "") {
      var n = Number(field.value);
      if (isNaN(n) || (field.min !== "" && n < Number(field.min)) || (field.max !== "" && n > Number(field.max))) {
        return "Inserisci un valore " + (field.min !== "" ? "da " + field.min : "") + (field.max !== "" ? " a " + field.max : "") + ".";
      }
    }
    if (field.maxLength > 0 && v.length > field.maxLength) return "Il testo può contenere al massimo " + field.maxLength + " caratteri.";
    return "";
  }

  function setError(field, msg) {
    var id = field.id + "-error";
    var err = document.getElementById(id);
    var describedBy = (field.getAttribute("aria-describedby") || "").split(" ").filter(function (x) { return x && x !== id; });
    if (msg) {
      if (!err) {
        err = document.createElement("p");
        err.className = "field-error";
        err.id = id;
        var container = field.closest(".field") || field.closest(".check") || field.parentNode;
        if (container.classList.contains("check")) container.parentNode.insertBefore(err, container.nextSibling);
        else container.appendChild(err);
      }
      err.textContent = msg;
      field.setAttribute("aria-invalid", "true");
      describedBy.push(id);
    } else {
      if (err) err.parentNode.removeChild(err);
      field.removeAttribute("aria-invalid");
    }
    if (describedBy.length) field.setAttribute("aria-describedby", describedBy.join(" "));
    else field.removeAttribute("aria-describedby");
  }

  function summary(form, errors) {
    var box = form.querySelector(".error-summary");
    if (!errors.length) { if (box) box.parentNode.removeChild(box); return null; }
    if (!box) {
      box = document.createElement("div");
      box.className = "error-summary";
      box.setAttribute("tabindex", "-1");
      box.setAttribute("role", "alert");
      form.insertBefore(box, form.firstChild);
    }
    box.innerHTML = "<h3>" + (errors.length === 1 ? "C'è un campo da controllare" : "Ci sono " + errors.length + " campi da controllare") + "</h3><ul>" +
      errors.map(function (e) { return '<li><a href="#' + e.field.id + '">' + CN.esc(e.msg) + "</a></li>"; }).join("") + "</ul>";
    return box;
  }

  function validateForm(form) {
    var errors = [];
    fieldsOf(form).forEach(function (f) {
      var msg = check(f);
      setError(f, msg);
      if (msg) errors.push({ field: f, msg: msg });
    });
    return errors;
  }

  function success(form) {
    var wrap = document.createElement("div");
    wrap.className = "form-success";
    wrap.setAttribute("role", "status");
    wrap.setAttribute("tabindex", "-1");
    var extra = form.getAttribute("data-success-extra");
    wrap.innerHTML = "<h3>Richiesta simulata</h3><p>" + SUCCESS + "</p>" + (extra ? "<p>" + CN.esc(extra) + "</p>" : "") +
      '<p class="small muted">I dati inseriti non sono stati salvati e il modulo è stato svuotato.</p>' +
      '<button type="button" class="btn btn--secondary btn--sm" data-form-again>Compila una nuova richiesta</button>';
    form.parentNode.insertBefore(wrap, form);
    form.reset();
    delete form.dataset.submitted;
    fieldsOf(form).forEach(function (f) { setError(f, ""); });
    summary(form, []);
    form.hidden = true;
    var restore = form._restore;
    if (typeof restore === "function") restore();
    wrap.focus();
    wrap.querySelector("[data-form-again]").addEventListener("click", function () {
      wrap.parentNode.removeChild(wrap);
      form.hidden = false;
      var first = fieldsOf(form)[0];
      if (first) first.focus();
    });
  }

  /* delega: funziona anche per i moduli creati dinamicamente (scheda immobile) */
  document.addEventListener("submit", function (e) {
    var form = e.target;
    if (!form.matches || !form.matches("form[data-demo-form]")) return;
    e.preventDefault();
    setMinDates(form);
    form.dataset.submitted = "1";
    var errors = validateForm(form);
    var box = summary(form, errors);
    if (errors.length) {
      if (errors.length > 1 && box) box.focus();
      else errors[0].field.focus();
      return;
    }
    /* Nessuna chiamata di rete: si tratta di una simulazione. */
    success(form);
  });

  document.addEventListener("focusout", function (e) {
    var f = e.target;
    var form = f.form;
    if (!form || !form.dataset || !form.dataset.submitted || !form.matches("[data-demo-form]")) return;
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(f.tagName)) {
      setError(f, check(f));
    }
  });
  document.addEventListener("change", function (e) {
    var f = e.target;
    if (f.type === "checkbox" && f.form && f.form.dataset && f.form.dataset.submitted) setError(f, check(f));
  });
  document.addEventListener("focusin", function (e) {
    if (e.target.matches && e.target.matches("input[type=date][data-min-today]")) e.target.min = today();
  });
  document.addEventListener("click", function (e) {
    var a = e.target.closest(".error-summary a[href^='#']");
    if (!a) return;
    var target = document.getElementById(a.getAttribute("href").slice(1));
    if (target) { e.preventDefault(); target.focus(); target.scrollIntoView({ block: "center" }); }
  });

  /* ---------------------------------------------- pagina contatti */
  function initContactForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;
    var params = new URLSearchParams(location.search);
    var tipo = form.querySelector("#c-tipo");
    var visit = form.querySelector("[data-visit-fields]");
    var valuation = form.querySelector("[data-valuation-hint]");
    var refWrap = form.querySelector("[data-ref]");
    var agentSel = form.querySelector("#c-agente");

    agentSel.innerHTML = '<option value="">Nessuna preferenza</option>' + D.agents.map(function (a) {
      return '<option value="' + a.id + '">' + CN.esc(a.name) + " – " + CN.esc(a.role) + "</option>";
    }).join("");

    function sync() {
      var t = tipo.value;
      visit.hidden = t !== "visita";
      valuation.hidden = t !== "valutazione" && t !== "vendita";
    }
    tipo.addEventListener("change", sync);

    var p = CN.findProperty(params.get("id"));
    var t = params.get("tipo");
    if (["info", "visita", "vendita", "affitto", "valutazione"].indexOf(t) !== -1) tipo.value = t;
    else if (p) tipo.value = "visita";

    function showRef(prop) {
      if (!prop) { refWrap.hidden = true; refWrap.innerHTML = ""; return; }
      refWrap.hidden = false;
      refWrap.innerHTML =
        '<p class="label" id="ref-label">Immobile di riferimento</p>' +
        '<div class="ref-box" aria-labelledby="ref-label"><img src="' + prop.gallery[0].src + '" alt="" width="1200" height="800">' +
        "<div><strong>" + CN.esc(prop.title) + "</strong><span>Rif. " + prop.id + " · " + CN.esc(prop.quartiere) + ", " + CN.esc(prop.comune) + " · " + CN.priceText(prop) + "</span></div></div>" +
        '<input type="hidden" name="riferimento" value="' + prop.id + '">' +
        '<p class="small" style="margin:.5rem 0 0"><a href="' + CN.propertyUrl(prop) + '">Torna alla scheda</a> · <button type="button" class="btn btn--ghost btn--sm" data-ref-remove>Rimuovi riferimento</button></p>';
    }
    showRef(p);
    refWrap.addEventListener("click", function (e) {
      if (!e.target.closest("[data-ref-remove]")) return;
      showRef(null);
      tipo.focus();
    });

    var ag = CN.agent(params.get("agente"));
    if (ag) agentSel.value = ag.id;

    var initial = { tipo: tipo.value, agente: agentSel.value, prop: p };
    form._restore = function () {
      tipo.value = initial.tipo;
      agentSel.value = initial.agente;
      showRef(initial.prop);
      sync();
    };
    sync();
  }

  function init() {
    setMinDates(document);
    initContactForm();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
