import { useCallback, useEffect, useState } from "react";
import DinoGame from "./DinoGame";
import IntroScreen from "./IntroScreen";
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
  SiDocker,
} from "react-icons/si";

const projects = [
  {
    id: "issueflow",
    title: "IssueFlow — Full-Stack Issue Tracker",
    type: "Project",
    featured: true,
    image: "/issueflow-preview-1.png",
    expandedImages: [
      {
        src: "/issueflow-preview-2.png",
        alt: "IssueFlow dashboard preview",
      },
      {
        src: "/issueflow-preview-3.png",
        alt: "IssueFlow issue workflow preview",
      },
    ],
    description:
        "Full stack issue tracker with authentication, shared repositories, issues, and repository permissions.",
    badges: ["Full Stack", "Backend", "Auth"],
    tech: ["Java", "Spring Boot", "JWT", "PostgreSQL", "Resend API", "React"],
    focus: ["Authenticated REST APIs", "Repository permissions", "Relational data modeling"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/HunterLynch0/issueflow",
      },
      {
        label: "Live Site",
        href: "https://issueflow.site",
      },
    ],
    architectureTitle: "Architecture",
    architecture: [
      "React/Vite frontend sends authenticated requests to a Spring Boot REST API.",
      "Spring Security validates JWT tokens.",
      "PostgreSQL stores users, repositories, issues, assignments, and permissions.",
      "Repository-level access control protects private project data.",
      "Resend API is used to send verification email to users.",
      "Deployed frontend, backend, and database.",
    ],
    diagram: ["React/Vite", "REST API", "JWT Security", "PostgreSQL", "Resend API"],
  },
  {
    id: "versionhandle",
    title: "VersionHandle — Version Control CLI",
    type: "Personal Project",
    image: "/versionhandle-preview.png",
    description:
        "A lightweight version control system, inspired by Git, built from scratch as a Java CLI tool. Supports repository initialization, staging, commits, status, logs, branches, checkout, and merges with conflict markers.",
    badges: ["Backend", "CLI Tool", "Data Structures"],
    tech: ["Java 17", "Maven", "CLI", "SHA-256"],
    focus: ["Command parsing", "Content hashing", "Branch and merge logic"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/HunterLynch0/versionhandle",
      },
    ],
    architectureTitle: "Architecture",
    architecture: [
      "Java CLI parses commands such as init, add, commit, log, branch, checkout, and merge.",
      "Repository data is stored locally in a hidden project folder.",
      "File contents are hashed with SHA-256.",
      "Commits track snapshots of project state.",
      "Branches point to different commit histories.",
      "Merge conflicts are represented with conflict markers.",
    ],
    diagram: ["CLI Parser", "Hidden Repo", "SHA-256 Hashing", "Commits", "Branches"],
  },
  {
    id: "andie",
    title: "ANDIE — Java Swing Image Editor",
    type: "Group Project",
    image: "/andie-preview-1.png",
    description:
        "A non destructive Java Swing image editor built for COSC202. Includes image filters, colour tools, transforms, drawing tools, Internationalisation - I18N, and light/dark theme support.",
    badges: ["Group Project", "Desktop App", "Java UI"],
    tech: ["Java", "Swing", "Gradle", "FlatLaf"],
    focus: ["Non-destructive edits", "Image processing tools", "Internationalised UI"],
    links: [],
    architectureTitle: "Architecture",
    architecture: [
      "Java Swing desktop application.",
      "Image operations are applied through menu actions and tool controls.",
      "Uses non-destructive editing principles.",
      "Supports filters, colour operations, transforms, drawing tools, I18N, and themes.",
      "Built as a group project for COSC202.",
    ],
    diagram: ["Swing UI", "Menu Actions", "Tool Controls", "Edit Stack", "Rendered Image"],
  },
];

const skillGroups = [
  {
    title: "Languages",
    items: ["Java", "Python", "JavaScript", "SQL", "C++"],
  },
  {
    title: "Backend",
    items: ["Spring Boot", "Spring Security", "JWT", "REST APIs"],
  },
  {
    title: "Frontend",
    items: ["React", "Vite", "HTML", "CSS"],
  },
  {
    title: "Tools & Data",
    items: ["PostgreSQL", "Postman", "Git", "GitLab", "Maven", "Gradle"],
  },
];

