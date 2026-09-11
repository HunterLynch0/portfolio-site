import { projectNumber, skillNumber } from "./sections.js";

export const projects = [
  {
    id: "issueflow",
    number: projectNumber(0),
    title: "IssueFlow",
    subtitle: "Full-Stack Issue Tracker",
    category: "Full-stack application",
    short: "A shared workspace for keeping software moving.",
    description:
      "A full-stack issue tracking platform with authentication, shared repositories, issues, repository permissions and collaboration features.",
    technologies: [
      "Java",
      "Spring Boot",
      "Spring Security",
      "JWT",
      "PostgreSQL",
      "React",
      "Vite",
      "Resend API",
    ],
    focus: [
      "Authenticated REST APIs",
      "Repository permissions",
      "Relational data modelling",
      "Full-stack deployment",
    ],
    images: [
      {
        src: "/images/issueflow-overview.png",
        alt: "IssueFlow's redesigned landing page with a blue-accented interface and an issue tracking preview.",
        width: 2582,
        height: 1710,
        label: "Product overview",
      },
      {
        src: "/images/issueflow-repository.png",
        alt: "IssueFlow repository workspace with an issue list, status filter, assignments and collaborators.",
        width: 2752,
        height: 1278,
        label: "Repository workspace",
      },
      {
        src: "/images/issueflow-issue.png",
        alt: "IssueFlow issue details with an assignee, editing controls and a team comment discussion.",
        width: 2604,
        height: 1590,
        label: "Issue details & discussion",
      },
      {
        src: "/images/issueflow-signin.png",
        alt: "IssueFlow's redesigned sign-in screen with email and password fields.",
        width: 1204,
        height: 1268,
        label: "Sign in",
      },
    ],
    links: [
      { label: "Live site", href: "https://issueflow.site" },
      { label: "GitHub", href: "https://github.com/HunterLynch0/issueflow" },
    ],
  },
  {
    id: "versionhandle",
    number: projectNumber(1),
    title: "VersionHandle",
    subtitle: "Version Control System Built From Scratch",
    category: "Developer tool",
    short: "Understanding version control by building it.",
    description:
      "A lightweight version control system inspired by Git, built from scratch as a Java CLI application. It supports repository initialisation, staging, commits, status, logs, branches, checkout and merges with conflict handling.",
    technologies: ["Java", "Maven", "SHA-256", "CLI"],
    focus: [
      "Content-addressed storage",
      "File hashing",
      "Commit snapshots",
      "Branching",
      "Checkout",
      "Merge logic",
      "Conflict handling",
    ],
    images: [
      {
        src: "/images/versionhandle-commands.jpg",
        alt: "VersionHandle command overview in Terminal, including commits, checkout, branches, merges and running commands against snapshots.",
        width: 1670,
        height: 722,
        label: "Command overview",
      },
      {
        src: "/images/versionhandle-first-commit.jpg",
        alt: "Initialising a VersionHandle repository, staging Java files, creating the first commit and checking its status.",
        width: 1710,
        height: 810,
        label: "First commit",
      },
      {
        src: "/images/versionhandle-history.jpg",
        alt: "VersionHandle commit history showing commit identifiers, messages, timestamps and parent relationships.",
        width: 1674,
        height: 954,
        label: "Commit history",
      },
      {
        src: "/images/versionhandle-branches.jpg",
        alt: "Creating and checking out a VersionHandle branch, checking its status and merging main into it.",
        width: 1670,
        height: 880,
        label: "Branches & merging",
      },
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/HunterLynch0/versionhandle",
      },
    ],
  },
  {
    id: "andie",
    number: projectNumber(2),
    title: "ANDIE",
    subtitle: "Java Image Editor",
    category: "Desktop application",
    short: "Room to experiment. Freedom to undo.",
    description:
      "A non-destructive Java Swing image editor built as a COSC202 group project, with filters, colour operations, transforms, drawing tools, internationalisation and light/dark themes.",
    technologies: ["Java", "Swing", "Gradle", "FlatLaf"],
    focus: [
      "Image processing",
      "Non-destructive editing",
      "Desktop UI",
      "Internationalisation",
    ],
    images: [
      {
        src: "/images/andie-preview-1-display.webp",
        alt: "ANDIE desktop image editor showing its menu, drawing tools and image workspace.",
        width: 1200,
        height: 510,
        label: "The editing workspace",
      },
    ],
    links: [],
  },
];

export const skillGroups = [
  {
    id: "skills-backend",
    number: skillNumber(0),
    name: "Backend",
    items: ["Spring Boot", "Spring Security", "JWT", "REST APIs"],
  },
  {
    id: "skills-languages",
    number: skillNumber(1),
    name: "Languages",
    items: ["Java", "Python", "C++", "SQL"],
  },
  {
    id: "skills-frontend",
    number: skillNumber(2),
    name: "Frontend",
    items: ["React", "Vite", "HTML", "CSS"],
  },
  {
    id: "skills-data",
    number: skillNumber(3),
    name: "Data & tools",
    items: ["PostgreSQL", "Git", "Gradle", "Postman", "Docker"],
  },
];
