/**
 * build.js — Static site generator for shayaandanish.com
 * Run: node build.js
 *
 * Reads data/projects.js and writes fully static HTML pages.
 * Output pages have all content baked in — no runtime JS needed for rendering.
 */

const fs   = require('fs');
const path = require('path');

// ─── Load data ────────────────────────────────────────────────────────────────
const { PROJECTS } = require('./data/projects.js');

const IMG_ROOT    = 'assets/img/';    // relative from root pages
const IMG_SUBDIR  = '../assets/img/'; // relative from subdir pages (projects/, support/)

// ─── Shared HTML partials ─────────────────────────────────────────────────────

function navbar(prefix = '') {
  return `
    <nav class="navbar">
        <ul>
            <li><a href="${prefix}index.html">Home</a></li>
            <li><a href="${prefix}projects/index.html">Projects</a></li>
            <li><a href="${prefix}support/index.html">Support a Project</a></li>
            <li><a href="${prefix}contact/index.html">Contact</a></li>
        </ul>
    </nav>`.trim();
}

function footer(prefix = '') {
  return `
    <footer class="site-footer">
        <div class="footer-content">
            <div class="footer-left">
                <p>&copy; Shayaan Danish 2026</p>
                <a href="mailto:shayaan0303@gmail.com" class="footer-email">shayaan0303@gmail.com</a>
            </div>
            <div class="footer-right">
                <a href="${prefix}policies/terms-and-conditions.html">Terms and Conditions</a>
                <a href="${prefix}policies/privacy.html">Privacy Policy</a>
                <a href="${prefix}policies/refund.html">Refund Policy</a>
                <a href="${prefix}policies/pricing.html">Pricing</a>
            </div>
        </div>
    </footer>`.trim();
}

function techTags(techArray) {
  return techArray.map(t => `<span class="tech-tag">${t}</span>`).join('');
}

// ─── Page generators ──────────────────────────────────────────────────────────

