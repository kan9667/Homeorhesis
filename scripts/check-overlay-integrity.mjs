import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'PACK_MANIFEST.json'), 'utf8'));
const errors = [];
for (const item of manifest.files || []) {
  const file = path.join(root, item.path);
  if (!fs.existsSync(file)) { errors.push(`missing ${item.path}`); continue; }
  const data = fs.readFileSync(file);
  const digest = crypto.createHash('sha256').update(data).digest('hex');
  if (data.length !== item.bytes) errors.push(`size mismatch ${item.path}: ${data.length} != ${item.bytes}`);
  if (digest !== item.sha256) errors.push(`hash mismatch ${item.path}`);
}
if ((manifest.files || []).length !== manifest.fileCountExcludingManifest) errors.push('manifest file count field is inconsistent');
if (errors.length) {
  console.error('SEH overlay integrity: FAIL');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`SEH overlay integrity: PASS (${manifest.files.length} hashed files)`);
