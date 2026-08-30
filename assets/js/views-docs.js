/* TRIA views, part 3 of 3: Sample report, Market map, Doctor brief. */

(function () {
  "use strict";

  var esc = TRIA.esc;
  TRIA.views = TRIA.views || {};

  /* ========================= Sample report ========================= */

  var MOCK = {
    who: "Mock subject — 41 years old, non-smoker, vegetarian, desk-based work. Father had a myocardial infarction at 52.",
    blood: [
      { n: "LDL-C",              v: "118 mg/dL", s: "watch" },
      { n: "ApoB",               v: "108 mg/dL", s: "act" },
      { n: "Lp(a)",              v: "92 nmol/L", s: "act" },
      { n: "Triglycerides",      v: "186 mg/dL", s: "watch" },
      { n: "HDL-C",              v: "38 mg/dL",  s: "watch" },
      { n: "HbA1c",              v: "5.7 %",     s: "watch" },
      { n: "Fasting insulin",    v: "16 µIU/mL", s: "act" },
      { n: "HOMA-IR (derived)",  v: "3.4",       s: "act" },
      { n: "hs-CRP",             v: "2.4 mg/L",  s: "watch" },
      { n: "Homocysteine",       v: "18 µmol/L", s: "watch" },
      { n: "Vitamin B12",        v: "168 pg/mL", s: "act" },
      { n: "Vitamin D (25-OH)",  v: "16 ng/mL",  s: "act" },
      { n: "Ferritin",           v: "42 ng/mL",  s: "ok" },
      { n: "TSH",                v: "2.4 mIU/L", s: "ok" },
      { n: "ALT",                v: "52 U/L",    s: "watch" },
      { n: "eGFR",               v: "98 mL/min/1.73m²", s: "ok" }
    ],
    genes: [
      { n: "LDLR / APOB / PCSK9", v: "No pathogenic variant", s: "ok" },
      { n: "MTHFR C677T",         v: "C/T heterozygous",      s: "ok" },
      { n: "Lp(a) — LPA locus",   v: "Consistent with the measured level", s: "act" }
    ],
    pgxr: [
      { n: "CYP2C19",     v: "*1/*2 — intermediate metaboliser", s: "act" },
      { n: "SLCO1B1",     v: "Decreased function",               s: "act" },
      { n: "CYP2D6",      v: "Normal metaboliser",               s: "ok" },
      { n: "TPMT / NUDT15", v: "Normal function",                s: "ok" },
      { n: "HLA-B*15:02", v: "Negative",                         s: "ok" },
      { n: "DPYD",        v: "Normal metaboliser",               s: "ok" }
    ]
  };

  function flagLine(r) {
    return '<div class="flagline"><span class="dot ' + r.s + '" aria-hidden="true"></span>' +
      '<span class="name">' + esc(r.n) + "</span>" +
      '<span class="val">' + esc(r.v) + "</span>" +
      '<span class="sr-only">' + (r.s === "ok" ? "no action" : r.s === "watch" ? "watch" : "act on this") + "</span></div>";
  }

  var report = {
    title: "Sample report",
    nav: "Report", icon: "▦",
    render: function () {
      return '' +
        '<div class="eyebrow">Sample report</div>' +
        '<h1>An annotated mock</h1>' +
        '<p class="lede">A fabricated result set, read the way an integrated report should be read. The point is the annotations, not the numbers.</p>' +

        '<div class="notice"><strong>Entirely fictional.</strong>These values belong to no one. They were chosen to make specific teaching points, and the reference thresholds implied here are approximations — real reports carry their own laboratory-specific ranges.</div>' +

        '<div class="card"><p style="margin:0" class="small">' + esc(MOCK.who) + "</p></div>" +

        '<h2><span style="color:var(--l1)">Layer 01</span> — blood</h2>' +
        '<div class="card">' + MOCK.blood.map(flagLine).join("") + "</div>" +

        '<div class="annot"><b>Read the discordance first.</b> LDL-C at 118 mg/dL reads as unremarkable. ApoB at 108 mg/dL does not. When the two disagree — typical alongside high triglycerides and low HDL — ApoB is counting particles and LDL-C is estimating cargo. The particle count is what collides with the artery wall.</div>' +

        '<div class="annot"><b>Lp(a) reframes the whole panel.</b> At 92 nmol/L this is a raised, genetically fixed, largely lifestyle-immune risk factor. It does not respond to diet or to statins. What it does is lower the threshold at which everything else deserves treating, and it makes the father\'s infarction at 52 look less like bad luck.</div>' +

        '<div class="annot"><b>The metabolic picture is earlier than HbA1c admits.</b> HbA1c 5.7% sits right at the edge of the prediabetes band and would pass unremarked in most packages. Fasting insulin of 16 µIU/mL with a HOMA-IR of 3.4 says the pancreas is already working hard to hold that number down. The raised ALT and triglycerides belong to the same story.</div>' +

        '<div class="annot"><b>The homocysteine has an obvious cause, and it is not the genotype.</b> Homocysteine 18 µmol/L with B12 at 168 pg/mL, in a vegetarian: that is a B12 finding. Treat the deficiency and re-measure. See the <a href="#/pathway">Pathway</a> section for why the MTHFR result below is the wrong thing to reach for here.</div>' +

        '<h2><span style="color:var(--l2)">Layer 02</span> — genetics</h2>' +
        '<div class="card">' + MOCK.genes.map(flagLine).join("") + "</div>" +

        '<div class="annot"><b>A negative FH panel is not a negative result.</b> No pathogenic variant was found in the three familial hypercholesterolaemia genes. That lowers the probability; it does not exclude the diagnosis, because not every causal variant is detectable on a standard panel. Clinical criteria and the family history still stand.</div>' +

        '<div class="annot"><b>MTHFR C/T is reported here only because real reports report it.</b> Heterozygous C677T is common and, on its own, not a finding to act on. ACMG recommends against routine MTHFR testing; CDC notes that carriers process folic acid normally. In a well-designed report this line would carry that context beside it, or would not appear at all.</div>' +

        '<h2><span style="color:var(--l3)">Layer 03</span> — pharmacogenomics</h2>' +
        '<div class="card">' + MOCK.pgxr.map(flagLine).join("") + "</div>" +

        '<div class="annot"><b>These two lines are instructions with a future date on them.</b> CYP2C19 *1/*2 means clopidogrel would be a poor choice if this person ever needs a stent — an alternative P2Y12 inhibitor is the guideline-supported route. Decreased-function SLCO1B1 means the statin that layer 1 clearly justifies should be chosen and dosed with muscle symptoms in mind. Neither result matters today. Both matter enormously on the day someone writes the prescription, which is why they need to be in a medical record rather than in an email.</div>' +

        '<h2>The one-paragraph version</h2>' +
        '<div class="card">' +
          '<p>A 41-year-old with more atherogenic particles than his LDL-C suggests, a raised and permanent Lp(a), a family history that now reads as signal rather than noise, and insulin resistance that HbA1c is not yet showing. He needs lipid-lowering earlier and harder than his lipid panel alone would trigger — and the pharmacogenomic layer already says which drugs to reach for and which to avoid when that day comes. Separately and unrelatedly, he has a treatable B12 deficiency that explains his homocysteine.</p>' +
          '<p style="margin-bottom:0"><b>Three layers, one story.</b> None of the three, read alone, would have produced that paragraph.</p>' +
        "</div>" +

        '<h2>What this report should also have said</h2>' +
        "<ul>" +
          "<li><b>What it did not look at.</b> No coronary calcium score, no blood pressure, no imaging. A report that omits its blind spots invites over-reading.</li>" +
          "<li><b>How confident each line is.</b> The CYP2C19 result and the vitamin D result are not the same kind of claim and should not be typeset as though they were.</li>" +
          "<li><b>What changes nothing.</b> Most lines here are normal, and saying so plainly is part of the job.</li>" +
          "<li><b>What to re-test, and when.</b> Lp(a) and every genetic line: never again. The metabolic markers: in three to six months, after something has actually changed.</li>" +
        "</ul>" +

        '<div class="btnrow"><a class="btn" href="#/brief">Take questions like these to a doctor</a></div>';
    }
  };

  /* ========================== Market map =========================== */

  var MARKET_CATS = [
    { id: "all",      label: "Everything" },
    { id: "blood",    label: "Blood panels" },
    { id: "pgx",      label: "Pharmacogenomics" },
    { id: "dtc",      label: "Consumer genomics" },
    { id: "clinical", label: "Clinical genomics" }
  ];

  var market = {
    title: "Market map",
    nav: "Market", icon: "◎",
    render: function () {
      return '' +
        '<div class="eyebrow">India market map</div>' +
        '<h1>Who sells what, at what band</h1>' +
        '<p class="lede">The same three layers, priced. Bands are ' + esc(TRIA.market.updated) +
        ' — packages, city and discounting move them a lot.</p>' +

        '<div class="notice"><strong>Illustrative, and it will drift.</strong>These are typical list bands for a category of service, not quotes, and not prices for any named provider. Check the current price and — more importantly — the exact analyte or gene list before you buy.</div>' +

        '<div class="chips" id="mktfilters" role="group" aria-label="Filter by category">' +
          MARKET_CATS.map(function (c, i) {
            return '<button class="chip" type="button" data-c="' + c.id + '" aria-pressed="' + (i === 0) + '">' + esc(c.label) + "</button>";
          }).join("") +
        "</div>" +

        '<div id="mktout" style="margin-top:16px"></div>' +

        "<h2>How to read this table</h2>" +
        "<ul>" +
          "<li><b>Accreditation before price.</b> NABL accreditation is the one quality signal a consumer can actually check, and it costs nothing to check it.</li>" +
          "<li><b>Buy analytes, not packages.</b> Four named tests you chose will nearly always beat a sixty-analyte bundle you did not.</li>" +
          "<li><b>Ask for the gene list.</b> A pharmacogenomics panel is only as good as its coverage. For India specifically, absence of NUDT15 or HLA-B*15:02 should be disqualifying.</li>" +
          "<li><b>Ask what happens after.</b> Whether a clinician reviews the result, and whether it reaches a medical record, matters more than the number of pages in the PDF.</li>" +
        "</ul>" +

        '<p class="srcnote">Provider names are given as examples of a category and are not endorsements, comparisons, or statements about any particular company\'s current pricing.</p>';
    },
    mount: function (root) {
      var out = root.querySelector("#mktout");
      var box = root.querySelector("#mktfilters");
      var active = "all";

      function draw() {
        var rows = TRIA.market.rows.filter(function (r) { return active === "all" || r.cat === active; });
        if (!rows.length) { out.innerHTML = '<p class="empty">Nothing in that category.</p>'; return; }
        out.innerHTML = '<div class="tablewrap"><table>' +
          "<thead><tr><th>What</th><th>Typically sold by</th><th>Band</th></tr></thead><tbody>" +
          rows.map(function (r) {
            return "<tr><td><b>" + esc(r.type) + "</b><br><span class='small'>" + esc(r.note) + "</span></td>" +
              "<td>" + esc(r.who) + "</td>" +
              '<td class="price">' + esc(r.band) + "</td></tr>";
          }).join("") + "</tbody></table></div>";
      }

      box.addEventListener("click", function (e) {
        var btn = e.target.closest("button[data-c]");
        if (!btn) return;
        active = btn.dataset.c;
        Array.prototype.forEach.call(box.querySelectorAll("button"), function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });
        draw();
      });

      draw();
    }
  };

  /* ========================= Doctor brief ========================== */

  var QUESTIONS = [
    ["About the results I already have",
      [
        "Which of these results would you act on, and which would you ignore?",
        "Is my ApoB or Lp(a) high enough to change when we start treatment, rather than whether?",
        "Does my family history change your threshold for treating me?",
        "Is anything here explained by something simple — a deficiency, a medicine I take, a recent infection?"
      ]],
    ["About testing further",
      [
        "What would you order next, and what decision would the result change?",
        "Is there a test I have bought that you would not have ordered?",
        "Should I have a coronary calcium score, or is it too early to be useful?",
        "How often should any of this be repeated — and is there anything I never need to repeat?"
      ]],
    ["About medicines and my genotype",
      [
        "If I ever need a stent, does my CYP2C19 status change which antiplatelet I should get?",
        "Does anything in my pharmacogenomic result affect a medicine I take right now?",
        "Can this result be recorded somewhere it will surface when someone prescribes for me in future?",
        "Is there a drug I should carry a note about?"
      ]],
    ["About the limits",
      [
        "What does this set of tests not tell us?",
        "How much of my risk is not captured by any of these numbers?",
        "If I only changed one thing, what should it be?"
      ]]
  ];

  var NOTE_KEY = "tria.brief.v1";

  var brief = {
    title: "Doctor brief",
    nav: "Brief", icon: "✎",
    render: function () {
      var saved = "";
      try { saved = localStorage.getItem(NOTE_KEY) || ""; } catch (e) { /* storage unavailable */ }

      var ans = {};
      try { ans = TRIA.plannerAnswers(); } catch (e) { ans = {}; }
      var plan = (ans && ans.age) ? TRIA.buildPlan(ans) : null;

      var planBlock = "";
      if (plan && plan.picked.length) {
        planBlock = "<h2>What the planner suggested</h2>" +
          '<div class="card"><ol style="margin-bottom:0">' +
            plan.picked.slice(0, 6).map(function (c) {
              return "<li>" + esc(c.name) + " <span class='small'>(" + esc(c.band) + ")</span></li>";
            }).join("") +
          "</ol></div>" +
          '<p class="small noprint">Carried over from the <a href="#/planner">Planner</a>. Edit there, not here.</p>';
      }

      return '' +
        '<div class="eyebrow noprint">Doctor brief</div>' +
        "<h1>Questions worth asking</h1>" +
        '<p class="lede noprint">A page to print or hand over. The value of everything else in this app is measured by how much shorter it makes this conversation.</p>' +

        '<div class="notice noprint"><strong>Your notes stay on this device.</strong>The box below is saved in this app\'s local storage only. It is not uploaded, synced, or readable by anyone but you — and it will be lost if you clear app data.</div>' +

        '<div class="field noprint"><label for="bnotes">My notes, symptoms, and current medicines</label>' +
          '<textarea id="bnotes" placeholder="Medicines and doses. Supplements. Symptoms and when they started. What I am most worried about.">' + esc(saved) + "</textarea></div>" +

        '<div id="bprint"></div>' +

        planBlock +

        QUESTIONS.map(function (g) {
          return "<h2>" + esc(g[0]) + "</h2><div class='card'><ol style='margin-bottom:0'>" +
            g[1].map(function (q) { return "<li>" + esc(q) + "</li>"; }).join("") + "</ol></div>";
        }).join("") +

        '<h2>What I should bring</h2>' +
        "<div class='card'><ul style='margin-bottom:0'>" +
          "<li>The full lab report — every page, including the reference ranges</li>" +
          "<li>Any genetic or pharmacogenomic report, in full rather than the summary</li>" +
          "<li>Every medicine and supplement, with doses</li>" +
          "<li>What my parents and siblings were diagnosed with, and at what age</li>" +
          "<li>My blood pressure, if I have measured it at home</li>" +
        "</ul></div>" +

        '<div class="btnrow noprint">' +
          '<button class="btn" type="button" id="bprintbtn">Print this page</button>' +
          '<button class="btn ghost" type="button" id="bclear">Clear my notes</button>' +
        "</div>" +

        '<p class="srcnote">This is a list of questions, not a clinical assessment. Your clinician may reasonably answer several of them with "that does not apply to you."</p>';
    },
    mount: function (root) {
      var ta = root.querySelector("#bnotes");
      var printArea = root.querySelector("#bprint");

      function syncPrint() {
        var v = ta.value.trim();
        printArea.innerHTML = v
          ? "<h2>My notes</h2><div class='card'><p style='margin:0;white-space:pre-wrap'>" + esc(v) + "</p></div>"
          : "";
      }

      ta.addEventListener("input", function () {
        try { localStorage.setItem(NOTE_KEY, ta.value); } catch (e) { /* non-fatal */ }
        syncPrint();
      });

      root.querySelector("#bprintbtn").addEventListener("click", function () { window.print(); });

      root.querySelector("#bclear").addEventListener("click", function () {
        ta.value = "";
        try { localStorage.removeItem(NOTE_KEY); } catch (e) { /* non-fatal */ }
        syncPrint();
      });

      syncPrint();
    }
  };

  TRIA.views.report = report;
  TRIA.views.market = market;
  TRIA.views.brief = brief;
})();
