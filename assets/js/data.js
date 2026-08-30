/* TRIA data layer.
 *
 * Everything here is educational reference content, current to 2025-2026.
 * Guideline levels follow CPIC's own grading; "FDA label" / "EMA" flags note
 * where a regulator has said something in a drug label. Nothing here is a
 * dose recommendation for an individual person.
 */

var TRIA = window.TRIA = window.TRIA || {};

/* ------------------------------------------------------------------ *
 * Layer 3 — pharmacogenomics. Restricted to well-known CPIC/FDA pairs. *
 * ------------------------------------------------------------------ */

TRIA.pgx = [
  {
    gene: "CYP2C19", drug: "Clopidogrel", area: "Cardiology",
    level: "CPIC A", label: "FDA boxed warning", india: false,
    effect: "Clopidogrel is a prodrug: CYP2C19 has to convert it into its active form. Poor and intermediate metabolisers make less active drug, so platelets stay stickier than the prescription assumes.",
    action: "After PCI/ACS, guidelines suggest an alternative P2Y12 inhibitor (prasugrel or ticagrelor) for poor/intermediate metabolisers, where there is no bleeding contraindication.",
    why: "This is the pair most likely to change a real decision in a cardiology clinic, and the genotype is stable for life."
  },
  {
    gene: "CYP2C19", drug: "Voriconazole", area: "Infectious disease",
    level: "CPIC A", label: "FDA label", india: false,
    effect: "Poor metabolisers accumulate voriconazole and are more prone to hepatotoxicity and visual/neurological side effects. Ultrarapid metabolisers may sit below the therapeutic window and fail treatment.",
    action: "Consider an alternative azole, or dose adjustment with therapeutic drug monitoring.",
    why: "An antifungal with a narrow therapeutic window, where blood levels are already routinely monitored."
  },
  {
    gene: "CYP2C19", drug: "Escitalopram / citalopram", area: "Psychiatry",
    level: "CPIC A", label: "FDA label", india: false,
    effect: "Poor metabolisers reach higher plasma concentrations at a standard dose; ultrarapid metabolisers may under-respond.",
    action: "CPIC suggests a reduced starting dose or an alternative SSRI not primarily metabolised by CYP2C19 for poor metabolisers.",
    why: "Psychiatric prescribing often involves long trial-and-error periods; this trims one source of it."
  },
  {
    gene: "CYP2D6", drug: "Codeine", area: "Pain",
    level: "CPIC A", label: "FDA contraindication", india: false,
    effect: "Codeine only works after CYP2D6 turns it into morphine. Ultrarapid metabolisers convert too much, too fast — a genuine respiratory depression risk. Poor metabolisers get little analgesia at all.",
    action: "Avoid codeine in both ultrarapid and poor metabolisers; use an analgesic that does not depend on CYP2D6. The FDA contraindicates codeine in children under 12, and after tonsillectomy/adenoidectomy under 18.",
    why: "One of the few pharmacogenomic findings tied to documented deaths, not just to efficacy."
  },
  {
    gene: "CYP2D6", drug: "Tramadol", area: "Pain",
    level: "CPIC A", label: "FDA contraindication", india: false,
    effect: "Same mechanism as codeine — tramadol needs CYP2D6 to form its active O-desmethyl metabolite.",
    action: "Avoid in ultrarapid metabolisers (toxicity risk) and in poor metabolisers (likely ineffective).",
    why: "Tramadol is prescribed very freely for moderate pain, including in settings where the genotype is never considered."
  },
  {
    gene: "CYP2D6", drug: "Tamoxifen", area: "Oncology",
    level: "CPIC A", label: "—", india: false,
    effect: "Tamoxifen depends on CYP2D6 to form endoxifen, the metabolite doing most of the work. Poor metabolisers form less of it.",
    action: "In postmenopausal patients, an aromatase inhibitor may be preferred. Strong CYP2D6-inhibiting drugs (including some SSRIs) should be avoided alongside tamoxifen.",
    why: "Shows a drug-drug-gene interaction: an antidepressant can phenocopy a poor metaboliser."
  },
  {
    gene: "CYP2D6", drug: "Ondansetron", area: "Supportive care",
    level: "CPIC A", label: "—", india: false,
    effect: "Ultrarapid metabolisers clear ondansetron quickly and are more likely to still vomit despite treatment.",
    action: "Use an antiemetic not metabolised by CYP2D6 in ultrarapid metabolisers.",
    why: "Low stakes individually, but a clean illustration of genotype predicting drug failure rather than toxicity."
  },
  {
    gene: "DPYD", drug: "Fluorouracil / capecitabine", area: "Oncology",
    level: "CPIC A", label: "EMA requires pre-treatment testing", india: false,
    effect: "DPD is the enzyme that clears fluoropyrimidines. Partial or complete deficiency causes severe — sometimes fatal — mucositis, neutropenia and diarrhoea at a normal dose.",
    action: "Reduce the starting dose substantially for intermediate metabolisers; avoid fluoropyrimidines entirely in complete deficiency.",
    why: "One of the strongest arguments for pre-emptive testing anywhere in medicine: the test is cheap, the failure mode is death."
  },
  {
    gene: "TPMT / NUDT15", drug: "Azathioprine / mercaptopurine", area: "Immunology, oncology",
    level: "CPIC A", label: "FDA label", india: true,
    effect: "Both enzymes handle thiopurine metabolites. Reduced function means marrow-suppressing metabolites build up, causing severe myelosuppression.",
    action: "Large dose reductions for intermediate metabolisers; alternative agents or drastically reduced dosing for poor metabolisers.",
    why: "NUDT15 reduced-function variants are considerably more common in South and East Asian populations than TPMT variants, so testing TPMT alone under-protects Indian patients."
  },
  {
    gene: "HLA-B*15:02", drug: "Carbamazepine / oxcarbazepine", area: "Neurology",
    level: "CPIC A", label: "FDA recommends testing", india: true,
    effect: "Carriers are at sharply increased risk of Stevens-Johnson syndrome and toxic epidermal necrolysis — a skin reaction with meaningful mortality.",
    action: "Do not start carbamazepine (or oxcarbazepine) in a carrier who has not taken it before. Choose a different anticonvulsant.",
    why: "Allele frequency is appreciably higher in South and Southeast Asian ancestry, which is exactly why the FDA singles out this population for testing."
  },
  {
    gene: "HLA-A*31:01", drug: "Carbamazepine", area: "Neurology",
    level: "CPIC A", label: "—", india: false,
    effect: "A separate carbamazepine hypersensitivity risk allele, associated with DRESS and maculopapular eruption across more ancestries than HLA-B*15:02.",
    action: "Consider an alternative anticonvulsant in carriers who are carbamazepine-naive.",
    why: "Two different alleles, two different reaction patterns, one drug — a good reminder that 'the carbamazepine gene' does not exist."
  },
  {
    gene: "HLA-B*57:01", drug: "Abacavir", area: "HIV",
    level: "CPIC A", label: "FDA label", india: false,
    effect: "Carriers develop a systemic hypersensitivity reaction that can be fatal on re-challenge.",
    action: "Screen before prescribing; do not use abacavir in carriers.",
    why: "The success story of the field — screening moved from research finding to routine standard of care, and hypersensitivity reactions largely disappeared."
  },
  {
    gene: "SLCO1B1 (with CYP2C9, ABCG2)", drug: "Simvastatin, atorvastatin, rosuvastatin", area: "Cardiology",
    level: "CPIC A", label: "FDA label (simvastatin)", india: false,
    effect: "SLCO1B1 encodes the transporter that pulls statins into the liver. Decreased function leaves more statin in the circulation and raises the risk of muscle symptoms and myopathy.",
    action: "Prefer a lower dose or a statin less dependent on that transporter; simvastatin at high dose is the worst offender.",
    why: "Statin intolerance is one of the commonest reasons people abandon effective cardiovascular prevention."
  },
  {
    gene: "CYP2C9 + VKORC1", drug: "Warfarin", area: "Anticoagulation",
    level: "CPIC A", label: "FDA label", india: false,
    effect: "VKORC1 sets the sensitivity of the drug target; CYP2C9 sets clearance. Together they explain a large share of the variation in dose requirement between people.",
    action: "Genotype-guided dosing algorithms exist and are supported by CPIC where a genotype is already available.",
    why: "The classic teaching example, though DOACs have reduced how often warfarin dosing is the live question."
  },
  {
    gene: "CYP2C9", drug: "Phenytoin", area: "Neurology",
    level: "CPIC A", label: "FDA label", india: true,
    effect: "Reduced-function alleles slow phenytoin clearance into the toxic range at standard doses. Phenytoin also carries HLA-B*15:02-associated severe cutaneous reaction risk.",
    action: "Reduce the starting dose in intermediate/poor metabolisers, and consider HLA-B*15:02 status separately.",
    why: "Two genes, one drug, two entirely different risks — dose toxicity and skin reaction."
  },
  {
    gene: "G6PD", drug: "Primaquine, rasburicase, dapsone", area: "Infectious disease, oncology",
    level: "CPIC A", label: "FDA label", india: true,
    effect: "G6PD deficiency leaves red cells unable to handle oxidative stress; these drugs then trigger acute haemolysis.",
    action: "Test before radical-cure primaquine for vivax malaria and before rasburicase. Deficiency is a contraindication for rasburicase.",
    why: "Directly relevant in India, where P. vivax malaria treatment routinely raises this question and G6PD deficiency is not rare."
  },
  {
    gene: "NUDT15", drug: "Thiopurines (see TPMT row)", area: "Immunology",
    level: "CPIC A", label: "FDA label", india: true,
    effect: "Reduced-function NUDT15 causes early, severe leukopenia and alopecia on standard thiopurine doses.",
    action: "Dose reduction proportional to predicted phenotype.",
    why: "Listed separately because a panel that omits NUDT15 is a materially weaker test for an Indian patient."
  },
  {
    gene: "CYP3A5", drug: "Tacrolimus", area: "Transplant",
    level: "CPIC A", label: "—", india: false,
    effect: "CYP3A5 expressers clear tacrolimus faster and sit below target trough levels on a standard weight-based starting dose.",
    action: "Higher starting dose in expressers, with the usual therapeutic drug monitoring.",
    why: "Time to therapeutic level matters in the first weeks after a transplant."
  },
  {
    gene: "CYP2B6", drug: "Efavirenz", area: "HIV",
    level: "CPIC A", label: "—", india: false,
    effect: "Poor metabolisers accumulate efavirenz and get more CNS side effects — vivid dreams, dizziness, mood change.",
    action: "Consider a reduced dose in poor metabolisers.",
    why: "Side effects drive non-adherence, and non-adherence drives resistance."
  },
  {
    gene: "UGT1A1", drug: "Irinotecan", area: "Oncology",
    level: "DPWG / FDA label", label: "FDA label", india: false,
    effect: "UGT1A1*28 homozygotes clear the active metabolite more slowly and have higher rates of severe neutropenia and diarrhoea.",
    action: "Consider a reduced starting dose in *28/*28.",
    why: "Same shape as DPYD: a cheap genotype in front of a cytotoxic drug."
  },
  {
    gene: "MT-RNR1 (m.1555A>G)", drug: "Gentamicin, amikacin, tobramycin", area: "Infectious disease",
    level: "CPIC A", label: "—", india: false,
    effect: "Carriers can lose hearing permanently after a single conventional dose of an aminoglycoside — not a dose-dependent effect.",
    action: "Avoid aminoglycosides in carriers unless the infection is life-threatening and no alternative exists.",
    why: "Mitochondrially inherited, so a maternal family history of antibiotic-associated deafness is the clinical clue."
  },
  {
    gene: "RYR1 / CACNA1S", drug: "Volatile anaesthetics, succinylcholine", area: "Anaesthesia",
    level: "CPIC A", label: "—", india: false,
    effect: "Malignant hyperthermia susceptibility — a rapid, life-threatening hypermetabolic crisis under general anaesthesia.",
    action: "Use a non-triggering anaesthetic technique in known carriers, and flag it on every anaesthetic record.",
    why: "The result matters years before the surgery it applies to, which is the whole argument for pre-emptive testing."
  },
  {
    gene: "CFTR", drug: "Ivacaftor", area: "Pulmonology",
    level: "CPIC A", label: "FDA label", india: false,
    effect: "Ivacaftor only works against specific CFTR gating variants. The genotype is the eligibility criterion, not a dosing modifier.",
    action: "Prescribe only for the responsive variants named in the label.",
    why: "The clearest case of genotype as an on/off switch for whether a very expensive drug is worth giving at all."
  },
  {
    gene: "NAT2", drug: "Isoniazid", area: "Tuberculosis",
    level: "Emerging — not CPIC level A", label: "—", india: true,
    effect: "Slow acetylators reach higher isoniazid concentrations and appear to have more hepatotoxicity and peripheral neuropathy; rapid acetylators may be under-treated on standard dosing.",
    action: "No CPIC guideline sets dosing on NAT2. Included because randomised and observational work on acetylator-guided dosing is active and India carries a very large TB burden.",
    why: "Shown deliberately as a not-yet-actionable pair, so the difference between 'interesting' and 'actionable' stays visible."
  }
];

