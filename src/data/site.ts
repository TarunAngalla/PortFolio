export type WorkPlaceholderVariant =
  | "ai-dashboard"
  | "marketing"
  | "android"
  | "nlp-dashboard"
  | "hiring-dashboard";

export interface WorkProject {
  id: string;
  number: string;
  title: string;
  category: string;
  image: string | null;
  imageAlt: string;
  tagline: string;
  description: string;
  highlights: string[];
  stack: string[];
  link: string | null;
}

/** True when `link` is a real external URL (not a placeholder token). */
export function isLiveWorkLink(link: string | null): link is string {
  return link !== null && /^https?:\/\//i.test(link.trim());
}

export type BeyondInterestVariant = "tennis-css" | "markets-photo" | "ai-css";

export interface BeyondInterest {
  id: string;
  variant: BeyondInterestVariant;
  title: string;
  subtitle: string;
  body: string;
  imageSrc?: string;
  imageAlt?: string;
}

export const siteData = {
  brand: {
    short: "tk",
    email: "tarunangalla08@gmail.com",
    resumeUrl: "/resume.pdf",
    logoSrc: "/images/brand/logo.png",
    logoAlt: "Tarun Kumar — TK mark",
  },
  hero: {
    greeting: "Hello, I'm",
    firstName: "TARUN",
    lastName: "KUMAR",
    preTitle: "Software engineer building",
    rotatingPrimary: ["BACKEND & AI SYSTEMS", "INTELLIGENT WORKFLOWS"],
    rotatingSecondary: ["APIS · DATA · RETRIEVAL", "SHIPPED FOR REAL USERS"],
  },
  loading: {
    marquee: [
      "Backend & API engineer",
      "AI-enabled workflows",
      "Document ingestion & retrieval",
      "Production-minded software",
    ],
  },
  about: {
    // Rendered as the small kicker above the paragraph.
    title: "Software Engineer · Backend & AI",
    body: `I build production backend services and AI-enabled workflows for real products — REST APIs, authentication, document ingestion, embeddings and retrieval, analytics, and file pipelines used by real users. I work end to end: data models, validation, integrations, deployment, iteration. I care about maintainable modules and turning product requirements into software that holds up after launch.`,
  },
  beyondTheBuild: {
    title: "Beyond the Build",
    lead:
      "A curated lens on how I think — discipline under pressure, systems-level reasoning with markets, and staying ahead of the AI infrastructure curve.",
    hero: {
      kicker: "Performance mindset",
      title: "Competition sharpens execution",
      body:
        "Basketball keeps timing and decision-making honest — full-speed reps where hesitation costs you. That carries straight into engineering: ship cleanly, iterate with intention, and stay aggressive without losing control.",
      imageSrc: "/images/beyond/basketball.png",
      imageAlt: "Tarun Kumar mid-air for a layup on an indoor basketball court",
    },
    interests: [
      {
        id: "tennis",
        variant: "tennis-css",
        title: "Tennis",
        subtitle: "Discipline & repetition",
        body:
          "Long rallies reward patience and shot selection — the same patience I bring to debugging, profiling, and refusing to paper over fragile systems.",
      },
      {
        id: "markets",
        variant: "markets-photo",
        title: "Investing & markets",
        subtitle: "Signals, structure, risk",
        body:
          "I follow markets as interconnected systems — liquidity, catalysts, and second-order effects — not noise. It reinforces how I reason about products: incentives, constraints, and what actually compounds.",
        imageSrc: "/images/beyond/markets.png",
        imageAlt: "Dark analytics dashboard with glowing cyan trend lines and financial charts",
      },
      {
        id: "ai-ecosystem",
        variant: "ai-css",
        title: "AI ecosystem tracking",
        subtitle: "Chips, models, infra",
        body:
          "I stay current on model releases, inference economics, tooling, and the semiconductor stack — so architectural bets stay grounded in what is shipping, not hype.",
      },
    ] satisfies BeyondInterest[],
  },
  whatIDo: {
    title: ["W", "HAT", "I", " DO"],
    lead: "Two practices, one discipline — ship production software, and wire applied AI into products that do real work for users.",
    cards: [
      {
        title: "PRODUCT ENGINEERING",
        subtitle: "Backend + product features, end to end",
        description:
          "REST APIs, authentication and protected routes, document pipelines, structured data models, cloud storage, and the integrations that tie them together. Validation, observability, and interfaces that stay safe to extend in production.",
        toolsTitle: "Primary stack",
        tools: [
          "Node.js",
          "Express",
          "Python",
          "FastAPI",
          "Spring Boot",
          "PostgreSQL",
          "MongoDB",
          "Docker",
          "AWS",
          "Azure",
        ],
      },
      {
        title: "AI SYSTEMS",
        subtitle: "Applied AI wired into products, not demos",
        description:
          "Resume and document parsing, embeddings, vector and semantic search, RAG-style retrieval, prompt orchestration, ranking, and structured outputs — tied to measurable product outcomes and evaluated over time.",
        toolsTitle: "Models & retrieval",
        tools: [
          "OpenAI",
          "Azure OpenAI",
          "Gemini",
          "RAG",
          "Embeddings",
          "Vector Search",
          "Prompt Design",
          "Evaluation",
        ],
      },
    ],
  },
  career: [
    {
      role: "AI Engineer",
      company: "ZoomInfo",
      year: "2024 — Present",
      description:
        "Production LLM workflows using Python, OpenAI APIs, LangChain, PostgreSQL, Pinecone, and AWS — RAG pipelines, system prompt design, agentic orchestration, evaluation frameworks, and AI-backend integrations. Reduced unsupported AI recommendations by 22% and search latency by 27%.",
    },
    {
      role: "Software Engineer",
      company: "HiEd Success",
      year: "2025 — Present",
      description:
        "Backend for a career intelligence platform: Node.js, Express, MongoDB, Azure Blob, JWT-protected REST APIs, resume and JD parsing, candidate–role matching, search, dashboards, notifications, and analytics integrations.",
    },
    {
      role: "Engineer",
      company: "anvikshiki.ai",
      year: "2025 — Present",
      description:
        "Building an AI-powered coaching SaaS — goal tracking, habit management, personalized recommendations, structured outputs, and recurring workflow automation using Next.js, PostgreSQL, Prisma, and OpenAI/Gemini APIs.",
    },
    {
      role: "Graduate Research Assistant",
      company: "University of Massachusetts Lowell",
      year: "2023 — 2025",
      description:
        "AI and ML experimentation using Python, TensorFlow, Keras, and OpenCV — CNN models for contamination detection achieving RMSE 0.133/0.11, preprocessing pipelines improving training data reliability by 36%, and M.S. CS completed May 2025.",
    },
    {
      role: "ML Software Engineer",
      company: "Meesho",
      year: "2022 — 2023",
      description:
        "ML-backed data pipelines and ranking workflows using Python, SQL, PySpark, XGBoost, and Scikit-learn — feature engineering from shopper and product data, recommendation improvements lifting engagement 18% and cutting processing time 29%.",
    },
    {
      role: "Software Engineering Intern",
      company: "Bharat Dynamics Limited",
      year: "2023",
      description:
        "Six-month internship building an internal pass-distribution system — registration, approvals, and status tracking — across full-stack modules with heavy validation and debugging in a process-driven environment.",
    },
    {
      role: "B.Tech Computer Science",
      company: "CVR College of Engineering",
      year: "2019 — 2023",
      description:
        "Undergraduate CS foundation — algorithms, systems, and software engineering fundamentals — before graduate study and industry roles.",
    },
  ],
  work: [
    {
      id: "anvikshiki",
      number: "01",
      title: "anvikshiki.ai",
      category: "AI product · Personal intelligence",
      image: "/images/work/anvikshiki.png",
      imageAlt: "Anvikshiki AI dashboard with productivity score, energy chart, and recommendations",
      tagline:
        "An AI-driven personal intelligence surface for patterns, summaries, and recommendations grounded in real activity data.",
      description:
        "MVP work spanning ingestion and storage, behavioral pattern analysis, summarization, embeddings, retrieval, and recommendation flows built from wearable and phone signals — designed as a product, not a slide deck.",
      highlights: [
        "Activity ingestion and structured storage",
        "Pattern analysis and summarization pipelines",
        "Embeddings and retrieval for contextual insights",
        "Recommendation UX wired to measured outcomes",
      ],
      stack: ["TypeScript", "React", "Data pipelines", "Embeddings", "Retrieval", "Product UI"],
      link: null,
    },
    {
      id: "bds",
      number: "02",
      title: "Badri Digital Strategies",
      category: "Business website · Digital marketing",
      image: "/images/work/bds.png",
      imageAlt: "Badri Digital Strategies marketing website with hero and services",
      tagline:
        "A conversion-focused digital marketing website built to present services, trust signals, and brand value through a clean responsive experience.",
      description:
        "Built a polished business-facing website for a digital marketing brand with a focus on service clarity, strong first impression, responsive layouts, and professional visual hierarchy.",
      highlights: [
        "Business-first landing page structure",
        "Responsive service and brand sections",
        "Clear marketing hierarchy",
        "Professional visual design",
        "Lead-focused website flow",
      ],
      stack: ["React / Next.js", "Responsive UI", "Modern web design", "SEO-friendly structure"],
      link: "PASTE_BDS_LINK_HERE",
    },
    {
      id: "usereasyshop",
      number: "03",
      title: "UserEasyShop",
      category: "Android · E-commerce",
      image: "/images/work/usereasyshop.png",
      imageAlt: "UserEasyShop Android app product screens on a phone",
      tagline: "A mobile shopping experience focused on clarity, checkout flow, and everyday usability on Android.",
      description:
        "Android application work emphasizing product discovery, cart and checkout paths, and a stable UI layer tuned for real-device use.",
      highlights: [
        "Product browsing and catalog flows",
        "Cart and checkout-oriented UX",
        "Android-native UI patterns",
        "State and navigation structured for maintainability",
      ],
      stack: ["Android", "Kotlin / Java", "Mobile UI", "REST clients"],
      link: null,
    },
    {
      id: "cyberbullying",
      number: "04",
      title: "Cyberbullying Detection System",
      category: "NLP · Trust and safety",
      image: "/images/work/cyberbullying.png",
      imageAlt: "Cyberbullying prevention dashboard with text analysis and model benchmarks",
      tagline: "A text analysis dashboard for classifying harmful language and surfacing model performance in one place.",
      description:
        "NLP-focused interface for phrase analysis, case-style classification with confidence, term-to-pattern mapping, and benchmark views — oriented toward transparency and review workflows.",
      highlights: [
        "Phrase input and analysis workflow",
        "Classification and confidence presentation",
        "Term and context breakdown for reviewers",
        "Model benchmark comparison table",
        "Activity trends for operational visibility",
      ],
      stack: ["Python", "NLP", "Classification", "Dashboard UI", "Analytics views"],
      link: null,
    },
    {
      id: "resume-matching",
      number: "05",
      title: "AI Resume Matching and Retrieval Platform",
      category: "Backend · Retrieval and matching",
      image: null,
      imageAlt: "Hiring intelligence dashboard with resume and role matching",
      tagline:
        "Career intelligence backend: resume and job parsing, candidate–role matching, search, and integrations behind real dashboards.",
      description:
        "Platform-style backend for resume and JD parsing, JWT-protected APIs, blob storage, matching and search, notifications, and analytics hooks — built to support recruiter and candidate experiences in production.",
      highlights: [
        "Resume and JD parsing pipelines",
        "JWT-protected REST APIs",
        "Candidate–role matching and search",
        "Dashboards, notifications, and analytics integrations",
        "Cloud storage and data modeling for scale",
      ],
      stack: ["Node.js", "Express", "MongoDB", "Azure Blob", "JWT", "Search & matching"],
      link: null,
    },
  ] satisfies WorkProject[],
  stack: [
    "/images/stack-react.svg",
    "/images/stack-python.svg",
    "/images/stack-java.svg",
    "/images/stack-aws.svg",
    "/images/stack-node.svg",
    "/images/stack-openai.svg",
    "/images/stack-sql.svg",
    "/images/stack-android.svg",
  ],
  social: {
    github: "https://github.com/angallatarun",
    linkedin: "https://www.linkedin.com/in/tarun-k-ab646936a/",
    x: "https://x.com/tarun_angalla",
    youtube: "https://www.youtube.com/@tarunK1810",
  },
  contact: {
    heading: "Let's build",
    lead: "Open to full-time software engineering roles and product-minded collaborations across backend, AI, and data systems.",
    email: "tarunangalla08@gmail.com",
    phone: "+1 (978) 735-3865",
    phoneTel: "+19787353865",
    location: "Boston, MA · Open to relocation",
  },
  footer: {
    line: "Designed and developed for a stronger personal brand presence.",
    year: "2026",
    creditName: "Tarun Kumar",
  },
  // Consolidated section headings — lets us sharpen copy without
  // editing each component file.
  headings: {
    career: {
      lead: "How I've learned",
      emphasis: "to ship",
      tail: "production software.",
      sub: "Roles and milestones that shaped how I build LLM systems, RAG pipelines, backend services, and production-grade AI workflows.",
    },
    work: {
      lead: "Selected",
      emphasis: "Work",
      sub: "Projects that show how I build backend systems, AI workflows, and retrieval features for real products.",
    },
  },
};
