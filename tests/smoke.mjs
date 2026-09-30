// KORTEKS duman testi: her soru üreticisini doğrular ve 50 oyunun hepsini hatasız açıp oynatır.
// Çalıştırma: npm test
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const url = pathToFileURL(path.join(root, 'src', 'index.html')).href;

const browser = await chromium.launch();
const open = async () => {
  const page = await browser.newPage({ viewport: { width: 400, height: 860 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  await page.goto(url);
  await page.waitForFunction(() => typeof ALL !== 'undefined' && ALL.length > 0);
  return { page, errors };
};

let failed = 0;

// 1) Soru üreticileri
{
  const { page, errors } = await open();
  const count = await page.evaluate(() => ALL.length);
  console.log(`Oyun sayısı: ${count}`);
  const problems = await page.evaluate(() => {
    const out = [];
    for (const g of ALL) {
      if (!g.gen) continue;
      const st = g.init ? g.init() : {};
      for (let lv = 1; lv <= 12; lv++) for (let k = 0; k < 40; k++) {
        try {
          const Q = g.gen(lv, st);
          if (Q.opts) {
            if (!(Q.ans >= 0 && Q.ans < Q.opts.length)) throw new Error('cevap indeksi geçersiz');
            if (new Set(Q.opts).size !== Q.opts.length) throw new Error('tekrarlanan seçenek');
          } else {
            const d = document.createElement('div'); d.innerHTML = Q.q;
            if (!d.querySelector(`[data-a="${Q.ans}"]`)) throw new Error('dokunma hedefi yok');
          }
          const html = (Q.q || '') + (Q.show || '') + (Q.seq || []).join('') + (Q.opts || []).join('');
          if (/undefined|NaN/.test(html)) throw new Error('undefined/NaN içerik');
          if (g.onAns) g.onAns(Math.random() < 0.7, st);
        } catch (e) { out.push(`${g.id}: ${e.message}`); break; }
      }
    }
    return [...new Set(out)];
  });
  problems.forEach((p) => console.error('✗', p));
  failed += problems.length + errors.length;
  errors.forEach((e) => console.error('✗ sayfa hatası:', e));
  await page.close();
}

// 2) Her oyunu başlat ve rastgele oynat
{
  const { page } = await open();
  const ids = await page.evaluate(() => ALL.map((g) => g.id));
  await page.close();
  const parts = Array.from({ length: 5 }, (_, i) => ids.filter((_, j) => j % 5 === i));
  await Promise.all(parts.map(async (list) => {
    const { page, errors } = await open();
    for (const id of list) {
      errors.length = 0;
      await page.evaluate((id) => start(GM[id]), id);
      await page.waitForTimeout(2600);
      for (let i = 0; i < 14; i++) {
        await page.evaluate(() => {
          const c = [...document.querySelectorAll('#opts button,#q [data-a],.node,.orb,.bub,.mcard,.bigbtn,#stop,.lgrid button,.pad button:not([disabled]),.tiles button,.tg button')].filter((e) => e.offsetParent !== null);
          if (!c.length) return;
          const e = c[Math.floor(Math.random() * c.length)];
          e.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
          e.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });
        await page.waitForTimeout(260);
      }
      if (errors.length) { failed++; console.error(`✗ ${id}: ${errors.join('; ')}`); }
      else console.log(`✓ ${id}`);
    }
    await page.close();
  }));
}

await browser.close();
if (failed) { console.error(`\n${failed} sorun bulundu.`); process.exit(1); }
console.log('\nTüm testler geçti.');
