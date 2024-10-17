// Ideally we should decode/encode serialized value
// so that users cannot see their tokens
export const createLocalStore = <TValue>(key: string) => {
  const get = () => {
    const rawString = window.localStorage.getItem(key);
    if (!rawString) {
      return null;
    }

    try {
      return JSON.parse(rawString) as TValue;
    } catch {
      return null;
    }
  };

  const set = (value: TValue | null) => {
    if (!value) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  };

  const remove = () => {
    set(null);
  }

  return {
    get,
    set,
    remove,
  };
};
