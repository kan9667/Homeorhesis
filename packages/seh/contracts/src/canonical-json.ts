/**
 * Canonical JSON serialization and deterministic SHA-256 hashing (§12.3).
 * Pure JavaScript, zero external dependencies, 100% browser and worker safe.
 * @module @deepseek-ai/dsh-seh-contracts/canonical-json
 */

/**
 * Deterministically serializes a JavaScript value into canonical JSON:
 * - Object keys are sorted lexicographically.
 * - Whitespace is omitted.
 * - Primitive types, arrays, and nested objects are handled recursively.
 */
export function canonicalJsonStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value)
  }

  if (Array.isArray(value)) {
    const elements = value.map(item => canonicalJsonStringify(item))
    return `[${elements.join(',')}]`
  }

  const obj = value as Record<string, unknown>
  const sortedKeys = Object.keys(obj).sort()
  const pairs: string[] = []

  for (const key of sortedKeys) {
    const val = obj[key]
    if (val !== undefined && typeof val !== 'function' && typeof val !== 'symbol') {
      pairs.push(`${JSON.stringify(key)}:${canonicalJsonStringify(val)}`)
    }
  }

  return `{${pairs.join(',')}}`
}

/**
 * Computes SHA-256 hex digest for a string in pure JavaScript.
 * Guarantees exact parity with standard crypto libraries without Node.js imports.
 */
export function sha256(input: string): string {
  // UTF-8 encode input
  const utf8: number[] = []
  for (let i = 0; i < input.length; i++) {
    let charcode = input.charCodeAt(i)
    if (charcode < 0x80) utf8.push(charcode)
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f))
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f))
    } else {
      i++
      charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (input.charCodeAt(i) & 0x3ff))
      utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f))
    }
  }

  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ]

  let H0 = 0x6a09e667, H1 = 0xbb67ae85, H2 = 0x3c6ef372, H3 = 0xa54ff53a
  let H4 = 0x510e527f, H5 = 0x9b05688c, H6 = 0x1f83d9ab, H7 = 0x5be0cd19

  const bitLen = utf8.length * 8
  utf8.push(0x80)
  while ((utf8.length % 64) !== 56) {
    utf8.push(0)
  }
  const highBits = Math.floor(bitLen / 0x100000000)
  const lowBits = bitLen >>> 0
  utf8.push((highBits >>> 24) & 0xff)
  utf8.push((highBits >>> 16) & 0xff)
  utf8.push((highBits >>> 8) & 0xff)
  utf8.push(highBits & 0xff)
  utf8.push((lowBits >>> 24) & 0xff)
  utf8.push((lowBits >>> 16) & 0xff)
  utf8.push((lowBits >>> 8) & 0xff)
  utf8.push(lowBits & 0xff)

  const W = new Int32Array(64)
  for (let i = 0; i < utf8.length; i += 64) {
    for (let t = 0; t < 16; t++) {
      const b0 = utf8[i + t * 4] ?? 0
      const b1 = utf8[i + t * 4 + 1] ?? 0
      const b2 = utf8[i + t * 4 + 2] ?? 0
      const b3 = utf8[i + t * 4 + 3] ?? 0
      W[t] = (b0 << 24) | (b1 << 16) | (b2 << 8) | b3
    }
    for (let t = 16; t < 64; t++) {
      const wt15 = W[t - 15] ?? 0
      const wt2 = W[t - 2] ?? 0
      const wt16 = W[t - 16] ?? 0
      const wt7 = W[t - 7] ?? 0
      const s0 = (((wt15 >>> 7) | (wt15 << 25)) ^ ((wt15 >>> 18) | (wt15 << 14)) ^ (wt15 >>> 3))
      const s1 = (((wt2 >>> 17) | (wt2 << 15)) ^ ((wt2 >>> 19) | (wt2 << 13)) ^ (wt2 >>> 10))
      W[t] = (wt16 + s0 + wt7 + s1) | 0
    }

    let a = H0, b = H1, c = H2, d = H3, e = H4, f = H5, g = H6, h = H7

    for (let t = 0; t < 64; t++) {
      const S1 = (((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7)))
      const ch = (e & f) ^ (~e & g)
      const kt = K[t] ?? 0
      const wt = W[t] ?? 0
      const temp1 = (h + S1 + ch + kt + wt) | 0
      const S0 = (((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10)))
      const maj = (a & b) ^ (a & c) ^ (b & c)
      const temp2 = (S0 + maj) | 0

      h = g
      g = f
      f = e
      e = (d + temp1) | 0
      d = c
      c = b
      b = a
      a = (temp1 + temp2) | 0
    }

    H0 = (H0 + a) | 0
    H1 = (H1 + b) | 0
    H2 = (H2 + c) | 0
    H3 = (H3 + d) | 0
    H4 = (H4 + e) | 0
    H5 = (H5 + f) | 0
    H6 = (H6 + g) | 0
    H7 = (H7 + h) | 0
  }

  function toHex(n: number): string {
    const hex = (n >>> 0).toString(16)
    return '0'.repeat(8 - hex.length) + hex
  }

  return `${toHex(H0)}${toHex(H1)}${toHex(H2)}${toHex(H3)}${toHex(H4)}${toHex(H5)}${toHex(H6)}${toHex(H7)}`
}

/**
 * Computes canonical content hash in SHA-256 format for any JSON-serializable object.
 */
export function computeContentHash(value: unknown): string {
  return sha256(canonicalJsonStringify(value))
}