/* ------------------------------------------------- *
 * Layer 1 — blood biomarkers, grouped by test order. *
 * ------------------------------------------------- */

TRIA.biomarkers = [
  { name: "Lipid panel (LDL-C, HDL-C, triglycerides)", tier: 1, cadence: "Every 1-2 years from your 20s", band: "₹300-900",
    what: "The standard starting picture of circulating lipids.", why: "Cheap, universally available, and the entry point to every cardiovascular risk score." },
  { name: "ApoB", tier: 1, cadence: "With, or instead of, a lipid panel", band: "₹600-1,500",
    what: "Counts atherogenic particles directly — one ApoB per LDL, IDL, VLDL and Lp(a) particle.", why: "When LDL-C and ApoB disagree — common in insulin resistance and high triglycerides — ApoB tracks risk better. Not yet standard in most Indian packages; you often have to ask for it by name." },
  { name: "Lp(a)", tier: 1, cadence: "Once in a lifetime", band: "₹800-2,000",
    what: "A largely genetically determined lipoprotein; roughly one in five people carry a raised level.", why: "It is the cheapest genetic information you can buy without a genetic test, because the level barely moves over a lifetime. One measurement answers the question permanently." },
  { name: "HbA1c", tier: 1, cadence: "Every 1-2 years, annually after 40", band: "₹300-700",
    what: "Average glycaemia over roughly three months.", why: "Standard, but blunt — it turns abnormal late. Read it alongside fasting insulin, not on its own." },
  { name: "Fasting glucose + fasting insulin (HOMA-IR)", tier: 2, cadence: "If HbA1c drifts, or with central adiposity", band: "₹500-1,400",
    what: "Insulin resistance often shows years before glucose does.", why: "Particularly relevant for South Asian physiology, where metabolic dysfunction appears at lower BMI than the thresholds derived from European cohorts." },
  { name: "hs-CRP", tier: 2, cadence: "When it would change a decision", band: "₹400-1,200",
    what: "Low-grade systemic inflammation.", why: "Non-specific and easily confounded by any recent infection. Useful as a repeated measure, misleading as a single reading." },
  { name: "Homocysteine", tier: 2, cadence: "Rarely — see the Pathway section", band: "₹700-1,800",
    what: "A methylation-cycle intermediate that rises when B12, folate or B6 are short.", why: "Often sold as a cardiovascular test. It is better understood as a readout of B-vitamin status: correcting a real deficiency is worthwhile, but trials of B-vitamin supplementation have not shown the cardiovascular event reduction the marker's popularity implies." },
  { name: "Vitamin B12", tier: 1, cadence: "Every 2-3 years; more often if vegetarian", band: "₹600-1,500",
    what: "Cofactor for converting homocysteine back to methionine.", why: "Deficiency is genuinely common on vegetarian diets and on long-term metformin, and it is one of the few findings here with a cheap, effective, unambiguous fix." },
  { name: "Folate (serum or RBC)", tier: 2, cadence: "With B12 if homocysteine is raised", band: "₹500-1,300",
    what: "The other half of the methylation input.", why: "In countries with fortified staples, deficiency is uncommon; India does not fortify as consistently, so it remains worth checking when indicated." },
  { name: "Ferritin + CBC", tier: 1, cadence: "Every 1-2 years; annually if menstruating", band: "₹400-1,000",
    what: "Iron stores and the blood count they support.", why: "Iron deficiency is the highest-prevalence correctable finding on this whole list in India, and it is routinely missed because haemoglobin is checked while ferritin is not." },
  { name: "Vitamin D (25-OH)", tier: 2, cadence: "Once, then only if treating", band: "₹800-2,000",
    what: "Vitamin D status.", why: "Very widely sold and very widely deficient in Indian cohorts. Worth measuring once; repeat testing usually adds cost rather than information." },
  { name: "TSH", tier: 1, cadence: "Every 2-3 years", band: "₹250-600",
    what: "Thyroid function screen.", why: "Common, treatable, and produces symptoms easily mistaken for stress or ageing." },
  { name: "ALT / AST", tier: 1, cadence: "Every 1-2 years", band: "₹250-700",
    what: "Liver enzymes.", why: "A raised ALT is often the first sign of metabolic (fatty) liver disease, which tracks with the same insulin resistance the metabolic markers are chasing." },
  { name: "Creatinine + eGFR", tier: 1, cadence: "Every 1-2 years", band: "₹250-600",
    what: "Kidney filtration.", why: "Sets a baseline and, practically, decides the safe dose of many drugs later." },
  { name: "Urine albumin-to-creatinine ratio", tier: 2, cadence: "If diabetic, hypertensive, or eGFR falling", band: "₹400-1,000",
    what: "Early kidney and vascular damage.", why: "Turns abnormal well before creatinine does, and changes treatment when it does." },
  { name: "Uric acid", tier: 2, cadence: "With metabolic workup or gout symptoms", band: "₹200-500",
    what: "Purine metabolism end-product.", why: "Clearly useful for gout; its role as an independent cardiovascular marker is contested." }
];

