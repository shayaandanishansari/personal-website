/**
 * render-landing.js
 * Renders the landing page portfolio cards and modal from PROJECTS data.
 * Requires: data/projects.js loaded before this script.
 */

(function () {

  const IMG = 'assets/img/';

  // --- Category card config ---
  const CARDS = [
    { category: 'websites', position: 'left',   label: 'Websites'    },
    { category: 'apps',     position: 'center',  label: 'Apps'        },
    { category: 'llm',      position: 'right',   label: 'LLM Systems' },
  ];

  // --- Build a project card element ---
  function buildProjectCard(project, isMain) {
    const article = document.createElement('article');
    article.className = 'project-card' + (isMain ? ' main-project' : '');
    article.setAttribute('data-project', project.id);
    article.setAttribute('tabindex', '0');
    article.setAttribute('role', 'button');
    article.setAttribute('aria-label', `View ${project.name}`);

    article.innerHTML = `
      <div class="project-header">
        <img src="${IMG}${project.logo}" alt="${project.name} Logo" class="project-logo">
        <span class="project-name">${project.name}</span>
      </div>
      <img src="${IMG}${project.preview}" alt="${project.name} Screenshot" class="project-preview">
    `;

    article.addEventListener('click', () => openModal(project));
    article.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(project); });

    return article;
  }

  // --- Render all category cards ---
  function renderCards() {
    const container = document.getElementById('portfolioContainer');
    if (!container) return;

    CARDS.forEach(({ category, position, label }) => {
      const projects = PROJECTS.filter(p => p.category === category);

      const card = document.createElement('div');
      card.className = 'category-card';
      card.setAttribute('data-position', position);
      card.setAttribute('data-category', category);

      const title = document.createElement('h2');
      title.className = 'category-title';
      title.textContent = label;
      card.appendChild(title);

      const projectsContainer = document.createElement('div');
      projectsContainer.className = 'projects-container';

      if (category === 'apps') {
        const featured = projects.find(p => p.featured);
        const rest = projects.filter(p => !p.featured);

        if (featured) projectsContainer.appendChild(buildProjectCard(featured, true));

        if (rest.length) {
          const grid = document.createElement('div');
          grid.className = 'projects-grid';
          rest.forEach(p => grid.appendChild(buildProjectCard(p, false)));
          projectsContainer.appendChild(grid);
        }
      } else {
        projects.forEach(p => projectsContainer.appendChild(buildProjectCard(p, false)));
      }

      card.appendChild(projectsContainer);
      container.appendChild(card);
    });
  }

  // --- Modal ---
  function openModal(project) {
    const overlay   = document.getElementById('modalOverlay');
    const logo      = document.getElementById('modalLogo');
    const title     = document.getElementById('modalTitle');
    const preview   = document.getElementById('modalPreview');
    const desc      = document.getElementById('modalDescription');
    const techStack = document.getElementById('techStack');
    const demoLink  = document.getElementById('modalDemoLink');
    const readLink  = document.getElementById('modalReadMoreLink');

    logo.style.backgroundImage    = `url(${IMG}${project.logo})`;
    title.textContent             = project.name;
    preview.style.backgroundImage = `url(${IMG}${project.preview})`;
    desc.textContent              = project.description;
    demoLink.href                 = project.demoUrl || '#';
    readLink.href                 = `projects/${project.id}.html`;

    techStack.innerHTML = project.tech
      .map(t => `<span class="tech-tag">${t}</span>`)
      .join('');

    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.getElementById('modalClose').focus();
  }

  function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
  }

  function initModal() {
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalOverlay').addEventListener('click', e => {
      if (e.target === e.currentTarget) closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', () => {
    renderCards();
    initModal();
  });

})();