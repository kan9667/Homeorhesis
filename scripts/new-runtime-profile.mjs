import fs from 'node:fs';
import path from 'node:path';

const id = process.argv[2];
if (!id || !/^[a-z0-9][a-z0-9._-]+$/.test(id)) {
  console.error('Usage: node scripts/new-runtime-profile.mjs <lowercase-profile-id>');
  process.exit(2);
}

const out = path.join('.seh-data', 'runtime-profiles', `${id}.json`);
fs.mkdirSync(path.dirname(out), { recursive: true });
if (fs.existsSync(out)) {
  console.error(`Refusing to overwrite ${out}`);
  process.exit(1);
}

const profile = {
  schemaVersion: 1,
  runtimeProfileId: id,
  status: 'DRAFT_UNQUALIFIED',
  route: {
    schemaVersion: 1,
    providerId: '',
    modelId: '',
    locality: 'local',
    providerConfigDigest: ''
  },
  modelArtifactDigest: '',
  modelSourceRef: '',
  licenseRecordId: '',
  quantization: '',
  inferenceEngine: '',
  inferenceEngineVersion: '',
  engineConfigDigest: '',
  chatTemplateDigest: '',
  toolParserDigest: null,
  tokenizerDigest: '',
  configuredContextTokens: 0,
  measuredSafeContextTokens: 0,
  configuredMaxOutputTokens: 0,
  cachePolicyDigest: '',
  samplingProfileDigest: '',
  measuredPeakVramMiB: 0,
  evidenceRefs: []
};

fs.writeFileSync(out, JSON.stringify(profile, null, 2) + '\n');
console.log(`Created ${out}`);
