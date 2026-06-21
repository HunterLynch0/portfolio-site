import { FaEnvelope, FaFileAlt, FaGithub, FaLinkedin } from "react-icons/fa";
import { useSectionMotion } from "../hooks/useScrollProgress";
import "../styles/Contact.css";

function Contact({ contactLinks }) {
  const sectionRef = useSectionMotion();

  return (
    <section className="contact-section cinematic-section" id="contact" ref={sectionRef}>
      <div className="contact-command glass-panel" data-reveal>
        <div>
          <p className="command-line">
            <span className="prompt">$</span> initiate_contact()
          </p>
          <p className="eyebrow">Final Signal</p>
          <h2>Open a channel.</h2>
          <p>
            I&apos;m open to software engineering internships, backend-heavy
            product work, and teams where I can contribute to real systems while
            continuing to learn quickly.
          </p>
        </div>

        <div className="contact-terminal" aria-hidden="true">
          <span>recipient: Hunter Lynch</span>
          <span>status: available_for_internship</span>
          <span>signal: ready</span>
        </div>

        <div className="contact-actions">
          <a className="button button-primary" href={contactLinks.email}>
            <FaEnvelope aria-hidden="true" />
            <span>Email</span>
          </a>
          <a
            className="button"
            href={contactLinks.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub aria-hidden="true" />
            <span>GitHub</span>
          </a>
          <a
            className="button"
            href={contactLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin aria-hidden="true" />
            <span>LinkedIn</span>
          </a>
          <a
            className="button"
            href={contactLinks.resume}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFileAlt aria-hidden="true" />
            <span>Resume</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contact;
