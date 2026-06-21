import { FaGithub } from "react-icons/fa";
import { useSectionMotion } from "../hooks/useScrollProgress";
import "../styles/About.css";

function About({
  githubContributionLabel,
  githubHeatmap,
  githubMonthLabels,
  githubProfileUrl,
  githubUsername,
  profileStats,
}) {
  const sectionRef = useSectionMotion();

  return (
    <section className="about-section cinematic-section" id="about" ref={sectionRef}>
      <div className="section-heading" data-reveal>
        <p className="command-line">
          <span className="prompt">$</span> inspect identity.core
        </p>
        <p className="eyebrow">System Profile</p>
        <h2>Developer identity, assembled as a live interface.</h2>
      </div>

      <div className="about-grid">
        <article className="identity-panel glass-panel tilt-surface" data-reveal>
          <div className="panel-cap">
            <span>candidate.profile</span>
            <strong>ONLINE</strong>
          </div>

          <h3>Computer Science and Mathematics student with a backend systems focus.</h3>
          <p>
            Hi, I&apos;m Hunter, a Computer Science and Mathematics student at
            the University of Otago. I focus on practical full-stack software:
            Java, Spring Boot, authentication, databases, React interfaces, and
            systems that model real workflows cleanly.
          </p>
          <p>
            I&apos;m currently seeking software engineering internships for the
            2026/27 summer and I&apos;m especially interested in backend-heavy
            product teams where reliability, data modeling, and clear APIs
            matter.
          </p>

          <div className="identity-lines" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </article>

        <div className="profile-stat-grid" aria-label="Engineering focus areas">
          {profileStats.map((stat, index) => (
            <article
              className="profile-stat glass-panel tilt-surface"
              data-reveal
              key={stat.label}
              style={{ "--delay": `${index * 80}ms` }}
            >
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <p>{stat.detail}</p>
            </article>
          ))}
        </div>

        <article className="github-activity-panel glass-panel" data-reveal>
          <div className="github-panel-header">
            <div>
              <p className="command-line">
                <span className="prompt">$</span> git activity --author=HunterLynch0
              </p>
              <h3>Contribution signal</h3>
            </div>
            <a href={githubProfileUrl} target="_blank" rel="noopener noreferrer">
              <FaGithub aria-hidden="true" />
              <span>@{githubUsername}</span>
            </a>
          </div>

          <a
            className="github-heatmap-link"
            href={githubProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${githubUsername} on GitHub`}
          >
            <div className="heatmap-chart" aria-hidden="true">
              <div className="heatmap-axis-spacer"></div>
              <div className="heatmap-month-axis">
                {githubMonthLabels.map((month) => (
                  <span
                    key={`${month.label}-${month.weekIndex}`}
                    style={{ gridColumn: `${month.weekIndex + 1} / span 4` }}
                  >
                    {month.label}
                  </span>
                ))}
              </div>

              <div className="heatmap-day-axis">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>

              <div className="github-heatmap-grid">
                {githubHeatmap.map((week, weekIndex) => (
                  <div className="heatmap-week" key={`week-${weekIndex}`}>
                    {week.map((day) => (
                      <span
                        className={`heatmap-cell level-${day.isFuture ? 0 : day.level}`}
                        key={day.date}
                        aria-label={`${day.count} contributions on ${day.date}`}
                      ></span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="heatmap-footer">
              <span>{githubContributionLabel}</span>
              <div className="heatmap-legend" aria-hidden="true">
                <span>Less</span>
                <i className="heatmap-cell level-0"></i>
                <i className="heatmap-cell level-1"></i>
                <i className="heatmap-cell level-2"></i>
                <i className="heatmap-cell level-3"></i>
                <i className="heatmap-cell level-4"></i>
                <span>More</span>
              </div>
            </div>
          </a>
        </article>
      </div>
    </section>
  );
}

export default About;
