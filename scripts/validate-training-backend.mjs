import fs from 'node:fs';
const file = process.argv[2];
if (!file) { console.error('Usage: node scripts/validate-training-backend.mjs <backend.json>'); process.exit(2); }
const x = JSON.parse(fs.readFileSync(file, 'utf8'));
const required = ['schemaVersion','backendId','backendVersion','sourceRevision','environmentDigest','capabilityIds','licenseRecordId','contentHash'];
const errors = required.filter((k) => x[k] === undefined || x[k] === null || x[k] === '');
if (x.schemaVersion !== 1) errors.push('schemaVersion must be 1');
if (!Array.isArray(x.capabilityIds) || !x.capabilityIds.length) errors.push('capabilityIds must be non-empty');
if (errors.length) { console.error('TrainingBackendRef validation: FAIL'); for (const e of errors) console.error(`- ${e}`); process.exit(1); }
console.log('TrainingBackendRef validation: PASS (identity completeness only; not adoption)');
