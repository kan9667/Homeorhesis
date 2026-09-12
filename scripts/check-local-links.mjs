import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
}
function stripAnchor(target) { return target.split('#', 1)[0].split('?', 1)[0]; }
for (const file of walk(root).filter((p) => p.endsWith('.md'))) {
  const text = fs.readFileSync(file, 'utf8');
  const links = [...text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)].map((m) => m[1].trim().replace(/^<|>$/g, ''));
  for (const target of links) {
    if (!target || /^(?:https?:|mailto:|data:|#)/i.test(target)) continue;
    const clean = decodeURIComponent(stripAnchor(target));
    if (!clean) continue;
    const resolved = clean.startsWith('/') ? path.join(root, clean.slice(1)) : path.resolve(path.dirname(file), clean);
    if (!fs.existsSync(resolved)) errors.push(`${path.relative(root, file)} -> ${target}`);
  }
}
if (errors.length) {
  console.error('Local Markdown links: FAIL');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('Local Markdown links: PASS');
