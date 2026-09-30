// src/ altındaki dosyaları tarar, sw.js içindeki önbellek listesini ve sürümünü package.json'a göre günceller.
// Çalıştırma: npm run sw
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const src = path.join(root, 'src');
const { version } = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));

const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = path.join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : [path.relative(src, p).split(path.sep).join('/')];
});
const files = ['./', ...walk(src).filter((f) => f !== 'sw.js').sort()];

const swPath = path.join(src, 'sw.js');
let sw = readFileSync(swPath, 'utf8');
sw = sw.replace(/const CACHE='[^']*';/, `const CACHE='korteks-${version}';`);
sw = sw.replace(/const FILES=\[[^\]]*\];/, `const FILES=${JSON.stringify(files)};`);
writeFileSync(swPath, sw);
console.log(`sw.js güncellendi: korteks-${version}, ${files.length} dosya`);
