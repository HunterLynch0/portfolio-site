export const githubUsername = "HunterLynch0";
export const githubProfileUrl = "https://github.com/HunterLynch0";

export const projects = [
  {
    id: "versionhandle",
    name: "VersionHandle",
    type: "Full-stack version control system",
    status: "Backend-heavy product build",
    image: "/versionhandle-preview.png",
    description:
      "A GitHub-style version control and issue tracking project with authenticated repositories, issue workflows, and a React interface.",
    tech: ["Java", "Spring Boot", "PostgreSQL", "JWT", "React", "REST APIs"],
    focus: ["Repository workflows", "JWT authentication", "Relational data modeling"],
    githubUrl: "https://github.com/HunterLynch0/versionhandle",
    liveUrl: null,
    command: "git status --versionhandle",
    accent: "cyan",
  },
  {
    id: "issueflow",
    name: "IssueFlow",
    type: "Issue tracker",
    status: "Deployed full-stack app",
    image: "/issueflow-preview-4.png",
    description:
      "A full-stack issue tracker with repositories, issues, user assignment, permissions, Spring Security, JWT auth, PostgreSQL, and React.",
    tech: ["Java", "Spring Boot", "Spring Security", "JWT", "PostgreSQL", "React"],
    focus: ["Protected APIs", "Repository permissions", "Production deployment"],
    githubUrl: "https://github.com/HunterLynch0/issueflow",
    liveUrl: "https://issueflow.site",
    command: "curl issueflow.site",
    accent: "green",
  },
  {
    id: "java-image-editor",
    name: "Java Image Editor",
    type: "Desktop image processing",
    status: "Graphics and algorithms",
    image: "/andie-preview-1.png",
    description:
      "A modular Java image editor with region selection, bilinear scaling, custom rendering, and image operations built around Graphics2D.",
    tech: ["Java", "Swing", "Graphics2D", "Gradle", "Image Processing"],
    focus: ["Modular operations", "Bilinear scaling", "Custom rendering pipeline"],
    githubUrl: "https://github.com/HunterLynch0",
    liveUrl: null,
    command: "render --graphics2d",
    accent: "amber",
  },
  {
    id: "dino-game",
    name: "Dino Game / Portfolio Easter Egg",
    type: "Interactive React game",
    status: "Embedded portfolio feature",
    image: null,
    description:
      "A lightweight React game embedded into the portfolio with keyboard input, collision checks, scoring, and persistent high score storage.",
    tech: ["React", "CSS Animations", "SVG", "LocalStorage"],
    focus: ["Game loop state", "Collision detection", "Responsive interaction"],
    githubUrl: "https://github.com/HunterLynch0",
    liveUrl: "#dino-game",
    liveLabel: "Play",
    command: "./play-dino",
    accent: "violet",
  },
];

export const skillGroups = [
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

export const profileStats = [
  {
    label: "Backend",
    value: "Spring APIs",
    detail: "Authentication, service logic, permissions, and REST design.",
  },
  {
    label: "Frontend",
    value: "React / Vite",
    detail: "Responsive interfaces, stateful components, and clean UX.",
  },
  {
    label: "Databases",
    value: "PostgreSQL",
    detail: "Relational modeling, SQL, persistence layers, and constraints.",
  },
  {
    label: "Core",
    value: "Java",
    detail: "Object-oriented design, data structures, tooling, and Graphics2D.",
  },
];

export const skillCategories = [
  {
    title: "Languages",
    level: "Foundation",
    items: ["Java", "Python", "JavaScript", "SQL", "C++"],
  },
  {
    title: "Backend",
    level: "Primary",
    items: ["Spring Boot", "Spring Security", "JWT", "REST APIs", "Maven"],
  },
  {
    title: "Frontend",
    level: "Product UI",
    items: ["React", "Vite", "HTML", "CSS"],
  },
  {
    title: "Databases",
    level: "Persistence",
    items: ["PostgreSQL", "Relational Modeling", "SQL"],
  },
  {
    title: "Tools",
    level: "Workflow",
    items: ["Git", "GitLab", "Postman", "Gradle", "Docker"],
  },
];

export const techStack = [
  "Java",
  "Spring Boot",
  "React",
  "JavaScript",
  "PostgreSQL",
  "Git",
  "HTML",
  "CSS",
  "Vite",
  "C++",
  "Docker",
];

export const journeyItems = [
  {
    period: "Now",
    title: "Seeking software engineering internships",
    meta: "2026/27 summer",
    description:
      "Focused on backend-heavy full-stack roles where I can build production-minded systems with Java, Spring Boot, React, and PostgreSQL.",
  },
  {
    period: "University",
    title: "Computer Science + Mathematics",
    meta: "University of Otago",
    description:
      "Building a strong technical base across software design, algorithms, systems thinking, mathematics, and practical engineering projects.",
  },
  {
    period: "Builds",
    title: "Full-stack product systems",
    meta: "IssueFlow / VersionHandle",
    description:
      "Designing authenticated repository and issue workflows with JWT auth, database-backed permissions, and React interfaces.",
  },
  {
    period: "Craft",
    title: "Graphics and interaction",
    meta: "Java Image Editor / Portfolio game",
    description:
      "Exploring custom rendering, image operations, collision systems, animation, and interactive UI details.",
  },
];

export const contactLinks = {
  email: "mailto:hunterplynch07@gmail.com",
  github: githubProfileUrl,
  linkedin: "https://www.linkedin.com/in/hunter-lynch-a6545938b/",
  resume: "/Resume.pdf",
};
