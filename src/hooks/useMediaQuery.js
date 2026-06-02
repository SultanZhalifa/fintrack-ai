import { useSyncExternalStore } from 'react';

/**
 * Reactive media-query hook built on useSyncExternalStore — returns true while
 * the query matches. Subscribes to the underlying MediaQueryList directly, so
 * there is no setState-in-effect and it stays tear-free during concurrent renders.
 */
export function useMediaQuery(query) {
  const subscribe = (callback) => {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', callback);
    return () => mql.removeEventListener('change', callback);
  };
  const getSnapshot = () => window.matchMedia(query).matches;
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