const githubUsername = "HunterLynch0";
const githubProfileUrl = "https://github.com/HunterLynch0";
const heatmapWeeks = 52;
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatHeatmapDisplayDate(dateKey) {
  const [year, month, day] = dateKey.split("-");

  return `${day}-${month}-${year}`;
}

function getContributionLevel(contribution) {
  if (!contribution) return 0;

  if (typeof contribution.level === "number") {
    return Math.max(0, Math.min(contribution.level, 4));
  }

  const count = Number(contribution.count) || 0;

  if (count === 0) return 0;
  if (count < 3) return 1;
  if (count < 6) return 2;
  if (count < 10) return 3;

  return 4;
}

function buildHeatmapData(contributions = []) {
  const contributionsByDate = new Map(
      contributions.map((contribution) => [contribution.date, contribution])
  );
  const today = new Date();
  const startDate = new Date(today);

  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(
      today.getDate() - ((heatmapWeeks - 1) * 7 + today.getDay())
  );

  return Array.from({ length: heatmapWeeks }, (_, weekIndex) => (
      Array.from({ length: 7 }, (_, dayIndex) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + weekIndex * 7 + dayIndex);

        const dateKey = formatDateKey(date);
        const contribution = contributionsByDate.get(dateKey);

        return {
          date: dateKey,
          count: Number(contribution?.count) || 0,
          level: getContributionLevel(contribution),
          isFuture: date > today,
        };
      })
  ));
}

function getHeatmapMonthLabels(heatmap) {
  return heatmap.flatMap((week, weekIndex) => {
    const firstOfMonth = week.find((day) => day.date.endsWith("-01"));

    if (!firstOfMonth) return [];

    const monthIndex = Number(firstOfMonth.date.slice(5, 7)) - 1;

    return [{
      label: monthNames[monthIndex],
      weekIndex,
    }];
  });
}

