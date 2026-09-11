import { useState } from "react";
import MagneticHeading from "./components/MagneticHeading";
import PortfolioSystem from "./components/PortfolioSystem";
import Arrow from "./components/Arrow";
import About from "./components/About";
import Work from "./components/Work";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import useReveal from "./hooks/useReveal";

function App() {
  useReveal();
  const [paused, setPaused] = useState(false);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Hunter Lynch home">
          Hunter Lynch<span className="wordmark-dot">.</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <a
          className="header-resume"
          href="/Resume.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Resume <Arrow diagonal />
        </a>
      </header>
      <main id="main">
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero-topline">
            <span className="eyebrow">Dunedin, New Zealand</span>
            <span className="eyebrow hero-edition">Portfolio — 2026</span>
          </div>
          <div className="hero-composition">
            <div className="hero-copy">
              <p className="hero-role">Software Engineering Student</p>
              <MagneticHeading paused={paused} />
              <p className="hero-study">
                Computer Science + Mathematics
                <br />
                <span>University of Otago</span>
              </p>
            </div>
            <div className="hero-art">
              <PortfolioSystem paused={paused} />
              <div className="sculpture-caption">
                <span className="eyebrow">
                  <span className="system-drag-hint">Drag to explore / </span>
                  Select a component
                </span>
                <button
                  className="motion-toggle"
                  onClick={() => setPaused(!paused)}
                  aria-pressed={paused}
                  aria-label={
                    paused ? "Resume system motion" : "Pause system motion"
                  }
                >
                  {paused ? "Play" : "Pause"}
                  <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
                </button>
              </div>
            </div>
          </div>
          <div className="hero-bottom">
            <a className="work-link" href="#work">
              Selected work{" "}
              <span className="round-arrow">
                <Arrow />
              </span>
            </a>
            <p>
              Building practical software across backend systems,
              <br className="desktop-break" /> full-stack applications and
              developer tools.
            </p>
            <div className="hero-socials">
              <a
                className="text-link hero-resume"
                href="/Resume.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Resume <Arrow diagonal />
              </a>
              <a
                className="text-link hero-github"
                href="https://github.com/HunterLynch0"
                target="_blank"
                rel="noreferrer"
              >
                GitHub <Arrow diagonal />
              </a>
            </div>
          </div>
        </section>
        <About />
        <Work />
        <Skills />
        <Contact />
      </main>
    </>
  );
}

export default App;
