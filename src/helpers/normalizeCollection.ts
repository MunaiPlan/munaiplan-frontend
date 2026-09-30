export const normalizeCollection = <T>(value: T[] | null, name: string): T[] => {
  if (value === null) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  throw new Error(`Invalid ${name} response: expected an array or null`);
};
