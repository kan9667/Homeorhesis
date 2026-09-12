import fs from 'node:fs';
const output = process.argv[2];
if (!output) { console.error('Usage: node scripts/new-steering-profile.mjs <output.json>'); process.exit(2); }
const placeholderDigest = 'sha256:c6d8c37792ea2f4930723d791f427a4ad3603747209af47ef8256973ef3d7614';
const x = {
  schemaVersion: 1,
  steeringProfileId: 'replace',
  baseRuntimeProfileId: 'replace',
  modelArtifactDigest: placeholderDigest,
  quantization: 'replace',
  inferenceEngine: 'replace',
  inferenceEngineVersion: 'replace',
  tokenizerDigest: placeholderDigest,
  chatTemplateDigest: placeholderDigest,
  promptBundleDigest: placeholderDigest,
  toolBundleDigest: placeholderDigest,
  extractionDatasetDigest: placeholderDigest,
  extractionSplitDigest: placeholderDigest,
  extractionMethod: 'difference-of-means',
  vectorArtifactDigest: placeholderDigest,
  layerStart: 0,
  layerEnd: 0,
  evidenceRefs: [],
  contentHash: placeholderDigest,
  status: 'RESEARCH_NOT_QUALIFIED'
};
fs.writeFileSync(output, `${JSON.stringify(x, null, 2)}\n`);
console.log(`Wrote illustrative unqualified steering profile: ${output}`);
