import { sections } from "../data/sections";
import { skillGroups } from "../data/portfolio";

export default function Skills() {
  return (
    <section
      className="skills-section section-pad"
      id="skills"
      aria-labelledby="skills-title"
    >
      <div className="skills-intro" data-reveal>
        <p className="eyebrow">
          {sections.skills.number} / {sections.skills.label}
        </p>
        <h2 id="skills-title">
          What I <br />
          build with<span>.</span>
        </h2>
        <p>
          Java at the core.
          <br />A broader toolkit around it.
        </p>
      </div>
      <dl className="skill-list" data-reveal>
        {skillGroups.map((group) => (
          <div className="skill-row" id={group.id} key={group.name}>
            <dt>
              <span className="skill-number eyebrow">{group.number}</span>
              {group.name}
            </dt>
            <dd>
              {group.items.map((item) => (
                <span
                  className={
                    ["Java", "Spring Boot", "PostgreSQL", "SQL"].includes(item)
                      ? "primary-skill"
                      : ""
                  }
                  key={item}
                >
                  {item}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
