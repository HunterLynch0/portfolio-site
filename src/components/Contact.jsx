import { sections } from "../data/sections";
import Arrow from "./Arrow";

export default function Contact() {
  return (
    <>
      <section
        className="contact-section section-pad"
        id="contact"
        aria-labelledby="contact-title"
      >
        <div className="contact-top" data-reveal>
          <span className="eyebrow">
            {sections.contact.number} / {sections.contact.label}
          </span>
          <p>
            Open to software engineering internships
            <br />
            for the 2026/27 New Zealand summer.
          </p>
        </div>
        <a
          className="contact-invitation"
          href="mailto:hunterplynch07@gmail.com"
          data-reveal
        >
          <h2 id="contact-title">
            Let's get
            <br />
            <span>in touch.</span>
          </h2>
          <span className="contact-arrow">
            <Arrow diagonal />
          </span>
        </a>
        <div className="contact-bottom" data-reveal>
          <a className="email-link" href="mailto:hunterplynch07@gmail.com">
            hunterplynch07@gmail.com <Arrow diagonal />
          </a>
          <div className="contact-socials">
            <a
              href="https://github.com/HunterLynch0"
              className="text-link"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <Arrow diagonal />
            </a>
            <a
              href="https://www.linkedin.com/in/hunter-lynch-a6545938b/"
              className="text-link"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <Arrow diagonal />
            </a>
            <a
              href="/Resume.pdf"
              className="text-link"
              target="_blank"
              rel="noreferrer"
            >
              Resume <Arrow diagonal />
            </a>
          </div>
        </div>
      </section>
      <footer className="site-footer">
        <p>© 2026 Hunter Lynch</p>
        <p>Made with curiosity. Based in New Zealand.</p>
        <a href="#home">
          Back to top <Arrow />
        </a>
      </footer>
    </>
  );
}
