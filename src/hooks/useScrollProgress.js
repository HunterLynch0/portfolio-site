import { useEffect, useRef, useState } from "react";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

export function useScrollProgress() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [scrollState, setScrollState] = useState({
    progress: 0,
    scrollY: 0,
  });

  useEffect(() => {
    let frameId = null;

    const updateScrollState = () => {
      frameId = null;

      const scrollY = window.scrollY;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const progress = clamp(scrollY / maxScroll);

      document.documentElement.style.setProperty("--page-progress", progress.toFixed(4));
      document.documentElement.style.setProperty("--scroll-y", `${scrollY.toFixed(0)}px`);

      setScrollState({ progress, scrollY });
    };

    const requestUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateScrollState);
    };

    updateScrollState();

    if (!prefersReducedMotion) {
      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", requestUpdate);
    }

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [prefersReducedMotion]);

  return scrollState;
}

export function useSectionMotion() {
  const ref = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const element = ref.current;
    let frameId = null;

    if (!element || prefersReducedMotion) return undefined;

    const updateSectionProgress = () => {
      frameId = null;

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height));
      const center = clamp((viewportHeight / 2 - rect.top) / rect.height, -0.5, 1.5);
      const signed = clamp((rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight, -1, 1);

      element.style.setProperty("--section-progress", progress.toFixed(4));
      element.style.setProperty("--section-center", center.toFixed(4));
      element.style.setProperty("--section-signed", signed.toFixed(4));
    };

    const requestUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateSectionProgress);
    };

    updateSectionProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [prefersReducedMotion]);

  return ref;
}

export { clamp };
