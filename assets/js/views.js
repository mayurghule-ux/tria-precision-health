/* TRIA views, part 1 of 3: shared helpers, Home, Study, Pathway.
 * Each view is { title, nav, icon, render(), mount(root)? } and registers
 * itself on TRIA.views under its route key. */

(function () {
  "use strict";

  TRIA.views = TRIA.views || {};

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function disclaimer(extra) {
    return '<div class="notice"><strong>Not a diagnostic product.</strong>' +
      (extra || "This app does not sequence DNA, read your labs as a clinician would, or replace a doctor. It exists to make the conversation with one shorter.") +
      "</div>";
  }

  /* ------------------------------------------------------------------ */

  var home = {
    title: "Three layers. One story.",
    nav: "Home", icon: "◆",
    render: function () {
      return '' +
        '<h1>Three layers.<br>One story.</h1>' +
        '<p class="lede">Preventive health gets sold as three separate products. It is really one question asked three ways: what is happening in you now, what were you dealt, and how will you handle the drugs you may one day be given.</p>' +

        disclaimer() +

        '<div class="card layercard l1">' +
          '<div class="num">LAYER 01</div>' +
          '<h3>Blood biomarkers — the state you are in</h3>' +
          '<p>Measurable, changeable, and cheap. Lipids, glucose handling, inflammation, iron, thyroid, kidney and liver function. These move with what you do, which is exactly what makes them worth repeating.</p>' +
          '<p class="small">Answers: <em>what is true about me today?</em></p>' +
        '</div>' +

        '<div class="card layercard l2">' +
          '<div class="num">LAYER 02</div>' +
          '<h3>Genetics — the hand you were dealt</h3>' +
          '<p>Fixed for life, which cuts both ways: you only pay once, but you also cannot improve the result. Most of it is far less predictive for a healthy adult than the marketing suggests. A narrow slice — familial hypercholesterolaemia, carrier status when planning a family, a handful of high-penetrance cancer genes — genuinely changes what you do.</p>' +
          '<p class="small">Answers: <em>what should I be watching for, earlier than most people?</em></p>' +
        '</div>' +

        '<div class="card layercard l3">' +
          '<div class="num">LAYER 03</div>' +
          '<h3>Pharmacogenomics — how you will meet medicine</h3>' +
          '<p>The most underrated layer. Not a risk score but a set of specific instructions that fire the day a specific drug is prescribed: clopidogrel after a stent, carbamazepine for seizures, a thiopurine for inflammatory bowel disease, codeine after surgery.</p>' +
          '<p class="small">Answers: <em>will this drug work on me, and will it hurt me?</em></p>' +
        '</div>' +

        '<h2>Why put them together</h2>' +
        '<p>Read alone, each layer misleads. A normal LDL-C with a raised Lp(a) looks reassuring and is not. A CYP2C19 result means nothing until the day someone writes a clopidogrel prescription. A raised homocysteine gets treated as a heart finding when it is usually a B12 finding.</p>' +
        '<p>The value is not in more tests. It is in reading the three layers against each other, and in knowing which results should change something.</p>' +

        '<div class="btnrow">' +
          '<a class="btn" href="#/planner">What should I test first?</a>' +
          '<a class="btn ghost" href="#/pgx">Open the PGx lab</a>' +
        '</div>' +

        '<h2>Where to go</h2>' +
        '<ul>' +
          '<li><a href="#/study">Study</a> — evidence, market, regulation, and an honest critique of the products</li>' +
          '<li><a href="#/pathway">Pathway</a> — homocysteine, folate and the MTHFR story, told straight</li>' +
          '<li><a href="#/pgx">PGx lab</a> — searchable gene-drug pairs with CPIC-style actionability</li>' +
          '<li><a href="#/planner">Planner</a> — a sequenced test list built from your answers, on your device</li>' +
          '<li><a href="#/report">Sample report</a> — an annotated mock, so a real one is less opaque</li>' +
          '<li><a href="#/market">Market map</a> — who sells what in India, at what price band</li>' +
          '<li><a href="#/brief">Doctor brief</a> — a printable page to take to a clinician</li>' +
        '</ul>';
    }
  };

  /* ------------------------------------------------------------------ */

  var study = {
    title: "Study",
    nav: "Study", icon: "▤",
    render: function () {
      return '' +
        '<div class="eyebrow">Study</div>' +
        '<h1>Evidence, market, regulation, critique</h1>' +
        '<p class="lede">Four questions worth separating: what is actually established, what is being sold, what the rules say, and where the products fall short.</p>' +

        '<h2>1. What the evidence supports</h2>' +

        '<div class="card">' +
          '<h3>Strong</h3>' +
          '<ul>' +
            '<li><b>ApoB and LDL particle burden are causal in atherosclerosis.</b> Mendelian randomisation, randomised lipid-lowering trials and genetic disease all converge. Lower for longer is better.</li>' +
            '<li><b>Lp(a) is largely genetically set and independently associated with cardiovascular risk.</b> One measurement in a lifetime is enough to know where you stand.</li>' +
            '<li><b>Specific pharmacogenomic pairs change outcomes.</b> HLA-B*57:01 screening effectively removed abacavir hypersensitivity from clinical practice. DPYD and TPMT/NUDT15 testing prevents severe chemotherapy and thiopurine toxicity.</li>' +
            '<li><b>Familial hypercholesterolaemia is underdiagnosed and highly actionable.</b> A genetic finding here changes treatment intensity, and it changes it for the patient\'s relatives too.</li>' +
          '</ul>' +
        '</div>' +

        '<div class="card">' +
          '<h3>Weak, contested, or oversold</h3>' +
          '<ul>' +
            '<li><b>Most consumer "wellness genomics".</b> Diet-response, fitness-type and trait panels rest on small effect sizes and studies that often fail to replicate.</li>' +
            '<li><b>Polygenic risk scores outside the populations they were trained on.</b> Predictive performance drops substantially in South Asian and African ancestry cohorts, because the underlying GWAS data are overwhelmingly European. This is a live equity problem, not a detail.</li>' +
            '<li><b>MTHFR-guided supplementation.</b> See the <a href="#/pathway">Pathway</a> section — the professional bodies are unusually blunt about this one.</li>' +
            '<li><b>Whole-body annual screening packages in asymptomatic adults.</b> More analytes produce more incidental findings, more follow-up imaging and more anxiety, without a demonstrated mortality benefit.</li>' +
          '</ul>' +
        '</div>' +

        '<h2>2. The market</h2>' +
        '<p>Three business models are competing for the same customer, and they are not equally honest about what they sell.</p>' +
        '<ul>' +
          '<li><b>Volume diagnostics.</b> Large chains selling fixed panels at low margin, optimised for collection logistics rather than for clinical question-asking. The bundle is the product; you cannot usually edit it.</li>' +
          '<li><b>Direct-to-consumer genomics.</b> High perceived value, one-time purchase, and a persistent incentive to expand the report with weakly-supported sections because the ancestry and carrier parts alone will not sustain the price.</li>' +
          '<li><b>Clinical genomics.</b> Referral-driven, regulated, evidence-anchored — and largely invisible to the consumer deciding what to buy on a Sunday evening.</li>' +
        '</ul>' +
        '<p>The gap the three leave is a service that says <em>no</em>: that tells you which of the tests you were about to buy will not change anything.</p>' +
        '<p><a href="#/market">See the India market map &rsaquo;</a></p>' +

        '<h2>3. Regulation</h2>' +
        '<div class="notice"><strong>Dated claims.</strong>Regulation moves. Everything below reflects the position as of 2025-2026 and should be re-checked before you rely on it.</div>' +
        '<div class="card">' +
          '<h3>India</h3>' +
          '<ul>' +
            '<li>Diagnostic laboratories are accredited through <b>NABL</b>; accreditation is the single most useful quality signal available to a consumer.</li>' +
            '<li>In-vitro diagnostic kits fall under <b>CDSCO</b> and the Medical Devices Rules, 2017.</li>' +
            '<li>Research and clinical ethics follow the <b>ICMR National Ethical Guidelines</b>.</li>' +
            '<li>There is <b>no India-specific statute governing direct-to-consumer genetic testing</b>. The DNA Technology (Use and Application) Regulation Bill — which was about forensic databases rather than consumer testing — was withdrawn in 2023.</li>' +
            '<li>Genetic data is personal data under the <b>Digital Personal Data Protection Act, 2023</b>, though the operative rules have arrived slowly.</li>' +
          '</ul>' +
        '</div>' +
        '<div class="card">' +
          '<h3>Elsewhere</h3>' +
          '<ul>' +
            '<li><b>United States:</b> laboratories under CLIA; devices under the FDA. The FDA\'s 2024 rule bringing laboratory-developed tests under device regulation was <b>vacated by a federal court in 2025</b>, leaving the LDT position unsettled.</li>' +
            '<li><b>European Union:</b> the IVDR raised the evidence bar for in-vitro diagnostics considerably, with phased transition deadlines.</li>' +
            '<li><b>Pharmacogenomics specifically:</b> the EMA requires DPD (DPYD) testing before fluoropyrimidines. The FDA carries PGx information in a large number of drug labels and maintains a public table of them.</li>' +
          '</ul>' +
        '</div>' +

        '<h2>4. Product critique</h2>' +
        '<p>Judged as products rather than as science, most integrated-health offerings fail in the same five places.</p>' +
        '<div class="card">' +
          '<ol>' +
            '<li><b>They report everything and prioritise nothing.</b> A 90-analyte PDF with no ordering is not a decision aid; it is a data dump that transfers the hard work back to the buyer.</li>' +
            '<li><b>They mix evidence tiers without labelling them.</b> A CPIC level-A pharmacogenomic finding and a "caffeine sensitivity" trait appear in the same typeface, with the same confidence.</li>' +
            '<li><b>They use European-derived reference ranges and risk models</b> on South Asian bodies, where metabolic dysfunction appears at lower BMI and cardiovascular events occur earlier.</li>' +
            '<li><b>They have no follow-through.</b> The pharmacogenomic result that matters most is the one that surfaces automatically at the moment of prescribing — which requires it to live in a medical record, not in a customer\'s email.</li>' +
            '<li><b>They are silent about what they cannot tell you.</b> A good report should be substantially about its own limits.</li>' +
          '</ol>' +
        '</div>' +
        '<p class="srcnote">This section is an educational summary, not a systematic review. Where it makes a factual claim about a guideline or regulation, check the primary source before acting on it.</p>';
    }
  };

  /* ------------------------------------------------------------------ */

  var pathway = {
    title: "Pathway",
    nav: "Pathway", icon: "⌥",
    render: function () {
      return '' +
        '<div class="eyebrow">Pathway</div>' +
        '<h1>Homocysteine, folate, MTHFR</h1>' +
        '<p class="lede">One pathway, endlessly mis-sold. Worth walking through carefully, because the biochemistry is real and most of the conclusions drawn from it are not.</p>' +

        '<div class="card">' + pathwaySVG() + '</div>' +
        '<p class="small">Folate arrives from food or fortification and is reduced to THF. <b>MTHFR</b> converts 5,10-methylene-THF to 5-methyl-THF, which hands its methyl group to homocysteine — with vitamin B12 as the cofactor for MTR — regenerating methionine. Methionine becomes SAM, the body\'s universal methyl donor; spending that methyl group returns the molecule to homocysteine, closing the loop. Homocysteine can also leave the cycle entirely through CBS, which needs vitamin B6.</p>' +

        '<h2>What is actually established</h2>' +
        '<ul>' +
          '<li>The <b>MTHFR C677T</b> variant reduces enzyme activity. Homozygotes (TT) have meaningfully lower activity than CC.</li>' +
          '<li>Lower activity can raise homocysteine — but chiefly <b>when folate status is already low</b>. With adequate folate, the difference largely washes out.</li>' +
          '<li>Raised homocysteine is <b>associated</b> with cardiovascular and cognitive outcomes in observational data.</li>' +
          '<li>B vitamins reliably <b>lower homocysteine</b>. That part works.</li>' +
        '</ul>' +

        '<h2>Where the story breaks</h2>' +
        '<div class="notice">' +
          '<strong>Lowering the number did not deliver the outcome.</strong>' +
          'Large randomised trials of B-vitamin supplementation (HOPE-2, NORVIT, SEARCH, VITATOPS and others) lowered homocysteine as expected but did not produce the cardiovascular event reduction the association predicted. Meta-analyses leave at most a modest signal for stroke. Homocysteine looks far more like a marker of B-vitamin status than a lever you pull on heart disease.' +
        '</div>' +

        '<h2>What the professional bodies say</h2>' +
        '<div class="card">' +
          '<p><b>ACMG</b> — the American College of Medical Genetics and Genomics recommends <b>against routine MTHFR polymorphism testing</b>, including as part of a thrombophilia workup and in the evaluation of recurrent pregnancy loss. It is not a useful test in those settings.</p>' +
          '<p><b>CDC</b> — people with MTHFR variants, <b>including TT homozygotes, can process folic acid normally</b>. The widespread advice that carriers must avoid folic acid and buy methylfolate instead does not follow from the biology.</p>' +
          '<p style="margin-bottom:0"><b>The practical consequence:</b> if your homocysteine is raised, the useful next step is measuring B12 and folate and correcting a real deficiency — not genotyping MTHFR.</p>' +
        '</div>' +

        '<h2>How the sales pitch is built</h2>' +
        '<p>Each step below is individually defensible. The chain is not.</p>' +
        '<div class="card">' +
          '<ol>' +
            '<li>MTHFR C677T reduces enzyme activity. <span class="badge a">true</span></li>' +
            '<li>Reduced activity can raise homocysteine. <span class="badge a">true, when folate is low</span></li>' +
            '<li>Raised homocysteine is associated with disease. <span class="badge b">true, observationally</span></li>' +
            '<li>Therefore lowering homocysteine prevents disease. <span class="badge hi">not shown in trials</span></li>' +
            '<li>Therefore you need this genotype and this supplement. <span class="badge hi">does not follow</span></li>' +
          '</ol>' +
          '<p style="margin-bottom:0" class="small">The failure is between 3 and 4 — the standard gap between a marker that travels with a disease and a mechanism you can act on.</p>' +
        '</div>' +

        '<h2>When this pathway does matter</h2>' +
        '<ul>' +
          '<li><b>Genuine B12 deficiency</b> — common on vegetarian diets and with long-term metformin. Worth finding, cheap to fix, and the deficiency itself causes neurological harm.</li>' +
          '<li><b>Periconceptional folic acid</b> — one of the best-evidenced interventions in preventive medicine, for neural tube defect prevention, and it applies regardless of MTHFR genotype.</li>' +
          '<li><b>Homocystinuria</b> — a rare inherited disorder, usually CBS deficiency, with homocysteine levels an order of magnitude above the mild elevations discussed here. A different disease, not a stronger version of the same finding.</li>' +
        '</ul>';
    }
  };

  function pathwaySVG() {
    var box = function (x, y, w, h, lines, cls) {
      var t = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8" ' +
        'fill="var(--surface-2)" stroke="var(--' + (cls || 'border-strong') + ')" stroke-width="1.5"/>';
      var cx = x + w / 2;
      var start = y + h / 2 - (lines.length - 1) * 7 + 4.5;
      for (var i = 0; i < lines.length; i++) {
        t += '<text x="' + cx + '" y="' + (start + i * 14) + '" text-anchor="middle" ' +
          'font-size="12" font-weight="600" fill="var(--text)">' + esc(lines[i]) + '</text>';
      }
      return t;
    };
    var arrow = function (x1, y1, x2, y2, dash) {
      return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" ' +
        'stroke="var(--border-strong)" stroke-width="2" marker-end="url(#tri-arrow)"' +
        (dash ? ' stroke-dasharray="4 3"' : '') + '/>';
    };
    var lbl = function (x, y, s, anchor, color) {
      return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '" ' +
        'font-size="10.5" font-weight="700" fill="var(--' + (color || 'muted') + ')" ' +
        'letter-spacing=".03em">' + esc(s) + '</text>';
    };

    return '<svg class="pathway" viewBox="0 0 340 400" role="img" ' +
      'aria-label="The folate and methionine cycle: folate is reduced to THF, then to 5,10-methylene-THF, then by MTHFR to 5-methyl-THF, which donates a methyl group to homocysteine to regenerate methionine and then SAM. Homocysteine can also exit via CBS to cystathionine and cysteine.">' +
      '<defs><marker id="tri-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
      '<path d="M 0 0 L 10 5 L 0 10 z" fill="var(--border-strong)"/></marker></defs>' +

      box(8, 6, 150, 44, ["Dietary folate /", "folic acid"]) +
      arrow(83, 50, 83, 72) +
      box(8, 74, 150, 34, ["THF"]) +
      arrow(83, 108, 83, 130) +
      box(8, 132, 150, 44, ["5,10-methylene-", "THF"]) +
      arrow(83, 176, 83, 198) +
      lbl(88, 191, "MTHFR", "start", "l2") +
      box(8, 200, 150, 34, ["5-methyl-THF"], "l2") +

      arrow(158, 217, 188, 217) +
      lbl(173, 193, "CH\u2083", "middle") +

      box(190, 200, 142, 34, ["Homocysteine"], "l1") +
      arrow(261, 234, 261, 266) +
      lbl(255, 254, "MTR + B12", "end") +
      box(190, 268, 142, 34, ["Methionine"]) +
      arrow(261, 302, 261, 334) +
      box(190, 336, 142, 44, ["SAM —", "methyl donor"]) +

      arrow(196, 238, 152, 296) +
      lbl(186, 272, "CBS + B6", "end") +
      box(8, 300, 150, 44, ["Cystathionine →", "cysteine"]) +
      '</svg>';
  }

  TRIA.esc = esc;
  TRIA.disclaimer = disclaimer;

  TRIA.views.home = home;
  TRIA.views.study = study;
  TRIA.views.pathway = pathway;
})();
