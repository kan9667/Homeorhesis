import fs from 'node:fs';
const output = process.argv[2];
if (!output) { console.error('Usage: node scripts/new-training-run-spec.mjs <output.json>'); process.exit(2); }
const placeholderDigest = 'sha256:c6d8c37792ea2f4930723d791f427a4ad3603747209af47ef8256973ef3d7614';
const x = {
  schemaVersion: 1,
  trainingRunId: 'replace',
  backend: {
    backendId: 'replace',
    backendVersion: 'replace',
    sourceRevision: 'replace',
    environmentDigest: placeholderDigest,
    capabilityIds: ['replace'],
    licenseRecordId: 'replace',
    contentHash: placeholderDigest
  },
  datasetManifestId: 'replace',
  baseModelArtifactRef: { artifactId: 'replace', digest: placeholderDigest, readOnly: true },
  tokenizerDigest: placeholderDigest,
  chatTemplateDigest: placeholderDigest,
  targetRole: 'LOCAL_TRAINABLE',
  targetTaskFamilies: ['replace'],
  method: 'qlora',
  trainingConfigRef: { artifactId: 'replace', digest: placeholderDigest },
  resourceBudgetRef: 'replace',
  checkpointPolicyRef: 'replace',
  outputCandidateRootRef: '.seh-training/candidates/replace',
  policyVersion: 'replace',
  contentHash: placeholderDigest,
  status: 'RESEARCH_DO_NOT_RUN'
};
fs.writeFileSync(output, `${JSON.stringify(x, null, 2)}\n`);
console.log(`Wrote illustrative non-authorizing training run spec: ${output}`);
