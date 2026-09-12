import fs from 'node:fs';
import path from 'node:path';

function output(decision, reason) {
  process.stdout.write(JSON.stringify({ decision, reason }));
}

let input;
try {
  input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
} catch {
  output('deny', 'SEH hook could not parse the proposed tool call.');
  process.exit(0);
}

const call = input.toolCall || {};
const name = String(call.name || '');
const args = call.args || {};

function canonicalPath(value) {
  const resolved = path.resolve(String(value));
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

const workspaces = (Array.isArray(input.workspacePaths) ? input.workspacePaths : []).map(canonicalPath);

function insideWorkspace(target) {
  const resolved = canonicalPath(target);
  return workspaces.some((root) => resolved === root || resolved.startsWith(root + path.sep));
}

function targetPath() {
  return args.TargetFile || args.AbsolutePath || args.DirectoryPath || null;
}

if (['write_to_file', 'replace_file_content', 'multi_replace_file_content'].includes(name)) {
  const target = targetPath();
  if (!target || !insideWorkspace(target)) {
    output('deny', 'SEH denies writes outside the mounted workspace.');
    process.exit(0);
  }

  const norm = canonicalPath(target).replaceAll('\\', '/').toLowerCase();
  const protectedPatterns = [
    '/architecture.md',
    '/seh_architecture_v3.1.md',
    '/gemini.md',
    '/gemeni.md',
    '/agents.md',
    '/.agents/',
    '/.seh/',
    '/docs/adr/',
    '/pnpm-lock.yaml',
    '/package.json',
    '/.github/',
    '/packages/seh/control/',
    '/packages/seh/qualification/',
    '/packages/seh/steering/',
    '/packages/seh/residency/',
    '/packages/seh/evidence/',
    '/packages/seh/evaluation/',
    '/packages/seh/gate/',
    '/packages/seh/training/',
    '/packages/seh/training-unsloth/',
    '/packages/seh/release/'
  ];
  const credentialLike = /\/(\.env($|\.)|[^/]*(credential|secret|token|private[-_]?key)[^/]*)/i.test(norm) && !norm.endsWith('.example');

  if (credentialLike) {
    output('force_ask', 'Credential-like file change requires explicit review; never commit secret values.');
    process.exit(0);
  }
  if (protectedPatterns.some((pattern) => norm.includes(pattern))) {
    output('force_ask', 'SEH protected architecture, authority, steering, training, evidence, dependency, gate, release, or customization target requires explicit review.');
    process.exit(0);
  }

  output('ask', 'SEH requests review for workspace file mutation.');
  process.exit(0);
}

if (name === 'run_command') {
  const cmd = String(args.CommandLine || '');
  const cwd = args.Cwd || workspaces[0];
  if (cwd && !insideWorkspace(cwd)) {
    output('deny', 'SEH denies commands with a working directory outside the workspace.');
    process.exit(0);
  }

  const destructive = [
    /rm\s+-rf\s+\/(?:\s|$)/i,
    /mkfs(?:\.|\s)/i,
    /dd\s+if=.*\s+of=\/dev\//i,
    /diskpart(?:\.exe)?\b[\s\S]*\bclean\b/i,
    /format(?:\.com)?\s+[a-z]:/i,
    /remove-item[\s\S]*-recurse[\s\S]*-force[\s\S]*[a-z]:\\?$/i,
    /:\(\)\s*\{\s*:\|:&\s*\};:/
  ];
  if (destructive.some((pattern) => pattern.test(cmd))) {
    output('deny', 'SEH denies destructive system/root command.');
    process.exit(0);
  }

  const highImpact = [
    /\bgit\s+(push|commit|merge|rebase|reset\s+--hard|clean\s+-[^\n]*[fdx])/i,
    /\bgh\s+pr\s+merge\b/i,
    /\b(pnpm|npm|yarn|pip|uv|conda)\s+(install|add|update|upgrade|remove|sync)/i,
    /\b(curl|wget|invoke-webrequest|irm)\b/i,
    /\b(docker|podman|wsl)\b/i,
    /\b(ollama\s+(run|serve|stop|pull)|llama-server|vllm\s+serve|python\s+-m\s+vllm|sglang\.launch_server)\b/i,
    /\b(?:python(?:3|\.exe)?|py)\s+(?:-[^\s]+\s+)*[^\n]*(?:train|finetune|fine[-_ ]?tune)[\w./\\-]*\.py\b/i,
    /\baccelerate\s+launch\b/i,
    /(?:\bunsloth\b|\btransformers\b|\bpeft\b|\btrl\b|\btorchrun\b|\bdeepspeed\b|\bagent[-_ ]?lightning\b|\bverl\b)/i,
    /\b(steering|control[-_ ]?vector|training)\b[\s\S]*\b(extract|load|start|run|enable|activate|resume)\b/i,
    /\b(remote\s+enable|release\s+(activate|canary|rollback)|gate\s+decide)\b/i
  ];
  if (highImpact.some((pattern) => pattern.test(cmd))) {
    output('force_ask', 'SEH high-impact dependency, network, Git, runtime, steering, training, provider, gate, or release command requires explicit review.');
    process.exit(0);
  }

  output('ask', 'SEH requests review for terminal execution.');
  process.exit(0);
}

output('ask', 'SEH requests review for mutating tool use.');