/* ------------------------------------------------------------- *
 * Market map — India. Bands are illustrative public list prices. *
 * ------------------------------------------------------------- */

TRIA.market = {
  updated: "2025-2026 public list bands",
  rows: [
    { type: "Basic preventive blood panel", who: "National diagnostic chains (Thyrocare, Redcliffe, Dr Lal PathLabs, Metropolis, SRL)", band: "₹500-2,500", cat: "blood",
      note: "Home collection is standard in metros. The cheapest tier is usually a fixed bundle you cannot edit." },
    { type: "Extended 'full body' package (60-90 analytes)", who: "Same chains, package tiers", band: "₹1,500-5,000", cat: "blood",
      note: "Priced for volume. Adds many analytes that will not change a decision, and frequently still omits ApoB and Lp(a)." },
    { type: "Hospital-linked lab panel", who: "Apollo, Fortis, Max, Manipal and similar hospital labs", band: "₹1,000-6,000", cat: "blood",
      note: "Costs more than the chains; often bundled with a physician consult, which is the part actually worth paying for." },
    { type: "Individual add-on analytes (ApoB, Lp(a), homocysteine, insulin)", who: "Most accredited labs, on request", band: "₹200-2,000 each", cat: "blood",
      note: "Usually the best value per rupee: you buy exactly the measurement that answers your question." },
    { type: "Single-gene clinical PGx test (HLA-B*15:02, TPMT/NUDT15, DPYD, G6PD)", who: "Clinical genetics labs and larger hospital labs", band: "₹2,000-8,000", cat: "pgx",
      note: "The highest-yield genetic spend in this table when a specific drug decision is imminent." },
    { type: "Clinical pharmacogenomics panel (multi-gene)", who: "MedGenome, Strand/Neuberg, Lilac Insights, Suburban and peers", band: "₹8,000-25,000", cat: "pgx",
      note: "Check the gene list before buying. A panel without CYP2C19, CYP2D6, DPYD, TPMT/NUDT15 and HLA-B*15:02 is not a serious PGx panel for India." },
    { type: "Direct-to-consumer 'wellness + ancestry' genomics", who: "Mapmygenome, Xcode Life and similar D2C brands", band: "₹8,000-30,000", cat: "dtc",
      note: "Array-based. Ancestry and carrier findings can be sound; the trait, diet and fitness sections are where the evidence thins out fastest." },
    { type: "Clinical exome sequencing", who: "Clinical genomics labs, usually on physician referral", band: "₹20,000-45,000", cat: "clinical",
      note: "A diagnostic test for a suspected genetic condition, not a screening product for a healthy adult." },
    { type: "Whole genome sequencing", who: "Clinical genomics labs; some consumer offerings", band: "₹35,000-1,00,000+", cat: "clinical",
      note: "Price has fallen much faster than the ability to interpret the result. Most of the file will not be actionable for a healthy person." },
    { type: "Carrier screening (pre-conception)", who: "Clinical genomics labs and fertility clinics", band: "₹10,000-30,000", cat: "clinical",
      note: "Genuinely useful in a specific window — planning a pregnancy, or consanguineous partnership — and largely pointless outside it." }
  ]
};