function App() {
  const [isIntroActive, setIsIntroActive] = useState(true);
  const [openProjectIds, setOpenProjectIds] = useState(() => new Set());
  const [githubHeatmap, setGithubHeatmap] = useState(() => buildHeatmapData());
  const [githubContributionTotal, setGithubContributionTotal] = useState(null);

  useEffect(() => {
    let ignoreResponse = false;

    fetch(`https://github-contributions-api.jogruber.de/v4/${githubUsername}?y=last`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Unable to load GitHub contributions");
          }

          return response.json();
        })
        .then((data) => {
          if (ignoreResponse || !Array.isArray(data.contributions)) return;

          setGithubHeatmap(buildHeatmapData(data.contributions));
          setGithubContributionTotal(
              data.contributions.reduce(
                  (total, contribution) => total + (Number(contribution.count) || 0),
                  0
              )
          );
        })
        .catch(() => {
          // Keep the empty styled heatmap if the public contribution API is unavailable.
        });

    return () => {
      ignoreResponse = true;
    };
  }, []);

  const githubContributionLabel = githubContributionTotal === null
      ? "Recent GitHub activity"
      : `${githubContributionTotal} contributions in the last year`;
  const githubMonthLabels = getHeatmapMonthLabels(githubHeatmap);

  const toggleProjectArchitecture = (projectId) => {
    setOpenProjectIds((currentOpenProjectIds) => {
      const nextOpenProjectIds = new Set(currentOpenProjectIds);

      if (nextOpenProjectIds.has(projectId)) {
        nextOpenProjectIds.delete(projectId);
      } else {
        nextOpenProjectIds.add(projectId);
      }

      return nextOpenProjectIds;
    });
  };

  const handleIntroComplete = useCallback(() => {
    setIsIntroActive(false);
  }, []);

  return (
      <>
        <IntroScreen onComplete={handleIntroComplete} />

        <main
            className={`page ${isIntroActive ? "page-intro-hidden" : ""}`}
            inert={isIntroActive ? "" : undefined}
            aria-hidden={isIntroActive ? "true" : undefined}
        >
          <header className="site-header">
            <a className="site-brand" href="#about" aria-label="Hunter Lynch home">
              Hunter Lynch
            </a>

            <nav className="site-nav" aria-label="Primary navigation">
              <a href="#about">About</a>
              <a href="#projects">Projects</a>
              <a href="#skills">Skills</a>
              <a href="#contact">Contact</a>
              <a
                  href="/Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-nav-resume"
              >
                Resume
              </a>
            </nav>
          </header>

          <section id="about" className="hero-grid" aria-labelledby="about-heading">
            <div className="terminal">
              <div className="terminal-body">
                <p className="label">About</p>

                <h1 id="about-heading">Hunter Lynch</h1>
                <h2>Software Engineering Student</h2>

                <div className="hero-status-row" aria-label="Profile highlights">
                  <span>University of Otago</span>
                  <span>Computer Science + Mathematics</span>
                  <span>Seeking 2026/27 internships</span>
                </div>

                <p className="text">
                  Hi, I'm Hunter, a Computer Science and Mathematics student at the University of Otago, with a focus on
                  backend development, Java, Spring Boot, databases, and practical full stack systems. I grew up primarily
                  in Gisborne, New Zealand, and outside of my career I am a keen surfer who enjoys meeting new people and
                  staying active. I'm currently seeking software engineering internships for the 2026/27 summer.
                </p>

                <p className="label">Focus</p>

                <div className="hero-focus-grid">
                  <div>
                    <span>Backend</span>
                    <p>Spring Boot APIs, authentication, and service logic.</p>
                  </div>
                  <div>
                    <span>Data</span>
                    <p>Database design, SQL, and practical persistence layers.</p>
                  </div>
                  <div>
                    <span>Systems</span>
                    <p>Java tools, algorithms, and structured problem solving.</p>
                  </div>
                </div>

                <div className="actions">
                  <a
                      href="/Resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resume-btn"
                  >
                    View Resume
                  </a>
                </div>
              </div>
            </div>

            <div className="preview-card">
              <div>
                <p className="label">Featured Project</p>
                <div className="project-title-row">
                  <img
                      src="/issue-flow-icon.png"
                      alt="IssueFlow logo"
                      className="project-logo"
                  />
                  <div>
                    <h2>IssueFlow</h2>
                    <span>Full-stack issue tracker</span>
                  </div>
                </div>
              </div>

              <div className="featured-preview-media" aria-label="IssueFlow preview">
                <img
                    src="/issueflow-preview-4.png"
                    alt="IssueFlow preview"
                    onError={(event) => {
                      event.currentTarget.hidden = true;
                    }}
                />
              </div>

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
                <span>DigitalOcean Deployment</span>
              </div>

              <div className="actions">
                <a
                    href="https://github.com/HunterLynch0/issueflow"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <a
                    href="https://issueflow.site"
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
              <div className="conveyor-rail conveyor-rail-top" aria-hidden="true"></div>
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
              <div className="conveyor-rail conveyor-rail-bottom" aria-hidden="true"></div>
            </div>
          </section>

          <section id="projects" className="section projects-section">
            <p className="command">
              <span className="prompt">$</span> ls projects
            </p>

            <div className="projects-heading">
              <div>
                <p className="label">Selected Work</p>
                <h2>Projects</h2>
              </div>
            </div>

            <div className="project-showcase">
              {projects.map((project) => {
                const isArchitectureOpen = openProjectIds.has(project.id);
                const architectureId = `${project.id}-architecture`;
                const expandedImages = project.expandedImages ?? [];
                const showExpandedMedia = isArchitectureOpen && expandedImages.length > 1;

                return (
                    <article
                        className={`project-card ${project.featured ? "featured-project" : ""} ${
                            showExpandedMedia ? "has-expanded-media" : ""
                        }`}
                        key={project.id}
                    >
                      <div className="project-media" aria-label={`${project.title} preview`}>
                        {showExpandedMedia ? (
                            <div className="project-media-grid">
                              {expandedImages.map((image) => (
                                  <div className="project-media-tile" key={image.alt}>
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        onError={(event) => {
                                          event.currentTarget.hidden = true;
                                        }}
                                    />
                                  </div>
                              ))}
                            </div>
                        ) : (
                            <img
                                src={project.image}
                                alt={`${project.title} preview`}
                                onError={(event) => {
                                  event.currentTarget.hidden = true;
                                }}
                            />
                        )}
                        <div className="project-media-overlay">
                          <span>{project.featured ? "Personal Project" : project.type}</span>
                        </div>
                      </div>

                      <div className="project-content">
                        <div className="project-card-header">
                          <div>
                            <h3>{project.title}</h3>
                            <p className="project-meta">{project.type}</p>
                          </div>
                          <div className="project-badges" aria-label={`${project.title} badges`}>
                            {project.badges.map((badge) => (
                                <span key={badge}>{badge}</span>
                            ))}
                          </div>
                        </div>

                        <p className="project-description">{project.description}</p>

                        <div className="project-focus">
                          <span>Engineering focus</span>
                          <ul>
                            {project.focus.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="tech-list small project-tech">
                          {project.tech.map((tech) => (
                              <span key={tech}>{tech}</span>
                          ))}
                        </div>

                        <div
                            className={`project-architecture ${
                                isArchitectureOpen ? "is-open" : ""
                            }`}
                            id={architectureId}
                            aria-hidden={!isArchitectureOpen}
                        >
                          <div className="architecture-inner">
                            <ol className="architecture-flow" aria-label={`${project.title} architecture flow`}>
                              {project.diagram.map((step) => (
                                  <li key={step}>
                                    <span>{step}</span>
                                  </li>
                              ))}
                            </ol>

                            <ul className="architecture-list">
                              {project.architecture.map((item) => (
                                  <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="project-actions">
                          <button
                              className="architecture-toggle"
                              type="button"
                              aria-expanded={isArchitectureOpen}
                              aria-controls={architectureId}
                              onClick={() => toggleProjectArchitecture(project.id)}
                          >
                            <span>{project.architectureTitle}</span>
                            <span className="toggle-icon" aria-hidden="true">
                              {isArchitectureOpen ? "-" : "+"}
                            </span>
                          </button>

                          {project.links.length > 0 && (
                              <div className="actions small">
                                {project.links.map((link) => (
                                    <a
                                        href={link.href}
                                        key={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                      {link.label}
                                    </a>
                                ))}
                              </div>
                          )}
                        </div>
                      </div>
                    </article>
                );
              })}
            </div>
          </section>

          <section id="skills" className="section skills-section">
            <p className="command">
              <span className="prompt">$</span> cat skills.txt
            </p>

            <div className="section-heading">
              <p className="label">Skills</p>
              <h2>Primary skillset</h2>
            </div>

            <div className="skills">
              {skillGroups.map((group) => (
                  <article className="skill-group" key={group.title}>
                    <h3>{group.title}</h3>
                    <div className="skill-tags">
                      {group.items.map((item) => (
                          <span key={item}>{item}</span>
                      ))}
                    </div>
                  </article>
              ))}
            </div>
          </section>

          <section className="section github-section">
            <p className="command">
              <span className="prompt">$</span> git log --author=HunterLynch0
            </p>

            <div className="github-panel">
              <div className="github-panel-header">
                <div>
                  <p className="label">GitHub Activity</p>
                  <h2>Contribution map</h2>
                </div>

                <a
                    href={githubProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-profile-link"
                >
                  @HunterLynch0
                </a>
              </div>

              <a
                  href={githubProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-heatmap-link"
                  aria-label="Open HunterLynch0 on GitHub"
              >
                <div
                    className="github-heatmap-frame"
                    role="img"
                    aria-label={`GitHub contribution heatmap for ${githubUsername}`}
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
	                            {week.map((day) => {
	                              const displayDate = formatHeatmapDisplayDate(day.date);

	                              return (
	                                  <span
	                                      className={`heatmap-cell level-${day.isFuture ? 0 : day.level}`}
	                                      key={day.date}
	                                      aria-label={`${day.count} contributions on ${displayDate}`}
	                                      data-tooltip={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${displayDate}`}
	                                      tabIndex="0"
	                                  ></span>
	                              );
	                            })}
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
                </div>
              </a>
            </div>
          </section>

          <section id="contact" className="section contact-section">
            <p className="command">
              <span className="prompt">$</span> ./contact
            </p>

            <div className="contact-panel">
              <div>
                <p className="label">Contact</p>
                <h2>Let's connect</h2>
                <p className="text">Open to Internships, Software Engineering roles, and serious project collaborations.</p>
              </div>

              <div className="actions contact-actions">
                <a href="mailto:hunterplynch07@gmail.com">Email</a>
                <a href="https://github.com/HunterLynch0" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/hunter-lynch-a6545938b/" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </div>
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
