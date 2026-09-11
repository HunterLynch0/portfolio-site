import { useEffect, useRef, useState } from "react";
import Arrow from "./Arrow";

export default function ProjectDialog({ project, onClose }) {
  const dialog = useRef(null);
  const [imageIndex, setImageIndex] = useState(0);
  const image = project.images[imageIndex];
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);
  const closeBackdrop = (event) => {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      onClose();
  };
  return (
    <dialog
      ref={dialog}
      className="project-dialog"
      aria-labelledby="dialog-title"
      onCancel={onClose}
      onClick={closeBackdrop}
    >
      <div className="dialog-header">
        <span className="eyebrow">Selected work / {project.number}</span>
        <button
          className="dialog-close"
          onClick={onClose}
          aria-label="Close project details"
          autoFocus
        >
          <span>Close</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="m6 6 12 12M6 18 18 6"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
        </button>
      </div>
      <div className="dialog-body">
        <p className="eyebrow dialog-category">{project.category}</p>
        <h2 id="dialog-title">{project.title}</h2>
        <p className="dialog-subtitle">{project.subtitle}</p>
        <p className="dialog-description">{project.description}</p>
        <figure className={`dialog-gallery dialog-gallery-${project.id}`}>
          <div
            className={`dialog-image${image.height > image.width ? " is-portrait" : ""}`}
          >
            <img
              src={image.src}
              width={image.width}
              height={image.height}
              alt={image.alt}
              decoding="async"
            />
          </div>
          <figcaption>
            <span aria-live="polite">{image.label}</span>
            {project.images.length > 1 && (
              <div
                className="gallery-controls"
                aria-label="Project screenshots"
              >
                {project.images.map((shot, index) => (
                  <button
                    key={shot.src}
                    aria-label={`Show ${shot.label.toLowerCase()}`}
                    aria-pressed={imageIndex === index}
                    onClick={() => setImageIndex(index)}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </button>
                ))}
              </div>
            )}
          </figcaption>
        </figure>
        <div className="dialog-details">
          <div>
            <h3 className="eyebrow">Built with</h3>
            <p>{project.technologies.join(" · ")}</p>
          </div>
          <div>
            <h3 className="eyebrow">Engineering focus</h3>
            <ul>
              {project.focus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        {project.links.length > 0 && (
          <div className="dialog-links">
            {project.links.map((link) => (
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-link"
                key={link.label}
              >
                {link.label}
                <Arrow diagonal />
              </a>
            ))}
          </div>
        )}
      </div>
    </dialog>
  );
}
