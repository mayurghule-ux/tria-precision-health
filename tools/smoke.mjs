import { chromium } from 'playwright';

const ROUTES = ['home','study','pathway','pgx','planner','report','market','brief','about'];
const base = process.argv[2] || 'http://127.0.0.1:8099';
const shots = process.argv[3];
let failed = false;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

const problems = [];
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') problems.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', e => problems.push(`[pageerror] ${e.message}`));
page.on('requestfailed', r => problems.push(`[reqfail] ${r.url()} ${r.failure()?.errorText}`));

await page.goto(base + '/index.html', { waitUntil: 'networkidle' });

for (const r of ROUTES) {
  await page.evaluate(k => { location.hash = '#/' + k; }, r);
  await page.waitForTimeout(180);
  const info = await page.evaluate(() => ({
    h1: document.querySelector('#view h1')?.textContent?.trim().slice(0,48),
    len: document.querySelector('#view').innerHTML.length,
    title: document.title,
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    current: document.querySelector('.tabbar [aria-current="page"]')?.textContent?.trim()
  }));
  const overflow = info.scrollW > info.clientW ? ` !! H-OVERFLOW ${info.scrollW}>${info.clientW}` : '';
  if (overflow) failed = true;
  if (!info.h1 || info.len < 500) { console.log('  !! route rendered nothing useful'); failed = true; }
  console.log(String(r).padEnd(8), String(info.len).padStart(6), '|', (info.h1||'(none)').padEnd(30), '| tab:', info.current || '-', overflow);
  if (shots) await page.screenshot({ path: `${shots}/${r}.png`, fullPage: false });
}

// interactive checks
await page.evaluate(() => { location.hash = '#/pgx'; });
await page.waitForTimeout(150);
await page.fill('#pgxq', 'clopidogrel');
await page.waitForTimeout(120);
console.log('\npgx search "clopidogrel" ->', await page.textContent('#pgxcount'));
await page.fill('#pgxq', '');
await page.click('button[data-f="india"]');
await page.waitForTimeout(120);
console.log('pgx filter india      ->', await page.textContent('#pgxcount'));

await page.evaluate(() => { location.hash = '#/planner'; });
await page.waitForTimeout(150);
await page.click('button[data-q="age"][data-v="40s"]');
await page.click('button[data-q="goal"][data-v="cvd"]');
await page.click('button[data-q="budget"][data-v="mid"]');
await page.waitForTimeout(150);
const steps = await page.$$eval('#planout .stepnum', els => els.length);
console.log('planner steps         ->', steps);

// persistence across reload
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(250);
const persisted = await page.$$eval('#planout .stepnum', els => els.length).catch(() => 0);
console.log('planner after reload  ->', persisted);

// brief picks up planner
await page.evaluate(() => { location.hash = '#/brief'; });
await page.waitForTimeout(180);
console.log('brief has plan block  ->', await page.evaluate(() => /What the planner suggested/.test(document.querySelector('#view').textContent)));

// theme toggle
await page.click('#themetoggle');
await page.waitForTimeout(80);
const t1 = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
await page.click('#themetoggle');
await page.waitForTimeout(80);
const t2 = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
console.log('theme cycle           ->', t1, '->', t2);
if (shots) { await page.evaluate(() => location.hash = '#/home'); await page.waitForTimeout(200); await page.screenshot({ path: `${shots}/home-light.png` }); }

// tap target audit
await page.evaluate(() => { location.hash = '#/pgx'; });
await page.waitForTimeout(200);
const small = await page.$$eval('button, a, input, summary', els =>
  els.filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 40; })
     .map(e => e.tagName + '.' + (e.className||'') + ' h=' + Math.round(e.getBoundingClientRect().height)));
console.log('tap targets < 40px    ->', small.length ? small.slice(0,6).join(' | ') : 'none');

const uniq = [...new Set(problems)];
console.log('\nconsole problems      ->', uniq.length ? '\n  ' + uniq.join('\n  ') : 'none');
if (uniq.length) failed = true;
if (small.length) failed = true;
await browser.close();
if (failed) { console.error('\nSMOKE TEST FAILED'); process.exit(1); }
console.log('\nsmoke test passed');