// 1. index.html — landing page
function buildLanding() {
  const CARDS = [
    { category: 'websites', position: 'left',   label: 'Websites'    },
    { category: 'apps',     position: 'center',  label: 'Apps'        },
    { category: 'llm',      position: 'right',   label: 'LLM Systems' },
  ];

  function projectCard(p, isMain = false) {
    return `
        <article class="project-card${isMain ? ' main-project' : ''}"
                 data-project="${p.id}"
                 tabindex="0"
                 role="button"
                 aria-label="View ${p.name}">
            <div class="project-header">
                <img src="${IMG_ROOT}${p.logo}" alt="${p.name} Logo" class="project-logo">
                <span class="project-name">${p.name}</span>
            </div>
            <img src="${IMG_ROOT}${p.preview}" alt="${p.name} Screenshot" class="project-preview">
        </article>`.trim();
  }

  const cardsHtml = CARDS.map(({ category, position, label }) => {
    const projects = PROJECTS.filter(p => p.category === category);
    let inner = '';

    if (category === 'apps') {
      const featured = projects.find(p => p.featured);
      const rest     = projects.filter(p => !p.featured);
      if (featured) inner += projectCard(featured, true);
      if (rest.length) {
        inner += `<div class="projects-grid">${rest.map(p => projectCard(p)).join('')}</div>`;
      }
    } else {
      inner = projects.map(p => projectCard(p)).join('');
    }

    return `
        <div class="category-card" data-position="${position}" data-category="${category}">
            <h2 class="category-title">${label}</h2>
            <div class="projects-container">${inner}</div>
        </div>`.trim();
  }).join('\n        ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Shayaan Danish - Creative Problem Solver and Software Engineer specializing in Websites, Apps, and LLM Systems">
    <meta name="author" content="Shayaan Danish">
    <title>Shayaan Danish | Software Engineer</title>
    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="stylesheet" href="assets/css/landing.css">
</head>
<body>

    ${navbar()}

    <header class="hero">
        <div class="profile-container">
            <img src="assets/img/profile.jpg" alt="Shayaan Danish" class="profile-img">
            <div class="hero-text">
                <h1>Shayaan Danish</h1>
                <div class="rule"></div>
                <p class="subtitle">Creative Problem Solver and <br> Software Engineer</p>
                <p class="focus">Websites · Apps · LLMs</p>
            </div>
        </div>
    </header>

    <section class="portfolio-container" aria-label="Project Portfolio">
        ${cardsHtml}
    </section>

    <div class="modal-overlay" id="modalOverlay" role="dialog" aria-modal="true" aria-labelledby="modalTitle" aria-hidden="true">
        <div class="modal-content" tabindex="-1">
            <button class="modal-close" id="modalClose" aria-label="Close modal">&times;</button>
            <div class="modal-header">
                <div class="modal-logo" id="modalLogo"></div>
                <h2 class="modal-title" id="modalTitle"></h2>
            </div>
            <div class="modal-body">
                <div class="modal-preview" id="modalPreview"></div>
                <div class="modal-description">
                    <h3>Description</h3>
                    <p id="modalDescription"></p>
                    <h3>Technologies</h3>
                    <div class="tech-stack" id="techStack"></div>
                </div>
                <div class="modal-actions" aria-label="Project links">
                    <a class="modal-action-btn modal-action-demo" id="modalDemoLink" href="#">Demo</a>
                    <a class="modal-action-btn modal-action-read" id="modalReadMoreLink" href="#">Read more</a>
                </div>
            </div>
        </div>
    </div>

    ${footer()}

    <script src="assets/js/main.js"></script>

</body>
</html>`;
}

// 2. projects/index.html — project list
function buildProjectsList() {
  const entries = PROJECTS.map(p => `
            <a class="project-entry" href="${p.id}.html" data-category="${p.category}">
                <div class="project-entry-left">
                    <img src="${IMG_SUBDIR}${p.logo}" alt="" class="project-entry-logo">
                    <div class="project-entry-info">
                        <span class="project-entry-name">${p.name}</span>
                        <span class="project-entry-desc">${p.tagline}</span>
                    </div>
                </div>
                <div class="project-entry-right">
                    <span class="project-entry-tag">${p.categoryLabel}</span>
                    <span class="project-entry-arrow">→</span>
                </div>
            </a>`.trim()).join('\n            ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Projects by Shayaan Danish — Websites, Apps, and LLM Systems">
    <title>Projects | Shayaan Danish</title>
    <link rel="stylesheet" href="../assets/css/main.css">
    <link rel="stylesheet" href="assets/css/projects.css">
</head>
<body class="projects-page">

    ${navbar('../')}

    <main class="projects-main">

        <div class="projects-header">
            <h1 class="projects-title">Projects</h1>
            <div class="projects-filters" role="tablist" aria-label="Filter projects by category">
                <button class="filter-btn active" data-filter="all" role="tab" aria-selected="true">All</button>
                <button class="filter-btn" data-filter="websites" role="tab" aria-selected="false">Websites</button>
                <button class="filter-btn" data-filter="apps" role="tab" aria-selected="false">Apps</button>
                <button class="filter-btn" data-filter="llm" role="tab" aria-selected="false">LLM Systems</button>
            </div>
        </div>

        <div class="projects-list" id="projectsList">
            ${entries}
        </div>

    </main>

    ${footer('../')}

    <script src="assets/js/projects.js"></script>

</body>
</html>`;
}

// 3. projects/[id].html — individual detail pages
function buildProjectDetail(project) {
  const overviewHtml = project.overview
    .map(para => `                <p>${para}</p>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${project.name} — ${project.tagline}">
    <title>${project.name} | Shayaan Danish</title>
    <link rel="stylesheet" href="../assets/css/main.css">
    <link rel="stylesheet" href="assets/css/projects.css">
</head>
<body class="project-detail-page">

    ${navbar('../')}

    <main class="project-detail-main">

        <a href="index.html" class="project-back">← Projects</a>

        <div class="project-detail-header">
            <img src="${IMG_SUBDIR}${project.logo}" alt="${project.name} Logo" class="project-detail-logo">
            <div class="project-detail-meta">
                <span class="project-detail-category">${project.categoryLabel}</span>
                <h1 class="project-detail-title">${project.name}</h1>
                <p class="project-detail-tagline">${project.tagline}</p>
            </div>
        </div>

        <div class="project-detail-preview">
            <img src="${IMG_SUBDIR}${project.preview}" alt="${project.name} screenshot" class="project-detail-img">
        </div>

        <div class="project-detail-body">

            <div class="project-detail-content">
                <h2>Overview</h2>
${overviewHtml}
                <h2>Tech Stack</h2>
                <div class="project-tech-stack">
                    ${techTags(project.tech)}
                </div>
            </div>

            <div class="project-detail-actions">
                <a href="${project.demoUrl || '#'}" class="project-action-btn primary"${project.demoUrl && project.demoUrl !== '#' ? ' target="_blank" rel="noopener noreferrer"' : ''}>Live Demo</a>
                <a href="../support/index.html" class="project-action-btn secondary">Support this project</a>
            </div>

        </div>

    </main>

    ${footer('../')}

</body>
</html>`;
}

// 4. support/index.html — support page
function buildSupport() {
  const items = PROJECTS.map(p => `
                <div class="support-project-item"
                     tabindex="0" role="option" aria-selected="false"
                     data-project="${p.id}" data-name="${p.name}">
                    <img src="${IMG_SUBDIR}${p.logo}" alt="" class="support-project-logo">
                    <span class="support-project-name">${p.name}</span>
                    <span class="support-project-category">${p.categoryLabel}</span>
                </div>`.trim()).join('\n                ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Support a Project - Shayaan Danish">
    <title>Support a Project | Shayaan Danish</title>
    <link rel="stylesheet" href="../assets/css/main.css">
    <link rel="stylesheet" href="assets/css/support.css">
</head>
<body class="support-page">

    ${navbar('../')}

    <main class="support-main">

        <p class="support-heading">
            Select a project to support the maintenance<br>
            and further development of: <span id="dynamicProjectName"></span>
        </p>

        <div class="support-layout">

            <div class="project-list" role="listbox" aria-label="Select a project to support">
                ${items}
            </div>

            <div class="payment-panel" id="paymentPanel" aria-live="polite" aria-label="Payment selection">

                <p class="payment-label">Payment Selection</p>

                <div class="amount-grid">
                    <button class="amount-btn" data-amount="1" aria-label="$1">$1</button>
                    <button class="amount-btn" data-amount="5" aria-label="$5">$5</button>
                    <button class="amount-btn" data-amount="10" aria-label="$10">$10</button>
                    <button class="amount-btn" data-amount="100" aria-label="$100">$100</button>
                </div>

                <div class="amount-other-wrapper">
                    <button class="amount-btn other-btn" data-amount="other" aria-expanded="false" aria-controls="otherInputWrapper">
                        Other
                    </button>
                    <div class="other-input-wrapper" id="otherInputWrapper" role="group" aria-label="Enter custom amount">
                        <span class="other-dollar" aria-hidden="true">$</span>
                        <input
                            type="number"
                            class="other-input"
                            id="otherAmountInput"
                            min="1"
                            step="1"
                            placeholder="Enter amount"
                            aria-label="Custom dollar amount"
                        >
                    </div>
                </div>

                <button class="next-btn" id="nextBtn" disabled aria-disabled="true">
                    Next →
                </button>

            </div>

        </div>
    </main>

    ${footer('../')}

    <script src="https://cdn.paddle.com/paddle/v2/paddle.js"></script>
    <script>Paddle.Initialize({ token: 'live_e73f5816f3a8e571c8d62425bfb' });</script>
    <script src="assets/js/support.js"></script>

</body>
</html>`;
}

// ─── Write files ──────────────────────────────────────────────────────────────

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓  ${filePath}`);
}

function build() {
  console.log('\nBuilding...\n');

  // Landing
  write('index.html', buildLanding());

  // Projects list
  write('projects/index.html', buildProjectsList());

  // Each detail page
  PROJECTS.forEach(project => {
    write(`projects/${project.id}.html`, buildProjectDetail(project));
  });

  // Support
  write('support/index.html', buildSupport());

  console.log(`\n✓  Done — ${PROJECTS.length + 3} files written.\n`);
}

build();