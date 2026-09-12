import { describe, expect, it } from 'vitest'
import { canonicalJsonStringify, computeContentHash, sha256 } from '../src/canonical-json.js'

describe('canonical JSON serialization and SHA-256 hashing (§12.3)', () => {
  it('serializes objects with lexicographically sorted keys', () => {
    const obj1 = { z: 10, a: 1, m: 5 }
    const obj2 = { a: 1, m: 5, z: 10 }
    const obj3 = { m: 5, z: 10, a: 1 }

    const serialized1 = canonicalJsonStringify(obj1)
    const serialized2 = canonicalJsonStringify(obj2)
    const serialized3 = canonicalJsonStringify(obj3)

    expect(serialized1).toBe('{"a":1,"m":5,"z":10}')
    expect(serialized1).toBe(serialized2)
    expect(serialized2).toBe(serialized3)
  })

  it('handles nested objects recursively with sorted keys', () => {
    const nested1 = {
      user: { name: 'Alice', age: 30 },
      meta: { tag: 'admin', active: true },
    }
    const nested2 = {
      meta: { active: true, tag: 'admin' },
      user: { age: 30, name: 'Alice' },
    }

    expect(canonicalJsonStringify(nested1)).toBe(canonicalJsonStringify(nested2))
    expect(canonicalJsonStringify(nested1)).toBe('{"meta":{"active":true,"tag":"admin"},"user":{"age":30,"name":"Alice"}}')
  })

  it('produces identical computeContentHash digests across key permutations', () => {
    const recordA = {
      schemaVersion: 1,
      id: 'item-1',
      details: { foo: 'bar', baz: 42 },
      tags: ['alpha', 'beta'],
    }

    const recordB = {
      tags: ['alpha', 'beta'],
      details: { baz: 42, foo: 'bar' },
      id: 'item-1',
      schemaVersion: 1,
    }

    const hashA = computeContentHash(recordA)
    const hashB = computeContentHash(recordB)

    expect(hashA).toBe(hashB)
    expect(hashA).toHaveLength(64)
  })

  it('matches standard SHA-256 for known reference string', () => {
    // Known test vector: sha256("") = e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
    expect(sha256('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
    // sha256("{}") = 44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a
    expect(computeContentHash({})).toBe('44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a')
  })
})
