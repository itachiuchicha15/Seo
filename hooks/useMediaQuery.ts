import { useState, useEffect } from 'react';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    
    // Add listener
    try {
        mediaQueryList.addEventListener('change', listener);
    } catch (e) {
        mediaQueryList.addListener(listener); // for Safari < 14
    }

    // Cleanup
    return () => {
        try {
            mediaQueryList.removeEventListener('change', listener);
        } catch (e) {
            mediaQueryList.removeListener(listener); // for Safari < 14
        }
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;
