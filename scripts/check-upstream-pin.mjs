import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pin = JSON.parse(fs.readFileSync(path.join(root,'.seh/upstream-pin.json'),'utf8'));
const expected = 'b150a551b8d465e31e418e1b2eaf5e79bbb7d28e';
let actual = null;
try {
  const head = fs.readFileSync(path.join(root,'.git','HEAD'),'utf8').trim();
  if (head.startsWith('ref: ')) actual = fs.readFileSync(path.join(root,'.git',head.slice(5)),'utf8').trim();
  else actual = head;
} catch {}
if (pin.approvedPin?.commit !== expected) {
  console.error(`Approved pin manifest mismatch: ${pin.approvedPin?.commit}`);
  process.exit(1);
}
console.log(`Approved DSH architecture pin: ${expected}`);
console.log(`Observed upstream candidate: ${pin.observedUpstream?.commit} (${pin.observedUpstream?.status})`);
if (actual) console.log(`Current checkout HEAD: ${actual}${actual === expected ? ' (approved pin)' : ' (not the approved pin; review branch ancestry explicitly)'}`);
else console.log('Current checkout HEAD unavailable; overlay may not yet be copied into a Git worktree.');
