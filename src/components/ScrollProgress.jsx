import "../styles/ScrollProgress.css";

const sections = [
  { id: "home", label: "Boot" },
  { id: "about", label: "Profile" },
  { id: "skills", label: "Stack" },
  { id: "projects", label: "Work" },
  { id: "journey", label: "Path" },
  { id: "contact", label: "Signal" },
];

function ScrollProgress({ progress = 0 }) {
  return (
    <aside className="scroll-progress" aria-label="Page sections">
      <div className="scroll-progress-line">
        <span style={{ transform: `scaleY(${progress})` }}></span>
      </div>

      <nav>
        {sections.map((section) => (
          <a href={`#${section.id}`} key={section.id}>
            <span></span>
            <strong>{section.label}</strong>
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default ScrollProgress;
