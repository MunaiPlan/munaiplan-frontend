export const isTokenExpired = (expiresAt: number): boolean => {
    return Date.now() / 1000 > expiresAt;
}