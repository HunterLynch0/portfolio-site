import { useEffect, useState } from "react";
import DinoGame from "./DinoGame";
import {
  FaJava,
  FaReact,
  FaJs,
  FaGitAlt,
  FaHtml5,
  FaCss3Alt,
} from "react-icons/fa";

import {
  SiSpringboot,
  SiPostgresql,
  SiVite,
  SiCplusplus,
  SiDocker
} from "react-icons/si";

function App() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorActive, setCursorActive] = useState(false);

  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrame;

    const moveCursor = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;

      setCursorPosition({ x: event.clientX, y: event.clientY });
      setCursorVisible(true);
      setCursorActive(Boolean(event.target.closest("a, button, .dino-game")));
    };

    const animateGlow = () => {
      currentX += (targetX - currentX) * 0.03;
      currentY += (targetY - currentY) * 0.03;

      document.documentElement.style.setProperty("--glow-x", `${currentX}px`);
      document.documentElement.style.setProperty("--glow-y", `${currentY}px`);

      animationFrame = requestAnimationFrame(animateGlow);
    };

    const hideCursor = () => {
      setCursorVisible(false);
      setCursorActive(false);
    };

    window.addEventListener("pointermove", moveCursor);
    window.addEventListener("pointerleave", hideCursor);

    animateGlow();

    return () => {
      window.removeEventListener("pointermove", moveCursor);
      window.removeEventListener("pointerleave", hideCursor);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const cursorClassName = `custom-cursor ${cursorVisible ? "visible" : ""} ${
    cursorActive ? "active" : ""
  }`;

  return (
      <>
        <div
            className={`${cursorClassName} cursor-ring`}
            style={{
              left: `${cursorPosition.x}px`,
              top: `${cursorPosition.y}px`,
            }}
        ></div>

        <div
            className={`${cursorClassName} cursor-dot`}
            style={{
              left: `${cursorPosition.x}px`,
              top: `${cursorPosition.y}px`,
            }}
        ></div>

      <main className="page">
        <section className="hero-grid">
          <div className="terminal">
            <div className="terminal-header">
              <div className="buttons">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>Hunter Lynch · Portfolio</p>
            </div>

            <div className="terminal-body">
              <p className="label">About</p>

              <h1>Hunter Lynch</h1>
              <h2>Software Engineering Student</h2>

              <p className="text">
                I study Computer Science and Mathematics at the University of Otago, with a focus on backend development, Java, Spring Boot, databases,
                and practical full-stack systems. Currently seeking software engineering internships for the 2026/27 summer.
              </p>

              <p className="label">Focus</p>

              <p className="text">
                Backend systems, data structures and algorithms, database design, and clean API
                development.
              </p>

              <div className="actions">
                <a
                    href="/Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-btn"
                >
                  View Resume
                </a>
                <a href="#projects">Projects</a>
                <a href="#skills">Skills</a>
                <a href="#contact">Contact</a>
              </div>
            </div>
          </div>

          <div className="preview-card">
            <p className="label">Featured Project</p>
            <h2>IssueFlow</h2>
            <p>
              A full stack issue tracker with repositories, issues, users,
              JWT authentication, PostgreSQL persistence, and protected API
              endpoints.
            </p>

            <div className="tech-list">
              <span>Java</span>
              <span>Spring Boot</span>
              <span>JWT</span>
              <span>PostgreSQL</span>
              <span>Resend API</span>
              <span>React</span>
            </div>

            <div className="actions">
              <a href="https://github.com/HunterLynch0/issueflow"
                 target="_blank"
                 rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a href="https://issueflow.site"
                 target="_blank"
                 rel="noopener noreferrer"
              >
                Live Site
              </a>
            </div>
          </div>
        </section>

        <section className="section tech-stack-section">
          <p className="label">Tech Stack</p>
          <h2>Tools I work with</h2>

          <div className="tech-marquee">
            <div className="tech-track">
              <span><FaJava /> Java</span>
              <span><SiSpringboot /> Spring Boot</span>
              <span><FaReact /> React</span>
              <span><FaJs /> JavaScript</span>
              <span><SiPostgresql /> PostgreSQL</span>
              <span><FaGitAlt /> Git</span>
              <span><FaHtml5 /> HTML</span>
              <span><FaCss3Alt /> CSS</span>
              <span><SiVite /> Vite</span>
              <span><SiCplusplus /> C++</span>
              <span><SiDocker /> Docker</span>

              {/* duplicate so the loop is seamless */}
              <span><FaJava /> Java</span>
              <span><SiSpringboot /> Spring Boot</span>
              <span><FaReact /> React</span>
              <span><FaJs /> JavaScript</span>
              <span><SiPostgresql /> PostgreSQL</span>
              <span><FaGitAlt /> Git</span>
              <span><FaHtml5 /> HTML</span>
              <span><FaCss3Alt /> CSS</span>
              <span><SiVite /> Vite</span>
              <span><SiCplusplus /> C++</span>
              <span><SiDocker /> Docker</span>
            </div>
          </div>
        </section>

        <section id="projects" className="section">
          <p className="command">
            <span className="prompt">$</span> ls projects
          </p>

          <div className="cards">
            <div className="card">
              <h3>IssueFlow | Personal</h3>
              <p>
                Full stack issue tracker with authentication, shared repositories,
                issues, and repository permissions.
              </p>
              <div className="tech-list small">
                <span>Java</span>
                <span>Spring Boot</span>
                <span>PostgreSQL</span>
                <span>Resend API</span>
                <span>React</span>
              </div>
              <div className="actions small">
                <a href="https://github.com/HunterLynch0/issueflow" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="https://issueflow.site" target="_blank" rel="noopener noreferrer">Live Site</a>
              </div>
            </div>

            <div className="card">
              <h3>VersionHandle | Personal</h3>
              <p>
                A lightweight version control system, inspired by Git, built from scratch
                as a Java CLI tool. Supports repository initialization, staging,
                commits, status, logs, branches, checkout, and merges with conflict markers.
              </p>
              <div className="tech-list small">
                <span>Java 17</span>
                <span>Maven</span>
                <span>CLI</span>
                <span>SHA-256</span>
              </div>
              <div className="actions small">
                <a href="https://github.com/HunterLynch0/versionhandle" target="_blank" rel="noopener noreferrer">GitHub</a>
              </div>
            </div>

            <div className="card">
              <h3>ANDIE | Group Project</h3>
              <p>
                A non destructive Java Swing image editor built for COSC202.
                Includes image filters, colour tools, transforms, drawing tools,
                Internationalisation - I18N, and light/dark theme support.
              </p>
              <div className="tech-list small">
                <span>Java</span>
                <span>Swing</span>
                <span>Gradle</span>
                <span>FlatLaf</span>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="section">
          <p className="command">
            <span className="prompt">$</span> cat skills.txt
          </p>

          <div className="skills">
            <p>Java · JavaScript · SQL · C++</p>
            <p>Spring Boot · Spring Security · JWT · REST APIs</p>
            <p>React · Vite · HTML · CSS</p>
            <p>PostgreSQL · Git · GitHub · GitLab · Maven</p>
          </div>
        </section>

        <section id="contact" className="section">
          <p className="command">
            <span className="prompt">$</span> ./contact
          </p>

          <p className="text">Open to collaboration and job opportunities.</p>

          <div className="actions">
            <a href="mailto:hunterplynch07@gmail.com">Email</a>
            <a href="https://github.com/HunterLynch0" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/hunter-lynch-a6545938b/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </section>

        <DinoGame />

        <footer className="footer">
          <p>© 2026 Hunter Lynch.</p>
        </footer>
      </main>
      </>
  );
}

export default App;