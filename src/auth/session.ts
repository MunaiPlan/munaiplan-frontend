import type { IUser } from '../types/types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isExpiry = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value > 0;

export const parseSignInResponse = (value: unknown): IUser => {
  if (!isRecord(value) || value.success !== true || value.token_type !== 'Bearer' ||
      typeof value.token !== 'string' || value.token.length === 0 ||
      !isExpiry(value.expires_at) ||
      typeof value.refresh_token !== 'string' || value.refresh_token.length === 0 ||
      !isExpiry(value.refresh_token_expires_at)) {
    throw new Error('Invalid sign-in response');
  }

  return {
    token: value.token,
    tokenExpiresAt: value.expires_at,
    refreshToken: value.refresh_token,
    refreshTokenExpiresAt: value.refresh_token_expires_at,
  };
};

export const isUsableSession = (value: unknown, nowSeconds = Date.now() / 1000): value is IUser =>
  isRecord(value) && typeof value.token === 'string' && value.token.length > 0 &&
  isExpiry(value.tokenExpiresAt) && value.tokenExpiresAt > nowSeconds &&
  typeof value.refreshToken === 'string' &&
  isExpiry(value.refreshTokenExpiresAt);

export const isUnauthorizedCurrentSession = (requestAuthorization: unknown, currentToken: string | undefined): boolean =>
  typeof requestAuthorization === 'string' && typeof currentToken === 'string' &&
  requestAuthorization === `Bearer ${currentToken}`;
