import { useState, useCallback } from 'react';
import { readStorage, writeStorage } from '../lib/storage';

/**
 * State synced to localStorage. Supports functional updates like useState.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readStorage(key, initialValue));

  const set = useCallback((next) => {
    setValue((prev) => {
      const resolved = typeof next === 'function' ? next(prev) : next;
      writeStorage(key, resolved);
      return resolved;
    });
  }, [key]);

  return [value, set];
}
