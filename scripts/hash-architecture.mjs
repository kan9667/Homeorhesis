import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = ['architecture.md','SEH_ARCHITECTURE_v3.1.md'];
const expected = 'e1d48e75f5ba169f262b08071add8fd7ae757d8d14f5c66a11147c404510d04a';
for (const rel of files) {
  const data = fs.readFileSync(path.join(root, rel));
  const digest = crypto.createHash('sha256').update(data).digest('hex');
  console.log(`${rel}: ${digest}${digest === expected ? ' OK' : ' MISMATCH'}`);
  if (digest !== expected) process.exitCode = 1;
}
