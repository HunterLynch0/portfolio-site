import {
  FaCss3Alt,
  FaGitAlt,
  FaHtml5,
  FaJava,
  FaJs,
  FaReact,
} from "react-icons/fa";
import {
  SiCplusplus,
  SiDocker,
  SiPostgresql,
  SiSpringboot,
  SiVite,
} from "react-icons/si";
import { useSectionMotion } from "../hooks/useScrollProgress";
import "../styles/Skills.css";

const techIcons = {
  Java: FaJava,
  "Spring Boot": SiSpringboot,
  React: FaReact,
  JavaScript: FaJs,
  PostgreSQL: SiPostgresql,
  Git: FaGitAlt,
  HTML: FaHtml5,
  CSS: FaCss3Alt,
  Vite: SiVite,
  "C++": SiCplusplus,
  Docker: SiDocker,
};

function Skills({ skillCategories, techStack }) {
  const sectionRef = useSectionMotion();
  const orbitItems = techStack.slice(0, 10);

  return (
    <section className="skills-section cinematic-section" id="skills" ref={sectionRef}>
      <div className="section-heading" data-reveal>
        <p className="command-line">
          <span className="prompt">$</span> map stack.constellation
        </p>
        <p className="eyebrow">Technical System</p>
        <h2>A stack built around backend systems, data, and polished interfaces.</h2>
      </div>

      <div className="skills-layout">
        <div className="skill-constellation glass-panel" data-reveal>
          <div className="constellation-core">
            <span>CORE</span>
            <strong>Java</strong>
          </div>

          <div className="orbit-ring orbit-ring-one"></div>
          <div className="orbit-ring orbit-ring-two"></div>

          {orbitItems.map((tech, index) => {
            const Icon = techIcons[tech];

            return (
              <div
                className="orbit-node"
                key={tech}
                style={{
                  "--node-total": orbitItems.length,
                  "--node-angle": `${(360 / orbitItems.length) * index}deg`,
                }}
              >
                {Icon && <Icon aria-hidden="true" />}
                <span>{tech}</span>
              </div>
            );
          })}
        </div>

        <div className="skill-category-grid">
          {skillCategories.map((category, index) => (
            <article
              className="skill-category glass-panel tilt-surface"
              data-reveal
              key={category.title}
              style={{ "--delay": `${index * 70}ms` }}
            >
              <div className="skill-category-header">
                <h3>{category.title}</h3>
                <span>{category.level}</span>
              </div>

              <div className="skill-tags">
                {category.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="skill-ribbon" aria-hidden="true" data-reveal>
        <div>
          {[...techStack, ...techStack].map((tech, index) => (
            <span key={`${tech}-${index}`}>{tech}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
