import fs from 'node:fs';
const file = process.argv[2];
if (!file) { console.error('Usage: node scripts/validate-training-run-spec.mjs <spec.json>'); process.exit(2); }
const x = JSON.parse(fs.readFileSync(file,'utf8'));
const required = ['schemaVersion','trainingRunId','backend','datasetManifestId','baseModelArtifactRef','tokenizerDigest','chatTemplateDigest','targetRole','targetTaskFamilies','method','trainingConfigRef','resourceBudgetRef','checkpointPolicyRef','outputCandidateRootRef','policyVersion','contentHash'];
const errors = required.filter((k) => x[k] === undefined || x[k] === null || x[k] === '');
if (x.schemaVersion !== 1) errors.push('schemaVersion must be 1');
if (!['lora','qlora','dpo','other-reviewed'].includes(x.method)) errors.push('unsupported method');
if (x.baseModelArtifactRef?.readOnly !== true) errors.push('baseModelArtifactRef.readOnly must be true');
if (!String(x.outputCandidateRootRef || '').includes('candidate')) errors.push('outputCandidateRootRef must be a candidate/quarantine path');
if (!Array.isArray(x.targetTaskFamilies) || !x.targetTaskFamilies.length) errors.push('targetTaskFamilies required');
if (errors.length) { console.error('TrainingRunSpec validation: FAIL'); for (const e of errors) console.error(`- ${e}`); process.exit(1); }
console.log('TrainingRunSpec validation: PASS (contract completeness only; does not authorize execution)');
