import { execFileSync } from 'node:child_process';

function parseVersion(text) {
  const m = String(text).trim().match(/(?:v)?(\d+)\.(\d+)\.(\d+)/);
  return m ? m.slice(1).map(Number) : null;
}
function atLeast(actual, required) {
  for (let i = 0; i < 3; i += 1) {
    if (actual[i] > required[i]) return true;
    if (actual[i] < required[i]) return false;
  }
  return true;
}
function commandVersion(command, args) {
  try { return execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }).trim(); }
  catch { return null; }
}

const errors = [];
const node = parseVersion(process.versions.node);
const nodeOk = node && ((node[0] === 22 && atLeast(node, [22,19,0])) || node[0] >= 24);
if (!nodeOk) errors.push(`Node ${process.versions.node} is unsupported; require ^22.19.0 or >=24.0.0`);

const gitText = commandVersion('git', ['--version']);
const git = parseVersion(gitText || '');
if (!git) errors.push('git is not installed or its version could not be read');
else if (!atLeast(git, [2,26,0])) errors.push(`git ${git.join('.')} is unsupported; require >=2.26.0`);

const pnpmText = commandVersion('pnpm', ['--version']);
const pnpm = parseVersion(pnpmText || '');
if (!pnpm) errors.push('pnpm is not installed; approved DSH package manager is pnpm 11.7.0');
else if (pnpm.join('.') !== '11.7.0') errors.push(`pnpm ${pnpm.join('.')} does not match approved DSH package manager 11.7.0`);

console.log(`Node: ${process.versions.node}${nodeOk ? ' OK' : ' MISMATCH'}`);
console.log(`git: ${gitText || 'unavailable'}${git && atLeast(git,[2,26,0]) ? ' OK' : ' MISMATCH'}`);
console.log(`pnpm: ${pnpmText || 'unavailable'}${pnpm && pnpm.join('.') === '11.7.0' ? ' OK' : ' MISMATCH'}`);
if (errors.length) {
  console.error('SEH toolchain check: FAIL');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('SEH toolchain check: PASS');
