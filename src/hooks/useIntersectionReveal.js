import { useEffect } from "react";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

function useIntersectionReveal(selector = "[data-reveal]") {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(selector));

    if (prefersReducedMotion) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.18,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [prefersReducedMotion, selector]);
}

export default useIntersectionReveal;
