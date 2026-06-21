import { FaArrowDown, FaEnvelope, FaFileAlt } from "react-icons/fa";
import { useSectionMotion } from "../hooks/useScrollProgress";
import "../styles/Hero.css";

function Hero() {
  const sectionRef = useSectionMotion();

  return (
    <section className="hero-section cinematic-section" id="home" ref={sectionRef}>
      <div className="hero-depth-plane" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="hero-copy" data-reveal>
        <p className="command-line">
          <span className="prompt">$</span> boot_portfolio --candidate=hunter
        </p>

        <h1>
          <span>Hunter</span>
          <span>Lynch</span>
        </h1>

        <p className="hero-type">
          <span>Software engineering student building backend-heavy full-stack systems.</span>
        </p>

        <div className="hero-status" aria-label="Profile highlights">
          <span>University of Otago</span>
          <span>Computer Science + Mathematics</span>
          <span>Seeking 2026/27 internships</span>
        </div>

        <div className="hero-actions">
          <a className="button button-primary" href="#projects">
            <FaArrowDown aria-hidden="true" />
            <span>View Projects</span>
          </a>
          <a
            className="button"
            href="/Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFileAlt aria-hidden="true" />
            <span>Resume</span>
          </a>
          <a className="button" href="#contact">
            <FaEnvelope aria-hidden="true" />
            <span>Contact</span>
          </a>
        </div>
      </div>

      <aside className="hero-hologram tilt-surface" aria-label="Portfolio system summary" data-reveal>
        <div className="hologram-core" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="terminal-window">
          <div className="terminal-bar">
            <span></span>
            <span></span>
            <span></span>
            <p>hunter@developer-lab</p>
          </div>

          <div className="terminal-body">
            <p><span className="prompt">&gt;</span> profile.status</p>
            <div className="hero-metrics">
              <div>
                <span>Focus</span>
                <strong>Backend + Full Stack</strong>
              </div>
              <div>
                <span>Core</span>
                <strong>Java / Spring Boot</strong>
              </div>
              <div>
                <span>Data</span>
                <strong>PostgreSQL / SQL</strong>
              </div>
              <div>
                <span>Interface</span>
                <strong>React / Vite</strong>
              </div>
            </div>

            <div className="code-feed" aria-hidden="true">
              <span>auth.jwt.verify()</span>
              <span>repository.permissions.sync()</span>
              <span>render.pipeline.commit()</span>
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}

export default Hero;
