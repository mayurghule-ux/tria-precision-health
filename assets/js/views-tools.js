/* TRIA views, part 2 of 3: the two interactive tools — PGx lab and Planner. */

(function () {
  "use strict";

  var esc = TRIA.esc;
  TRIA.views = TRIA.views || {};

  /* ============================ PGx lab ============================ */

  var PGX_FILTERS = [
    { id: "all",   label: "All" },
    { id: "india", label: "High relevance in India" },
    { id: "a",     label: "CPIC level A only" },
    { id: "fda",   label: "Named in a drug label" }
  ];

  function levelBadge(level) {
    if (/CPIC A/.test(level)) return '<span class="badge a">' + esc(level) + "</span>";
    if (/Emerging/.test(level)) return '<span class="badge c">' + esc(level) + "</span>";
    return '<span class="badge b">' + esc(level) + "</span>";
  }

  function pgxRow(p) {
    return '' +
      '<details class="result">' +
        '<summary>' +
          '<div>' +
            '<div class="title">' + esc(p.drug) + "</div>" +
            '<div class="sub"><span class="gene">' + esc(p.gene) + "</span> &middot; " + esc(p.area) + "</div>" +
          "</div>" +
        "</summary>" +
        '<div class="body">' +
          '<div class="badgerow">' + levelBadge(p.level) +
            (p.label !== "—" ? '<span class="badge b">' + esc(p.label) + "</span>" : "") +
            (p.india ? '<span class="badge in">India-relevant</span>' : "") +
          "</div>" +
          "<p><b>What the gene does to the drug.</b> " + esc(p.effect) + "</p>" +
          "<p><b>What guidelines suggest.</b> " + esc(p.action) + "</p>" +
          '<p class="small" style="margin-bottom:0"><b>Why it is on this list.</b> ' + esc(p.why) + "</p>" +
        "</div>" +
      "</details>";
  }

  var pgx = {
    title: "PGx lab",
    nav: "PGx", icon: "⚗",
    render: function () {
      return '' +
        '<div class="eyebrow">PGx lab</div>' +
        '<h1>Gene-drug pairs</h1>' +
        '<p class="lede">' + TRIA.pgx.length + ' pairs where a genotype has a documented bearing on whether a drug works or whether it harms. Restricted to well-known CPIC and FDA-labelled pairs; the speculative end of pharmacogenomics is deliberately absent.</p>' +

        '<div class="notice"><strong>Reference, not a prescription.</strong>Nothing here tells you to start, stop, or change a dose. Bring a pair that concerns you to the person writing the prescription.</div>' +

        '<div class="field">' +
          '<label for="pgxq">Search by drug, gene or specialty</label>' +
          '<input type="search" id="pgxq" placeholder="clopidogrel, CYP2D6, oncology…" autocomplete="off" autocapitalize="none" spellcheck="false">' +
        "</div>" +

        '<div class="chips" id="pgxfilters" role="group" aria-label="Filter pairs">' +
          PGX_FILTERS.map(function (f, i) {
            return '<button class="chip" type="button" data-f="' + f.id + '" aria-pressed="' + (i === 0) + '">' + esc(f.label) + "</button>";
          }).join("") +
        "</div>" +

        '<p class="small" id="pgxcount" aria-live="polite" style="margin:14px 0 10px"></p>' +
        '<div id="pgxlist"></div>' +

        '<p class="srcnote">Levels follow CPIC\'s own grading. "Named in a drug label" means a regulator has put pharmacogenomic information in the product label — it does not always mean testing is required. Guidelines are revised; check CPIC or the regulator before acting.</p>';
    },
    mount: function (root) {
      var q = root.querySelector("#pgxq");
      var list = root.querySelector("#pgxlist");
      var count = root.querySelector("#pgxcount");
      var filterBox = root.querySelector("#pgxfilters");
      var active = "all";

      function matches(p) {
        if (active === "india" && !p.india) return false;
        if (active === "a" && !/CPIC A/.test(p.level)) return false;
        if (active === "fda" && p.label === "—") return false;
        var term = q.value.trim().toLowerCase();
        if (!term) return true;
        return (p.drug + " " + p.gene + " " + p.area + " " + p.effect + " " + p.action)
          .toLowerCase().indexOf(term) !== -1;
      }

      function draw() {
        var hits = TRIA.pgx.filter(matches);
        count.textContent = hits.length + (hits.length === 1 ? " pair" : " pairs");
        list.innerHTML = hits.length
          ? hits.map(pgxRow).join("")
          : '<p class="empty">No pair matches that. Try a drug name, a gene, or clear the filter.</p>';
      }

      q.addEventListener("input", draw);
      filterBox.addEventListener("click", function (e) {
        var btn = e.target.closest("button[data-f]");
        if (!btn) return;
        active = btn.dataset.f;
        Array.prototype.forEach.call(filterBox.querySelectorAll("button"), function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });
        draw();
      });

      draw();
    }
  };

  /* ============================ Planner ============================ */

  var CANDIDATES = [
    { key: "lipid",  name: "Lipid panel",                     band: "₹300-900",   budget: 1, base: 3,
      why: "The cheapest useful starting point, and the input to every cardiovascular risk score." },
    { key: "apob",   name: "ApoB",                            band: "₹600-1,500", budget: 2, base: 1,
      why: "Counts atherogenic particles directly. Where it disagrees with LDL-C, it is the one that tracks risk." },
    { key: "lpa",    name: "Lp(a) — once in a lifetime",      band: "₹800-2,000", budget: 2, base: 1,
      why: "Genetically set and essentially fixed, so one measurement settles the question permanently." },
    { key: "hba1c",  name: "HbA1c",                           band: "₹300-700",   budget: 1, base: 2,
      why: "Standard glycaemic screen. Blunt on its own — reads normal until fairly late." },
    { key: "insulin",name: "Fasting insulin + glucose (HOMA-IR)", band: "₹500-1,400", budget: 2, base: 0,
      why: "Insulin resistance shows years before glucose does, and appears at lower BMI in South Asian physiology." },
    { key: "ferritin", name: "Ferritin + CBC",                band: "₹400-1,000", budget: 1, base: 2,
      why: "Iron deficiency is the highest-prevalence correctable finding here, and haemoglobin alone misses it." },
    { key: "tsh",    name: "TSH",                             band: "₹250-600",   budget: 1, base: 2,
      why: "Common, treatable, and its symptoms are easily filed under stress." },
    { key: "b12",    name: "Vitamin B12",                     band: "₹600-1,500", budget: 1, base: 1,
      why: "Genuinely common deficiency on vegetarian diets and long-term metformin, with a cheap fix." },
    { key: "alt",    name: "ALT / AST",                       band: "₹250-700",   budget: 1, base: 1,
      why: "A raised ALT is often the first sign of metabolic fatty liver disease." },
    { key: "renal",  name: "Creatinine + eGFR",               band: "₹250-600",   budget: 1, base: 1,
      why: "Sets a baseline, and practically decides safe dosing for many drugs later." },
    { key: "vitd",   name: "Vitamin D (25-OH)",               band: "₹800-2,000", budget: 2, base: 0,
      why: "Worth measuring once. Repeat testing usually buys cost rather than information." },
    { key: "acr",    name: "Urine albumin-to-creatinine ratio", band: "₹400-1,000", budget: 2, base: 0,
      why: "Turns abnormal before creatinine does, and changes treatment when it does." },
    { key: "pgxtarget", name: "Targeted PGx test for the specific drug", band: "₹2,000-8,000", budget: 2, base: 0,
      why: "When one prescription is imminent, a single-gene test beats a broad panel on both cost and turnaround." },
    { key: "pgxpanel", name: "Clinical pharmacogenomics panel", band: "₹8,000-25,000", budget: 3, base: 0,
      why: "Worth it if you expect repeated prescribing decisions. Check it covers CYP2C19, CYP2D6, DPYD, TPMT/NUDT15 and HLA-B*15:02." },
    { key: "fhgene", name: "Familial hypercholesterolaemia genetic testing (via a clinician)", band: "₹8,000-25,000", budget: 3, base: 0,
      why: "Changes treatment intensity for you and triggers cascade screening of your relatives." },
    { key: "carrier", name: "Carrier screening (pre-conception)", band: "₹10,000-30,000", budget: 3, base: 0,
      why: "Genuinely useful in this specific window, and of little use outside it." },
    { key: "folate", name: "Periconceptional folic acid — no test needed", band: "₹0", budget: 1, base: 0,
      why: "One of the best-evidenced interventions in preventive medicine, and it applies whatever your MTHFR genotype is." },
    { key: "genref", name: "Clinical genetics referral — not a consumer test", band: "consult fee", budget: 1, base: 0,
      why: "A strong young-onset cancer family history needs a proper pedigree and a clinician, not a mail-order kit." }
  ];

  var RULES = {
    goal: {
      cvd:     { apob: 4, lpa: 4, lipid: 2 },
      metab:   { hba1c: 3, insulin: 3, alt: 2, lipid: 1 },
      fatigue: { ferritin: 4, tsh: 3, b12: 3, vitd: 1 },
      meds:    { pgxtarget: 5, pgxpanel: 2 },
      family:  { folate: 5, carrier: 3, b12: 2, tsh: 1 },
      curious: {}
    },
    fh: {
      cvd:    { apob: 4, lpa: 4 },
      dm:     { hba1c: 3, insulin: 3, acr: 1 },
      chol:   { apob: 4, lpa: 3, fhgene: 3 },
      cancer: { genref: 5 },
      drug:   { pgxpanel: 3, pgxtarget: 2 },
      none:   {}
    },
    age: {
      u30: { lipid: 1, ferritin: 1 },
      "30s": { lipid: 1, hba1c: 1, alt: 1 },
      "40s": { lipid: 1, hba1c: 2, apob: 2, renal: 1, alt: 1 },
      "55p": { lipid: 1, hba1c: 2, apob: 2, renal: 2, acr: 1, alt: 1 }
    },
    diet: { veg: { b12: 4, ferritin: 2 }, mixed: {} }
  };

  var BUDGET_CAP = { low: 1, mid: 2, high: 3 };

  var NEVER = [
    ["MTHFR genotyping", "ACMG recommends against routine MTHFR testing, and CDC notes that carriers process folic acid normally. If homocysteine is raised, measure B12 and folate instead."],
    ["A 90-analyte \"full body\" package", "Bundles you cannot edit, priced for volume. More incidental findings and follow-up scans, with no demonstrated mortality benefit in asymptomatic adults."],
    ["Direct-to-consumer wellness genomics", "The ancestry and carrier parts can be sound. The diet, fitness and trait sections rest on effect sizes too small to act on."],
    ["Whole genome sequencing, as a healthy adult", "Sequencing got cheap much faster than interpretation did. Most of the file will not change anything you do."],
    ["Repeat vitamin D testing", "Measure once. If you are treating a deficiency, treat it — re-testing every few months mostly buys cost."]
  ];

  var STORE_KEY = "tria.planner.v1";

  function loadAnswers() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* private mode, cleared storage, or storage blocked */ }
    return {};
  }

  function saveAnswers(a) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(a)); } catch (e) { /* non-fatal */ }
  }

  function buildPlan(ans) {
    var score = {};
    CANDIDATES.forEach(function (c) { score[c.key] = c.base; });

    function apply(table) {
      if (!table) return;
      Object.keys(table).forEach(function (k) { score[k] = (score[k] || 0) + table[k]; });
    }

    apply(RULES.age[ans.age]);
    apply(RULES.diet[ans.diet]);
    (ans.goal || []).forEach(function (g) { apply(RULES.goal[g]); });
    (ans.fh || []).forEach(function (f) { apply(RULES.fh[f]); });

    var cap = BUDGET_CAP[ans.budget] || 2;

    var picked = CANDIDATES
      .filter(function (c) { return score[c.key] > 0 && c.budget <= cap; })
      .sort(function (a, b) {
        if (score[b.key] !== score[a.key]) return score[b.key] - score[a.key];
        return a.budget - b.budget;
      });

    var deferred = CANDIDATES.filter(function (c) {
      return score[c.key] > 0 && c.budget > cap;
    });

    return { picked: picked, deferred: deferred, score: score };
  }

  function planHTML(ans) {
    var plan = buildPlan(ans);
    if (!plan.picked.length) {
      return '<p class="empty">Answer the questions above and a sequenced list appears here.</p>';
    }

    var out = '<h2>Your sequence</h2>' +
      '<p class="small">Ordered by how likely each result is to change something, given what you said. Prices are illustrative 2025-2026 Indian list bands.</p>';

    out += '<div class="card"><p style="margin-bottom:10px"><b>Before you buy anything.</b> Write down your blood pressure, your waist measurement, and what your parents and siblings were diagnosed with and at what age. These are free, and they change the interpretation of everything below.</p></div>';

    plan.picked.forEach(function (c, i) {
      out += '<div class="card">' +
        '<div style="display:flex;align-items:flex-start;gap:4px">' +
          '<span class="stepnum">' + (i + 1) + "</span>" +
          '<div style="flex:1"><b>' + esc(c.name) + '</b> <span class="badge">' + esc(c.band) + "</span>" +
          '<p class="small" style="margin:6px 0 0">' + esc(c.why) + "</p></div>" +
        "</div></div>";
    });

    if (plan.deferred.length) {
      out += "<h2>Above the budget you set</h2>" +
        '<p class="small">Relevant to your answers, but outside the amount you said you wanted to spend now.</p><ul>' +
        plan.deferred.map(function (c) {
          return "<li><b>" + esc(c.name) + "</b> — " + esc(c.band) + ". " + esc(c.why) + "</li>";
        }).join("") + "</ul>";
    }

    out += "<h2>What this plan deliberately leaves out</h2>" +
      '<p class="small">A test list is only as useful as the things it refuses to sell you.</p>';
    out += '<div class="card"><ul style="margin-bottom:0">' + NEVER.map(function (n) {
      return "<li><b>" + esc(n[0]) + "</b> — " + esc(n[1]) + "</li>";
    }).join("") + "</ul></div>";

    out += '<div class="btnrow"><a class="btn" href="#/brief">Turn this into a doctor brief</a></div>';
    out += '<p class="srcnote">Educational sequencing only. It does not know your history, your medicines or your examination findings, and it is not a substitute for a clinician deciding what you need.</p>';
    return out;
  }

  var planner = {
    title: "Planner",
    nav: "Planner", icon: "◱",
    render: function () {
      var ans = loadAnswers();

      var qs = TRIA.plannerQuestions.map(function (q) {
        var chips = q.options.map(function (o) {
          var on = q.type === "many"
            ? (ans[q.id] || []).indexOf(o.v) !== -1
            : ans[q.id] === o.v;
          return '<button class="chip" type="button" data-q="' + q.id + '" data-v="' + o.v +
            '" aria-pressed="' + on + '">' + esc(o.l) + "</button>";
        }).join("");
        return '<div class="field"><label id="lbl-' + q.id + '">' + esc(q.label) +
          (q.type === "many" ? ' <span class="small">(choose any)</span>' : "") + "</label>" +
          '<div class="chips" role="group" aria-labelledby="lbl-' + q.id + '">' + chips + "</div></div>";
      }).join("");

      return '' +
        '<div class="eyebrow">Planner</div>' +
        '<h1>What should I test first?</h1>' +
        '<p class="lede">Five questions, then a sequenced list — including the things it thinks you should not buy. Everything is computed on this device; nothing is sent anywhere.</p>' +
        '<form id="plannerform">' + qs + "</form>" +
        '<div class="btnrow noprint"><button class="btn ghost" type="button" id="planreset">Clear answers</button></div>' +
        '<div id="planout"></div>';
    },
    mount: function (root) {
      var form = root.querySelector("#plannerform");
      var out = root.querySelector("#planout");
      var ans = loadAnswers();

      function redraw() {
        saveAnswers(ans);
        out.innerHTML = planHTML(ans);
      }

      form.addEventListener("click", function (e) {
        var btn = e.target.closest("button[data-q]");
        if (!btn) return;
        var qid = btn.dataset.q, v = btn.dataset.v;
        var q = TRIA.plannerQuestions.filter(function (x) { return x.id === qid; })[0];

        if (q.type === "many") {
          var cur = ans[qid] || [];
          var i = cur.indexOf(v);
          if (i === -1) cur = cur.concat([v]); else cur = cur.slice(0, i).concat(cur.slice(i + 1));
          ans[qid] = cur;
          btn.setAttribute("aria-pressed", String(cur.indexOf(v) !== -1));
        } else {
          ans[qid] = ans[qid] === v ? null : v;
          Array.prototype.forEach.call(form.querySelectorAll('button[data-q="' + qid + '"]'), function (b) {
            b.setAttribute("aria-pressed", String(b.dataset.v === ans[qid]));
          });
        }
        redraw();
      });

      root.querySelector("#planreset").addEventListener("click", function () {
        ans = {};
        try { localStorage.removeItem(STORE_KEY); } catch (e) { /* non-fatal */ }
        Array.prototype.forEach.call(form.querySelectorAll("button[data-q]"), function (b) {
          b.setAttribute("aria-pressed", "false");
        });
        out.innerHTML = planHTML(ans);
      });

      out.innerHTML = planHTML(ans);
    }
  };

  TRIA.buildPlan = buildPlan;
  TRIA.plannerAnswers = loadAnswers;
  TRIA.plannerCandidates = CANDIDATES;

  TRIA.views.pgx = pgx;
  TRIA.views.planner = planner;
})();
