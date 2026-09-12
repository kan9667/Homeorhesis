import fs from 'node:fs';
const file = process.argv[2];
if (!file) { console.error('Usage: node scripts/validate-runtime-profile.mjs <profile.json>'); process.exit(2); }
const p = JSON.parse(fs.readFileSync(file, 'utf8'));
const required = ['runtimeProfileId','status','route','modelArtifactDigest','modelSourceRef','licenseRecordId','quantization','inferenceEngine','inferenceEngineVersion','engineConfigDigest','chatTemplateDigest','tokenizerDigest','configuredContextTokens','measuredSafeContextTokens','configuredMaxOutputTokens','cachePolicyDigest','samplingProfileDigest','measuredPeakVramMiB','evidenceRefs'];
const missing = required.filter((k) => !(k in p));
if (missing.length) { console.error(`Missing fields: ${missing.join(', ')}`); process.exit(1); }
if (p.route?.locality !== 'local') { console.error('Runtime profile route.locality must be local'); process.exit(1); }
if (!String(p.status).includes('UNQUALIFIED') && !(Array.isArray(p.evidenceRefs) && p.evidenceRefs.length)) { console.error('Qualified/non-draft status requires evidenceRefs'); process.exit(1); }
if (p.measuredSafeContextTokens > p.configuredContextTokens) { console.error('Measured safe context cannot exceed configured context'); process.exit(1); }
console.log('Runtime profile validation: PASS');
