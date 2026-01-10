import { useEffect, useState, useRef, RefObject } from 'react';

interface ObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

const useIntersectionObserver = (
  options: ObserverOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
): [RefObject<Element>, boolean] => {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef<Element>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true);
          // Disconnect observer after first intersection to prevent re-triggering
          if (ref.current && observerRef.current) {
            observerRef.current.unobserve(ref.current);
          }
        }
      },
      options
    );

    const currentRef = ref.current;
    if (currentRef) {
      observerRef.current.observe(currentRef);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [options]);

  return [ref, isIntersecting];
};

export default useIntersectionObserver;