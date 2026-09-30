// Mağaza ekran görüntülerini örnek verilerle üretir.
// Çalıştırma: npm run screenshots  →  store/screenshots/{ios,android}/*.png
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const url = pathToFileURL(path.join(root, 'src', 'index.html')).href;
const targets = [
  { dir: 'ios', viewport: { width: 430, height: 932 }, scale: 3 },      // 1290 × 2796 (iPhone 6.7")
  { dir: 'android', viewport: { width: 360, height: 640 }, scale: 3 },  // 1080 × 1920
];
const demo = () => {
  const best = { sinaps: 1180, kayip: 900, degisen: 760, tekfark: 1900, cogunluk: 1500, refleks: 2700, siraavcisi: 1600,
    tersakis: 1700, kuralibul: 1300, hedefsayi: 1900, oruntu: 1400, zincirhesap: 800, kesir: 1500, zit: 2000, anagram: 1300, pusula: 1400, dondur: 1100 };
  const days = []; for (let i = 0; i < 9; i++) { const d = new Date(); d.setDate(d.getDate() - i); days.push(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`); }
  const history = Object.entries(best).slice(0, 8).map(([g, s], i) => ({ g, s, d: `${30 - i} Eylül · 20:1${i}` }));
  localStorage.setItem('korteks-v1', JSON.stringify({ best, days, history, played: {}, settings: { sound: false, vibrate: false }, profile: { name: 'Deniz' }, onboarded: true }));
};

const browser = await chromium.launch();
for (const t of targets) {
  const out = path.join(root, 'store', 'screenshots', t.dir); mkdirSync(out, { recursive: true });
  const page = await browser.newPage({ viewport: t.viewport, deviceScaleFactor: t.scale });
  await page.goto(url); await page.evaluate(() => localStorage.clear()); await page.reload();
  await page.waitForTimeout(900); await page.screenshot({ path: `${out}/1-karsilama.png` });
  await page.evaluate(demo); await page.goto(url + '#/'); await page.reload(); await page.waitForTimeout(1800);
  await page.screenshot({ path: `${out}/2-ana-sayfa.png` });
  await page.goto(url + '#/kategori/hafiza'); await page.waitForTimeout(700); await page.screenshot({ path: `${out}/3-kategori.png` });
  await page.goto(url + '#/oyun/sinaps'); await page.waitForTimeout(400); await page.click('#go'); await page.waitForTimeout(1300);
  await page.screenshot({ path: `${out}/4-oyun.png` });
  await page.goto(url + '#/oyun/cogunluk'); await page.waitForTimeout(400); await page.click('#go'); await page.waitForTimeout(2600);
  await page.screenshot({ path: `${out}/5-oyun.png` });
  await page.goto(url + '#/ilerleme'); await page.waitForTimeout(800); await page.screenshot({ path: `${out}/6-ilerleme.png` });
  await page.close();
  console.log(`✓ ${t.dir}`);
}
await browser.close();
