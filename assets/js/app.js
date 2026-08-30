/* TRIA app shell: hash router, tab bar, overflow sheet, theme, service worker. */

(function () {
  "use strict";

  var TABS = ["home", "pathway", "pgx", "planner"];
  var SHEET = ["study", "report", "market", "brief"];
  var DEFAULT = "home";

  var main = document.getElementById("view");
  var tabbar = document.getElementById("tabbar");
  var sheet = document.getElementById("sheet");
  var backdrop = document.getElementById("sheet-backdrop");

  /* ---------------------------- theme ---------------------------- */

  var THEME_KEY = "tria.theme.v1";

  function readTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }

  function applyTheme(t) {
    if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t);
    else document.documentElement.removeAttribute("data-theme");

    var dark = t ? t === "dark"
      : !window.matchMedia || !window.matchMedia("(prefers-color-scheme: light)").matches;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#0b0f14" : "#f7f8fa");
  }

  function cycleTheme() {
    var order = [null, "light", "dark"];
    var next = order[(order.indexOf(readTheme()) + 1) % order.length];
    try {
      if (next) localStorage.setItem(THEME_KEY, next);
      else localStorage.removeItem(THEME_KEY);
    } catch (e) { /* storage unavailable — theme still applies for this session */ }
    applyTheme(next);
    return next;
  }

  applyTheme(readTheme());

  /* ---------------------------- sheet ---------------------------- */

  function openSheet(open) {
    backdrop.dataset.open = open ? "1" : "0";
    backdrop.setAttribute("aria-hidden", String(!open));
    var btn = document.getElementById("tab-more");
    if (btn) btn.setAttribute("aria-expanded", String(!!open));
    if (open) {
      var first = sheet.querySelector("a.row, button.row");
      if (first) first.focus();
    }
  }

  function buildSheet() {
    var links = SHEET.map(function (k) {
      var v = TRIA.views[k];
      return '<a class="row" href="#/' + k + '"><span class="ic" aria-hidden="true">' + v.icon + "</span>" +
        "<span><b>" + v.title + "</b><span class='sub'>" + sheetSub(k) + "</span></span></a>";
    }).join("");

    sheet.innerHTML =
      '<div class="grip" aria-hidden="true"></div>' +
      "<h2>More sections</h2>" + links +
      "<h2>App</h2>" +
      '<button class="row" type="button" id="themebtn"><span class="ic" aria-hidden="true">◐</span>' +
        "<span><b>Appearance</b><span class='sub' id='themelabel'></span></span></button>" +
      '<button class="row" type="button" id="aboutbtn"><span class="ic" aria-hidden="true">ⓘ</span>' +
        "<span><b>Limits and disclaimers</b><span class='sub'>What this app is not</span></span></button>";

    updateThemeLabel();

    sheet.querySelector("#themebtn").addEventListener("click", function () {
      cycleTheme();
      updateThemeLabel();
    });

    sheet.querySelector("#aboutbtn").addEventListener("click", function () {
      openSheet(false);
      go("about");
    });
  }

  function sheetSub(k) {
    return {
      study:  "Evidence, market, regulation, critique",
      report: "An annotated mock, so a real one is less opaque",
      market: "Who sells what in India, at what band",
      brief:  "A printable page for a clinician"
    }[k] || "";
  }

  function updateThemeLabel() {
    var t = readTheme();
    var el = document.getElementById("themelabel");
    if (el) el.textContent = t === "light" ? "Light" : t === "dark" ? "Dark" : "Follows your system";
  }

  /* ---------------------------- about ---------------------------- */

  TRIA.views.about = {
    title: "Limits",
    nav: "Limits", icon: "ⓘ",
    render: function () {
      return '' +
        '<div class="eyebrow">About</div>' +
        "<h1>What this is not</h1>" +
        '<div class="notice"><strong>TRIA is educational.</strong>It does not sequence DNA, interpret your laboratory results as a clinician would, diagnose anything, or replace medical advice.</div>' +
        "<h2>Hard limits</h2>" +
        "<ul>" +
          "<li><b>No medical advice.</b> Nothing here is a recommendation for you specifically.</li>" +
          "<li><b>ACMG recommends against routine MTHFR polymorphism testing.</b></li>" +
          "<li><b>CDC:</b> people with MTHFR variants can still process folic acid.</li>" +
          "<li><b>Pharmacogenomic content is restricted</b> to well-known CPIC and FDA-labelled pairs, with one pair marked explicitly as not yet actionable.</li>" +
          "<li><b>Prices are 2025-2026 public list bands</b> for categories of service, not quotes, and they will drift.</li>" +
        "</ul>" +
        "<h2>Your data</h2>" +
        "<p>Everything you type — planner answers and doctor-brief notes — is stored in this app's local storage on this device. There is no account, no server, no analytics and no network call in normal use. Clearing app data deletes it permanently.</p>" +
        "<h2>Offline</h2>" +
        "<p>The whole app is bundled. Once installed it works with no connection at all, which is the point: the moment you need the pharmacogenomics section is often the moment you are standing in a hospital corridor.</p>" +
        '<h2>Source</h2>' +
        '<p><a href="https://github.com/mayurghule-ux/tria-precision-health" rel="noopener">github.com/mayurghule-ux/tria-precision-health</a></p>' +
        '<div class="btnrow"><a class="btn ghost" href="#/home">Back to the start</a></div>';
    }
  };

  /* --------------------------- routing --------------------------- */

  function currentKey() {
    var k = (location.hash || "").replace(/^#\/?/, "").split("?")[0];
    return TRIA.views[k] ? k : DEFAULT;
  }

  function go(k) { location.hash = "#/" + k; }

  function render() {
    var k = currentKey();
    var v = TRIA.views[k];

    main.innerHTML = v.render();
    document.title = k === "home" ? "TRIA — three layers, one story" : v.title + " · TRIA";

    if (typeof v.mount === "function") {
      try {
        v.mount(main);
      } catch (err) {
        // A broken interactive section must not take the whole app down.
        if (window.console) console.error("mount failed for " + k, err);
      }
    }

    Array.prototype.forEach.call(tabbar.querySelectorAll("[data-k]"), function (a) {
      if (a.dataset.k === k) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });

    var moreBtn = document.getElementById("tab-more");
    if (moreBtn) {
      if (SHEET.indexOf(k) !== -1) moreBtn.setAttribute("aria-current", "page");
      else moreBtn.removeAttribute("aria-current");
    }

    openSheet(false);
    window.scrollTo(0, 0);
    main.focus();
  }

  /* ----------------------------- init ---------------------------- */

  function buildTabs() {
    tabbar.innerHTML = TABS.map(function (k) {
      var v = TRIA.views[k];
      return '<a href="#/' + k + '" data-k="' + k + '">' +
        '<span class="ic" aria-hidden="true">' + v.icon + "</span>" + v.nav + "</a>";
    }).join("") +
      '<button type="button" id="tab-more" aria-expanded="false" aria-controls="sheet">' +
        '<span class="ic" aria-hidden="true">⋯</span>More</button>';

    document.getElementById("tab-more").addEventListener("click", function () {
      openSheet(backdrop.dataset.open !== "1");
    });
  }

  backdrop.addEventListener("click", function (e) {
    if (e.target === backdrop) openSheet(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") openSheet(false);
  });

  document.getElementById("themetoggle").addEventListener("click", function () {
    cycleTheme();
    updateThemeLabel();
  });

  window.addEventListener("hashchange", render);

  buildTabs();
  buildSheet();
  if (!location.hash) location.replace("#/" + DEFAULT);
  render();

  /* ------------------------ service worker ------------------------ */

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function (err) {
        if (window.console) console.warn("Service worker not registered:", err);
      });
    });
  }
})();
