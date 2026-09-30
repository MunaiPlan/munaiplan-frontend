import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeCollection } from './normalizeCollection.ts';

test('treats an empty legacy collection response as an empty list', () => {
  assert.deepEqual(normalizeCollection(null, 'companies'), []);
  assert.deepEqual(normalizeCollection([], 'companies'), []);
});

test('keeps malformed responses distinct from an empty list', () => {
  assert.throws(() => normalizeCollection({}, 'companies'), /Invalid companies response/);
});
