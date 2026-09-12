import fs from 'node:fs';
import path from 'node:path';

let input = {};
try { input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch {}
if ((input.invocationNum ?? 0) !== 0) {
  process.stdout.write('{}');
  process.exit(0);
}

const mountedWorkspaces = Array.isArray(input.workspacePaths) ? input.workspacePaths : [];
const workspace = mountedWorkspaces.find((candidate) =>
  fs.existsSync(path.join(candidate, '.seh', 'phase-state.json')) &&
  fs.existsSync(path.join(candidate, 'architecture.md'))
) || mountedWorkspaces[0] || process.cwd();
function readJson(rel, fallback) {
  try { return JSON.parse(fs.readFileSync(path.join(workspace, rel), 'utf8')); } catch { return fallback; }
}
const phase = readJson('.seh/phase-state.json', { activeImplementationPhase: 'unknown', parallelResearchLanes: [] });
const pin = readJson('.seh/upstream-pin.json', { approvedPin: { commit: 'unknown' } });
const laneIds = (phase.parallelResearchLanes || []).map((x) => typeof x === 'string' ? x : x.id).filter(Boolean);
const msg = [
  'SEH v3.1 workspace reminder:',
  `implementation phase ${phase.activeImplementationPhase}; research lanes ${laneIds.join(', ') || 'none'}.`,
  `Approved DSH pin: ${pin.approvedPin?.commit || 'unknown'}.`,
  'Task requirements, deterministic options, and ToolGrantManifest precede model and steering selection.',
  'Supported does not imply qualified. One generative model lease is shared across inference, qualification, steering work, and training.',
  'Phase 0 enables contracts and fake tests only: no live routing, load/unload, non-neutral steering, vector extraction, remote calls, Unsloth run, training, candidate execution, autonomous memory mutation, or promotion.',
  'Preserve DSH AGENTS.md and use documented Cordis seams.'
].join(' ');
process.stdout.write(JSON.stringify({ injectSteps: [{ ephemeralMessage: msg }] }));
