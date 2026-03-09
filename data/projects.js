/**
 * projects.js — Single source of truth for all project data
 * Location: data/projects.js
 *
 * Fields:
 *   id            — URL slug, matches the detail page filename
 *   name          — Display name
 *   category      — "websites" | "apps" | "llm"
 *   categoryLabel — Human-readable category label
 *   tagline       — One-line description (list page + detail header)
 *   description   — Short paragraph (landing modal)
 *   overview      — Full paragraphs for detail page (array, one per <p>)
 *   tech          — Array of tech tags
 *   logo          — Filename only (consumers prepend correct relative path)
 *   preview       — Filename only (consumers prepend correct relative path)
 *   color         — Gradient string (landing card background)
 *   demoUrl       — "Live Demo" button href (use "#" if not live)
 *   repoUrl       — "View Repo" button href (omit field if private)
 *   featured      — true = main-project slot on landing card
 */

const PROJECTS = [

  // ============================================================
  // WEBSITES
  // ============================================================

  {
    id: "highlighter",
    name: "Highlighter",
    category: "websites",
    categoryLabel: "Websites",
    tagline: "A social platform for publishing stories, showcasing projects, and connecting with collaborators",
    description: "Highlighter is a social platform where people can publish stories, post projects looking for collaboration, funding, or marketing, maintain a personal profile, and connect with others.",
    overview: [
      "Highlighter is a social platform built around the idea that great work deserves an audience. Users can publish long-form stories, showcase projects they are building, and connect with others who share their interests or want to collaborate.",
      "Projects can be posted with context around what kind of support is being sought — whether that is a co-founder, a developer, a designer, funding, or simply visibility. The platform is designed to make it easy to discover people and work worth paying attention to.",
    ],
    tech: ["Next.js", "Tailwind CSS"],
    logo: "highlighter-logo.png",
    preview: "highlighter-website.png",
    color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    demoUrl: "#",
    featured: false,
  },

  {
    id: "jourts",
    name: "JOURTS",
    category: "websites",
    categoryLabel: "Websites",
    tagline: "An online grocery store",
    description: "JOURTS is an online grocery store — a clean, functional e-commerce platform for browsing and purchasing groceries.",
    overview: [
      "JOURTS is an online grocery store built as a full e-commerce platform. It covers the complete shopping flow from product browsing and category filtering through to cart management and checkout.",
    ],
    // TODO: Confirm tech stack — placeholder values below
    tech: ["Next.js", "Stripe", "PostgreSQL", "Redis"],
    logo: "jourts-logo.png",
    preview: "jourts-website.png",
    color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    demoUrl: "#",
    featured: false,
  },

  // ============================================================
  // APPS
  // ============================================================

  {
    id: "file-visualiser",
    name: "File Structure Visualiser",
    category: "apps",
    categoryLabel: "Apps",
    tagline: "An interactive desktop tool for visualising complex directory trees",
    description: "An Electron desktop application that takes any folder on your machine and renders it as an interactive, navigable tree — built out of frustration with understanding large inherited codebases.",
    overview: [
      "File Structure Visualiser is an Electron desktop application that takes any folder on your machine and renders it as an interactive, navigable tree. Built out of personal frustration with trying to understand large inherited codebases and communicate project structure in documentation.",
      "The tree view supports collapsing and expanding nodes, search and highlight across the entire structure, and colour coding by file type. Nodes can be clicked to open files directly in your default editor.",
      "Export options include a clean SVG diagram for documentation, a plain text tree for README files, and a JSON representation for programmatic use. The app runs fully offline with no telemetry.",
    ],
    tech: ["TypeScript", "D3.js", "Electron", "Vue.js"],
    logo: "filestructurevisualiser-logo.png",
    preview: "filestructurevisualiser-app.png",
    color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    demoUrl: "#",
    featured: true,
  },

  {
    id: "quotescript",
    name: "QuoteScript",
    category: "apps",
    categoryLabel: "Apps",
    tagline: "A domain-specific language for querying a quotes database, backed by a full compiler pipeline",
    description: "A domain-specific language for querying and exploring a quotes database, backed by a full compiler pipeline written in Python and surfaced through a Flutter desktop GUI.",
    overview: [
      "QuoteScript is a domain-specific language (DSL) that lets you express what you want from a quotes collection in clean, human-readable syntax — and get back exactly that. Under the hood it goes through the classic compiler phases: lexing, parsing, semantic analysis, IR generation, optimisation, and execution.",
      'The result lands in a split-pane desktop interface where you write your script on the left and read your output on the right. Two lines is all it takes — QUOTE: "Freedom" and TOP: 10 — and you get your quotes filtered, ranked, and tagged.',
      "QuoteScript started as a practical tool: a way to query a quotes database without writing boilerplate search logic every time. Building it as a real compiler rather than a string-matching hack was the more interesting path, and it made the whole thing more extensible. The Flutter GUI made it feel like a real tool rather than a script you run in a terminal.",
    ],
    tech: ["Python", "Flutter", "Dart"],
    logo: "quotescript-logo.png",
    preview: "quotescript-app.png",
    color: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    demoUrl: "#",
    featured: false,
  },

  {
    id: "grocify",
    name: "Grocify",
    category: "apps",
    categoryLabel: "Apps",
    tagline: "A multi-platform grocery shopping app with wishlist, cart, and Firebase-powered checkout",
    description: "A multi-platform grocery shopping app built with Flutter, featuring wishlist, cart, category browsing, checkout, and order history — powered by Firebase Firestore and Auth.",
    overview: [
      "Grocify is a multi-platform grocery shopping app built with Flutter. It covers the full shopping experience — browsing products by category, managing a wishlist, building a cart, checking out, and reviewing order history.",
      "State management is handled with the BLoC pattern throughout. Product and order data lives in Cloud Firestore, and Firebase Auth gates the checkout flow, ensuring orders are always tied to a verified user.",
      "The checkout flow is currently cash-on-delivery with full input validation. The category drawer filters the product list in real time, and the home feed is pulled live from Firestore.",
    ],
    tech: ["Flutter", "Dart", "Firebase", "BLoC"],
    logo: "grocery-logo.png",
    preview: "grocery-website.png",
    color: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    demoUrl: "#",
    featured: false,
  },

  // ============================================================
  // LLM SYSTEMS
  // ============================================================

  {
    id: "lm-stick",
    name: "LM Stick",
    category: "llm",
    categoryLabel: "LLM Systems",
    tagline: "A portable, self-contained LLM you can carry on a USB drive",
    description: "A compact, self-contained LLM, runner, and GUI — copy it onto a USB and you are walking with an LLM in your pocket, usable on any Windows 11 PC with no installation required.",
    overview: [
      "LM Stick is a compact, self-contained package containing an LLM model, a runner, and a GUI. Copy it onto a USB drive and you are walking with a capable language model in your pocket — plug into any Windows 11 PC with at least 8 GB RAM and it runs immediately, with no dependencies and no installation.",
      "It is built on Ollama, which handles the local HTTP server, model loading, and GUI. LM Stick wraps this with two executables: setup.exe, which runs once to configure the environment, and run.exe, which starts everything and handles clean shutdown. The dolphin-llama3 model is bundled directly in the package.",
      "The motivation is straightforward: most people either pay for a closed cloud model or go through a complex local setup. LM Stick eliminates both friction points — download, unzip, run. The model runs fully offline with no telemetry and no subscription.",
    ],
    tech: ["Ollama", "PowerShell", "Llama 3"],
    logo: "lmstick-logo.png",
    preview: "lm-stick-folders.png",
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    demoUrl: "https://pub-bfb26aaa51024d16b54830768efdd3af.r2.dev/LM_Stick.zip",
    featured: false,
  },

  {
    id: "lm-stick-server",
    name: "LM Stick Server",
    category: "llm",
    categoryLabel: "LLM Systems",
    // TODO: Replace with real description — no README provided
    tagline: "Backend server infrastructure for the LM Stick platform",
    description: "Backend server infrastructure for the LM Stick platform. Handles model inference, request queuing, and scalable deployment.",
    overview: [
      "TODO: Add real overview for LM Stick Server.",
    ],
    // TODO: Confirm tech stack
    tech: ["Python", "FastAPI", "Docker", "AWS"],
    logo: "lmstick-logo.png",
    preview: "ollama-server.png",
    color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    demoUrl: "#",
    featured: false,
  },

];