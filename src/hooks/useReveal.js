import { useEffect } from "react";

export default function useReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll("[data-reveal]");
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    targets.forEach((target) => {
      target.classList.add("will-reveal");
      observer.observe(target);
    });
    return () => {
      observer.disconnect();
      targets.forEach((target) => target.classList.remove("will-reveal"));
    };
  }, []);
}
