import test from 'node:test';
import assert from 'node:assert/strict';
import { isUnauthorizedCurrentSession, isUsableSession, parseSignInResponse } from './session.ts';

const now = 1_800_000_000;
const response = {
  success: true,
  token: 'access-token',
  token_type: 'Bearer',
  expires_at: now + 900,
  refresh_token: 'refresh-token',
  refresh_token_expires_at: now + 86_400,
};

test('maps the Go sign-in response and accepts a live session', () => {
  const session = parseSignInResponse(response);
  assert.deepEqual(session, {
    token: 'access-token',
    tokenExpiresAt: now + 900,
    refreshToken: 'refresh-token',
    refreshTokenExpiresAt: now + 86_400,
  });
  assert.equal(isUsableSession(session, now), true);
});

test('rejects a stale access token even while refresh metadata remains live', () => {
  const session = parseSignInResponse(response);
  assert.equal(isUsableSession(session, now + 901), false);
});

test('rejects malformed API responses and corrupted stored sessions', () => {
  assert.throws(() => parseSignInResponse({ ...response, expires_at: undefined }), /Invalid sign-in response/);
  assert.throws(() => parseSignInResponse({ ...response, token_type: 'Basic' }), /Invalid sign-in response/);
  assert.throws(() => parseSignInResponse({ ...response, success: false }), /Invalid sign-in response/);
  assert.equal(isUsableSession({ token: 'access-token', tokenExpiresAt: 'later' }, now), false);
});

test('a late unauthorized response from session A does not clear session B', () => {
  assert.equal(isUnauthorizedCurrentSession('Bearer token-A', 'token-B'), false);
  assert.equal(isUnauthorizedCurrentSession(undefined, 'token-B'), false);
});

test('an unauthorized response for the current token clears that session', () => {
  assert.equal(isUnauthorizedCurrentSession('Bearer token-B', 'token-B'), true);
});
