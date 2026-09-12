import fs from 'node:fs';
const file = process.argv[2];
if (!file) { console.error('Usage: node scripts/validate-steering-profile.mjs <profile.json>'); process.exit(2); }
const x = JSON.parse(fs.readFileSync(file,'utf8'));
const required = ['schemaVersion','steeringProfileId','baseRuntimeProfileId','modelArtifactDigest','quantization','inferenceEngine','inferenceEngineVersion','tokenizerDigest','chatTemplateDigest','promptBundleDigest','toolBundleDigest','extractionDatasetDigest','extractionSplitDigest','vectorArtifactDigest','layerStart','layerEnd','evidenceRefs','contentHash'];
const errors = required.filter((k) => x[k] === undefined || x[k] === null || x[k] === '');
if (x.schemaVersion !== 1) errors.push('schemaVersion must be 1');
if (!Number.isInteger(x.layerStart) || !Number.isInteger(x.layerEnd) || x.layerEnd < x.layerStart) errors.push('invalid layer range');
if (errors.length) { console.error('Steering profile validation: FAIL'); for (const e of errors) console.error(`- ${e}`); process.exit(1); }
console.log('Steering profile validation: PASS (identity completeness only; not qualification)');
