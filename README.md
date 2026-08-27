# TRIA

**Three layers. One story.**

An educational study and companion app on integrated preventive health: blood biomarkers + genetics + pharmacogenomics.

Live files: open `index.html` in any browser. Printable brief: `study.pdf` (download from the chat zip if not in this repo).

This is **not a diagnostic product**. It does not sequence DNA, interpret your labs as a clinician, or replace a doctor.

## App sections

1. Home — the three-layer model
2. Study — evidence, market, regulation, product critique
3. Pathway — homocysteine / folate / MTHFR explainer
4. PGx lab — searchable gene–drug pairs with CPIC-style actionability
5. Planner — what should I test first?
6. Sample report — annotated mock integrated report
7. India map — who sells what, at what price band
8. Doctor brief — questions to take to a clinician

## How to run

```bash
open index.html
python3 -m http.server 8080 --directory .
```

## Hard limits

- No medical advice
- ACMG does not recommend routine MTHFR polymorphism testing
- CDC: people with MTHFR variants can still process folic acid
- PGx examples restricted to well-known CPIC / FDA pairs
- Prices are 2025–2026 public list bands and will drift

Repo: https://github.com/mayurghule-ux/tria-precision-health
