import { useEffect, useRef } from 'react';
import anime from 'animejs';

export const useAnime = (options, deps = []) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef.current) {
      anime({
        targets: elementRef.current,
        ...options,
      });
    }
  }, deps);

  return elementRef;
};

export const useStagger = (options) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const children = containerRef.current.children;
      if (children.length > 0) {
        anime({
          targets: children,
          ...options,
          delay: anime.stagger(options.stagger || 100),
        });
      }
    }
  }, []);

  return containerRef;
};

export const useScrollReveal = (options = {}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: element,
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              easing: 'easeOutExpo',
              ...options,
            });
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return elementRef;
};

export const animateFadeIn = (target, options = {}) => {
  return anime({
    targets: target,
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutQuad',
    ...options,
  });
};

export const animateSlideUp = (target, options = {}) => {
  return anime({
    targets: target,
    opacity: [0, 1],
    translateY: [40, 0],
    duration: 800,
    easing: 'easeOutExpo',
    ...options,
  });
};

export const animateScaleIn = (target, options = {}) => {
  return anime({
    targets: target,
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 600,
    easing: 'easeOutBack',
    ...options,
  });
};

export const animateStaggerChildren = (container, options = {}) => {
  const children = container.children;
  if (children.length === 0) return;

  return anime({
    targets: children,
    opacity: [0, 1],
    translateY: [30, 0],
    duration: 600,
    delay: anime.stagger(100),
    easing: 'easeOutQuad',
    ...options,
  });
};
