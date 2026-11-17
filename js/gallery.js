/* =========================================================================
   CasaNova Immobiliare — gallery.js
   Galleria con frecce, miniature, swipe touch, tastiera e lightbox
   accessibile (Escape, frecce, gestione del focus).
   ========================================================================= */

(function () {
  "use strict";
  var CN = window.CN;

  function swipe(el, onLeft, onRight) {
    var x0 = null, y0 = null, moved = false;
    el.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1) { x0 = null; return; }
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
      moved = false;
    }, { passive: true });
    el.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var t = e.changedTouches[0];
      var dx = t.clientX - x0, dy = t.clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        moved = true;
        if (dx < 0) onLeft(); else onRight();
      }
    }, { passive: true });
    return function wasSwipe() { var m = moved; moved = false; return m; };
  }

  function CNGallery(root, images, opts) {
    opts = opts || {};
    var index = 0;
    var total = images.length;
    var title = opts.title || "Galleria";

    root.classList.add("gallery");
    root.innerHTML =
      '<div class="gallery__stage">' +
        '<img class="gallery__main" src="' + images[0].src + '" alt="' + CN.esc(images[0].alt) + '" width="' + images[0].width + '" height="' + images[0].height + '" fetchpriority="high">' +
        '<button type="button" class="gallery__open"><span class="visually-hidden">Apri la foto a schermo intero</span>' +
          '<span class="gallery__zoom" aria-hidden="true">' + CN.icon("expand", "icon--sm") + "Ingrandisci</span></button>" +
        (total > 1 ?
          '<button type="button" class="gallery__nav gallery__nav--prev" aria-label="Foto precedente">' + CN.icon("chevronLeft") + "</button>" +
          '<button type="button" class="gallery__nav gallery__nav--next" aria-label="Foto successiva">' + CN.icon("chevronRight") + "</button>" : "") +
        '<span class="gallery__counter" aria-hidden="true"></span>' +
      "</div>" +
      '<p class="visually-hidden" aria-live="polite" data-gallery-status></p>' +
      (total > 1 ? '<ul class="gallery__thumbs" aria-label="Miniature">' + images.map(function (im, i) {
        return '<li><button type="button" data-index="' + i + '" aria-label="Mostra foto ' + (i + 1) + " di " + total + ": " + CN.esc(im.label) + '"><img src="' + im.src + '" alt="" width="' + im.width + '" height="' + im.height + '" loading="lazy"></button></li>';
      }).join("") + "</ul>" : "");

    var stage = root.querySelector(".gallery__stage");
    var main = root.querySelector(".gallery__main");
    var counter = root.querySelector(".gallery__counter");
    var status = root.querySelector("[data-gallery-status]");
    var thumbs = root.querySelectorAll(".gallery__thumbs button");
    var openBtn = root.querySelector(".gallery__open");

    function preload(i) {
      var im = new Image();
      im.src = images[(i + total) % total].src;
    }

    function go(i, announce) {
      index = (i + total) % total;
      var im = images[index];
      main.removeAttribute("data-fallback");
      main.src = im.src;
      main.alt = im.alt;
      main.width = im.width;
      main.height = im.height;
      counter.textContent = (index + 1) + " / " + total;
      Array.prototype.forEach.call(thumbs, function (b, k) {
        if (k === index) {
          b.setAttribute("aria-current", "true");
          var list = b.closest("ul");
          if (list && list.scrollWidth > list.clientWidth) {
            list.scrollLeft = b.offsetLeft - list.clientWidth / 2 + b.clientWidth / 2;
          }
        } else b.removeAttribute("aria-current");
      });
      if (announce) status.textContent = "Foto " + (index + 1) + " di " + total + ": " + im.label;
      preload(index + 1);
      preload(index - 1);
    }

    var wasSwipe = swipe(stage, function () { go(index + 1, true); }, function () { go(index - 1, true); });

    root.addEventListener("click", function (e) {
      if (e.target.closest(".gallery__nav--prev")) go(index - 1, true);
      else if (e.target.closest(".gallery__nav--next")) go(index + 1, true);
      else {
        var t = e.target.closest("[data-index]");
        if (t) go(parseInt(t.getAttribute("data-index"), 10), true);
      }
    });
    openBtn.addEventListener("click", function () {
      if (wasSwipe()) return;
      openLightbox(openBtn);
    });
    root.addEventListener("keydown", function (e) {
      if (total < 2) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1, true); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1, true); }
    });

    /* ------------------------------------------------- lightbox */
    var lb = null, release = null, opener = null;

    function openLightbox(from) {
      opener = from || document.activeElement;
      lb = document.createElement("div");
      lb.className = "lightbox";
      lb.setAttribute("role", "dialog");
      lb.setAttribute("aria-modal", "true");
      lb.setAttribute("aria-label", "Galleria fotografica: " + title);
      lb.innerHTML =
        '<div class="lightbox__bar"><span class="lightbox__count" aria-live="polite"></span>' +
          '<button type="button" class="icon-btn lightbox__close" aria-label="Chiudi galleria">' + CN.icon("close") + "</button></div>" +
        '<div class="lightbox__stage"><img class="lightbox__img" alt="">' +
          (total > 1 ? '<button type="button" class="icon-btn lightbox__prev" aria-label="Foto precedente">' + CN.icon("chevronLeft") + "</button>" +
          '<button type="button" class="icon-btn lightbox__next" aria-label="Foto successiva">' + CN.icon("chevronRight") + "</button>" : "") +
        "</div>" +
        '<p class="lightbox__caption"></p>';
      document.body.appendChild(lb);
      CN.lockScroll(true);
      release = CN.trapFocus(lb);
      update();
      lb.querySelector(".lightbox__close").focus();

      lb.addEventListener("click", function (e) {
        if (e.target.closest(".lightbox__close")) close();
        else if (e.target.closest(".lightbox__prev")) step(-1);
        else if (e.target.closest(".lightbox__next")) step(1);
        else if (e.target.classList.contains("lightbox__stage")) close();
      });
      lb.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); }
        else if (e.key === "ArrowLeft" && total > 1) { e.preventDefault(); step(-1); }
        else if (e.key === "ArrowRight" && total > 1) { e.preventDefault(); step(1); }
      });
      swipe(lb.querySelector(".lightbox__stage"), function () { step(1); }, function () { step(-1); });
    }
    function step(d) { go(index + d, false); update(); }
    function update() {
      if (!lb) return;
      var im = images[index];
      var img = lb.querySelector(".lightbox__img");
      img.removeAttribute("data-fallback");
      img.src = im.src;
      img.alt = im.alt;
      lb.querySelector(".lightbox__count").textContent = "Foto " + (index + 1) + " di " + total;
      lb.querySelector(".lightbox__caption").textContent = im.label + " · Immagine illustrativa dimostrativa";
    }
    function close() {
      if (!lb) return;
      release();
      lb.parentNode.removeChild(lb);
      lb = null;
      CN.lockScroll(false);
      if (opener && document.contains(opener)) opener.focus();
    }

    go(0, false);
    return { go: go, open: openLightbox };
  }

  window.CNGallery = CNGallery;
})();
