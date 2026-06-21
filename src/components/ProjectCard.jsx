import { useRef } from "react";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import "../styles/ProjectCard.css";

function ProjectCard({ project, index, total, isActive, style }) {
  const cardRef = useRef(null);
  const liveLabel = project.liveLabel ?? "Live Demo";

  const handlePointerMove = (event) => {
    if (!isActive || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    cardRef.current.style.setProperty("--tilt-x", `${(-y * 7).toFixed(2)}deg`);
    cardRef.current.style.setProperty("--tilt-y", `${(x * 8).toFixed(2)}deg`);
    cardRef.current.style.setProperty("--shine-x", `${((x + 0.5) * 100).toFixed(1)}%`);
    cardRef.current.style.setProperty("--shine-y", `${((y + 0.5) * 100).toFixed(1)}%`);
  };

  const resetTilt = () => {
    if (!cardRef.current) return;

    cardRef.current.style.setProperty("--tilt-x", "0deg");
    cardRef.current.style.setProperty("--tilt-y", "0deg");
    cardRef.current.style.setProperty("--shine-x", "50%");
    cardRef.current.style.setProperty("--shine-y", "20%");
  };

  return (
    <article
      className={`project-orbit-card tilt-surface accent-${project.accent} ${
        isActive ? "is-active" : ""
      }`}
      ref={cardRef}
      style={style}
      aria-label={`${project.name}, project ${index + 1} of ${total}`}
      aria-current={isActive ? "true" : undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div className="project-card-scanline" aria-hidden="true"></div>

      <div className="project-card-terminal">
        <div className="terminal-lights" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p>{project.command}</p>
      </div>

      <div className="project-card-content">
        <div className="project-card-main">
          <div>
            <p className="project-index">PROJECT {String(index + 1).padStart(2, "0")}</p>
            <p className="project-type">{project.type}</p>
            <h3>{project.name}</h3>
            <p className="project-description">{project.description}</p>
          </div>

          <div className="project-visual" aria-hidden="true">
            {project.image ? (
              <img
                src={project.image}
                alt=""
                onError={(event) => {
                  event.currentTarget.hidden = true;
                }}
              />
            ) : (
              <div className="project-visual-fallback">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </div>
        </div>

        <div className="project-focus-list" aria-label={`${project.name} focus areas`}>
          {project.focus.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <div className="project-tech-tags" aria-label={`${project.name} tech stack`}>
          {project.tech.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>

        <div className="project-card-footer">
          <span>{project.status}</span>

          <div className="project-links">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={isActive ? undefined : -1}
            >
              <FaGithub aria-hidden="true" />
              <span>GitHub</span>
            </a>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target={project.liveUrl.startsWith("#") ? undefined : "_blank"}
                rel={project.liveUrl.startsWith("#") ? undefined : "noopener noreferrer"}
                tabIndex={isActive ? undefined : -1}
              >
                <FaExternalLinkAlt aria-hidden="true" />
                <span>{liveLabel}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
