import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]);
}
for (const group of ['.agents/rules','.agents/workflows']) {
  for (const file of walk(path.join(root, group)).filter((x) => x.endsWith('.md'))) {
    const n = fs.readFileSync(file, 'utf8').length;
    if (n > 12000) errors.push(`${path.relative(root,file)} exceeds 12000 characters: ${n}`);
  }
}
for (const file of walk(path.join(root,'.agents/skills')).filter((x) => path.basename(x) === 'SKILL.md')) {
  const text = fs.readFileSync(file,'utf8');
  if (!text.startsWith('---\n')) errors.push(`${path.relative(root,file)} missing YAML frontmatter`);
  if (!/^description:\s*\S/m.test(text)) errors.push(`${path.relative(root,file)} missing description`);
}
for (const file of walk(path.join(root,'.agents/agents')).filter((x) => path.basename(x) === 'agent.md')) {
  const text = fs.readFileSync(file,'utf8');
  for (const key of ['name','description','tools','mainAgent','subagent','model','commandExecutionPolicy']) if (!new RegExp(`^${key}:`, 'm').test(text)) errors.push(`${path.relative(root,file)} missing ${key}`);
}
if (errors.length) { console.error('Antigravity customization limits: FAIL'); for (const e of errors) console.error(`- ${e}`); process.exit(1); }
console.log('Antigravity customization limits: PASS');
