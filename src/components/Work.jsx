import { sections } from "../data/sections";
import { useRef, useState } from "react";
import Arrow from "./Arrow";
import ProjectDialog from "./ProjectDialog";
import { projects } from "../data/portfolio";

function ProjectImage({ project, onOpen }) {
  const ref = useRef(null);
  const frame = useRef(0);
  const pointer = (event) => {
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      if (!ref.current) return;
      ref.current.style.setProperty("--tilt-x", `${-y * 4}deg`);
      ref.current.style.setProperty("--tilt-y", `${x * 5}deg`);
    });
  };
  const reset = () => {
    cancelAnimationFrame(frame.current);
    ref.current?.style.setProperty("--tilt-x", "0deg");
    ref.current?.style.setProperty("--tilt-y", "0deg");
  };
  const shot = project.images[0];
  return (
    <button
      className={`project-image project-image-${project.id}`}
      onClick={onOpen}
      onPointerMove={pointer}
      onPointerLeave={reset}
      aria-label={`Explore ${project.title}`}
    >
      <span className="image-topline eyebrow">
        <span>
          {project.number} / {project.category}
        </span>
        <span>
          {project.id === "andie" ? "Group project" : "Personal project"}
        </span>
      </span>
      <span className="image-perspective" ref={ref}>
        <img
          src={shot.src}
          width={shot.width}
          height={shot.height}
          alt={shot.alt}
          loading="lazy"
          decoding="async"
        />
      </span>
      <span className="image-bottomline">
        <span className="eyebrow">
          {project.id === "issueflow"
            ? "Java / Spring Boot / React"
            : project.id === "versionhandle"
              ? "Java / Maven / SHA-256"
              : "Java / Swing / FlatLaf"}
        </span>
        <span className="image-open">
          <Arrow diagonal />
        </span>
      </span>
    </button>
  );
}

export default function Work() {
  const [active, setActive] = useState(null);
  return (
    <section
      className="work-section section-pad"
      id="work"
      aria-labelledby="work-title"
    >
      <div className="work-heading" data-reveal>
        <div>
          <p className="eyebrow">
            {sections.work.number} / {sections.work.label}
          </p>
          <h2 id="work-title">
            Project portfolio<span>.</span>
          </h2>
        </div>
        <p>
          From the systems underneath
          <br />
          to the experience on the surface.
        </p>
      </div>
      <div className="project-list">
        {projects.map((project) => (
          <article
            id={project.id}
            className={`project project-${project.id}`}
            key={project.id}
            data-reveal
          >
            <ProjectImage project={project} onOpen={() => setActive(project)} />
            <div className="project-info">
              <div className="project-titles">
                <span className="project-number eyebrow">{project.number}</span>
                <div>
                  <h3>{project.title}</h3>
                  <p className="project-subtitle">{project.subtitle}</p>
                </div>
              </div>
              <p className="project-summary">
                {project.id === "issueflow"
                  ? project.description
                  : project.short}
              </p>
              <div className="project-actions">
                <button
                  className="text-link project-explore"
                  onClick={() => setActive(project)}
                >
                  Explore project <span aria-hidden="true">+</span>
                </button>
                {project.links.map((link) => (
                  <a
                    className="text-link project-external"
                    href={link.href}
                    key={link.label}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.label}
                    <Arrow diagonal />
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
      {active && (
        <ProjectDialog
          key={active.id}
          project={active}
          onClose={() => setActive(null)}
        />
      )}
    </section>
  );
}
