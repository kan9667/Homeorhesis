import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const notes = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap((e) => e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]);
}
const required = [
  'GEMINI.md','GEMENI.md','architecture.md','SEH_ARCHITECTURE_v3.1.md','SEH_ARCHITECTURE_v3.1_CHANGELOG.md','SEH_ARCHITECTURE_v3.1_VALIDATION.md',
  '.agents/hooks.json','.agents/mcp_config.json','.agents/rules/00-seh-core.md','.agents/rules/45-representation-steering.md','.agents/rules/55-supervised-training-backend.md',
  '.seh/phase-state.json','.seh/upstream-pin.json','.seh/steering-policy.defaults.json','.seh/training-backend-policy.defaults.json',
  'docs/adr/ADR-SEH-021.md','docs/adr/ADR-SEH-022.md','docs/antigravity/REPRESENTATION_STEERING_SETUP.md','docs/antigravity/UNSLOTH_BACKEND_SETUP.md',
  '.seh/schemas/runtime-profile.schema.json','.seh/examples/runtime-profile.example.json','scripts/check-toolchain.mjs','scripts/check-local-links.mjs','scripts/check-overlay-integrity.mjs'
];
for (const rel of required) if (!fs.existsSync(path.join(root,rel))) errors.push(`missing ${rel}`);
for (const file of walk(root).filter((x) => x.endsWith('.json'))) {
  try { JSON.parse(fs.readFileSync(file,'utf8')); } catch (e) { errors.push(`invalid JSON ${path.relative(root,file)}: ${e.message}`); }
}
const phase = JSON.parse(fs.readFileSync(path.join(root,'.seh/phase-state.json'),'utf8'));
if (String(phase.activeImplementationPhase) !== '0') errors.push('activeImplementationPhase must be 0');
const lanes = (phase.parallelResearchLanes || []).map((x) => typeof x === 'string' ? x : x.id);
for (const lane of ['0-M','0-M/S','0-M/U']) if (!lanes.includes(lane)) errors.push(`research lane missing: ${lane}`);
for (const [k,v] of Object.entries(phase.runtimeFeatures || {})) if (v !== false) errors.push(`Phase 0 runtime feature must be false: ${k}`);
const policy = JSON.parse(fs.readFileSync(path.join(root,'.seh/policy.defaults.json'),'utf8'));
if (policy.remote?.enabled !== false) errors.push('remote.enabled must be false');
if (policy.local?.maxConcurrentGenerativeGpuModels !== 1) errors.push('maxConcurrentGenerativeGpuModels must be 1');
if (policy.steering?.enabled !== false) errors.push('steering.enabled must be false');
if (policy.training?.enabled !== false || policy.training?.backendEnabled !== false) errors.push('training/backend must be false');
if (policy.evolution?.candidateExecutionEnabled !== false || policy.evolution?.autoPromotionEnabled !== false) errors.push('candidate execution and promotion must be false');
const gemini = fs.readFileSync(path.join(root,'GEMINI.md'),'utf8');
for (const concept of ['supported != qualified','one generative model','ToolGrantManifest','representation steering','TrainingBackend','Unsloth','core/agent-loop','Phase 0-M/S','Phase 0-M/U']) if (!gemini.includes(concept)) errors.push(`GEMINI.md missing concept: ${concept}`);
const a = fs.readFileSync(path.join(root,'architecture.md'));
const b = fs.readFileSync(path.join(root,'SEH_ARCHITECTURE_v3.1.md'));
if (!a.equals(b)) errors.push('architecture.md and versioned architecture differ');
const sha = crypto.createHash('sha256').update(a).digest('hex');
if (sha !== 'e1d48e75f5ba169f262b08071add8fd7ae757d8d14f5c66a11147c404510d04a') errors.push(`architecture SHA mismatch: ${sha}`);
notes.push(`architecture sha256 ${sha}`);
const pin = JSON.parse(fs.readFileSync(path.join(root,'.seh/upstream-pin.json'),'utf8'));
if (pin.approvedPin?.commit !== 'b150a551b8d465e31e418e1b2eaf5e79bbb7d28e') errors.push('approved DSH pin changed unexpectedly');
if (pin.observedUpstream?.commit === pin.approvedPin?.commit) errors.push('observed upstream must remain separate from approved pin');
if (pin.observedUpstream?.status !== 'UNREVIEWED_DO_NOT_ADOPT') errors.push('observed upstream status must remain unreviewed');
const mcp = JSON.parse(fs.readFileSync(path.join(root,'.agents/mcp_config.json'),'utf8'));
if (!mcp.mcpServers || Object.keys(mcp.mcpServers).length !== 0) errors.push('MCP config must start empty');
const hooks = JSON.parse(fs.readFileSync(path.join(root,'.agents/hooks.json'),'utf8'));
if (!hooks['seh-phase-context']?.PreInvocation || !hooks['seh-tool-review']?.PreToolUse) errors.push('required Antigravity hooks missing/current schema invalid');
for (let i=1;i<=22;i++) if (!fs.existsSync(path.join(root,`docs/adr/ADR-SEH-${String(i).padStart(3,'0')}.md`))) errors.push(`missing ADR stub ${i}`);
for (const forbidden of ['llm/kimi-k3','llm/vibethinker-local','llm/qwen-coder','seh/provider-registry','seh/tool-loop','seh/session-runtime','seh/chat-backend','seh/steering-authorization','seh/unsloth-control-plane']) if (fs.existsSync(path.join(root,'packages',forbidden))) errors.push(`forbidden initial package present: packages/${forbidden}`);
const env = fs.readFileSync(path.join(root,'.env.seh.example'),'utf8');
for (const line of env.split(/\r?\n/)) if (/^(MOONSHOT|OPENAI|ANTHROPIC|GOOGLE|DEEPSEEK)_API_KEY=.+/.test(line)) errors.push('environment example contains a nonempty API key');
if (errors.length) { console.error('SEH v3.1 setup validation: FAIL'); for (const e of errors) console.error(`- ${e}`); process.exit(1); }
console.log('SEH v3.1 setup validation: PASS');
for (const n of notes) console.log(`- ${n}`);
console.log(`- rules: ${walk(path.join(root,'.agents/rules')).filter((x)=>x.endsWith('.md')).length}`);
console.log(`- workflows: ${walk(path.join(root,'.agents/workflows')).filter((x)=>x.endsWith('.md')).length}`);
console.log(`- skills: ${walk(path.join(root,'.agents/skills')).filter((x)=>path.basename(x)==='SKILL.md').length}`);
console.log(`- custom agents: ${walk(path.join(root,'.agents/agents')).filter((x)=>path.basename(x)==='agent.md').length}`);
console.log('- phase: 0; research lanes: 0-M, 0-M/S, 0-M/U; live runtime features: disabled');
