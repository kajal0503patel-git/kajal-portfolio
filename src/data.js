// =====================================================================
//  YOUR PORTFOLIO CONTENT. Edit ONLY this file to update the website.
//  Everything here also feeds the hero terminal, the chatbot and the
//  "Resume" PDF button, so they all stay in sync automatically.
//  Accent colours: "brass" (pink), "terracotta" (amber), "forest" (cyan).
// =====================================================================

export const PROFILE = {
  name: "Kajal Patel",
  role: "Software Engineer",
  location: "Bhopal, Madhya Pradesh, India",
  email: "kajal.0503patel@gmail.com",
  phone: "+91 6264451161", // only used in the downloadable resume PDF
  linkedin: "https://linkedin.com/in/kajal-patel-sde",
  github: "https://github.com/kajal0503patel-git",
  stack: ["Java", "Spring Boot", "React"], // shown in the hero terminal
  learning: ["System Design"], // add or remove what you are learning now
};

// ---------------------------------------------------------------------
//  ADD A NEW PROJECT: copy one block below, paste it at the TOP of the
//  PROJECTS list and edit the text. The newest project shows first and
//  is also what the chatbot lists first.
//  repo / demo = your GitHub and live-demo links ("" hides the button).
// ---------------------------------------------------------------------

export const SKILL_GROUPS = [
  { title: "Languages & core", color: "brass", items: ["Java", "JavaScript (ES6+)", "SQL", "OOP & Design", "DSA", "Java Collections", "Concurrency"] },
  { title: "Backend", color: "terracotta", items: ["Spring Boot", "Spring Data JPA", "RESTful Web Services", "REST API Design", "Microservices", "Design Patterns", "Exception Handling"] },
  { title: "Frontend & full stack", color: "forest", items: ["React.js (basics)", "HTML", "CSS", "Node.js", "Express.js", "MERN Stack"] },
  { title: "Data & caching", color: "brass", items: ["MySQL", "MongoDB", "Redis", "Cache Aside", "Rate Limiting", "Indexing"] },
  { title: "Tools & practices", color: "terracotta", items: ["Git & GitHub", "Maven", "Docker", "Docker Compose", "JUnit 5", "Unit Testing", "Postman", "Clean Code"] },
  { title: "Applied AI", color: "forest", items: ["LLM API Integration", "Prompt Engineering", "Structured Prompting", "Loop Engineering", "Graph Engineering", "Agentic AI Workflows"] },
];

export const PROJECTS = [
  {
    title: "High-Throughput URL Shortener Service",
    stack: ["Java", "Spring Boot", "MySQL", "Redis", "Docker", "JUnit 5"],
    desc: "A RESTful web service that turns MySQL sequential keys into Base62 short links and redirects with HTTP 302.",
    points: [
      "Redis cache-aside layer (1-hour TTL) with connection timeout safeguards and automatic fallback to MySQL, so the service stays available if the cache fails",
      "IP-based rate limiting (5 requests/min, HTTP 429) with centralized JSON exception handling and logging-ready error responses",
      "Automated unit tests with JUnit 5; MySQL and Redis provisioned with Docker Compose",
    ],
    accent: "brass",
    repo: "",
    demo: "",
  },
  {
    title: "HireFlow: AI-Powered Candidate Evaluation System",
    stack: ["Node.js", "Express", "React", "LLM API"],
    desc: "Backend microservices that automate technical interview workflows and evaluate candidate responses against dynamic benchmarks.",
    points: [
      "Third-party LLM integration using structured prompting, loop-based evaluation and graph-style multi-step orchestration (question generation, response evaluation, scorecard generation)",
      "Produces contextual engineering questions and real-time qualitative scorecards",
      "React components talk to REST endpoints with efficient data parsing and low latency",
    ],
    accent: "terracotta",
    repo: "",
    demo: "",
  },
  {
    title: "Enterprise Resource Planning (ERP) System",
    stack: ["MERN Stack", "MongoDB", "REST Architecture"],
    desc: "Modular backend APIs for inventory tracking, an employee directory and departmental workflows.",
    points: [
      "MongoDB document schemas and indexing strategies for efficient querying across modules",
      "MVC separation of concerns with custom authentication middleware and standardized error responses",
    ],
    accent: "forest",
    repo: "",
    demo: "",
  },
  {
    title: "Library and Inventory Management System",
    stack: ["React", "Node.js", "Express", "MongoDB"],
    desc: "A full-stack catalog application with real-time search, cataloging and status auditing of inventory.",
    points: [
      "Reusable controller logic and payload validation to prevent runtime failures",
    ],
    accent: "brass",
    repo: "",
    demo: "",
  },
];

export const ACHIEVEMENTS = [
  { number: "279+", label: "LeetCode problems solved", sub: "101 Easy, 142 Medium, 36 Hard" },
  { number: "1,903", label: "LeetCode Knight, contest rating", sub: "Top 4.56% globally" },
  { number: "1st", label: "Smart India Hackathon 2026", sub: "Team leader, institutional rounds" },
  { number: "4th", label: "College-wide coding competition", sub: "Algorithmic problem solving" },
];
