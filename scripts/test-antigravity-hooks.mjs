import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function run(script, input) {
  const result = spawnSync(process.execPath, [path.join(root, script)], {
    input: JSON.stringify(input),
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, `${script} exited ${result.status}: ${result.stderr}`);
  return JSON.parse(result.stdout || '{}');
}

const base = {
  conversationId: 'test',
  workspacePaths: [root],
  transcriptPath: path.join(os.tmpdir(), 'transcript.jsonl'),
  artifactDirectoryPath: os.tmpdir()
};

const safeWrite = run('scripts/antigravity-pretool-guard.mjs', {
  ...base,
  toolCall: { name: 'write_to_file', args: { TargetFile: path.join(root, 'tmp.txt') } }
});
assert.equal(safeWrite.decision, 'ask');

const protectedWrite = run('scripts/antigravity-pretool-guard.mjs', {
  ...base,
  toolCall: { name: 'write_to_file', args: { TargetFile: path.join(root, '.seh', 'phase-state.json') } }
});
assert.equal(protectedWrite.decision, 'force_ask');

const credentialWrite = run('scripts/antigravity-pretool-guard.mjs', {
  ...base,
  toolCall: { name: 'write_to_file', args: { TargetFile: path.join(root, '.env.local') } }
});
assert.equal(credentialWrite.decision, 'force_ask');

const outsideWrite = run('scripts/antigravity-pretool-guard.mjs', {
  ...base,
  toolCall: { name: 'write_to_file', args: { TargetFile: path.join(os.tmpdir(), 'outside.txt') } }
});
assert.equal(outsideWrite.decision, 'deny');

const destructive = run('scripts/antigravity-pretool-guard.mjs', {
  ...base,
  toolCall: { name: 'run_command', args: { CommandLine: 'rm -rf /', Cwd: root } }
});
assert.equal(destructive.decision, 'deny');

for (const command of [
  'python train_unsloth.py',
  'python scripts/train.py',
  'accelerate launch scripts/sft.py',
  'curl https://example.invalid/model',
  'git commit -am test'
]) {
  const highImpact = run('scripts/antigravity-pretool-guard.mjs', {
    ...base,
    toolCall: { name: 'run_command', args: { CommandLine: command, Cwd: root } }
  });
  assert.equal(highImpact.decision, 'force_ask', command);
}

const validation = run('scripts/antigravity-pretool-guard.mjs', {
  ...base,
  toolCall: { name: 'run_command', args: { CommandLine: 'node scripts/check-seh-setup.mjs', Cwd: root } }
});
assert.equal(validation.decision, 'ask');

const malformed = spawnSync(process.execPath, [path.join(root, 'scripts/antigravity-pretool-guard.mjs')], {
  input: '{not-json',
  encoding: 'utf8'
});
assert.equal(malformed.status, 0);
assert.equal(JSON.parse(malformed.stdout).decision, 'deny');

const reminder = run('scripts/antigravity-pre-invocation.mjs', {
  ...base,
  invocationNum: 0,
  initialNumSteps: 0
});
assert.ok(Array.isArray(reminder.injectSteps) && reminder.injectSteps[0].ephemeralMessage.includes('SEH v3.1'));

const later = run('scripts/antigravity-pre-invocation.mjs', {
  ...base,
  invocationNum: 1,
  initialNumSteps: 1
});
assert.deepEqual(later, {});

const hooks = JSON.parse(fs.readFileSync(path.join(root, '.agents/hooks.json'), 'utf8'));
assert.ok(hooks['seh-phase-context']?.PreInvocation);
assert.ok(hooks['seh-tool-review']?.PreToolUse);
console.log('Antigravity hook self-test: PASS');
