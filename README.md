# TRIA

**Three layers. One story.**

An educational study and companion app on integrated preventive health: blood
biomarkers + genetics + pharmacogenomics.

This is **not a diagnostic product**. It does not sequence DNA, interpret your
labs as a clinician, or replace a doctor.

## Getting it on a phone

Two ways, both offline once installed.

**As an Android app.** The **Build APK** workflow produces an installable APK on
every push. Open the latest run under the Actions tab, download the
`tria-apk-<n>` artifact, unzip it, and install the `-release.apk` on the phone.
Setup, signing and the install steps are in [`android/README.md`](android/README.md).

**As a home-screen web app.** Once GitHub Pages is enabled for this repository
(Settings → Pages → Source: GitHub Actions), open the published URL on the phone
and choose *Add to Home Screen* / *Install app*. It then launches full-screen
with no browser chrome and works with no connection.

Neither route needs the Play Store.

## Running it locally

There is no build step. The app is plain HTML, CSS and ES5-compatible JavaScript.

```bash
python3 -m http.server 8080     # then open http://localhost:8080
```

Serve it over HTTP rather than opening `index.html` directly — the service worker
and `localStorage` need an origin.

## App sections

1. **Home** — the three-layer model
2. **Study** — evidence, market, regulation, product critique
3. **Pathway** — homocysteine / folate / MTHFR explainer, with a diagram
4. **PGx lab** — 24 searchable gene-drug pairs with CPIC-style actionability
5. **Planner** — what should I test first, including what not to buy
6. **Sample report** — annotated mock integrated report
7. **Market map** — who sells what in India, at what price band
8. **Doctor brief** — printable questions to take to a clinician

## Privacy

There is no account, no server, no analytics, and no network call in normal use.
Planner answers and doctor-brief notes are held in the app's own local storage on
the device and are lost if you clear app data.

The Android build makes that structural rather than promised: it declares **no
`INTERNET` permission**, and the WebView answers every non-asset request locally
with a 403. The app is incapable of sending your notes anywhere.

## Repository layout

```
index.html                  app shell
assets/css/app.css          all styling, light and dark
assets/js/data.js           PGx pairs, biomarkers, market bands, planner questions
assets/js/views*.js         the eight sections
assets/js/app.js            hash router, tab bar, theme, service worker
sw.js                       precache-everything service worker
manifest.webmanifest        PWA manifest
android/                    Gradle project wrapping the above in a WebView
tools/smoke.mjs             Playwright test that renders every section
.github/workflows/          APK build, Pages deploy, smoke test
```

## Tests

```bash
npm ci
npx playwright install chromium
npx http-server -p 8099 -s . &
npm run smoke
```

The smoke test loads every section at a phone viewport and fails on a console
error, a failed request, horizontal overflow, a tap target under 40px, or a
section that renders nothing. It runs in CI on every push.

## Hard limits

- No medical advice
- ACMG does not recommend routine MTHFR polymorphism testing
- CDC: people with MTHFR variants can still process folic acid
- PGx examples restricted to well-known CPIC / FDA pairs, with one pair marked
  explicitly as not yet actionable
- Prices are 2025-2026 public list bands for categories of service, not quotes,
  and they will drift
- Regulatory statements are dated and should be re-checked against the primary
  source before you rely on them

Repo: https://github.com/mayurghule-ux/tria-precision-health
