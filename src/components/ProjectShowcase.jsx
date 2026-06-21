import { useEffect, useRef, useState } from "react";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { clamp } from "../hooks/useScrollProgress";
import ProjectCard from "./ProjectCard";
import "../styles/ProjectShowcase.css";

function ProjectShowcase({ projects }) {
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [virtualIndex, setVirtualIndex] = useState(0);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const compactQuery = window.matchMedia("(max-width: 760px)");
    const syncCompact = () => setIsCompact(compactQuery.matches);

    syncCompact();
    compactQuery.addEventListener("change", syncCompact);

    return () => {
      compactQuery.removeEventListener("change", syncCompact);
    };
  }, []);

  useEffect(() => {
    const updateShowcase = () => {
      frameRef.current = null;

      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollableDistance = Math.max(rect.height - window.innerHeight, 1);
      const progress = clamp(-rect.top / scrollableDistance, 0, 1);
      const sceneProgress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1);

      section.style.setProperty("--section-progress", sceneProgress.toFixed(4));
      section.style.setProperty("--project-progress", progress.toFixed(4));
      setVirtualIndex(progress * (projects.length - 1));
    };

    const requestUpdate = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(updateShowcase);
    };

    updateShowcase();

    if (!prefersReducedMotion) {
      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", requestUpdate);
    }

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [prefersReducedMotion, projects.length]);

  const activeIndex = Math.round(virtualIndex);

  return (
    <section
      className="project-showcase cinematic-section"
      id="projects"
      ref={sectionRef}
      style={{ "--project-scroll-height": `${projects.length * 105 + 120}svh` }}
    >
      <div className="project-sticky-shell">
        <div className="project-narrative" data-reveal>
          <p className="command-line">
            <span className="prompt">$</span> open selected_work.timeline
          </p>
          <p className="eyebrow">Selected Work</p>
          <h2>Projects moving through a 3D system view.</h2>
          <p>
            Scroll through backend-heavy full-stack systems, graphics work, and
            interactive portfolio experiments. The active card is sharp and
            centered; adjacent cards rotate away into depth.
          </p>

          <div className="project-rail" aria-label="Project progress">
            <span style={{ transform: `scaleY(${projects.length <= 1 ? 1 : activeIndex / (projects.length - 1)})` }}></span>
            {projects.map((project, index) => (
              <div
                className={index === activeIndex ? "is-active" : ""}
                key={project.id}
                aria-label={`Project ${index + 1}: ${project.name}`}
              >
                <i></i>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="project-orbit-stage" aria-live="polite">
          <div className="project-stage-rings" aria-hidden="true"></div>

          {projects.map((project, index) => {
            const offset = index - virtualIndex;
            const clampedOffset = clamp(offset, -2.7, 2.7);
            const distance = Math.min(Math.abs(offset), 3.2);
            const isActive = index === activeIndex;
            const orbitRadius = isCompact ? 62 : 168;
            const verticalSpacing = isCompact ? 86 : 122;
            const depthStep = isCompact ? 120 : 196;

            const style = {
              "--card-x": `${Math.sin(clampedOffset * 0.9) * orbitRadius}px`,
              "--card-y": `${clampedOffset * verticalSpacing}px`,
              "--card-z": `${distance * -depthStep}px`,
              "--card-rotate-x": `${clampedOffset * 5.2}deg`,
              "--card-rotate-y": `${clampedOffset * -27}deg`,
              "--card-rotate-z": `${clampedOffset * 1.7}deg`,
              "--card-scale": 1 - Math.min(distance * 0.095, 0.32),
              "--card-opacity": Math.max(0.1, 1 - distance * 0.32),
              "--card-blur": `${Math.min(distance * 0.75, 2.4)}px`,
              zIndex: 100 - Math.round(distance * 10),
            };

            return (
              <ProjectCard
                index={index}
                isActive={isActive}
                key={project.id}
                project={project}
                style={style}
                total={projects.length}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ProjectShowcase;