/* ---------------------------------------- *
 * Planner rules. All evaluated on-device.   *
 * ---------------------------------------- */

TRIA.plannerQuestions = [
  { id: "age", label: "Age band", type: "one",
    options: [ {v:"u30",l:"Under 30"}, {v:"30s",l:"30-39"}, {v:"40s",l:"40-54"}, {v:"55p",l:"55+"} ] },
  { id: "goal", label: "What is actually prompting this?", type: "many",
    options: [
      {v:"cvd",l:"Heart risk"}, {v:"metab",l:"Weight / blood sugar"},
      {v:"fatigue",l:"Fatigue, low energy"}, {v:"meds",l:"About to start a new medicine"},
      {v:"family",l:"Planning a pregnancy"}, {v:"curious",l:"General curiosity"} ] },
  { id: "fh", label: "Family history (first-degree relatives)", type: "many",
    options: [
      {v:"cvd",l:"Early heart attack or stroke"}, {v:"dm",l:"Type 2 diabetes"},
      {v:"chol",l:"Very high cholesterol"}, {v:"cancer",l:"Cancer under 50"},
      {v:"drug",l:"Bad drug reaction"}, {v:"none",l:"None known"} ] },
  { id: "diet", label: "Diet", type: "one",
    options: [ {v:"veg",l:"Vegetarian / vegan"}, {v:"mixed",l:"Mixed"}, ] },
  { id: "budget", label: "Roughly what are you willing to spend now?", type: "one",
    options: [ {v:"low",l:"Under ₹2,000"}, {v:"mid",l:"₹2,000-8,000"}, {v:"high",l:"Above ₹8,000"} ] }
];
