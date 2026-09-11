import { sections } from "../data/sections";
export default function About() {
  return (
    <section
      className="about section-pad"
      id="about"
      aria-labelledby="about-title"
    >
      <div className="section-label" data-reveal>
        <span className="eyebrow">
          {sections.about.number} / {sections.about.label}
        </span>
      </div>
      <div className="about-main" data-reveal>
        <h2 id="about-title">
          From ideas to systems.
          <br />
          <span>Built to be useful.</span>
        </h2>
        <div className="about-paragraphs">
          <p>
            Hi I'm Hunter, a Computer Science and Mathematics student at the
            University of Otago. My area of interest is backend development and practical full-stack
            systems, with a focus Java. I am drawn to the logic behind good software.
          </p>
          <p>
            I was born in the United Statues but grew up primarily in Gisborne, New Zealand.
            Outside of my career I'm a keen surfer who enjoys staying active and meeting new
            people.
          </p>
        </div>
        <a className="availability" href="#contact">
          <span className="availability-dot" aria-hidden="true" />
          Seeking software engineering internships · Summer 2026/27
        </a>
      </div>
    </section>
  );
}
